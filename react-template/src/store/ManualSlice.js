import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../services/instance.js";

const initialState = {
  manual: [],
  manualloading: false,
  manualerror: "",
  manualpage: 0
};

const ManualSlice = createSlice({
  name: "Manual",
  initialState,
  reducers: {
    clearManualError: (state) => {
      state.manualerror = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addManual.pending, (state) => {
        state.manualloading = true;
      })
      .addCase(addManual.fulfilled, (state, action) => {
        state.manual.push(action.payload.data);
        state.manualloading = false;
      })
      .addCase(addManual.rejected, (state, action) => {
        state.manualloading = false;
        state.manualerror = action.payload.message;
      })
      .addCase(getManual.pending, (state) => {
        state.manualloading = true;
      })
      .addCase(getManual.fulfilled, (state, action) => {
        state.manualpage = action.payload.totalPages;
        state.manual = action.payload.data;
        state.manualloading = false;
      })
      .addCase(getManual.rejected, (state, action) => {
        state.manualloading = false;
        state.manualerror = action.payload.message;
      })
      .addCase(deleteManual.pending, (state) => {
        state.manualloading = true;
      })
      .addCase(deleteManual.fulfilled, (state, action) => {
        state.manualloading = false;
        const {
          arg: { id },
        } = action.meta;
        if (id) {
          state.manual = state.manual.filter((item) => item.id !== id);
        }
      })
      .addCase(deleteManual.rejected, (state, action) => {
        state.manualloading = false;
        state.manualerror = action.payload.message;
      })
      .addCase(updateManual.pending, (state) => {
        state.manualloading = true;
      })
      .addCase(updateManual.fulfilled, (state, action) => {
        state.manualloading = false;
        const {
          arg: { id },
        } = action.meta;
        if (id) {
          state.manual = state.manual.map((item) =>
            item.id === id ? action.payload.data : item
          );
        }
      })
      .addCase(updateManual.rejected, (state, action) => {
        state.manualloading = false;
        state.manualerror = action.payload.message;
      });
  },
});

export const { clearManualError } = ManualSlice.actions;
export default ManualSlice.reducer;

export const addManual = createAsyncThunk(
  "manual/post",
  async ({ toast, manualfilename, manualfile }, { rejectWithValue }) => {
    try {
        const formData = new FormData();
        formData.append("manualfilename",manualfilename);
        formData.append("Manual_File",manualfile);

      const response = await axios.post(
        process.env.REACT_APP_API_URL + `api/addmanual`,
        formData
      );
      const result = response.data;
      toast.success("FAQ Added Successfully");
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getManual = createAsyncThunk(
  "manual/get",
  async ({currentPage,search,department}, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + `api/getmanual?page=${currentPage}&limit=${process.env.REACT_APP_HD_PAGE}`,{
          currentPage,search,department
        }
      );
      const result = response.data;
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteManual = createAsyncThunk(
  "manual/delete",
  async ({ id, toast }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        process.env.REACT_APP_API_URL + `api/deletemanual/${id}`
      );
      const result = response.data;
      toast.success("Deleted Successfully");
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateManual = createAsyncThunk(
"manual/update",
  async ({ id, toast,manualfilename,manualfile }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("manualfilename",manualfilename);
      formData.append("Manual_File",manualfile);
      const response = await axios.put(
        process.env.REACT_APP_API_URL + `api/updatemanual/${id}`,
        formData
      );
      const result = response.data;
      toast.success("Updated Successfully");
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
