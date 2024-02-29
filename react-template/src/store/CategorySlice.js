import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../services/instance.js";

const initialState = {
  data: [], //we are making this object because api always doesnt return data sometime it returns caterror too that's why
  catloading: false,
  caterror: "",
  category: [],
  staff: [],
  subcategory: [],
  categorypage: 0,
  subcategorypage: 0
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    clearCatError: (state) => {
      state.caterror = "";
    },
  },
  extraReducers: (builder) => {
    //for handling asynchronous task...for handling promises
    builder
      .addCase(addCategory.pending, (state) => {
        state.catloading = true;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.data.push(action.payload);
        state.catloading = false;
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.catloading = false;
        state.caterror = action.payload.message;
      })
      .addCase(getCategory.pending, (state) => {
        state.catloading = true;
      })
      .addCase(getCategory.fulfilled, (state, action) => {
        state.catloading = false;
        state.categorypage = action.payload.totalPages;
        state.data = action.payload.data;
      })
      .addCase(getCategory.rejected, (state, action) => {
        state.catloading = false;
        state.caterror = action.payload.message;
      })
      .addCase(updateCategory.pending, (state) => {
        state.catloading = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.catloading = false;
        const {
          arg: { id },
        } = action.meta;
        if (id) {
          state.data = state.data.map((item) =>
            item.id === id ? action.payload : item
          );
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.catloading = false;
        state.caterror = action.payload.message;
      })
      .addCase(deleteCategory.pending, (state) => {
        state.catloading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.catloading = false;
        const {
          arg: { id },
        } = action.meta;
        if (id) {
          state.data = state.data.filter((item) => item.id !== id);
        }
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.catloading = false;
        state.caterror = action.payload.message;
      })
      .addCase(SpecificCategory.pending, (state) => {
        state.catloading = true;
      })
      .addCase(SpecificCategory.fulfilled, (state, action) => {
        state.catloading = false;
        state.category = action.payload;
      })
      .addCase(SpecificCategory.rejected, (state, action) => {
        state.catloading = false;
        state.caterror = action.payload.message;
      })
      .addCase(getStaff.pending, (state) => {
        state.catloading = false;
      })
      .addCase(getStaff.fulfilled, (state, action) => {
        state.catloading = false;
        state.staff = action.payload;
      })
      .addCase(getStaff.rejected, (state, action) => {
        state.catloading = false;
        state.caterror = action.payload.message;
      })
      .addCase(addSubCategory.pending, (state) => {
        state.catloading = true;
      })
      .addCase(addSubCategory.fulfilled, (state, action) => {
        state.subcategory.push(action.payload);
        state.catloading = false;
      })
      .addCase(addSubCategory.rejected, (state, action) => {
        state.catloading = false;
        state.caterror = action.payload.message;
      })
      .addCase(getSubCategory.pending, (state) => {
        state.catloading = true;
      })
      .addCase(getSubCategory.fulfilled, (state, action) => {
        state.catloading = false;
        state.subcategorypage = action.payload.totalPages;
        state.subcategory = action.payload.data;
      })
      .addCase(getSubCategory.rejected, (state, action) => {
        state.catloading = false;
        state.caterror = action.payload.message;
      })
      .addCase(SubCategory.pending, (state) => {
        state.catloading = true;
      })
      .addCase(SubCategory.fulfilled, (state, action) => {
        state.catloading = false;
        state.subcategory = action.payload;
      })
      .addCase(SubCategory.rejected, (state, action) => {
        state.catloading = false;
        state.caterror = action.payload.message;
      })
      .addCase(deleteSubCategory.pending, (state) => {
        state.catloading = true;
      })
      .addCase(deleteSubCategory.fulfilled, (state, action) => {
        state.catloading = false;
        const {
          arg: { id },
        } = action.meta;
        if (id) {
          state.subcategory = state.subcategory.filter((item) => item.id !== id);
        }
      })
      .addCase(deleteSubCategory.rejected, (state, action) => {
        state.catloading = false;
        state.caterror = action.payload.message;
      })
      .addCase(updateSubCategory.pending, (state) => {
        state.catloading = true;
      })
      .addCase(updateSubCategory.fulfilled, (state, action) => {
        state.catloading = false;
        const {
          arg: { id },
        } = action.meta;
        if (id) {
          state.subcategory = state.subcategory.map((item) =>
            item.id === id ? action.payload : item
          );
        }
      })
      .addCase(updateSubCategory.rejected, (state, action) => {
        state.catloading = false;
        state.caterror = action.payload.message;
      })
  },
});

export const { clearCatError } = categorySlice.actions;
export default categorySlice.reducer;

//add category
export const addCategory = createAsyncThunk(
  "categories/add",
  async ({ Name, Department, toast,Description }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + `api/addcategory`,
        { Name, Department, Description }
      );
      const result = response.data;
      toast.success("Category Added Successfully");
      // console.log(result);
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

//add subcategory
export const addSubCategory = createAsyncThunk(
  "subcategories/add",
  async ({ Name, Department, toast,Description,Subcategory,severity }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + `api/addsubcategory`,
        { Name, Department, Description,Subcategory,severity }
      );
      const result = response.data;
      toast.success("SubCategory Added Successfully");
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getSubCategory = createAsyncThunk(
  "categories/getsubcategory",
  async ({currentPage}, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + `api/getsubcategory?page=${currentPage}&limit=${process.env.REACT_APP_HD_PAGE}`
      );
      const result = response.data;
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getCategory = createAsyncThunk(
  "categories/get",
  async ({currentPage}, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + `api/getcategory?page=${currentPage}&limit=${process.env.REACT_APP_HD_PAGE}`
      );
      const result = response.data;
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data); // Return a rejected action with the caterror payload
    }
  }
);
//update Main Category 
export const updateCategory = createAsyncThunk(
  "categories/update",
  async ({ id, Name, Department,Description,toast }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        process.env.REACT_APP_API_URL + `api/updatecategory/${id}`,
        {
          Name,
          Department,
          Description
        }
      );
      const result = response.data;
      toast.success("Category Updated Successfully");
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
//update Sub Category
export const updateSubCategory = createAsyncThunk(
  "subcategories/update",
  async ({ id, Name, Department,Description, Category_Parent,toast,severity }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        process.env.REACT_APP_API_URL + `api/updatesubcategory/${id}`,
        {
          Name,
          Department,
          Description,
          Category_Parent,
          severity
        }
      );
      const result = response.data;
      toast.success("Category Updated Successfully");
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async ({ id, toast }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        process.env.REACT_APP_API_URL + `api/deletecategory/${id}`
      );
      const result = response.data;
      toast.success("Deleted Succesfully");
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteSubCategory = createAsyncThunk(
  "subcategories/delete",
  async ({ id, toast }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        process.env.REACT_APP_API_URL + `api/deletesubcategory/${id}`
      );
      const result = response.data;
      toast.success("Deleted Succesfully");
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const SpecificCategory = createAsyncThunk(
  "categories/specific",
  async ({ Department }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + `api/getspecificcategory`,
        {Department}
      );
      const result = response.data;
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const SubCategory = createAsyncThunk(
  "categories/subcategory",
  async ({ Category }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + `api/subcategory/${Category}`,
      );
      const result = response.data;
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getStaff = createAsyncThunk(
  "staff/getStaff",
  async ({inputValue}, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + `api/getallstaffs?name=${inputValue}`
      );
      const result = response.data;
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data); // Return a rejected action with the caterror payload
    }
  }
);


