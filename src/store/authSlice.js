import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	isLoggedIn: false,
	token: null,
	username: null,
	role: null,
};

// Логика auth
export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		// Успешный логин
		setAuthData: (state, action) => {
			// action.payload = { token, username, role }
			state.isLoggedIn = true;
			state.token = action.payload.token;
			state.username = action.payload.username || null;
			state.role = action.payload.role || null;
		},
		// Логаут
		logout: (state) => {
			state.isLoggedIn = false;
			state.token = null;
			state.username = null;
			state.role = null;
		},
		// Восстановить из localStorage, если хотим
		restoreAuth: (state, action) => {
			const { token, username, role } = action.payload;
			if (token) {
				state.isLoggedIn = true;
				state.token = token;
				state.username = username || null;
				state.role = role || null;
			} else {
				state.isLoggedIn = false;
				state.token = null;
				state.username = null;
				state.role = null;
			}
		},
	},
});

export const { setAuthData, logout, restoreAuth } = authSlice.actions;
export default authSlice.reducer;
