import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../services/instance.js";

const initialState = {
    ticketcount:{},
    dashloading: false,
    dasherror: ""
  };

  const DashboardSlice = createSlice({
    name: "dashboardcounts",
    initialState,
    reducers: {
      clearDashError: (state) => {
        state.dasherror = "";
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(ticketscount.pending, (state) => {
          state.dashloading = true;
        })
        .addCase(ticketscount.fulfilled, (state, action) => {
          state.ticketcount = action.payload;
          state.dashloading = false;
        })
        .addCase(ticketscount.rejected, (state, action) => {
          state.dashloading = false;
          state.dasherror = action.payload.message;
        })
    },
  });

  export const { clearDashError } = DashboardSlice.actions;
  export default DashboardSlice.reducer;

  export const ticketscount= createAsyncThunk(
    "ticketcount/get",
    async (_, { rejectWithValue }) => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + `api/countticket`
        );
        const result = response.data;
        return result;
      } catch (err) {
        return rejectWithValue(err.response.data);
      }
    }
  );

  


 


