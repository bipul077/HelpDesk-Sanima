import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../services/instance.js";

const initialState = {
  predefines: [],
  predefineticket: [],
  predefinedloading: false,
  predefinederror: "",
  responsepage: 0
};

const PredefinedSlice = createSlice({
  name: "predefined",
  initialState,
  reducers: {
    clearPredefinedError: (state) => {
      state.predefinederror = "";
    },
  },
  extraReducers: (builder) => {
    //for handling asynchronous task...for handling promises
    builder
      .addCase(addpredefined.pending, (state) => {
        state.predefinedloading = true;
      })
      .addCase(addpredefined.fulfilled, (state, action) => {
        state.predefines.push(action.payload);
        state.predefinedloading = false;
      })
      .addCase(addpredefined.rejected, (state, action) => {
        state.predefinedloading = false;
        console.log(action);
        // state.predefinederror = action.payload.message;
      })
      .addCase(getpredefined.pending, (state) => {
        state.predefinedloading = true;
      })
      .addCase(getpredefined.fulfilled, (state, action) => {
        state.predefinedloading = false;
        state.responsepage = action.payload.totalPages;
        state.predefines = action.payload.data;
      })
      .addCase(getpredefined.rejected, (state, action) => {
        state.predefinedloading = false;
        state.predefinederror = action.payload.message;
      })
      .addCase(deletepredefined.pending, (state) => {
        state.predefinedloading = true;
      })
      .addCase(deletepredefined.fulfilled, (state, action) => {
        state.predefinedloading = false;
        const {
          arg: { id },
        } = action.meta;
        if (id) {
          state.predefines = state.predefines.filter((item) => item.id !== id);
        }
      })
      .addCase(deletepredefined.rejected, (state, action) => {
        state.predefinedloading = false;
        state.predefinederror = action.payload.message;
      })
      .addCase(updatepredefined.pending, (state) => {
        state.predefinedloading = true;
      })
      .addCase(updatepredefined.fulfilled, (state, action) => {
        state.predefinedloading = false;
        const {
          arg: { id },
        } = action.meta;
        if (id) {
          state.predefines = state.predefines.map((item) =>
            item.id === id ? action.payload : item
          );
        }
      })
      .addCase(updatepredefined.rejected, (state, action) => {
        state.predefinedloading = false;
        state.predefinederror = action.payload.message;
      })
      .addCase(predefinedticket.pending, (state) => {
        state.predefinedloading = true;
      })
      .addCase(predefinedticket.fulfilled, (state, action) => {
        state.predefinedloading = false;
        let pretickets = action.payload;
        const responseoptions = pretickets.map((option) => ({
          label: option.Prereply,
          value: option.Prereply,
        }));
        state.predefineticket = responseoptions;
      })
      .addCase(predefinedticket.rejected, (state, action) => {
        state.predefinedloading = false;
        state.predefinederror = action.payload.message;
      });
  },
});

export const { clearPredefinedError } = PredefinedSlice.actions;
export default PredefinedSlice.reducer;

export const addpredefined = createAsyncThunk(
  "predefined/add",
  async ({ department, prereply, toast }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + `api/addpredefined`,
        {department,
        prereply}
      );      
      console.log(response)
      const result = response.data;
      console.log(result);
      toast.success("Added Successfully");
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getpredefined = createAsyncThunk(
    "predefined/get",
    async ({currentPage}, { rejectWithValue }) => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + `api/getpredefined?page=${currentPage}&limit=${process.env.REACT_APP_HD_PAGE}` 
        );
        const result = response.data;
        return result;
      } catch (err) {
        return rejectWithValue(err.response.data);
      }
    }
  );

  export const deletepredefined = createAsyncThunk(
    "predefined/delete",
    async ({id,toast}, { rejectWithValue }) => {
      try {
        const response = await axios.delete(
          process.env.REACT_APP_API_URL + `api/deletepredefined/${id}` 
        );
        const result = response.data;
        toast.success("Deleted Successfully");
        return result;
      } catch (err) {
        return rejectWithValue(err.response.data);
      }
    }
  );

  export const updatepredefined = createAsyncThunk(
    "predefined/update",
    async ({id,toast,department,prereply}, { rejectWithValue }) => {
      try {
        const response = await axios.put(
          process.env.REACT_APP_API_URL + `api/updateresponse/${id}`,
          {
            department, 
            prereply
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

  export const predefinedticket = createAsyncThunk(
    "predefinedticket/get",
    async(_,{rejectWithValue})=>{
      try {
        const response = await axios.get(process.env.REACT_APP_API_URL + 'api/responseticket')
        const result = response.data;
        return result;
      } catch (err) {
        return rejectWithValue(err.response.data);
      }
    }
  )
