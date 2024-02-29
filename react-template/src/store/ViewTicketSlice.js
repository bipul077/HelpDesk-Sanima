import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../services/instance.js";

const initialState = {
  //we are making this object because api always doesnt return data sometime it returns vticketerror too that's why
  vticketloading: false,
  vticketerror: "",
  Ticketdata: [],
  replies: [],
  userdetail: {},
  cviewticket: false,
};

const ViewTicketSlice = createSlice({
  name: "viewticket",
  initialState,
  reducers: {
    clearVticketError: (state) => {
      state.vticketerror = "";
    },
    clearviewticket: (state) => {
      state.cviewticket = false;
    },
  },
  extraReducers: (builder) => {
    //for handling asynchronous task...for handling promises
    builder
      .addCase(checkviewticket.pending, (state) => {
        state.vticketloading = true;
      })
      .addCase(checkviewticket.fulfilled, (state, action) => {
        state.vticketloading = false;
        state.cviewticket = action.payload.success;
      })
      .addCase(checkviewticket.rejected, (state, action) => {
        state.vticketloading = false;
        state.vticketerror = action.payload.message;
      })
      .addCase(addassignuser.pending, (state) => {
        state.vticketloading = true;
      })
      .addCase(addassignuser.fulfilled, (state, action) => {
        state.vticketloading = false;
        state.Ticketdata = {
          ...state.Ticketdata,
          total_worked: action.payload.data.total_worked,
          updatedAt: action.payload.data.updatedAt,
          Assign_User: action.payload.data.Assign_User,
          Ticket_Status: action.payload.data.Ticket_Status,
          ticketlogs: state.Ticketdata.ticketlogs.concat(
            action.payload.logsdata
          ),
        };
      })
      .addCase(addassignuser.rejected, (state, action) => {
        state.vticketloading = false;
        state.vticketerror = action.payload.message;
      })
      .addCase(acknowledgeticketuser.pending, (state) => {
        state.vticketloading = true;
      })
      .addCase(acknowledgeticketuser.fulfilled, (state, action) => {
        state.vticketloading = false;
        state.Ticketdata = {
          ...state.Ticketdata,
          updatedAt: action.payload.data.updatedAt,
          total_worked: action.payload.data.total_worked,
          ticketlogs: state.Ticketdata.ticketlogs.concat(
            action.payload.logsdata
          ),
        };
      })
      .addCase(acknowledgeticketuser.rejected, (state, action) => {
        state.vticketloading = false;
        state.vticketerror = action.payload.message;
      })
      .addCase(addassignuserself.pending, (state) => {
        state.vticketloading = true;
      })
      .addCase(addassignuserself.fulfilled, (state, action) => {
        state.vticketloading = false;
        state.Ticketdata = {
          ...state.Ticketdata, // Spread the existing Ticketdata properties
          updatedAt: action.payload.data.updatedAt,
          total_worked: action.payload.data.total_worked, // Update the specific property
          Assign_User: action.payload.data.Assign_User, // Update another specific property
          Ticket_Status: action.payload.data.Ticket_Status,
          ticketlogs: state.Ticketdata.ticketlogs.concat(
            action.payload.logsdata
          ), // Concatenate new data to ticketlogs//If you use the push method instead of concat to add data to the ticketlogs array, you will directly mutate the existing array.
        };
      })

      .addCase(addassignuserself.rejected, (state, action) => {
        state.vticketloading = false;
        state.vticketerror = action.payload.message;
      })
      .addCase(addreply.pending, (state) => {
        state.vticketloading = true;
      })
      .addCase(addreply.fulfilled, (state, action) => {
        state.replies.push(action.payload.reply);
        state.Ticketdata = {
          ...state.Ticketdata,
          updatedAt: action.payload.ticket.updatedAt,
          total_worked: action.payload.reply.total_worked,
          Ticket_Status: action.payload.ticket.Ticket_Status,
          ticketlogs: state.Ticketdata.ticketlogs.concat(
            action.payload.logsdata
          ),
        };
        state.vticketloading = false;
      })
      .addCase(addreply.rejected, (state, action) => {
        state.vticketloading = false;
        state.vticketerror = action.payload.message;
      })
      .addCase(getreply.pending, (state) => {
        state.vticketloading = true;
      })
      .addCase(getreply.fulfilled, (state, action) => {
        state.vticketloading = false;
        state.replies = action.payload;
      })
      .addCase(getreply.rejected, (state, action) => {
        state.vticketloading = false;
        state.vticketerror = action.payload.message;
      })
      .addCase(addstatus.pending, (state) => {
        state.vticketloading = true;
      })
      .addCase(addstatus.fulfilled, (state, action) => {
        state.vticketloading = false;
        state.Ticketdata = {
          ...state.Ticketdata,
          updatedAt: action.payload.data.updatedAt,
          total_worked: action.payload.data.total_worked,
          Ticket_Status: action.payload.data.Ticket_Status,
          ticketlogs: state.Ticketdata.ticketlogs.concat(
            action.payload.logsdata
          ),
        };
      })
      .addCase(addstatus.rejected, (state, action) => {
        state.vticketloading = false;
        state.vticketerror = action.payload.message;
      })
      .addCase(getspecificTicket.pending, (state) => {
        state.vticketloading = true;
      })
      .addCase(getspecificTicket.fulfilled, (state, action) => {
        state.vticketloading = false;
        state.Ticketdata = action.payload;
      })
      .addCase(getspecificTicket.rejected, (state, action) => {
        state.vticketloading = false;
        state.vticketerror = action.payload.message;
      })
      .addCase(switchdepartment.pending, (state) => {
        state.vticketloading = true;
      })
      .addCase(switchdepartment.fulfilled, (state, action) => {
        state.vticketloading = false;
        state.Ticketdata = {
          ...state.Ticketdata,
          updatedAt: action.payload.data.updatedAt,
          total_worked: action.payload.data.total_worked,
          department: action.payload.data.departments,
          ticketlogs: state.Ticketdata.ticketlogs.concat(
            action.payload.logsdata
          ),
        };
      })
      .addCase(switchdepartment.rejected, (state, action) => {
        state.vticketloading = false;
        // console.log(action);
        state.vticketerror = action.payload.message;
        // toast.vticketerror = action.payload.message;
      })
      .addCase(userDetail.pending, (state) => {
        state.vticketloading = true;
      })
      .addCase(userDetail.fulfilled, (state, action) => {
        state.vticketloading = false;
        state.userdetail = action.payload;
      })
      .addCase(userDetail.rejected, (state, action) => {
        state.vticketloading = false;
        state.vticketerror = action.payload.message;
      })
      .addCase(editSeverity.pending, (state) => {
        state.vticketloading = true;
      })
      .addCase(editSeverity.fulfilled, (state, action) => {
        state.vticketloading = false;
        state.Ticketdata = {
          ...state.Ticketdata,
          Severity_id: action.payload.data.Severity_id,
          updatedAt: action.payload.data.updatedAt,
          total_worked: action.payload.data.total_worked,
          ticketlogs: state.Ticketdata.ticketlogs.concat(
            action.payload.logsdata
          ),
        };
        if (!state.Ticketdata.severity) {
          state.Ticketdata.severity = {}; // Initialize severity if it's null
        }
        state.Ticketdata.severity.Name = action.payload.data.severity.Name;
      })
      .addCase(editSeverity.rejected, (state, action) => {
        state.vticketloading = false;
        state.vticketerror = action.payload.message;
      })
      .addCase(updateUserDetail.pending, (state) => {
        state.vticketloading = true;
      })
      .addCase(updateUserDetail.fulfilled, (state, action) => {
        state.vticketloading = false;
        state.Ticketdata = {
          ...state.Ticketdata,
          User: action.payload.data.User,
          StaffId: action.payload.data.StaffId,
          updatedAt: action.payload.data.updatedAt,
          total_worked: action.payload.data.total_worked,
          ticketlogs: state.Ticketdata.ticketlogs.concat(
            action.payload.logsdata
          ),
        };
      })
      .addCase(updateUserDetail.rejected, (state, action) => {
        state.vticketloading = false;
        state.vticketerror = action.payload.message;
      })
      .addCase(editCategory.pending, (state) => {
        state.vticketloading = true;
      })
      .addCase(editCategory.fulfilled, (state, action) => {
        state.vticketloading = false;
        state.Ticketdata = {
          ...state.Ticketdata,
          Category: action.payload.data.Category,
          SubCategory: action.payload.data.SubCategory,
          updatedAt: action.payload.data.updatedAt,
          total_worked: action.payload.data.total_worked,
          ticketlogs: state.Ticketdata.ticketlogs.concat(
            action.payload.logsdata
          ),
        };
      })
      .addCase(editCategory.rejected, (state, action) => {
        state.vticketloading = false;
        state.vticketerror = action.payload.message;
      });
  },
});
export const { clearVticketError,clearviewticket } = ViewTicketSlice.actions;
export default ViewTicketSlice.reducer;

//checkviewticket
export const checkviewticket = createAsyncThunk(
  "checkviewticket/get",
  async ({id}, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + `api/accessview/${id}`
      );
      const result = response.data;
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

//assignuserandstatus
export const addassignuser = createAsyncThunk(
  "assignuser/post",
  async ({ id, assignuserid, toast, message }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + `api/assignuser/${id}`,
        {
          assignuserid,
        }
      );
      const result = response.data;
      toast.success(message);
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

//acknowledgeticketuser
export const acknowledgeticketuser = createAsyncThunk(
  "acknowledgeticketuser/post",
  async ({ id, acknowledgeuser, toast, message }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + `api/acknowledgeuser/${id}`,
        {
          acknowledgeuser,
        }
      );
      const result = response.data;
      toast.success(message);
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const addassignuserself = createAsyncThunk(
  "assignuserself/post",
  async ({ id, assignuser, toast, message }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + `api/assignselfuser/${id}`,
        {
          assignuserid: assignuser,
        }
      );
      const result = response.data;
      toast.success(message);
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const addstatus = createAsyncThunk(
  "addstatus/post",
  async ({ id, toast, status, message }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + `api/changestatus/${id}`,
        {
          status,
        }
      );
      const result = response.data;
      toast.success(message);
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const addreply = createAsyncThunk(
  "reply/post",
  async ({ formData, toast }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + `api/addreply`,
        formData
      );
      const result = response.data;
      toast.success("Replied Successfully");
      // console.log(result);
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getreply = createAsyncThunk(
  "reply/get",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + `api/reply/${id}`
      );
      const result = response.data;
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getspecificTicket = createAsyncThunk(
  "specifictickets/get",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + `api/tickets/${id}`
      );
      const result = response.data;
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const switchdepartment = createAsyncThunk(
  "switchdepartment/post",
  async ({ id, toast, status, history }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + `api/switchdepartment/${id}`,
        {
          department: status,
        }
      );
      const result = response.data;
      toast.success("Switched Department Successfully");
      history.push("/tickets");
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const userDetail = createAsyncThunk(
  "userdetail/get",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_COMMON_API_URL + `api/staff/${id}`
      );
      const result = response.data;
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const editSeverity = createAsyncThunk(
  "editseverity/post",
  async ({ id, severity, toast }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + `api/changeseverity/${id}`,
        {
          severity,
        }
      );
      const result = response.data;
      toast.success("Severity updated successfully");
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateUserDetail = createAsyncThunk(
  "updateuserdetail/put",
  async ({ id, username, staffid, toast }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        process.env.REACT_APP_API_URL + `api/updateuser/${id}`,
        {
          username,
          staffid,
        }
      );
      const result = response.data;
      toast.success("Acknowledged Successfully");
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const editCategory = createAsyncThunk(
  "editcategory/post",
  async ({ id, category,subcategory, toast }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + `api/changecategory/${id}`,
        {
          category,
          subcategory
        }
      );
      const result = response.data;
      toast.success("Category/Updated updated successfully");
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
