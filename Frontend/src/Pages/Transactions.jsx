import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import logo from "../Images/logo.png";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateBalance } from "../Store/authSlice";
import { updateUser } from "../Store/authSlice";
import { useNavigate } from "react-router-dom";
const Transactions = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.userData);
  const [showDepositBox, setShowDepositBox] = useState(false);
  const [showTransferBox, setShowTransferBox] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [reciverAccount, setReciverAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const toggleModal = () => {
    setShowDepositBox(!showDepositBox);
  };
  useEffect(() => {
    if (user && user.accountNumber) {
      console.log(user.accountNumber, "acc");
      dispatch(updateUser(user.accountNumber));
    }

    const fetchTransactions = async (ac) => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_KEY}/user/${ac}/transactions`
        );
        console.log(response.data);
        setTransactions(response.data);
        console.log("transactions:", transactions);
      } catch (error) {
        console.log(error);
      }
    };
    

    fetchTransactions(user.accountNumber);
  }, [user, dispatch]);


  const handleTransfer =async ()=>{
    const details = {
        senderAccountNumber: user.accountNumber,
        receiverAccountNumber: reciverAccount,
        amount: amount,
      };
      try {
        const response  = await axios.post(`${import.meta.env.VITE_API_KEY}/transaction` , details)
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }

  }

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, "");
    const formatted = cleaned.replace(/(.{4})/g, "$1 ").trim();
    return formatted;
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setCardNumber(formatCardNumber(value));
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    await addDeposit(user.accountNumber);
    toggleModal();
  };

  const addDeposit = async (ac) => {
    const details = {
      senderAC: cardNumber,
      receiverAC: ac,
      amount: amount,
    };
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_KEY}/deposit/${ac}`,
        details
      );
      console.log(response.data, "$#$#$#$");
      alert("Transaction has been done successfully");
      dispatch(updateBalance(response.data.balance));
    } catch (error) {
      console.log(error);
    }
  };

  const toggleTransferBox=()=>{
    console.log("4343ffdf");
    setShowTransferBox(!showTransferBox)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Total Balance</h2>
        <div className="text-3xl font-semibold text-green-500">
          $<span>{user ? user.balance : "loading..."}</span>
        </div>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none"
          onClick={toggleModal}
        >
          Deposit
        </button>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Transactions</h2>
        <button
        onClick={toggleTransferBox}
  className="mt-4 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none"
  
>
  Transfer Money
</button>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                Date
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                Sender
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                Receiver
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                Amount
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
          {transactions.length ? (
              transactions.map((transaction, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-600">{new Date(transaction.date).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-600">{transaction.sender}</td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-600">{transaction.receiver}</td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-600">${transaction.amount.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-600 capitalize">{transaction.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-2 px-4 text-center text-gray-600">No Transactions</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Deposit Modal */}
      {showDepositBox && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-75 p-5">
          <div className="w-full max-w-lg mx-auto bg-white rounded-lg shadow-lg p-6 text-gray-700">
            <div className="w-full pt-1 pb-5 text-center">
              <div className="bg-white text-white overflow-hidden rounded-full w-20 h-20 mx-auto shadow-lg flex justify-center items-center">
                <i className="mdi mdi-credit-card-outline text-3xl"></i>
                <img src={logo} alt="" />
              </div>
            </div>
            <h1 className="text-center font-bold text-xl uppercase mb-6">
              Deposit your money in bank
            </h1>
            <form onSubmit={handleDeposit}>
              <div className="mb-4">
                <label
                  className="block font-semibold text-sm mb-2"
                  htmlFor="card-number"
                >
                  Card Number
                </label>
                <input
                  type="text"
                  id="card-number"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="0000 0000 0000 0000"
                  onChange={handleChange}
                  value={cardNumber}
                  required
                />
              </div>
              <div className="mb-4 flex items-end space-x-4">
                <div className="w-1/2">
                  <label
                    className="block font-semibold text-sm mb-2"
                    htmlFor="exp-month"
                  >
                    Expiration Month
                  </label>
                  <select
                    id="exp-month"
                    className="form-select w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
                    required
                  >
                    <option value="01">01 - January</option>
                    <option value="02">02 - February</option>
                    <option value="03">03 - March</option>
                    <option value="04">04 - April</option>
                    <option value="05">05 - May</option>
                    <option value="06">06 - June</option>
                    <option value="07">07 - July</option>
                    <option value="08">08 - August</option>
                    <option value="09">09 - September</option>
                    <option value="10">10 - October</option>
                    <option value="11">11 - November</option>
                    <option value="12">12 - December</option>
                  </select>
                </div>
                <div className="w-1/2">
                  <label
                    className="block font-semibold text-sm mb-2"
                    htmlFor="exp-year"
                  >
                    Expiration Year
                  </label>
                  <select
                    id="exp-year"
                    className="form-select w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
                    required
                  >
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                    <option value="2029">2029</option>
                    <option value="2030">2030</option>
                  </select>
                </div>
              </div>
              <div className="mb-6">
                <label
                  className="block font-semibold text-sm mb-2"
                  htmlFor="security-code"
                >
                  Security Code
                </label>
                <input
                  type="text"
                  id="security-code"
                  className="w-32 px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="000"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block font-semibold text-sm mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-32 px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="$0"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold"
              >
                <i className="mdi mdi-lock-outline mr-1"></i> Deposit
              </button>
              <button
                type="button"
                onClick={toggleModal}
                className="w-full bg-white hover:bg-gray-500 text-black rounded-lg px-3 py-3 font-semibold"
              >
                <i className="mdi mdi-lock-outline mr-1"></i> Cancel
              </button>
            </form>
          </div>
        </div>
      )}
      {
        showTransferBox &&
        ( <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-75 p-5">
            <div className="w-full max-w-lg mx-auto bg-white rounded-lg shadow-lg p-6 text-gray-700">
              <div className="w-full pt-1 pb-5 text-center">
                <div className="bg-white text-white overflow-hidden rounded-full w-20 h-20 mx-auto shadow-lg flex justify-center items-center">
                  <i className="mdi mdi-credit-card-outline text-3xl"></i>
                  <img src={logo} alt="" />
                </div>
              </div>
              <h1 className="text-center font-bold text-xl uppercase mb-6">
                Transfer Money
              </h1>
              <form onSubmit={handleTransfer} >
                <div className="mb-4">
                  <label
                    className="block font-semibold text-sm mb-2"
                    htmlFor="card-number"
                  >
                    Reciver Account Number
                  </label>
                  <input
                    type="text"
                    id="card-number"
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="1221212312"
                    onChange={(e)=>setReciverAccount(e.target.value)}
                    value={reciverAccount}
                    required
                  />
                </div>
                <div className="mb-4 flex items-end space-x-4">
                </div>
                <div className="mb-6">
                  <label className="block font-semibold text-sm mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-32 px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="$0"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold"
                >
                  <i className="mdi mdi-lock-outline mr-1"></i> Transfer Now
                </button>
                <button
                  type="button"
                  onClick={toggleTransferBox}
                  className="w-full bg-white hover:bg-gray-500 text-black rounded-lg px-3 py-3 font-semibold"
                >
                  <i className="mdi mdi-lock-outline mr-1"></i> Cancel
                </button>
              </form>
            </div>
          </div>)
      }
    </div>
  );
};

export default Transactions;
