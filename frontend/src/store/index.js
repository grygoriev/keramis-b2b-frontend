// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
// import cartReducer from './cartSlice.js';
import cartUiReducer from './cartUiSlice';
import langReducer from './langSlice.js';
import currencyReducer from './currencySlice';
import { adminApi, cartApi, catalogApi, ordersApi } from '../services';

const store = configureStore({
	reducer: {
		auth: authReducer,
		// cart: cartReducer,
		cartUi: cartUiReducer,
		currency : currencyReducer,
		lang: langReducer,
		[adminApi.reducerPath]: adminApi.reducer,
		[cartApi.reducerPath]: cartApi.reducer,
		[catalogApi.reducerPath]: catalogApi.reducer,
		[ordersApi.reducerPath]: ordersApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.concat(adminApi.middleware)
			.concat(cartApi.middleware)
			.concat(catalogApi.middleware)
			.concat(ordersApi.middleware),
});

export default store;
