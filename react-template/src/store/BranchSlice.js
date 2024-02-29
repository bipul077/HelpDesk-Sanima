import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../services/instance.js";

const initialState = {
  branches: [], //we are making this object because api always doesnt return data sometime it returns brancherror too that's why
  branchloading: false,
  brancherror: "",
};

const BranchSlice = createSlice({
  name: "branch",
  initialState,
  extraReducers: (builder) => {
    //for handling asynchronous task...for handling promises
    builder
      .addCase(getBranches.pending, (state) => {
        state.branchloading = true;
      })
      .addCase(getBranches.fulfilled, (state, action) => {
        state.branches= action.payload;
        state.branchloading = false;
      })
      .addCase(getBranches.rejected, (state, action) => {
        state.branchloading = false;
        state.brancherror = action.payload.message;
      })   
      .addCase(syncBranches.pending, (state) => {
        state.branchloading = true;
      })
      .addCase(syncBranches.fulfilled, (state, action) => {
        // state.branches= action.payload;
        state.branchloading = false;
      })
      .addCase(syncBranches.rejected, (state, action) => {
        state.branchloading = false;
        state.brancherror = action.payload.message;
      })  
  },
});

export default BranchSlice.reducer;


export const getBranches = createAsyncThunk(
  "branches/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + `api/getbranches`
      );
      const result = response.data;
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const syncBranches = createAsyncThunk(
    "branches/post",
    async ({toast}, { rejectWithValue }) => {
      try {
        const response = await axios.post(
          process.env.REACT_APP_API_URL + `api/branches`
        );
        const result = response.data;
        toast.success("Branch Sync Succesfully");
        return result;
      } catch (err) {
        return rejectWithValue(err.response.data);
      }
    }
  );

