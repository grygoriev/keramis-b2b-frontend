// src/services/adminApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery'; // наш кастомный baseQuery с axios

export const adminApi = createApi({
	reducerPath: 'adminApi',
	baseQuery: axiosBaseQuery(),
	tagTypes: ['Clients', 'ClientGroups', 'Discounts', 'PriceGroups'],
	endpoints: (builder) => ({
		// ========= 1) КЛИЕНТЫ =========
		getClients: builder.query({
			query: (langParam) => ({
				url: '/api/auth/clients/',
				method: 'GET',
				params: { lang: langParam },
			}),
			providesTags: (result) =>
				result
					? [
						...result.map((c) => ({ type: 'Clients', id: c.id })),
						{ type: 'Clients', id: 'LIST' },
					]
					: [{ type: 'Clients', id: 'LIST' }],
		}),
		getClientGroups: builder.query({
			query: () => ({ url: '/api/auth/client-groups/', method: 'GET' }),
			providesTags: (result) =>
				result
					? [
						...result.map((g) => ({ type: 'ClientGroups', id: g.id })),
						{ type: 'ClientGroups', id: 'LIST' },
					]
					: [{ type: 'ClientGroups', id: 'LIST' }],
		}),
		updateClient: builder.mutation({
			query: ({ clientId, payload }) => ({
				url: `/api/auth/clients/${clientId}/`,
				method: 'PATCH',
				data: payload,
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: 'Clients', id: arg.clientId },
				{ type: 'Clients', id: 'LIST' },
			],
		}),

		// ========= 2) СКИДКИ (Discounts) =========
		getPriceGroups: builder.query({
			// GET /pricing/price-groups/
			query: () => ({ url: '/pricing/price-groups/', method: 'GET' }),
			providesTags: (result) =>
				result
					? [
						...result.map((pg) => ({ type: 'PriceGroups', id: pg.id })),
						{ type: 'PriceGroups', id: 'LIST' },
					]
					: [{ type: 'PriceGroups', id: 'LIST' }],
		}),

		getGroupDiscounts: builder.query({
			// GET /pricing/group-discounts/
			query: () => ({ url: '/pricing/group-discounts/', method: 'GET' }),
			providesTags: (result) =>
				result
					? [
						...result.map((d) => ({ type: 'Discounts', id: d.id })),
						{ type: 'Discounts', id: 'LIST' },
					]
					: [{ type: 'Discounts', id: 'LIST' }],
		}),

		updateGroupDiscount: builder.mutation({
			// PATCH /pricing/group-discounts/:id/
			query: ({ discountId, payload }) => ({
				url: `/pricing/group-discounts/${discountId}/`,
				method: 'PATCH',
				data: payload,
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: 'Discounts', id: arg.discountId },
				{ type: 'Discounts', id: 'LIST' },
			],
		}),

		createGroupDiscount: builder.mutation({
			// POST /pricing/group-discounts/
			query: (payload) => ({
				url: '/pricing/group-discounts/',
				method: 'POST',
				data: payload,
			}),
			invalidatesTags: [{ type: 'Discounts', id: 'LIST' }],
		}),

		deleteGroupDiscount: builder.mutation({
			// DELETE /pricing/group-discounts/:id/
			query: (discountId) => ({
				url: `/pricing/group-discounts/${discountId}/`,
				method: 'DELETE',
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: 'Discounts', id: arg },
				{ type: 'Discounts', id: 'LIST' },
			],
		}),
	}),
});

export const {
	// 1) КЛИЕНТЫ
	useGetClientsQuery,
	useGetClientGroupsQuery,
	useUpdateClientMutation,

	// 2) СКИДКИ
	useGetPriceGroupsQuery,
	useGetGroupDiscountsQuery,
	useUpdateGroupDiscountMutation,
	useCreateGroupDiscountMutation,
	useDeleteGroupDiscountMutation,
} = adminApi;
