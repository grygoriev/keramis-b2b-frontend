// src/pages/catalog/hooks/useCategoryOrSearch.js
import { useState, useEffect } from 'react';
import { fetchCategoryDetail, fetchSearchProducts } from '../../../api/catalogApi';
import { useTranslation } from 'react-i18next';

export function useCategoryOrSearch({
										slug,
										q,
										selectedFilters,
										page,
										pageSize,
										sort,
										serverLang,
									}) {
	const { t } = useTranslation();

	// Режим "Категория" или "Поиск"
	const isCategoryMode = Boolean(slug);

	// Состояния
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const [category, setCategory] = useState(null);
	const [breadcrumbs, setBreadcrumbs] = useState([]);
	const [products, setProducts] = useState([]);
	const [facets, setFacets] = useState([]);
	const [totalCount, setTotalCount] = useState(0);

	useEffect(() => {
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [slug, q, selectedFilters, page, pageSize, sort, serverLang]);

	async function loadData() {
		setLoading(true);
		setError(null);

		try {
			// Формируем query-параметры
			const params = {
				lang: serverLang,
				page,
				page_size: pageSize,
				sort,
			};

			// Фильтры fv_...
			Object.entries(selectedFilters).forEach(([code, arr]) => {
				if (arr.length) {
					params[`fv_${code}`] = arr.join(',');
				}
			});

			let data;
			if (isCategoryMode) {
				// Категория
				data = await fetchCategoryDetail(slug, serverLang, params);
				if (!data.category) {
					const msg = t('categoryPage.notFound', 'Категория не найдена');
					setError(msg);
					return;
				}
				setCategory(data.category);
				setBreadcrumbs(data.breadcrumbs || []);
				setProducts(data.products || []);
				setTotalCount(data.count || 0);
				if (data.facets) setFacets(data.facets);

			} else {
				// Поиск
				if (q) {
					params.q = q;
				}
				data = await fetchSearchProducts(serverLang, params);
				setCategory(null);
				setBreadcrumbs([]);
				setProducts(data.products || []);
				setTotalCount(data.count || 0);
				if (data.facets) setFacets(data.facets);
			}
		} catch (err) {
			console.error(err);
			setError(t('common.loadError', 'Ошибка загрузки'));
		} finally {
			setLoading(false);
		}
	}

	return {
		isCategoryMode,
		loading,
		error,
		category,
		breadcrumbs,
		products,
		facets,
		totalCount,
	};
}
