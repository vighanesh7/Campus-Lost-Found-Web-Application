import { createSlice } from '@reduxjs/toolkit';
import api from '../services/api';
import { apiThunk } from './apiThunk';

export const fetchItems = apiThunk('items/fetch', async (params) => (await api.get('/items', { params })).data.data);
export const fetchMyItems = apiThunk('items/fetchMine', async (params) => (await api.get('/items/mine', { params })).data.data);
export const fetchRecent = apiThunk('items/fetchRecent', async () => {
  const [lost, found] = await Promise.all([
    api.get('/items', { params: { type: 'LOST', limit: 4 } }), api.get('/items', { params: { type: 'FOUND', limit: 4 } })]);
  return { lost: lost.data.data.items, found: found.data.data.items };
});
export const fetchStats = apiThunk('items/fetchStats', async () => (await api.get('/items/stats')).data.data);
export const fetchItem = apiThunk('items/fetchOne', async (id) => (await api.get(`/items/${id}`)).data.data.item);
export const createItem = apiThunk('items/create', async (formData) => (await api.post('/items', formData)).data.data.item);
export const changeItemStatus = apiThunk('items/status', async ({ id, status }) => (await api.patch(`/items/${id}/status`, { status })).data.data.item);
export const removeItem = apiThunk('items/remove', async (id) => { await api.delete(`/items/${id}`); return id; });

const paged = () => ({ items: [], currentPage: 1, totalPages: 1, totalItems: 0, status: 'idle', error: null });
const slice = createSlice({
  name: 'items',
  initialState: {
    list: paged(), mine: paged(),
    recent: { lost: [], found: [], status: 'idle', error: null },
    stats: { data: null, status: 'idle' },
    current: { item: null, status: 'idle', error: null },
  },
  reducers: {},
  extraReducers: (b) => {
    const pagedCases = (thunk, key) => b
      .addCase(thunk.pending, (s) => { s[key].status = 'loading'; s[key].error = null; })
      .addCase(thunk.fulfilled, (s, { payload }) => { Object.assign(s[key], payload, { status: 'succeeded' }); })
      .addCase(thunk.rejected, (s, { payload }) => { s[key].status = 'failed'; s[key].error = payload?.message; });
    pagedCases(fetchItems, 'list');
    pagedCases(fetchMyItems, 'mine');
    b.addCase(fetchRecent.pending, (s) => { s.recent.status = 'loading'; })
      .addCase(fetchRecent.fulfilled, (s, { payload }) => { Object.assign(s.recent, payload, { status: 'succeeded' }); })
      .addCase(fetchRecent.rejected, (s, { payload }) => { s.recent.status = 'failed'; s.recent.error = payload?.message; })
      .addCase(fetchStats.pending, (s) => { s.stats.status = 'loading'; })
      .addCase(fetchStats.fulfilled, (s, { payload }) => { s.stats = { data: payload, status: 'succeeded' }; })
      .addCase(fetchStats.rejected, (s) => { s.stats.status = 'failed'; })
      .addCase(fetchItem.pending, (s) => { s.current = { item: null, status: 'loading', error: null }; })
      .addCase(fetchItem.fulfilled, (s, { payload }) => { s.current = { item: payload, status: 'succeeded', error: null }; })
      .addCase(fetchItem.rejected, (s, { payload }) => { s.current = { item: null, status: 'failed', error: payload?.message }; })
      .addCase(changeItemStatus.fulfilled, (s, { payload }) => { if (s.current.item?.id === payload.id) s.current.item = payload; });
  },
});
export default slice.reducer;
