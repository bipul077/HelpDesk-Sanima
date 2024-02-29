import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../services/instance.js";

const initialState = {
    filtercategory:[],
    filterdepartment:[],
    fticketloading: false,
    fticketerror: "",
    filterStatus: [
      {label: "New",value: "New",},
      { label: "In-Progress", value: "In Progress" },
      { label: "Closed", value: "Closed" }
    ]
  };

  const FilterTicketSlice = createSlice({
    name: "filerticket",
    initialState,
    reducers: {
      clearfticketError: (state) => {
        state.fticketerror = "";
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(filtercategoryticket.pending, (state) => {
          state.fticketloading = true;
        })
        .addCase(filtercategoryticket.fulfilled, (state, action) => {
          state.filtercategory = action.payload;
          state.fticketloading = false;
        })
        .addCase(filtercategoryticket.rejected, (state, action) => {
          state.fticketloading = false;
          state.fticketerror = action.payload.message;
        })
        .addCase(filterdepartmentticket.pending, (state) => {
          state.fticketloading = true;
        })
        .addCase(filterdepartmentticket.fulfilled, (state, action) => {
          let department = action.payload;
          const deptoptions = department.map((option) => ({
            label: option.Name,
            value: option.DEPT_ID,
          }));
          state.filterdepartment = deptoptions;
          state.fticketloading = false;
        })
        .addCase(filterdepartmentticket.rejected, (state, action) => {
          state.fticketloading = false;
          state.fticketerror = action.payload.message;
        })
    },
  });
  
  export const { clearfticketError } = FilterTicketSlice.actions;
  export default FilterTicketSlice.reducer;

  export const filtercategoryticket= createAsyncThunk(
    "filtercategoryticket/get",
    async (_, { rejectWithValue }) => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + `api/filtercategoryticket`
        );
        const result = response.data;
        return result;
      } catch (err) {
        return rejectWithValue(err.response.data);
      }
    }
  );

  export const filterdepartmentticket= createAsyncThunk(
    "filterdepartmentticket/get",
    async (_, { rejectWithValue }) => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + `api/filterdepartmentticket`
        );
        const result = response.data;
        return result;
      } catch (err) {
        return rejectWithValue(err.response.data);
      }
    }
  );

  


 


