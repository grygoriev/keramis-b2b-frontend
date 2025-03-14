// src/services/cartApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery'; // <-- ваш кастомный baseQuery (см. предыдущие примеры)

export const cartApi = createApi({
	reducerPath: 'cartApi',
	baseQuery: axiosBaseQuery(),
	tagTypes: ['Carts'],
	endpoints: (builder) => ({
		// ========== getCarts =========
		getCarts: builder.query({
			query: (langParam) => ({
				url: '/orders/carts/',
				method: 'GET',
				params: { lang: langParam },
			}),
			providesTags: (result) =>
				result
					? [
						...result.map((cart) => ({ type: 'Carts', id: cart.id })),
						{ type: 'Carts', id: 'LIST' },
					]
					: [{ type: 'Carts', id: 'LIST' }],
		}),

		// ========== createCart =========
		createCart: builder.mutation({
			query: (name) => ({
				url: '/orders/carts/',
				method: 'POST',
				data: { name },
			}),
			invalidatesTags: [{ type: 'Carts', id: 'LIST' }],
		}),

		// ========== deleteCart =========
		deleteCart: builder.mutation({
			query: (cartId) => ({
				url: `/orders/carts/${cartId}/`,
				method: 'DELETE',
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: 'Carts', id: arg },
				{ type: 'Carts', id: 'LIST' },
			],
		}),

		// ========== addItemToCart (если нужно) =========
		addItemToCart: builder.mutation({
			query: ({ cartId, productId, quantity = 1 }) => ({
				url: '/orders/cart-items/',
				method: 'POST',
				data: {
					cart_id: cartId,
					product_id: productId,
					quantity,
				},
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: 'Carts', id: arg.cartId },
			],
		}),

		// ========== updateCartItem =========
		updateCartItem: builder.mutation({
			query: ({ itemId, quantity }) => ({
				url: `/orders/cart-items/${itemId}/`,
				method: 'PATCH',
				data: { quantity },
			}),
			// Убираем invalidatesTags, чтобы избежать ре-fetch
			// invalidatesTags: [],
			async onQueryStarted({ itemId, quantity }, { dispatch, queryFulfilled }) {
				// 1) Оптимистически патчим кэш useGetCartsQuery('ru') (или какой у вас ключ)
				//    Предположим, что "getCarts" – это builder.query({ query:..., providesTags:... }).

				// Запускаем patchResult
				const patchResult = dispatch(
					cartApi.util.updateQueryData('getCarts', 'ru', (draft) => {
						// draft – это массив корзин
						for (const cart of draft) {
							const item = cart.items.find((i) => i.id === itemId);
							if (item) {
								item.quantity = quantity; // обновляем quantity локально
								break;
							}
						}
					}),
				);
				try {
					// 2) Дожидаемся ответа сервера
					await queryFulfilled;
					// Если успех – ничего дополнительно не делаем
				} catch {
					// Если ошибка – откатываем
					patchResult.undo();
				}
			},
		}),

		// ========== deleteCartItem =========
		deleteCartItem: builder.mutation({
			query: (itemId) => ({
				url: `/orders/cart-items/${itemId}/`,
				method: 'DELETE',
			}),
			invalidatesTags: [{ type: 'Carts', id: 'LIST' }],
		}),

		// ========== checkoutCart =========
		checkoutCart: builder.mutation({
			query: (cartId) => ({
				url: '/orders/checkout/',
				method: 'POST',
				data: { cart_id: cartId },
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: 'Carts', id: arg },
				{ type: 'Carts', id: 'LIST' },
			],
		}),
	}),
});

export const {
	useGetCartsQuery,
	useCreateCartMutation,
	useDeleteCartMutation,
	useAddItemToCartMutation,
	useUpdateCartItemMutation,
	useDeleteCartItemMutation,
	useCheckoutCartMutation,
} = cartApi;
