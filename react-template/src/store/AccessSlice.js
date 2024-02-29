import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../services/instance.js";

const initialState = {
    accesscontrols: [],
    employees : [],
    employeeoptions: [],
    accessloading: false,
    accesserror: "",
    acpage: 0,
    acdepartment: [],
    isaccess: false,
  };

  const AccessSlice = createSlice({
    name: "accesscontrol",
    initialState,
    reducers: {
      clearAccessError: (state) => {
        state.accesserror = "";
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(getaccesscontrols.pending, (state) => {
          state.accessloading = true;
        })
        .addCase(getaccesscontrols.fulfilled, (state, action) => {
          state.accesscontrols = action.payload;
          state.accessloading = false;
        })
        .addCase(getaccesscontrols.rejected, (state, action) => {
          state.accessloading = false;
          state.accesserror = action.payload.message;
        })
        .addCase(getEmployees.pending, (state) => {
          state.accessloading = true;
        })
        .addCase(getEmployees.fulfilled, (state, action) => {
          state.employees = action.payload;
          let emp = action.payload;
          const empoptions = emp.map((option) => ({
            label: option.Username,
            value: option.StaffId,
          }));
          state.employeeoptions = empoptions;
          state.accessloading = false;
        })
        .addCase(getEmployees.rejected, (state, action) => {
          state.accessloading = false;
          state.accesserror = "Something wrong";
        })
        .addCase(addaccesscontrols.pending, (state) => {
          state.accessloading = true;
        })
        .addCase(addaccesscontrols.fulfilled, (state, action) => {
          if(action.payload.message==="Created"){
            state.accesscontrols.push(action.payload.data);
          }
          else{
            const id = action.payload.data.id
            if (id) {
              state.accesscontrols = state.accesscontrols.map((item) =>
                item.id === id ? action.payload.data : item
              );
            }
          }
          state.accessloading = false;
        })
        .addCase(addaccesscontrols.rejected, (state, action) => {
          state.accessloading = false;
          state.accesserror = action.payload.message;
        })
        .addCase(deleteaccesscontrols.pending, (state) => {
          state.accessloading = true;
        })
        .addCase(deleteaccesscontrols.fulfilled, (state, action) => {
          state.accessloading = false;
          const {
            arg: { id },
          } = action.meta;
          if (id) {
            state.accesscontrols = state.accesscontrols.filter((item) => item.id !== id);
          }
        })
        .addCase(deleteaccesscontrols.rejected, (state, action) => {
          state.accessloading = false;
          state.accesserror = action.payload.message;
        })
        .addCase(updateaccesscontrols.pending, (state) => {
          state.accessloading = true;
        })
        .addCase(updateaccesscontrols.fulfilled, (state, action) => {
          state.accessloading = false;
          const {
            arg: { id },
          } = action.meta;
          if (id) {
            state.accesscontrols = state.accesscontrols.map((item) =>
              item.id === id ? action.payload.data : item
            );
          }
        })
        .addCase(updateaccesscontrols.rejected, (state, action) => {
          state.accessloading = false;
          state.accesserror = action.payload.message;
        })
        .addCase(getDepartment.pending, (state) => {
          state.accessloading = true;
        })
        .addCase(getDepartment.fulfilled, (state, action) => {
          state.accessloading = false;
          let department = action.payload;
          const deptoptions = department.map((option) => ({
            label: option.Name,
            value: option.DEPT_ID,
          }));
          state.acdepartment = deptoptions;
        })
        .addCase(getDepartment.rejected, (state, action) => {
          state.accessloading = false;
          state.accesserror = action.payload.message;
        })
        .addCase(specificaccess.pending, (state) => {
          state.accessloading = true;
        })
        .addCase(specificaccess.fulfilled, (state, action) => {
          state.isaccess = action.payload.success;
          state.accessloading = false;
        })
        .addCase(specificaccess.rejected, (state, action) => {
          state.accessloading = false;
          // state.accesserror = action.payload.message;
        })
    },
  });

  export const { clearAccessError } = AccessSlice.actions;
  export default AccessSlice.reducer;

  export const getaccesscontrols= createAsyncThunk(
    "accesscontrols/get",
    async (_, { rejectWithValue }) => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + `api/getaccess`
        );
        const result = response.data;
        return result;
      } catch (err) {
        return rejectWithValue(err.response.data);
      }
    }
  );

  export const getEmployees= createAsyncThunk(
    "employees/get",
    async (_, { rejectWithValue }) => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_COMMON_API_URL + `api/central/staffs`
        );
        const result = response.data;
        return result;
      } catch (err) {
        return rejectWithValue(err.response.data);
      }
    }
  );

  export const addaccesscontrols= createAsyncThunk(
    "addaccesscontrols/post",
    async ({toast,staffid,jobid,accesstodept}, { rejectWithValue }) => {      
      try {
        const STAFF_ID = staffid || null;
        const JOB_ID = jobid || null;
        const ACCESS_TO_DEPT =  accesstodept.join(',')
        const response = await axios.post(
          process.env.REACT_APP_API_URL + `api/addaccess`,
          {STAFF_ID,JOB_ID,ACCESS_TO_DEPT}
        );
        const result = response.data;
        if(result.message==="Created"){
          toast.success("Added Successfully");
        }
        else{
          toast.success("Added and Updated Successfully");
        }
        return result;
      } catch (err) {
        return rejectWithValue(err.response.data);
      }
    }
  );

  export const deleteaccesscontrols = createAsyncThunk(
    "accesscontrols/delete",
    async ({ id, toast }, { rejectWithValue }) => {
      try {
        const response = await axios.delete(
          process.env.REACT_APP_API_URL + `api/deleteaccess/${id}`
        );
        const result = response.data;
        toast.success("Deleted Succesfully");
        return result;
      } catch (err) {
        return rejectWithValue(err.response.data);
      }
    }
  );

  export const updateaccesscontrols= createAsyncThunk(
    "updateaccesscontrols/put",
    async ({toast,staffid,jobid,accesstodept,id}, { rejectWithValue }) => {      
      try {
        const STAFF_ID = staffid || null;
        const JOB_ID = jobid || null;
        const ACCESS_TO_DEPT =  accesstodept.join(',')
        // console.log(STAFF_ID,JOB_ID,ACCESS_TO_DEPT,id);
        const response = await axios.put(
          process.env.REACT_APP_API_URL + `api/updateaccess/${id}`,
          {STAFF_ID,JOB_ID,ACCESS_TO_DEPT}
        );
        const result = response.data;
        toast.success("Updated Successfully");
        return result;
      } catch (err) {
        return rejectWithValue(err.response.data);
      }
    }
  );

  //specificaccesscontrol
  export const specificaccess= createAsyncThunk(
    "specificaccess/get",
    async (_, { rejectWithValue }) => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + `api/specificaccess`
        );
        const result = response.data;
        return result;
      } catch (err) {
        return rejectWithValue(err.response.data);
      }
    }
  );

  export const getDepartment = createAsyncThunk(
    "departments/get",
    async (_, { rejectWithValue }) => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + `api/departments`
        );
        const result = response.data;
        return result;
      } catch (err) {
        return rejectWithValue(err.response.data);
      }
    }
  );


