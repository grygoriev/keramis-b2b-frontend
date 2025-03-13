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
			const { username, role } = action.payload
			state.isLoggedIn = true;
			state.username = username || null;
			state.role = role || null;
			localStorage.setItem('role', role);
			if (username) {
				localStorage.setItem('username', username);
			}
		},
		logout: (state) => {
			state.isLoggedIn = false;
			state.username = null;
			state.role = null;
			localStorage.removeItem('role');
			localStorage.removeItem('username');
		},
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

export const { setAuthData, logout, restoreAuth } = authSlice.actions;
export const selectUserRole = (state) => state.auth.role;
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectUsername = (state) => state.auth.username;
export default authSlice.reducer;
