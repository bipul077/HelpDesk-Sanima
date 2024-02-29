import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../services/instance.js";

const initialState = {
    link: [],
    linkloading: false,
    linkerror: "",
    linkpage: 0
  };

  const LinkSlice = createSlice({
    name: "Link",
    initialState,
    reducers: {
      clearLinkError: (state) => {
        state.linkerror = "";
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(addLink.pending, (state) => {
          state.linkloading = true;
        })
        .addCase(addLink.fulfilled, (state, action) => {
          state.link.push(action.payload.data);
          state.linkloading = false;
        })
        .addCase(addLink.rejected, (state, action) => {
          state.linkloading = false;
          state.linkerror = action.payload.message;
        })
        .addCase(getLink.pending, (state) => {
          state.linkloading = true;
        })
        .addCase(getLink.fulfilled, (state, action) => {
          state.linkpage = action.payload.totalPages;
          state.link = action.payload.data;
          state.linkloading = false;
        })
        .addCase(getLink.rejected, (state, action) => {
          state.linkloading = false;
          state.linkerror = action.payload.message;
        })
        .addCase(deleteLink.pending, (state) => {
          state.linkloading = true;
        })
        .addCase(deleteLink.fulfilled, (state, action) => {
          state.linkloading = false;
          const {
            arg: { id },
          } = action.meta;
          if (id) {
            state.link = state.link.filter((item) => item.id !== id);
          }
        })
        .addCase(deleteLink.rejected, (state, action) => {
          state.linkloading = false;
          state.linkerror = action.payload.message;
        })
        .addCase(updateLink.pending, (state) => {
          state.linkloading = true;
        })
        .addCase(updateLink.fulfilled, (state, action) => {
          state.linkloading = false;
          const {
            arg: { id },
          } = action.meta;
          if (id) {
            state.link = state.link.map((item) =>
              item.id === id ? action.payload.data : item
            );
          }
        })
        .addCase(updateLink.rejected, (state, action) => {
          state.linkloading = false;
          state.linkerror = action.payload.message;
        });
    },
  });
  
  export const { clearLinkError } = LinkSlice.actions;
  export default LinkSlice.reducer;
  
  export const addLink = createAsyncThunk(
    "link/post",
    async ({ toast, appname, link }, { rejectWithValue }) => {
      try {
        const response = await axios.post(
          process.env.REACT_APP_API_URL + `api/addlink`,
          {appname,link}
        );
        const result = response.data;
        toast.success("FAQ Added Successfully");
        return result;
      } catch (err) {
        return rejectWithValue(err.response.data);
      }
    }
  );
  
  export const getLink = createAsyncThunk(
    "link/get",
    async ({currentPage,search,department}, { rejectWithValue }) => {
      try {
        const response = await axios.post(
          process.env.REACT_APP_API_URL + `api/getlink?page=${currentPage}&limit=${process.env.REACT_APP_HD_PAGE}`,{
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
  
  export const deleteLink = createAsyncThunk(
    "link/delete",
    async ({ id, toast }, { rejectWithValue }) => {
      try {
        const response = await axios.delete(
          process.env.REACT_APP_API_URL + `api/deletelink/${id}`
        );
        const result = response.data;
        toast.success("Deleted Successfully");
        return result;
      } catch (err) {
        return rejectWithValue(err.response.data);
      }
    }
  );
  
  export const updateLink = createAsyncThunk(
  "link/update",
    async ({ id, toast,appname,link }, { rejectWithValue }) => {
      try {
        const response = await axios.put(
          process.env.REACT_APP_API_URL + `api/updatelink/${id}`,
          {appname,link}
        );
        const result = response.data;
        toast.success("Updated Successfully");
        return result;
      } catch (err) {
        return rejectWithValue(err.response.data);
      }
    }
  );