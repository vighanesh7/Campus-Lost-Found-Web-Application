import { configureStore } from '@reduxjs/toolkit';
import auth from './authSlice';
import items from './itemSlice';
import favorites from './favoriteSlice';
import notifications from './notificationSlice';
import messages from './messageSlice';
export default configureStore({ reducer: { auth, items, favorites, notifications, messages } });
