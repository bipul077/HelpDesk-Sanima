import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../services/instance.js";

const initialState = {
  notice: {},
  eodloading: false,
  eoderror: "",
};

const EodSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearEodError: (state) => {
      state.eoderror = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addnotice.pending, (state) => {
        state.eodloading = true;
      })
      .addCase(addnotice.fulfilled, (state, action) => {
        state.notice = action.payload;
        state.eodloading = false;
      })
      .addCase(addnotice.rejected, (state, action) => {
        state.eodloading = false;
        state.eoderror = action.payload.message;
      })
      .addCase(getnotice.pending, (state) => {
        state.eodloading = true;
      })
      .addCase(getnotice.fulfilled, (state, action) => {
        state.notice = action.payload;
        state.eodloading = false;
      })
      .addCase(getnotice.rejected, (state, action) => {
        state.eodloading = false;
        state.eoderror = action.payload.message;
      })
      .addCase(deletenotice.pending, (state) => {
        state.eodloading = true;
      })
      .addCase(deletenotice.fulfilled, (state, action) => {
        state.eodloading = false;
        state.notice = {};
      })
      .addCase(deletenotice.rejected, (state, action) => {
        state.eodloading = false;
        state.eoderror = action.payload.message;
      });
  },
});

export const { clearEodError } = EodSlice.actions;
export default EodSlice.reducer;

export const addnotice = createAsyncThunk(
  "notice/post",
  async ({ toast, Content }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + `api/addeodnotice`,
        { Content }
      );
      const result = response.data;
      toast.success("EOD Notice Added Successfully");
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getnotice = createAsyncThunk(
  "notice/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + `api/eodnotice`
      );
      const result = response.data;
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deletenotice = createAsyncThunk(
    "notice/delete",
    async ({id,toast}, { rejectWithValue }) => {
      try {
        const response = await axios.delete(
          process.env.REACT_APP_API_URL + `api/deleteeodnotice/${id}` 
        );
        const result = response.data;
        toast.success("Deleted Successfully");
        return result;
      } catch (err) {
        return rejectWithValue(err.response.data);
      }
    }
  );
