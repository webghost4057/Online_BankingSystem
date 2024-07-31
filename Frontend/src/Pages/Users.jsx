import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Users = () => {
    const user = useSelector(state => state.auth.status);
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_KEY}/users`);
                console.log(response.data, "@#@!@!#3@#");
                setUsers(response.data.users);
                console.log(users);
            } catch (error) {
                console.log(error);
            }
        };
        getUsers();
    }, [user, navigate]);

    if (!user) {
        return null;
    }
    const verifyUser = async (id) => {
      console.log(id, "#@#@#id");
      try {
          const response = await axios.put(`${import.meta.env.VITE_API_KEY}/verify/${id}`);
          console.log(response.data);
          setUsers(prevUsers => prevUsers.map(user => 
              user._id === id ? { ...user, verified: true } : user
          ));
      } catch (error) {
          console.log(error);
      }
  };
    return (
        <div className="container mx-auto">
            <table className="w-full bg-white rounded-lg overflow-hidden shadow-lg my-5">
                <thead className="bg-blue-500 text-white">
                    <tr className="hidden sm:table-row">
                        <th className="p-3 text-left">ID Number</th>
                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-left">Email</th>
                        <th className="p-3 text-left" width="110px">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr className="bg-blue-100" key={user._id}>
                            <td className="border p-3">{user.idnumber}</td>
                            <td className="border p-3">{user.name}</td>
                            <td className="border p-3 truncate">{user.email}</td>
                            {
                              user.verified?(<td className="border p-3 text-red-400 hover:text-red-600 hover:font-medium cursor-pointer">Verified </td>):
                              (<td className="border p-3 text-red-400 hover:text-red-600 hover:font-medium cursor-pointer" onClick={()=>verifyUser(user._id)}>Verify?</td>)
                            }
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Users;
