import React from "react";
import { useSelector } from "react-redux";
import logo from "../Images/logo.png"; // Ensure this path is correct
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../Store/authSlice";
const Header = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  console.log(userData, "Userdata");
  const logoutUser = () => {
    console.log("####");
    dispatch(logout());
  };

  return (
    <>
      {userData ? (
        <aside
          id="default-sidebar"
          className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
          aria-label="Sidebar"
        >
          <div className="h-full px-3 py-4 overflow-y-auto bg-blue-200 dark:bg-blue-700">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              <div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {userData.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Admin
                </p>
              </div>
            </div>
            <ul className="space-y-2 font-medium">
              <li>
                <Link
                  to="/"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <span className="flex-1 ms-3 whitespace-nowrap">Home</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/transactions"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <span className="flex-1 ms-3 whitespace-nowrap">
                    Transactions
                  </span>
                </Link>
              </li>
              <li>
                {userData.isAdmin === "admin" && (
                  <Link
                    to="/users"
                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    <span className="flex-1 ms-3 whitespace-nowrap">Users</span>
                  </Link>
                )}
              </li>
              <li>
                <Link
                  to="/user-profile"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <span className="flex-1 ms-3 whitespace-nowrap">Profile</span>
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <span
                    onClick={logoutUser}
                    className="flex-1 ms-3 whitespace-nowrap"
                  >
                    Logout
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </aside>
      ) : (
        <header className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-blue-800 p-4 w-full">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <img
                src={logo}
                alt="Logo"
                className="h-16 w-16" // Adjust the height and width as needed
              />
              <h1 className="text-white text-xl font-bold">E-Pay</h1>
            </div>

            {/* Buttons */}
            <div className="space-x-4">
              <a
                href="/login"
                className="bg-white text-blue-500 hover:bg-blue-400 px-4 py-2 rounded-md font-medium"
              >
                Sign In
              </a>
              <Link
                to="/register"
                className="bg-white text-blue-500 hover:bg-blue-400 px-4 py-2 rounded-md font-medium"
              >
                Register
              </Link>
            </div>
          </div>
        </header>
      )}
    </>
  );
};

export default Header;
