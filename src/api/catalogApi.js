// src/api/catalogApi.js
import axiosInstance from './axiosInstance';

// --- Категории ---

/**
 * Возвращает дерево категорий (GET /catalog/categories/tree/)
 * [{
 *   id: 1, slug: "bathroom", name: "Сантехника", children: [...]
 * }, ...]
 */
export async function fetchCategoryTree(lang) {
	const response = await axiosInstance.get('/catalog/categories/tree/', {
		params: { lang }, // например ?lang=ru или ?lang=uk
	});
	return response.data; // массив дерева
}

/**
 * Возвращает детали категории (GET /catalog/categories/:slug/detail/)
 *
 * Ожидаемый ответ:
 * {
 *   "category": { ... },
 *   "breadcrumbs": [ ... ],
 *   "products": [ ... ],
 *   "facets": [ ... ] // если на бэкенде это реализовано
 * }
 *
 * @param {string} slug - Slug категории
 * @param {string} lang - Код языка (ru/uk/...)
 * @param {object} [extraParams] - Дополнительные query-параметры,
 *   например { fv_color: "1,2", fv_surface: "4,5" }
 * @returns {Promise<object>} - объект ответа { category, breadcrumbs, products, facets? }
 */
export async function fetchCategoryDetail(slug, lang, extraParams = {}) {
	// Формируем объект params, объединяя language + дополнительные параметры (фильтры)
	const params = {
		lang,
		...extraParams,
	};

	const response = await axiosInstance.get(`/catalog/categories/${slug}/detail/`, {
		params, // ?lang=ru&fv_color=4,7&fv_surface=11 ...
	});

	return response.data;
}

// --- Товары ---

/**
 * Возвращает детали товара (GET /catalog/products/:slug/detail/)
 * {
 *   product: {...},
 *   breadcrumbs: [...]
 * }
 */
export async function fetchProductDetail(slug, lang) {
	const response = await axiosInstance.get(`/catalog/products/${slug}/detail/`, {
		params: { lang }, // например ?lang=ru или ?lang=uk
	});
	return response.data; // { product, breadcrumbs }
}
