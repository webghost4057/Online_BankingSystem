import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
const Profile = () => {
    const user = useSelector(state=>state.auth.userData)
    console.log(user, "@#@#user");
    
   
  return (
    <div>
         <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center space-x-4">
        <h1>{user.name}</h1>
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-800">Profile Details</h3>
        <div className="mt-4 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-600">{user.identificationType}:</span>
            <span className="text-gray-800">{user.idnumber}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-600">Acc/Number:</span>
            <span className="text-gray-800">{user.accountNumber}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-600">Status:</span>
            <span className="text-gray-800">{user.isAdmin}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-600">Phone Number:</span>
            <span className="text-gray-800">{user.phonenumber}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-600">Profile Status</span>
            <span className="text-gray-800">{user.verified === true? 'Verified':'NotVerified'}</span>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Profile