// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import cartReducer from './cartSlice.js';
import langReducer from './langSlice.js';

const store = configureStore({
	reducer: {
		auth: authReducer,
		cart: cartReducer,
		lang: langReducer,
	},
});

export default store;
