import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../../../config/axiosInstance';
import type { LoginFormData, RegisterPayload } from '../../hooks/useAuth';

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credential: LoginFormData, thunkApi) => {
    try {
      const res = await axiosInstance.post('/auth/users/login', credential);
      return res.data.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const currentLoggedInUser = createAsyncThunk('auth/get-me', async (_, thunkApi) => {
  try {
    const res = await axiosInstance.get('/auth/users/get-me');
    // console.log(res.data.data);
    return res.data.data;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const registerUser = createAsyncThunk(
  'auth/register',
  async (credential: RegisterPayload, thunkApi) => {
    try {
      const res = await axiosInstance.post('/auth/users/register', credential);
      // console.log(res);
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);
