// src/store/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
	getCarts,
	addItemToCart,
	deleteCartItem,
	createCart, // <-- мы добавляем createCart для POST /orders/carts
} from '../api/cartApi';
import { message } from 'antd';

export const fetchCartsAsync = createAsyncThunk(
	'cart/fetchCarts',
	async (lang, { rejectWithValue }) => {
		try {
			const data = await getCarts(lang);  // <-- передаем lang
			return data; // [{id, name, items:[]}, ...]
		} catch (err) {
			if (err.response && err.response.status === 401) {
				// Логика, если пользователь не авторизован
				console.warn('Пользователь не авторизован, корзина недоступна');
				// Возвращаем пустую корзину (или любую заглушку)
				return [];
			}
			return rejectWithValue(err.response?.data || err.message);
		}
	}
);

export const addItemToCartAsync = createAsyncThunk(
	'cart/addItem',
	async ({ cartId, productId, quantity }, { rejectWithValue }) => {
		try {
			const newItem = await addItemToCart(cartId, productId, quantity);
			return { cartId, newItem };
		} catch (err) {
			return rejectWithValue(err.response?.data || err.message);
		}
	}
);

export const deleteCartItemAsync = createAsyncThunk(
	'cart/deleteItem',
	async (itemId, { rejectWithValue }) => {
		try {
			const status = await deleteCartItem(itemId);
			if (status === 204) {
				return itemId;
			}
			throw new Error('Failed to delete');
		} catch (err) {
			return rejectWithValue(err.response?.data || err.message);
		}
	}
);

// <-- new
export const createCartAsync = createAsyncThunk(
	'cart/createCart',
	async (name, { rejectWithValue }) => {
		try {
			const result = await createCart(name);
			return result; // {id, name, items: []}
		} catch (err) {
			return rejectWithValue(err.response?.data || err.message);
		}
	}
);

const cartSlice = createSlice({
	name: 'cart',
	initialState: {
		carts: [],
		activeCartId: null,
		status: 'idle',
		error: null,
	},
	reducers: {
		setActiveCart: (state, action) => {
			state.activeCartId = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchCartsAsync.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchCartsAsync.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.carts = action.payload;
				if (!state.activeCartId && action.payload.length > 0) {
					state.activeCartId = action.payload[0].id;
				}
			})
			.addCase(fetchCartsAsync.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload;
			})

			.addCase(addItemToCartAsync.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(addItemToCartAsync.fulfilled, (state, action) => {
				state.status = 'succeeded';
				const { cartId, newItem } = action.payload;
				const cart = state.carts.find((c) => c.id === cartId);
				if (cart) {
					const existing = cart.items.find((i) => i.id === newItem.id);
					if (existing) {
						existing.quantity = newItem.quantity;
					} else {
						cart.items.push(newItem);
					}
				}
			})
			.addCase(addItemToCartAsync.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload;
			})

			.addCase(deleteCartItemAsync.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(deleteCartItemAsync.fulfilled, (state, action) => {
				state.status = 'succeeded';
				const itemId = action.payload;
				state.carts.forEach((c) => {
					c.items = c.items.filter((i) => i.id !== itemId);
				});
			})
			.addCase(deleteCartItemAsync.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload;
			})

			// createCartAsync
			.addCase(createCartAsync.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(createCartAsync.fulfilled, (state, action) => {
				state.status = 'succeeded';
				// action.payload = {id, name, items:[]}
				state.carts.push(action.payload);
			})
			.addCase(createCartAsync.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload;
			});
	},
});

export const { setActiveCart } = cartSlice.actions;
export default cartSlice.reducer;
