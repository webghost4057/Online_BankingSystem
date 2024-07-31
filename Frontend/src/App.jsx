import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './App.css';
import Header from './components/Header';
import { Outlet } from 'react-router-dom';
import { loadState } from './Store/authSlice';

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadState());
  }, [dispatch]);
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default App;
