// src/services/catalogApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';
// ↑ ваша реализация, внутри которой axiosInstance с интерцепторами

export const catalogApi = createApi({
	reducerPath: 'catalogApi',
	baseQuery: axiosBaseQuery(),
	tagTypes: [
		'Banners',
		'Categories',
		'Products',
		'Search',
		// и т.д. если нужно invalidatesTags / providesTags
	],
	endpoints: (builder) => ({
		// 1) Баннеры → GET /catalog/banners/
		getBanners: builder.query({
			query: () => ({
				url: '/catalog/banners/',
				method: 'GET',
			}),
			providesTags: (result) =>
				result
					? [
						...result.map((banner) => ({ type: 'Banners', id: banner.id })),
						{ type: 'Banners', id: 'LIST' },
					]
					: [{ type: 'Banners', id: 'LIST' }],
		}),

		// 2) Дерево категорий → GET /catalog/categories/tree/
		getCategoryTree: builder.query({
			query: (lang) => ({
				url: '/catalog/categories/tree/',
				method: 'GET',
				params: { lang },
			}),
			// providesTags: ...
		}),

		// 3) Детали категории → GET /catalog/categories/:slug/detail/
		getCategoryDetail: builder.query({
			query: ({ slug, lang, extraParams = {} }) => ({
				url: `/catalog/categories/${slug}/detail/`,
				method: 'GET',
				params: {
					lang,
					...extraParams,
				},
			}),
			// providesTags: ...
		}),

		// 4) Поиск товаров (GET /catalog/search/products/)
		searchProducts: builder.query({
			query: ({ lang, extraParams = {} }) => ({
				url: '/catalog/search/products/',
				method: 'GET',
				params: {
					lang,
					...extraParams,
				},
			}),
			// transformResponse / providesTags ...
		}),

		// 5) Автокомплит (GET /catalog/search/autocomplete/)
		searchAutocomplete: builder.query({
			query: ({ lang, extraParams = {} }) => ({
				url: '/catalog/search/autocomplete/',
				method: 'GET',
				params: {
					lang,
					...extraParams,
				},
			}),
		}),

		// 6) Детали товара → GET /catalog/products/:slug/detail/
		getProductDetail: builder.query({
			query: ({ slug, lang }) => ({
				url: `/catalog/products/${slug}/detail/`,
				method: 'GET',
				params: { lang },
			}),
		}),

		// 7) Список товаров (для home или общего)
		getProducts: builder.query({
			query: ({ lang, extraParams = {} }) => ({
				url: '/catalog/products',
				method: 'GET',
				params: {
					lang,
					...extraParams,
				},
			}),
			transformResponse: (response /*, meta, arg */) =>
				// если бекэнд уже вернул пагинационный объект – берём .products,
				// иначе это старый формат (простой массив)
				Array.isArray(response) ? response : (response.products ?? []),
			// providesTags: ...
		}),
	}),
});

// Экспорт хуков RTK Query
export const {
	useGetBannersQuery,
	useGetCategoryTreeQuery,
	useGetCategoryDetailQuery,
	useSearchProductsQuery,
	useSearchAutocompleteQuery,
	useGetProductDetailQuery,
	useGetProductsQuery,
} = catalogApi;
