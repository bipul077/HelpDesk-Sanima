import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../services/instance.js";

const initialState = {
    ticketsolvebystaff:[],
    ticketcategorysolvebystaff:[],
    reporthr:[],
    reportloading: false,
    reporterror: "",
    reporthrpages: 0,
    fyOption: [
      {
        label: "2080-81",
        value: "2080-81",
      },
      {
        label: "2081-82",
        value: "2081-82",
      },
      {
        label: "2082-83",
        value: "2082-83",
      },
      {
        label: "2083-84",
        value: "2083-84",
      },
      {
        label: "2084-85",
        value: "2084-85",
      },
    ]
  };

  const ReportSlice = createSlice({
    name: "reports",
    initialState,
    reducers: {
      clearReportError: (state) => {
        state.reporterror = "";
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(ticketbystaff.pending, (state) => {
          state.reportloading = true;
        })
        .addCase(ticketbystaff.fulfilled, (state, action) => {
          state.ticketsolvebystaff = action.payload;
          state.reportloading = false;
        })
        .addCase(ticketbystaff.rejected, (state, action) => {
          state.reportloading = false;
          state.reporterror = action.payload.message;
        })
        .addCase(ticketcategorybystaff.pending, (state) => {
          state.reportloading = true;
        })
        .addCase(ticketcategorybystaff.fulfilled, (state, action) => {
          state.ticketcategorysolvebystaff = action.payload;
          state.reportloading = false;
        })
        .addCase(ticketcategorybystaff.rejected, (state, action) => {
          state.reportloading = false;
          state.reporterror = action.payload.message;
        })
        .addCase(hrreport.pending, (state) => {
          state.reportloading = true;
        })
        .addCase(hrreport.fulfilled, (state, action) => {
          state.reporthr = action.payload.data;
          state.reporthrpages = action.payload.totalPages;
          state.reportloading = false;
        })
        .addCase(hrreport.rejected, (state, action) => {
          state.reportloading = false;
          state.reporterror = action.payload.message;
        });
    },
  });

  export const { clearReportError } = ReportSlice.actions;
  export default ReportSlice.reducer;

  export const ticketbystaff= createAsyncThunk(
    "ticketsolvebystaff/post",
    async ({startdate,enddate}, { rejectWithValue }) => {
      try {
        const response = await axios.post(
          process.env.REACT_APP_API_URL + `api/ticketsolvebystaff`,
          {startdate,enddate}
        );
        const result = response.data;
        return result;
      } catch (err) {
        return rejectWithValue(err.response.data);
      }
    }
  );

  export const ticketcategorybystaff= createAsyncThunk(
    "ticketcategorysolvebystaff/post",
    async ({startdate,enddate}, { rejectWithValue }) => {
      try {
        const response = await axios.post(
          process.env.REACT_APP_API_URL + `api/categorybystaff`,
          {startdate,enddate}
        );
        const result = response.data;
        return result;
      } catch (err) {
        return rejectWithValue(err.response.data);
      }
    }
  );

  export const hrreport = createAsyncThunk(
    "hrreport/post",
    async({status,fiscalyear,currentPage,row},{rejectWithValue})=>{
      try {
        const response = await axios.post(process.env.REACT_APP_API_URL + `api/report?page=${currentPage}&limit=${row}`,
        {status,fiscalyear}
        );
        const result = response.data;
        return result;
      } catch (err) {
        return rejectWithValue(err.response.data);        
      }
    }
  )

  


 


