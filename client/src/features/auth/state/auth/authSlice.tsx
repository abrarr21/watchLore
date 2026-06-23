import { createSlice } from '@reduxjs/toolkit';
import { currentLoggedInUser, loginUser } from './authAction';

interface User {
  id: string;
  email: string;
  // add other fields returned by your API
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
    },
    removeUser: (state) => {
      state.user = null;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
      })

      // For currentLoggedIn users
      .addCase(currentLoggedInUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(currentLoggedInUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(currentLoggedInUser.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { addUser, removeUser } = authSlice.actions;

export default authSlice.reducer;
