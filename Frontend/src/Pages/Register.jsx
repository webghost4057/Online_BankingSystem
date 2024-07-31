import React, { useState } from 'react';
import logo from '../Images/logo.png';
import axios from 'axios';
import { login } from '../Store/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
export const Register = () => {
  const usedispatch = useDispatch()
  const navigate  = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phonenumber: '',
    identificationType: '',
    idnumber: '',
    password: '',
    confirmPassword: ''
  });
  const [togglePassword , setTogglePassword] = useState(true)
  const [toggleConfirmPassword , setToggleConfirmPassword] = useState(true)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
    } else if (formData.password.length < 8) {
      alert("Password length should be at least 8 characters");
    } else {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_KEY}/register`, formData);
        console.log(response.data);
        alert("User registered successfully!");
        navigate('/login')
        setFormData({
          name: '',
          email: '',
          phoneNumber: '',
          identificationType: '',
          idnumber: '',
          password: '',
          confirmPassword: ''
        });
      } catch (error) {
        console.error('Error registering user:', error);
        alert("Error registering user");
      }
    }
  };

  const handlePassword = ()=>{
    setTogglePassword(!togglePassword)
  }
  const handleConfirmPassword = ()=>{
    setToggleConfirmPassword(!toggleConfirmPassword)
  }

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <img className="mx-auto h-10 w-auto" src={logo} alt="EPay" />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Create your account</h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-lg">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">Name</label>
              <div className="mt-2">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
              <div className="mt-2">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />

              </div>
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium leading-6 text-gray-900">Phone Number</label>
              <div className="mt-2">
                <input
                  type="text"
                  id="phonenumber"
                  name="phonenumber"
                  value={formData.phonenumber}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="identificationType" className="block text-sm font-medium leading-6 text-gray-900">Identification Type</label>
              <div className="mt-2">
                <select
                  id="identificationType"
                  name="identificationType"
                  value={formData.identificationType}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option value="">Select an option</option>
                  <option value="NationalID">National ID Card</option>
                  <option value="DrivingLicense">Driving License</option>
                  <option value="Passport">Passport</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="idnumber" className="block text-sm font-medium leading-6 text-gray-900">Identification Number</label>
              <div className="mt-2">
                <input
                  type="text"
                  id="idnumber"
                  name="idnumber"
                  value={formData.idnumber}
                  onChange={handleChange}
                  autoComplete="identification"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
              <div className="mt-2 flex">
                <input
                  type={togglePassword? 'password':'text'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {
                  togglePassword? (
                  <div onClick={handlePassword}><VisibilityIcon/></div>
                ):(
                <div onClick={handlePassword}><VisibilityOffIcon/></div>
              )
                }
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-900">Confirm Password</label>
              <div className="mt-2 flex">
                <input
                  type={toggleConfirmPassword? 'password':'text'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {
                  toggleConfirmPassword? (
                  <div onClick={handleConfirmPassword}><VisibilityIcon/></div>
                ):(
                <div onClick={handleConfirmPassword}><VisibilityOffIcon/></div>
              )
                }
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Register
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <a href="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Sign in</a>
        </p>
      </div>
    </div>
  );
};
