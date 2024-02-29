import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../services/instance.js";

const initialState = { 
  loginloading: false,
  loginerror: "",
};

const LoginSlice = createSlice({
  name: "login",
  initialState,
  extraReducers: (builder) => {
    //for handling asynchronous task...for handling promises
    builder
      .addCase(verifyrole.pending, (state) => {
        state.loginloading = true;
      })
      .addCase(verifyrole.fulfilled, (state, action) => {
        state.loginloading = false;   
      })
      .addCase(verifyrole.rejected, (state, action) => {
        state.loginloading = false;
        // localStorage.clear();
        window.location.href = "/helpdesk/#/dashboard"//uatorlive
        // window.location.href = "/#/dashboard";//local
      })  
  },
});

export default LoginSlice.reducer;

export const verifyrole = createAsyncThunk(
    "roles/get",
    async ({role}, { rejectWithValue }) => {
      try {
        // console.log(role)
        const response = await axios.get(
          process.env.REACT_APP_API_URL + `api/${role}`
        );
        const result = response.data;
        return result;
      } catch (err) {
        return rejectWithValue(err.response.data);
      }
    }
  );

