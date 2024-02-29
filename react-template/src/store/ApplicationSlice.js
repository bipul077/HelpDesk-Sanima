import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  sidebarShow: 'responsive'
  // other state properties
};

const loaderSlice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    set: (state, action) => {
      return { ...state, ...action.payload };
    },
    showLoader: (state) => {
      state.loading = true;
    },
    hideLoader: (state) => {
      state.loading = false;
    },
  },
});

export const { set,showLoader, hideLoader } = loaderSlice.actions;

export default loaderSlice.reducer;