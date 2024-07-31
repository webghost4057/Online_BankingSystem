const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("DB connected successfully");
  })
  .catch((err) => {
    console.log("There is an error in DB connection", err);
  });

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phonenumber: { type: String, required: true },
  identificationType: { type: String, required: true },
  idnumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
  accountNumber: { type: String, unique: true, sparse: true },
  isAdmin: { type: String, default: 'user' },
  balance: { type: Number, default: 0 }
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);

const generateAccountNumber =()=>{
  const accountNumber = "AC" +  Math.floor(100000000 + Math.random() * 900000000);
  return accountNumber
}
// Transaction Schema
const Transaction = mongoose.model('Transaction', new mongoose.Schema({
  amount: { type: Number, required: true },
  sender: { type: String, required: true }, // Use String if sending account numbers
  receiver: { type: String, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
}));


app.get('/api/user/:ac/transactions', async (req, res) => {
  const { ac } = req.params;
  try {
    console.log(`Fetching transactions for account: ${ac}`);
    const transactions = await Transaction.find({
      $or: [{ sender: ac }, { receiver: ac }]
    });

    console.log('Transactions found:', transactions);

    if (transactions.length === 0) {
      console.log('No transactions found for this user.');
      return res.status(404).json({ message: 'No transactions found for this user.' });
    }

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
});

// Routes

// Register
app.post("/api/register", async (req, res) => {
  const { email, name, phonenumber, identificationType, idnumber, password } = req.body;
  try {
    const user = new User({ email, name, phonenumber, identificationType, idnumber, password });
    await user.save();
    res.status(201).json({ message: "User registered successfully. Please wait for admin verification." });
  } catch (err) {
    console.error("Error saving user:", err);
    res.status(400).json({ message: err.message });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    console.log(user , '3434343OFFF');
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.verified) {
      return res.status(403).json({ message: "Account not verified. Please wait for admin verification." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const { password: _, _id, ...userWithoutPassword } = user.toObject();
    const token = jwt.sign({ _id: user._id, name: user.name }, process.env.JWT_SECRET);
    res.json({ token, user: userWithoutPassword });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: err.message });
  }
});

// Admin verification
app.put("/api/verify/:userid", async (req, res) => {
  const userid = req.params.userid;
  console.log(userid , '34[][[');
  try {
    const user = await User.findById(userid);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.verified = true;
    user.accountNumber = generateAccountNumber();
    await user.save();
    res.status(200).json({ message: "User verified successfully", accountNumber: user.accountNumber });
  } catch (err) {
    console.error("Error verifying user:", err);
    res.status(500).json({ message: err.message });
  }
});

// Deposit
app.put("/api/deposit/:userAC", async (req, res) => {
  const { userAC } = req.params;
  const { amount, senderAC } = req.body; // receiverAC is not needed for deposit
  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount)) {
    return res.status(400).json({ message: 'Invalid amount' });
  }

  try {
    const user = await User.findOne({ accountNumber: userAC });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.balance += parsedAmount;
    await user.save();
    
    const newTransaction = new Transaction({
      amount: parsedAmount,
      sender: senderAC,
      receiver: user.accountNumber,
      date: new Date(),
      status: 'completed'
    });

    await newTransaction.save();
    res.status(200).json({ message: 'Balance updated and transaction recorded', balance: user.balance });
  } catch (error) {
    console.error("Error during deposit:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Transaction route
app.post("/api/transaction", async (req, res) => {
  const { senderAccountNumber, receiverAccountNumber, amount } = req.body;
  console.log(senderAccountNumber , receiverAccountNumber , amount  , "fesadf");
  try {
    const sender = await User.findOne({ accountNumber: senderAccountNumber });
    const receiver = await User.findOne({ accountNumber: receiverAccountNumber });

    if (!sender || !receiver) {
      return res.status(404).json({ message: "Sender or receiver not found" });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than zero" });
    }

    if (sender.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    sender.balance -= +amount;
    receiver.balance += +amount;

    await sender.save();
    await receiver.save();

    const transaction = new Transaction({
      sender: senderAccountNumber,
      receiver: receiverAccountNumber,
      amount,
      status: 'completed'
    });

    await transaction.save();
    res.status(201).json({ message: "Transaction created successfully", transaction });
  } catch (err) {
    console.error("Error creating transaction:", err);
    res.status(500).json({ message: err.message });
  }
});


app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json({ users }); 
  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: 'An error occurred while fetching users.' }); 
  }
});

app.get('/api/user/:ac', async (req, res) => {
  const { ac } = req.params;
  try {
    // Use findOne instead of findById to search by accountNumber
    const user = await User.findOne({ accountNumber: ac });

    if (user) {
      res.json(user); // Send the user data as JSON
    } else {
      res.status(404).json({ message: 'User not found' }); // Handle case where user is not found
    }
  } catch (error) {
    console.error(error); // Log the error
    res.status(500).json({ error: 'An error occurred while fetching the user' }); // Handle server error
  }
});

const server = app.listen(process.env.PORT, () => {
  console.log(`Server running at port: ${process.env.PORT}`);
});
