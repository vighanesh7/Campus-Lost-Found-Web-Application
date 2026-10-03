import { createSlice } from '@reduxjs/toolkit';
import api from '../services/api';
import { apiThunk } from './apiThunk';

export const fetchConversations = apiThunk('messages/fetchList', async () => (await api.get('/messages')).data.data.conversations);
export const fetchConversation = apiThunk('messages/fetchOne', async ({ id }) => (await api.get(`/messages/${id}`)).data.data);
export const sendMessage = apiThunk('messages/send', async (body) => (await api.post('/messages', body)).data.data);

const slice = createSlice({
  name: 'messages',
  initialState: {
    conversations: [], status: 'idle', error: null,
    active: { conversation: null, messages: [], status: 'idle', error: null },
  },
  reducers: {},
  extraReducers: (b) => b
    .addCase(fetchConversations.pending, (s) => { if (s.status === 'idle') s.status = 'loading'; })
    .addCase(fetchConversations.fulfilled, (s, { payload }) => { s.conversations = payload; s.status = 'succeeded'; })
    .addCase(fetchConversations.rejected, (s, { payload }) => { s.status = 'failed'; s.error = payload?.message; })
    .addCase(fetchConversation.pending, (s, { meta }) => { if (!meta.arg.silent) s.active = { conversation: null, messages: [], status: 'loading', error: null }; })
    .addCase(fetchConversation.fulfilled, (s, { payload }) => { s.active = { ...payload, status: 'succeeded', error: null }; })
    .addCase(fetchConversation.rejected, (s, { payload }) => { s.active.status = 'failed'; s.active.error = payload?.message; })
    .addCase(sendMessage.fulfilled, (s, { payload }) => {
      if (s.active.conversation?.id === payload.conversationId && !s.active.messages.some((m) => m.id === payload.message.id)) s.active.messages.push(payload.message);
    }),
});
export default slice.reducer;
