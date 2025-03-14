// src/store/cartUiSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { cartApi } from '../services/cartApi'; // <-- ваш RTK Query slice

const initialState = {
	activeCartId: null,
};

const cartUiSlice = createSlice({
	name: 'cartUi',
	initialState,
	reducers: {
		setActiveCart: (state, action) => {
			state.activeCartId = action.payload;
		},
	},
	extraReducers: (builder) => {
		// Подписываемся на экшен, срабатывающий когда getCartsQuery завершается успехом
		builder.addMatcher(
			cartApi.endpoints.getCarts.matchFulfilled,
			(state, { payload }) => {
				// payload = массив [{id, name, items:[]}, ...]
				if (!state.activeCartId && payload?.length > 0) {
					// Если activeCartId ещё не установлен и корзины есть
					state.activeCartId = payload[0].id; // ставим первую
				}
			},
		);
	},
});

export const { setActiveCart } = cartUiSlice.actions;
export const selectActiveCartId = (state) => state.cartUi.activeCartId;
export default cartUiSlice.reducer;
