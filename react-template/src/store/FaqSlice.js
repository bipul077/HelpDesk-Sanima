import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../services/instance.js";

const initialState = {
  faq: [],
  faqloading: false,
  faqerror: "",
  faqpage: 0
};

const FaqSlice = createSlice({
  name: "faq",
  initialState,
  reducers: {
    clearFaqError: (state) => {
      state.faqerror = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addfaq.pending, (state) => {
        state.faqloading = true;
      })
      .addCase(addfaq.fulfilled, (state, action) => {
        state.faq.push(action.payload.data);
        state.faqloading = false;
      })
      .addCase(addfaq.rejected, (state, action) => {
        state.faqloading = false;
        state.faqerror = action.payload.message;
      })
      .addCase(getfaq.pending, (state) => {
        state.faqloading = true;
      })
      .addCase(getfaq.fulfilled, (state, action) => {
        state.faqpage = action.payload.totalPages;
        state.faq = action.payload.data;
        state.faqloading = false;
      })
      .addCase(getfaq.rejected, (state, action) => {
        state.faqloading = false;
        state.faqerror = action.payload.message;
      })
      .addCase(deletefaq.pending, (state) => {
        state.faqloading = true;
      })
      .addCase(deletefaq.fulfilled, (state, action) => {
        state.faqloading = false;
        const {
          arg: { id },
        } = action.meta;
        if (id) {
          state.faq = state.faq.filter((item) => item.id !== id);
        }
      })
      .addCase(deletefaq.rejected, (state, action) => {
        state.faqloading = false;
        state.faqerror = action.payload.message;
      })
      .addCase(updatefaq.pending, (state) => {
        state.faqloading = true;
      })
      .addCase(updatefaq.fulfilled, (state, action) => {
        state.faqloading = false;
        const {
          arg: { id },
        } = action.meta;
        if (id) {
          state.faq = state.faq.map((item) =>
            item.id === id ? action.payload.data : item
          );
        }
      })
      .addCase(updatefaq.rejected, (state, action) => {
        state.faqloading = false;
        state.faqerror = action.payload.message;
      });
  },
});

export const { clearFaqError } = FaqSlice.actions;
export default FaqSlice.reducer;

export const addfaq = createAsyncThunk(
  "faq/post",
  async ({ toast, question, answer }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + `api/addfaq`,
        { question, answer }
      );
      const result = response.data;
      toast.success("FAQ Added Successfully");
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getfaq = createAsyncThunk(
  "faq/get",
  async ({currentPage,search}, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + `api/faq?page=${currentPage}&limit=${process.env.REACT_APP_HD_PAGE}`,{
          search
        }
      );
      const result = response.data;
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deletefaq = createAsyncThunk(
  "faq/delete",
  async ({ id, toast }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        process.env.REACT_APP_API_URL + `api/deletefaq/${id}`
      );
      const result = response.data;
      toast.success("Deleted Successfully");
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updatefaq = createAsyncThunk(
"faq/update",
  async ({ id, toast,question,answer }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        process.env.REACT_APP_API_URL + `api/updatefaq/${id}`,
        {
          question,answer
        }
      );
      const result = response.data;
      toast.success("Updated Successfully");
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
