// src/api/catalogApi.js
import axiosInstance from './axiosInstance.js';

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
 *   "count": <int>,
 *   "next": "...",
 *   "previous": "...",
 *   "category": { ... },
 *   "breadcrumbs": [ ... ],
 *   "products": [ ... ],
 *   "facets": [ ... ]
 * }
 *
 * @param {string} slug - Slug категории
 * @param {string} lang - Код языка (ru/uk/...)
 * @param {object} [extraParams] - Дополнительные query-параметры,
 *   например { fv_color: "1,2", fv_surface: "4,5", page: 1, page_size: 12, sort: price_desc }
 * @returns {Promise<object>} - объект ответа { count, next, previous, category, breadcrumbs, products, facets? }
 */
export async function fetchCategoryDetail(slug, lang, extraParams = {}) {
	// Формируем объект params, объединяя language + дополнительные параметры (фильтры)
	const params = {
		lang,
		...extraParams,
	};

	const response = await axiosInstance.get(`/catalog/categories/${slug}/detail/`, {
		params, // ?lang=ru&fv_color=4,7&fv_surface=11&page=1&page_size=2 ...
	});

	return response.data;
}

/**
 * Возвращает результат поиска товаров (GET /catalog/search/products/)
 *
 * Ожидаемый ответ:
 * {
 *   "count": <int>,
 *   "next": "...",
 *   "previous": "...",
 *   "products": [ ... ],
 *   "facets": [ ... ]
 * }
 *
 * @param {string} lang - Код языка (ru/uk/...)
 * @param {object} [extraParams] - Дополнительные query-параметры,
 *   например { fv_color: "1,2", fv_surface: "4,5", page: 1, page_size: 12, sort: price_desc }
 * @returns {Promise<object>} - объект ответа { count, next, previous, products, facets? }
 */
export async function fetchSearchProducts(lang, extraParams = {}) {
	// Формируем объект params, объединяя language + дополнительные параметры (фильтры)
	const params = {
		lang,
		...extraParams,
	};

	const response = await axiosInstance.get(`/catalog/search/products/`, {
		params, // ?lang=ru&fv_color=4,7&fv_surface=11&page=1&page_size=2 ...
	});

	return response.data;
}

/**
 * Возвращает результат поиска товаров (GET /catalog/search/autocomplete/)
 *
 * Ожидаемый ответ:
 * [
 * {
 *         "id": 6,
 *         "sku_id": "00-00225614",
 *         "name": "плитка Paradyz Afternoon 29,5x59,5 grys poler rect",
 *         "price": "1103.86",
 *         "discounted_price": null,
 *         "image_filename": "http://localhost:8000/media/products/06/00/6/92608.970.jpg",
 *         "slug": "plitka_paradyz_afternoon_29_5x59_5_grys_poler_rect",
 *         "category_name": "Afternoon"
 * },
 * ]
 *
 * @param {string} lang - Код языка (ru/uk/...)
 * @param {object} [extraParams] - Дополнительные query-параметры,
 *   например { q: "rea" }
 */
export async function fetchSearchAutocomplete(lang, extraParams = {}) {
	// Формируем объект params, объединяя language + дополнительные параметры (фильтры)
	const params = {
		lang,
		...extraParams,
	};

	const response = await axiosInstance.get(`/catalog/search/autocomplete/`, {
		params, // ?lang=ru&q=rea ...
	});

	return response.data;
}

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

/**
 * Возвращает список товаров (GET /catalog/products/)
 * Ожидаемый ответ:
 * [
 *     {
 *         "id": 3,
 *         "sku_id": "00-00223808",
 *         "name": "умывальник Rea Royal 36x62,5 granit shiny (REA-U8596)",
 *         "price": "7636.00",
 *         "discounted_price": null,
 *         "image_filename": "http://159.69.148.221/media/products/03/00/3/72697.970.jpg",
 *         "slug": "umyvalnik_rea_royal_36x62_5_granit_rea_u8596_",
 *         "category_name": "Royal",
 *         "unit_of_measure": {...},
 *         "stocks": [...],
 *         "features": [...]
 *     }
 * ]
 * @param {string} lang - Код языка (ru/uk/...)
 * @param {object} [extraParams] - Дополнительные query-параметры,
 *   например { fv_product_list: "new,promo", fv_surface: "4,5" }
 */
export async function fetchHomeProducts(lang, extraParams = {}) {
	const resp = await axiosInstance.get('/catalog/products', {
		params: {
			lang,
			...extraParams,
		},
	});
	return resp.data; // массив [{id, name, ...}, ...]
}

/**
 * Загрузка банеров (GET /catalog/banners/)
 * Ожидаемый ответ:
 * [
 *     {
 *         "id": 1,
 *         "image_url": "http://159.69.148.221/media/banners/promo_674727c5302d8934271423.jpg",
 *         "link_url": "https://keramis.in.ua/search/?query=isvea",
 *         "title": "Банер 1",
 *         "description": "Описание Банер 1",
 *         "sort_order": 0,
 *         "start_date": null,
 *         "end_date": null
 *     }
 * ]
 */
export async function fetchBanners() {
	// GET /catalog/banners/
	const resp = await axiosInstance.get('/catalog/banners/');
	return resp.data; // [{id, image_url, link_url, ...}]
}
