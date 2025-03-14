// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import cartReducer from './cartSlice.js';
import langReducer from './langSlice.js';
import { adminApi } from '../services';

const store = configureStore({
	reducer: {
		auth: authReducer,
		cart: cartReducer,
		lang: langReducer,
		[adminApi.reducerPath]: adminApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(adminApi.middleware),
});

export default store;
