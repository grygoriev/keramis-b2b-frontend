// src/store/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
	getCarts,
	addItemToCart,
	deleteCartItem,
	createCart,
	deleteCart, checkoutCart, updateCartItem,
} from '../api/cartApi.js';

export const fetchCartsAsync = createAsyncThunk(
	'cart/fetchCarts',
	async (lang, { rejectWithValue }) => {
		try {
			const data = await getCarts(lang); // <-- передаем lang
			return data; // [{id, name, items:[]}, ...]
		} catch (err) {
			if (err.response && err.response.status === 401) {
				// Логика, если пользователь не авторизован
				console.warn('Пользователь не авторизован, корзина недоступна');
				// Возвращаем пустую корзину
				return [];
			}
			return rejectWithValue(err.response?.data || err.message);
		}
	},
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
	},
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
	},
);

export const updateCartItemAsync = createAsyncThunk(
	'cart/updateItem',
	async ({ itemId, quantity }, { rejectWithValue }) => {
		try {
			const updatedItem = await updateCartItem(itemId, quantity);
			return updatedItem; // {id, product, quantity, ...}
		} catch (err) {
			return rejectWithValue(err.response?.data || err.message);
		}
	}
);

export const createCartAsync = createAsyncThunk(
	'cart/createCart',
	async (name, { rejectWithValue }) => {
		try {
			const result = await createCart(name);
			return result; // {id, name, items: []}
		} catch (err) {
			return rejectWithValue(err.response?.data || err.message);
		}
	},
);

export const deleteCartAsync = createAsyncThunk(
	'cart/deleteCart',
	async (cartId, { rejectWithValue }) => {
		try {
			const status = await deleteCart(cartId);
			if (status === 204) {
				return cartId;
			}
			throw new Error('Failed to delete cart');
		} catch (err) {
			return rejectWithValue(err.response?.data || err.message);
		}
	},
);

export const checkoutCartAsync = createAsyncThunk(
	'cart/checkout',
	async (cartId, { rejectWithValue }) => {
		try {
			const order = await checkoutCart(cartId);
			return { order, cartId };
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
			// updateCartItemAsync
			.addCase(updateCartItemAsync.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(updateCartItemAsync.fulfilled, (state, action) => {
				state.status = 'succeeded';
				const updatedItem = action.payload; // {id, product, quantity, ...}
				for (const cart of state.carts) {
					const item = cart.items.find((i) => i.id === updatedItem.id);
					if (item) {
						item.quantity = updatedItem.quantity;
						// добавить поля (price, product_name, ...)
						break;
					}
				}
			})
			.addCase(updateCartItemAsync.rejected, (state, action) => {
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
			})
			.addCase(deleteCartAsync.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(deleteCartAsync.fulfilled, (state, action) => {
				state.status = 'succeeded';
				const cartId = action.payload;
				state.carts = state.carts.filter((c) => c.id !== cartId);
				if (state.activeCartId === cartId) {
					state.activeCartId = null;
				}
			})
			.addCase(deleteCartAsync.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload;
			})
			// checkoutCartAsync
			.addCase(checkoutCartAsync.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(checkoutCartAsync.fulfilled, (state, action) => {
				state.status = 'succeeded';
				const { cartId } = action.payload;
				const cart = state.carts.find((c) => c.id === cartId);
				if (cart) {
					cart.items = [];
				}
			})
			.addCase(checkoutCartAsync.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload;
			});
	},
});
export const selectCarts = (state) => state.cart.carts;
export const selectCartStatus = (state) => state.cart.status;
export const selectCartError = (state) => state.cart.error;
export const selectCartById = (state, cartId) =>
	state.cart.carts.find((c) => c.id === cartId);
export const selectTotalCartItems = (state) => {
	return state.cart.carts.reduce((acc, cart) => {
		return acc + cart.items.reduce((a, item) => a + item.quantity, 0);
	}, 0);
};
export const { setActiveCart } = cartSlice.actions;
export default cartSlice.reducer;
