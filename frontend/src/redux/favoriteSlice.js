import { createSlice } from '@reduxjs/toolkit';
import api from '../services/api';
import { apiThunk } from './apiThunk';

export const fetchFavorites = apiThunk('favorites/fetch', async () => (await api.get('/favorites')).data.data.favorites);
export const addFavorite = apiThunk('favorites/add', async (itemId) => { await api.post(`/favorites/${itemId}`); return itemId; });
export const removeFavorite = apiThunk('favorites/remove', async (itemId) => { await api.delete(`/favorites/${itemId}`); return itemId; });

const slice = createSlice({
  name: 'favorites',
  initialState: { items: [], ids: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (b) => b
    .addCase(fetchFavorites.pending, (s) => { s.status = 'loading'; })
    .addCase(fetchFavorites.fulfilled, (s, { payload }) => { s.items = payload; s.ids = payload.map((f) => f.itemId); s.status = 'succeeded'; })
    .addCase(fetchFavorites.rejected, (s, { payload }) => { s.status = 'failed'; s.error = payload?.message; })
    .addCase(addFavorite.fulfilled, (s, { payload }) => { if (!s.ids.includes(payload)) s.ids.push(payload); })
    .addCase(removeFavorite.fulfilled, (s, { payload }) => { s.ids = s.ids.filter((i) => i !== payload); s.items = s.items.filter((f) => f.itemId !== payload); }),
});
export default slice.reducer;
