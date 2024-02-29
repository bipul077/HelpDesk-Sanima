import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../services/instance.js";

const initialState = {
  data: [], //we are making this object because api always doesnt return data sometime it returns ticketerror too that's why
  userticket: [],
  assignticket: [],
  acknowledgeticket: [],
  ticketloading: false,
  ticketerror: "",
  department: [],
  severity: [],//this one is needed for subcategory 
  specificseverity: [],
  PagesCount: 0,
};

const TicketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {
    clearticketError: (state) => {
      state.ticketerror = "";
    },
    clearspecificsevError:(state)=>{
      state.specificseverity = [];
    }
  },
  extraReducers: (builder) => {
    //for handling asynchronous task...for handling promises
    builder
      .addCase(addTicket.pending, (state) => {
        state.ticketloading = true;
      })
      .addCase(addTicket.fulfilled, (state, action) => {
        state.data.push(action.payload);
        state.ticketloading = false;
      })
      .addCase(addTicket.rejected, (state, action) => {
        state.ticketloading = false;
        state.ticketerror = action.payload.message;
      })
      .addCase(getTicket.pending, (state) => {
        state.ticketloading = true;
      })
      .addCase(getTicket.fulfilled, (state, action) => {
        state.ticketloading = false;
        state.PagesCount = action.payload.totalPages;
        state.data = action.payload.data;
      })
      .addCase(getTicket.rejected, (state, action) => {
        state.ticketloading = false;
        state.ticketerror = action.payload.message;
      })
      .addCase(getFilterTicket.pending, (state) => {
        state.ticketloading = true;
      })
      .addCase(getFilterTicket.fulfilled, (state, action) => {
        state.ticketloading = false;
        state.PagesCount = action.payload.totalPages;
        state.data = action.payload.data;
      })
      .addCase(getFilterTicket.rejected, (state, action) => {
        state.ticketloading = false;
        state.ticketerror = action.payload.message;
      })
      .addCase(getuserTicket.pending, (state) => {
        state.ticketloading = true;
      })
      .addCase(getuserTicket.fulfilled, (state, action) => {
        state.ticketloading = false;
        state.PagesCount = action.payload.totalPages;
        state.userticket = action.payload.data;
      })
      .addCase(getuserTicket.rejected, (state, action) => {
        state.ticketloading = false;
        // console.log(action);
        state.ticketerror = action.payload.message;
      })
      .addCase(getassignTicket.pending, (state) => {
        state.ticketloading = true;
      })
      .addCase(getassignTicket.fulfilled, (state, action) => {
        state.ticketloading = false;
        state.PagesCount = action.payload.totalPages;
        state.assignticket = action.payload.data;
      })
      .addCase(getassignTicket.rejected, (state, action) => {
        state.ticketloading = false;
        state.ticketerror = action.payload.message;
      })
      .addCase(getacknowledgeTicket.pending, (state) => {
        state.ticketloading = true;
      })
      .addCase(getacknowledgeTicket.fulfilled, (state, action) => {
        state.ticketloading = false;
        state.PagesCount = action.payload.totalPages;
        state.acknowledgeticket = action.payload.data;
      })
      .addCase(getacknowledgeTicket.rejected, (state, action) => {
        state.ticketloading = false;
        state.ticketerror = action.payload.message;
      })
      .addCase(getDepartment.pending, (state) => {
        state.ticketloading = true;
      })
      .addCase(getDepartment.fulfilled, (state, action) => {
        state.ticketloading = false;
        let department = action.payload;
        const deptoptions = department.map((option) => ({
          label: option.Name,
          value: option.DEPT_ID,
        }));
        state.department = deptoptions;
      })
      .addCase(getDepartment.rejected, (state, action) => {
        state.ticketloading = false;
        state.ticketerror = action.payload.message;
      })
      .addCase(getSeverity.pending, (state) => {
        state.ticketloading = true;
      })
      .addCase(getSeverity.fulfilled, (state, action) => {
        state.ticketloading = false;
        let severity = action.payload.data;
        const severityoptions = severity.map((option) => ({
          label: option.Name,
          value: option.id,
        }));
        state.severity = severityoptions;
      })
      .addCase(getSeverity.rejected, (state, action) => {
        state.ticketloading = false;
        state.ticketerror = action.payload.message;
      })
      .addCase(getsubCatSeverity.pending, (state) => {
        state.ticketloading = true;
      })
      .addCase(getsubCatSeverity.fulfilled, (state, action) => {
        state.ticketloading = false;
        let subsev = action.payload;
        const responseoptions = subsev.severity ? [{label:subsev.severity && subsev.severity.Name,value:subsev.severity && subsev.severity.id}]:[]
        state.specificseverity = responseoptions;
      })
      .addCase(getsubCatSeverity.rejected, (state, action) => {
        state.ticketloading = false;
        state.ticketerror = action.payload.message;
      })
  },
});

export const { clearticketError,clearspecificsevError } = TicketSlice.actions;
export default TicketSlice.reducer;

export const addTicket = createAsyncThunk(
  "tickets/add",
  async ({ formData, toast, history }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + `api/addticket`,
        formData
      );
      const result = response.data;
      toast.success("Ticket Created Successfully");
      history.push("/userticket");
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getTicket = createAsyncThunk(
  "tickets/get",
  async ({currentPage}, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + `api/tickets?page=${currentPage}&limit=${process.env.REACT_APP_HD_PAGE}`
      );
      const result = response.data;
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getFilterTicket = createAsyncThunk(
  "filtertickets/post",
  async ({currentPage,category,search,status,fiscalyear,department}, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + `api/filterticket?page=${currentPage}&limit=${process.env.REACT_APP_HD_PAGE}`,
        {category,search,status,fiscalyear,department}
      );
      const result = response.data;
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

//Ticket Created By You
export const getuserTicket = createAsyncThunk(
  "usertickets/post",
  async ({currentPage,search,fiscalyear}, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + `api/getuserticket?page=${currentPage}&limit=${process.env.REACT_APP_HD_PAGE}`,
        {search,fiscalyear}
      );
      const result = response.data;
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

//Ticket Assigned To You
export const getassignTicket = createAsyncThunk(
  "assigntickets/post",
  async ({currentPage,category,search,fiscalyear,status}, { rejectWithValue }) => {
    console.log(status)
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + `api/getassignticket?page=${currentPage}&limit=${process.env.REACT_APP_HD_PAGE}`,
        {category,search,fiscalyear,status}
      );
      const result = response.data;
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getacknowledgeTicket = createAsyncThunk(
  "acknowledgeticket/post",
  async ({currentPage,search}, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + `api/getacknowledgeticket?page=${currentPage}&limit=${process.env.REACT_APP_HD_PAGE}`,
        {search}
      );
      const result = response.data;
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getDepartment = createAsyncThunk(
  "departments/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + `api/departments`
      );
      const result = response.data;
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getSeverity = createAsyncThunk(
  "severity/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + `api/severity`
      );
      const result = response.data;
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getsubCatSeverity = createAsyncThunk(
  "subcatseverity/get",
  async ({id}, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + `api/subcatseverity/${id}`
      );
      const result = response.data;
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data); // Return a rejected action with the caterror payload
    }
  }
);
