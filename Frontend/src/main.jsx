import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import App from './App.jsx';
import Home from './Pages/Home.jsx';
import { Register } from './Pages/Register.jsx';
import Login from './Pages/Login.jsx'
import Profile from './Pages/Profile.jsx';
import Protected from './components/Protected.jsx';
import store from './Store/Store.js';
import './index.css';
import Users from './Pages/Users.jsx';
import Transactions from './Pages/Transactions.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="/register" element={<Protected authentication={false}><Register/></Protected>} />
      <Route path="/login" element={<Protected  authentication={false}><Login /></Protected>} />
      <Route path="/user-profile" element={<Protected><Profile/></Protected>} />
      <Route path="/users" element={<Protected><Users/></Protected>} />
      <Route path="/transactions" element={<Protected><Transactions/></Protected>} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
