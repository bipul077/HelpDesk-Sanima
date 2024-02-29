import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../services/instance.js";

const initialState = {
  myuser: [],
  users: [],
  roles: [], //we are making this object because api always doesnt return data sometime it returns usererror too that's why
  userloading: false,
  usererror: "",
  userpage: 0,
};

const UserSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.usererror = "";
    },
  },
  extraReducers: (builder) => {
    //for handling asynchronous task...for handling promises
    //members
    builder
      .addCase(getusers.pending, (state) => {
        state.userloading = true;
      })
      .addCase(getusers.fulfilled, (state, action) => {
        state.userpage = action.payload.totalPages;
        state.users = action.payload.data;
        state.userloading = false;
      })
      .addCase(getusers.rejected, (state, action) => {
        state.userloading = false;
        state.usererror = action.payload.message;
      })
      .addCase(getspecificmember.pending, (state) => {
        state.userloading = true;
      })
      .addCase(getspecificmember.fulfilled, (state, action) => {
        state.myuser = action.payload;//return from api
        state.userloading = false;
      })
      .addCase(getspecificmember.rejected, (state, action) => {
        state.userloading = false;
        // console.log(action);
        state.usererror = action.payload.message;
      })
      .addCase(addusers.pending, (state) => {
        state.userloading = true;
      })
      .addCase(addusers.fulfilled, (state, action) => {
        state.users.push(action.payload);
        state.userloading = false;
      })
      .addCase(addusers.rejected, (state, action) => {
        state.userloading = false;
        state.usererror = action.payload.message;
      })
      .addCase(deleteuser.pending, (state) => {
        state.userloading = true;
      })
      .addCase(deleteuser.fulfilled, (state, action) => {
        state.userloading = false;
        const {
          arg: { id },
        } = action.meta;
        if (id) {
          state.users = state.users.filter((item) => item.id !== id);
        }
      })
      .addCase(deleteuser.rejected, (state, action) => {
        state.userloading = false;
        state.usererror = action.payload.message;
      })
      .addCase(updateuser.pending, (state) => {
        state.userloading = true;
      })
      .addCase(updateuser.fulfilled, (state, action) => {
        state.userloading = false;
        const {
          arg: { id },
        } = action.meta;
        if (id) {
          state.users = state.users.map((item) =>
            item.id === id ? action.payload : item
          );
        }
      })
      .addCase(updateuser.rejected, (state, action) => {
        state.userloading = false;
        state.usererror = action.payload.message;
      })
      //roles
      .addCase(addroles.pending, (state) => {
        state.userloading = true;
      })
      .addCase(addroles.fulfilled, (state, action) => {
        state.roles.push(action.payload);
        state.userloading = false;
      })
      .addCase(addroles.rejected, (state, action) => {
        state.userloading = false;
        state.usererror = action.payload.message;
      })
      .addCase(getroles.pending, (state) => {
        state.userloading = true;
      })
      .addCase(getroles.fulfilled, (state, action) => {
        state.userloading = false;
        state.roles = action.payload;
      })
      .addCase(getroles.rejected, (state, action) => {
        state.userloading = false;
        state.usererror = action.payload.message;
      })
      .addCase(updateroles.pending, (state) => {
        state.userloading = true;
      })
      .addCase(updateroles.fulfilled, (state, action) => {
        state.userloading = false;
        const {
          arg: { id },
        } = action.meta;
        if (id) {
          state.roles = state.roles.map((item) =>
            item.id === id ? action.payload : item
          );
        }
      })
      .addCase(updateroles.rejected, (state, action) => {
        state.userloading = false;
        state.usererror = action.payload.message;
      })
      .addCase(deleteroles.pending, (state) => {
        state.userloading = true;
      })
      .addCase(deleteroles.fulfilled, (state, action) => {
        state.userloading = false;
        const {
          arg: { id },
        } = action.meta;
        if (id) {
          state.roles = state.roles.filter((item) => item.id !== id);
        }
      })
      .addCase(deleteroles.rejected, (state, action) => {
        state.userloading = false;
        state.usererror = action.payload.message;
      });
  },
});

export const { clearUserError } = UserSlice.actions;
export default UserSlice.reducer;

export const addusers = createAsyncThunk(
  "users/post",
  async ({ toast, role,StaffId,category }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + `api/addmember`,
        { role,StaffId,category }
      );
      const result = response.data;
      toast.success("User Role Added Successfully");
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getusers = createAsyncThunk(
  "users/get",
  async ({currentPage}, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + `api/getmember?page=${currentPage}&limit=${process.env.REACT_APP_HD_PAGE}`
      );
      const result = response.data;
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getspecificmember = createAsyncThunk(
  "specificmember/post",
  async ({StaffId}, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + `api/specificmember`,
        {StaffId}
      );
      const result = response.data;
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateuser = createAsyncThunk(
  "users/update",
  async ({id,toast,role,StaffId,category}, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        process.env.REACT_APP_API_URL + `api/updatemember/${id}`,
        {role,StaffId,id,category}
      );
      const result = response.data;
      toast.success("User Updated Successfully");
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteuser = createAsyncThunk(
  "users/delete",
  async ({toast,id}, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        process.env.REACT_APP_API_URL + `api/deletemember/${id}`
      );
      const result = response.data;
      toast.success("User Deleted Successfully");
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const addroles = createAsyncThunk(
  "roles/post",
  async ({ toast, rolename }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + `api/addrole`,
        { rolename }
      );
      const result = response.data;
      toast.success("User Role Added Successfully");
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getroles = createAsyncThunk(
  "roles/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + `api/getrole`
      );
      const result = response.data;
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateroles = createAsyncThunk(
  "roles/update",
  async ({id,toast,rolename}, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        process.env.REACT_APP_API_URL + `api/updaterole/${id}`,
        {rolename}
      );
      const result = response.data;
      toast.success("Role Updated Successfully");
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteroles = createAsyncThunk(
  "roles/delete",
  async ({id,toast}, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        process.env.REACT_APP_API_URL + `api/deleterole/${id}`,
      );
      const result = response.data;
      toast.success("Role Deleted Successfully");
      return result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
