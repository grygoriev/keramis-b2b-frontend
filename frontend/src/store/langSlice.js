// store/langSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	currentLang: localStorage.getItem('lang') || 'ru',
};

export const langSlice = createSlice({
	name: 'lang',
	initialState,
	reducers: {
		setLang: (state, action) => {
			state.currentLang = action.payload;
			localStorage.setItem('lang', action.payload);
		},
	},
});
export const selectCurrentLang = (state) => state.lang.currentLang;
export const { setLang } = langSlice.actions;
export default langSlice.reducer;
