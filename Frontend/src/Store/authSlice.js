import { createSlice } from "@reduxjs/toolkit";
import axios from 'axios'
const initialState = {
  userData: null,
  token: null,
  status: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.userData = action.payload.userData;
      state.token = action.payload.token;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("userData", JSON.stringify(action.payload.userData));
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
    },
    loadState: (state) => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("userData");
      if (token && userData) {
        state.status = true;
        state.token = token;
        state.userData = JSON.parse(userData);
      }
    },
    updateBalance:(state , action)=>{
      if(state.userData){
        state.userData.balance = action.payload
        localStorage.setItem("userData", JSON.stringify(state.userData));
      }
    }
  },
  });

export const { login, logout , loadState , updateBalance} = authSlice.actions;
export const updateUser = (AC) => async (dispatch) => {
  try {
    const response = await axios.get(`http://localhost:4000/api/user/${AC}`);
    console.log(response, "555jeuuu");
    const newBalance = response.data.balance;
    dispatch(updateBalance(newBalance));
    const userData = JSON.parse(localStorage.getItem("userData"));
    localStorage.setItem("userData", JSON.stringify({ ...userData, balance: newBalance }));
  } catch (error) {
    console.error('Failed to update balance:', error);
  }
};
export default authSlice.reducer;
