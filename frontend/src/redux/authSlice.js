import { createSlice } from '@reduxjs/toolkit';
import api, { TOKEN_KEY } from '../services/api';
import { apiThunk } from './apiThunk';

export const loginUser = apiThunk('auth/login', async (creds) => (await api.post('/auth/login', creds)).data.data);
export const registerUser = apiThunk('auth/register', async (body) => (await api.post('/auth/register', body)).data.data);
export const fetchCurrentUser = apiThunk('auth/me', async () => (await api.get('/auth/me')).data.data.user);
export const updateProfile = apiThunk('auth/updateProfile', async (formData) => (await api.put('/users/profile', formData)).data.data.user);

const token = localStorage.getItem(TOKEN_KEY);
const slice = createSlice({
  name: 'auth',
  initialState: { user: null, token, status: token ? 'loading' : 'ready', submitting: false, error: null },
  reducers: {
    logout(state) { localStorage.removeItem(TOKEN_KEY); state.user = null; state.token = null; state.status = 'ready'; },
    clearAuthError(state) { state.error = null; },
  },
  extraReducers: (b) => {
    const start = (s) => { s.submitting = true; s.error = null; };
    const done = (s, { payload }) => { s.submitting = false; s.user = payload.user; s.token = payload.token; s.status = 'ready'; localStorage.setItem(TOKEN_KEY, payload.token); };
    const fail = (s, { payload }) => { s.submitting = false; s.error = payload; };
    b.addCase(loginUser.pending, start).addCase(loginUser.fulfilled, done).addCase(loginUser.rejected, fail)
      .addCase(registerUser.pending, start).addCase(registerUser.fulfilled, done).addCase(registerUser.rejected, fail)
      .addCase(fetchCurrentUser.fulfilled, (s, { payload }) => { s.user = payload; s.status = 'ready'; })
      .addCase(fetchCurrentUser.rejected, (s) => { s.user = null; s.token = null; s.status = 'ready'; localStorage.removeItem(TOKEN_KEY); })
      .addCase(updateProfile.fulfilled, (s, { payload }) => { s.user = payload; });
  },
});
export const { logout, clearAuthError } = slice.actions;
export default slice.reducer;
