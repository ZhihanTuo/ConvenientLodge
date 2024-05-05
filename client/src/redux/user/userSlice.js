import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true; 
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload; // Data received 
      state.loading = false;
      state.error = null;
    },
    SignInFailure: (state, action) => {
      state.error = action.payload; // Data received 
      state.loading = false;
    }
  }
});

export const { signInStart, signInSuccess, SignInFailure } = userSlice.actions;

export default userSlice.reducer;