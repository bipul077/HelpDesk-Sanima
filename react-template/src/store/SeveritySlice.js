import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../services/instance.js";

const initialState = {
  severities: [],
  severityloading: false,
  severityerror: "",
};

const SeveritySlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    clearSeverityError: (state) => {
      state.severityerror = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addSeverity.pending, (state) => {
        state.severityloading = true;
      })
      .addCase(addSeverity.fulfilled, (state, action) => {
        state.severities.push(action.payload.data);
        state.severityloading = false;
      })
      .addCase(addSeverity.rejected, (state, action) => {
        state.severityloading = false;
        state.severityerror = action.payload.message;
      })
      .addCase(getSeverity.pending, (state) => {
        state.severityloading = true;
      })
      .addCase(getSeverity.fulfilled, (state, action) => {
        state.severityloading = false;
        state.severities = action.payload.data;
      })
      .addCase(getSeverity.rejected, (state, action) => {
        state.ticketloading = false;
        state.severityerror = action.payload.message;
      })
      .addCase(updateSeverity.pending, (state) => {
        state.severityloading = true;
      })
      .addCase(updateSeverity.fulfilled, (state, action) => {
        state.severityloading = false;
        const {
          arg: { id },
        } = action.meta;
        if (id) {
          state.severities = state.severities.map((item) =>
            item.id === id ? action.payload.data : item
          );
        }
      })
      .addCase(updateSeverity.rejected, (state, action) => {
        state.severityloading = false;
        state.severityerror = action.payload.message;
      })
      .addCase(deleteSeverity.pending, (state) => {
        state.severityloading = true;
      })
      .addCase(deleteSeverity.fulfilled, (state, action) => {
        state.severityloading = false;
        const {
          arg: { id },
        } = action.meta;
        if (id) {
          state.severities = state.severities.filter((item) => item.id !== id);
        }
      })
      .addCase(deleteSeverity.rejected, (state, action) => {
        state.severityloading = false;
        state.severityerror = action.payload.message;
      });
  },
});

export const { clearSeverityError } = SeveritySlice.actions;
export default SeveritySlice.reducer;

export const addSeverity = createAsyncThunk(
  "severity/post",
  async ({ name, duration, toast }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + `api/addseverity`,
        { name, duration }
      );
      const result = response.data;
      toast.success("Severity added succesfully");
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

export const updateSeverity = createAsyncThunk(
  "severity/update",
  async ({ name, duration, toast, id }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        process.env.REACT_APP_API_URL + `api/updateseverity/${id}`,
        {
          name,
          duration,
        }
      );
      const result = response.data;
      toast.success("Severity Updated Successfully");
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteSeverity = createAsyncThunk(
  "severity/delete",
  async ({ id, toast }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        process.env.REACT_APP_API_URL + `api/deleteseverity/${id}`
      );
      const result = response.data;
      toast.success("Deleted Successfully");
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
