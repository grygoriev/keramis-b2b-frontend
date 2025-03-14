// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
// import cartReducer from './cartSlice.js';
import cartUiReducer from './cartUiSlice';
import langReducer from './langSlice.js';
import { adminApi, cartApi } from '../services';

const store = configureStore({
	reducer: {
		auth: authReducer,
		// cart: cartReducer,
		cartUi: cartUiReducer,
		lang: langReducer,
		[adminApi.reducerPath]: adminApi.reducer,
		[cartApi.reducerPath]: cartApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.concat(adminApi.middleware)
			.concat(cartApi.middleware),
});

export default store;
