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
 * {
 *   category: {...},
 *   breadcrumbs: [...],
 *   products: [...]
 * }
 */
export async function fetchCategoryDetail(slug, lang) {
	const response = await axiosInstance.get(`/catalog/categories/${slug}/detail/`, {
		params: { lang }, // например ?lang=ru или ?lang=uk
	});
	return response.data; // {category, breadcrumbs, products}
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
