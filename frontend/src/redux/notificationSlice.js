import { createSlice } from '@reduxjs/toolkit';
import api from '../services/api';
import { apiThunk } from './apiThunk';

export const fetchNotifications = apiThunk('notifications/fetch', async () => (await api.get('/notifications')).data.data);
export const markNotificationRead = apiThunk('notifications/read', async (id) => { await api.put(`/notifications/${id}/read`); return id; });
export const markAllNotificationsRead = apiThunk('notifications/readAll', async () => { await api.put('/notifications/read-all'); });

const mark = (list, id) => list.map((n) => (n.id === id ? { ...n, isRead: true } : n));
const slice = createSlice({
  name: 'notifications',
  initialState: { today: [], earlier: [], unreadCount: 0, status: 'idle', error: null },
  reducers: {},
  extraReducers: (b) => b
    .addCase(fetchNotifications.pending, (s) => { if (s.status === 'idle') s.status = 'loading'; })
    .addCase(fetchNotifications.fulfilled, (s, { payload }) => Object.assign(s, payload, { status: 'succeeded', error: null }))
    .addCase(fetchNotifications.rejected, (s, { payload }) => { s.status = 'failed'; s.error = payload?.message; })
    .addCase(markNotificationRead.fulfilled, (s, { payload }) => {
      s.today = mark(s.today, payload); s.earlier = mark(s.earlier, payload);
      s.unreadCount = [...s.today, ...s.earlier].filter((n) => !n.isRead).length;
    })
    .addCase(markAllNotificationsRead.fulfilled, (s) => {
      s.today = s.today.map((n) => ({ ...n, isRead: true })); s.earlier = s.earlier.map((n) => ({ ...n, isRead: true })); s.unreadCount = 0;
    }),
});
export default slice.reducer;
