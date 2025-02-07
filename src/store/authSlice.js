// src/store/authSlice.js

import { createSlice } from '@reduxjs/toolkit';

// Начальное состояние
const initialState = {
	isLoggedIn: false,
	username: null,
	role: null,
};

// Создаем слайс
const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setAuthData: (state, action) => {
			// action.payload = { username, role }
			state.isLoggedIn = true;
			state.username = action.payload.username || null;
			state.role = action.payload.role || null;
		},
		logout: (state) => {
			state.isLoggedIn = false;
			state.username = null;
			state.role = null;
		},
		// Восстановление из localStorage (опционально)
		restoreAuth: (state, action) => {
			const { username, role } = action.payload;
			if (username) {
				state.isLoggedIn = true;
				state.username = username || null;
				state.role = role || null;
			} else {
				state.isLoggedIn = false;
				state.username = null;
				state.role = null;
			}
		},
	},
});

// Экспорт экшенов (по именам)
export const { setAuthData, logout, restoreAuth } = authSlice.actions;

// Экспорт по умолчанию (default) – это сам reducer
export default authSlice.reducer;
