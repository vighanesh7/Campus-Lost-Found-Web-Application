import { createAsyncThunk } from '@reduxjs/toolkit';
import { getErrorInfo } from '../utils/errors';
// createAsyncThunk wrapper: any API failure becomes a clean { message, errors } rejection payload.
export const apiThunk = (type, fn) =>
  createAsyncThunk(type, async (arg, { rejectWithValue }) => {
    try { return await fn(arg); } catch (e) { return rejectWithValue(getErrorInfo(e)); }
  });
