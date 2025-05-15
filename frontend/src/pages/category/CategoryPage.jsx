// src/pages/catalog/CategoryPage.jsx
import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Row, Col } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { selectCurrentLang } from '../../store/langSlice';
import { transformLangToServer } from '../../utils';
import { ProductCard, BreadcrumbsBlock, LoadingWrapper } from '../../components';

import { CategoryFilters, CategoryPagination, SortSelect, SubcategoryList, MobileFilterButton } from './components';

import {
	useGetCategoryDetailQuery,
	useSearchProductsQuery,
} from '../../services';

export function CategoryPage() {
	const { slug } = useParams();
	const location = useLocation();
	const dispatch = useDispatch();
	const { t } = useTranslation();

	const currentLanguage = useSelector(selectCurrentLang);
	const serverLang = transformLangToServer(currentLanguage);

	// Извлекаем q (поиск)
	const searchParams = new URLSearchParams(location.search);
	const q = searchParams.get('q') || '';

	// Определяем режим
	const isCategoryMode = Boolean(slug);

	// Фильтры
	const [selectedFilters, setSelectedFilters] = useState({});
	// Пагинация
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(12);
	// Сортировка
	const [sort, setSort] = useState('id_asc');

	// Подготовим объект дополнительных params (page, page_size, sort, fv_...)
	const extraParams = {
		page,
		page_size: pageSize,
		sort,
	};

	// Переводим selectedFilters в fv_color=..., fv_surface=...
	Object.entries(selectedFilters).forEach(([code, arr]) => {
		if (arr.length) {
			extraParams[`fv_${code}`] = arr.join(',');
		}
	});

	// Если это режим поиска и q есть
	if (!isCategoryMode && q) {
		extraParams.q = q;
	}

	// ======= RTK QUERY =======
	// 1) Запрос для категории (skip, если не isCategoryMode)
	const {
		data: catData,
		error: catError,
		isFetching: catLoading,
	} = useGetCategoryDetailQuery(
		{
			slug,
			lang: serverLang,
			extraParams,
		},
		{
			skip: !isCategoryMode, // пропустить запрос, если это не категория
		},
	);

	// 2) Запрос для поиска (skip, если isCategoryMode)
	const {
		data: searchData,
		error: searchError,
		isFetching: searchLoading,
	} = useSearchProductsQuery(
		{
			lang: serverLang,
			extraParams,
		},
		{
			skip: isCategoryMode, // пропустить запрос, если это категория
		},
	);

	// Объединяем loading/error
	const loading = catLoading || searchLoading;
	const error = catError || searchError;

	// Извлекаем данные (продукты, кол-во, facets, breadcrumbs) из catData или searchData
	let category = null;
	let breadcrumbs = [];
	let products = [];
	let facets = [];
	let subcategories =[];
	let totalCount = 0;

	if (isCategoryMode) {
		// Данные из getCategoryDetail
		category = catData?.category;
		if (catData?.breadcrumbs) {
			breadcrumbs = catData.breadcrumbs;
		}
		if (catData?.products) {
			products = catData.products;
		}
		subcategories = catData?.subcategories || [];
		facets = catData?.facets || [];
		totalCount = catData?.count || 0;
	} else {
		// Данные из searchProducts
		if (searchData?.products) {
			products = searchData.products;
		}
		facets = searchData?.facets || [];
		totalCount = searchData?.count || 0;
		// Поиск не отдаёт category/breadcrumbs
	}

	// Заголовок
	const title = isCategoryMode
		? category?.name
		: t('search.resultsFor', 'Результаты поиска');

	// ======= Обработчики =======
	const handleFiltersChange = (newSelected) => {
		setSelectedFilters(newSelected);
		setPage(1);
	};

	const handleChangePage = (newPage, newPageSize) => {
		setPage(newPage);
		setPageSize(newPageSize);
	};

	// ======= РЕНДЕР =======
	return (
		<LoadingWrapper
			loading={loading}
			error={error ? String(error) : null}
			data={products}
		>
			<div>
				{/* Хлебные крошки, если есть */}
				<BreadcrumbsBlock breadcrumbs={breadcrumbs} />

				{/* Заголовок */}
				<h2 style={{ margin: '0 0 12px 0' }}>{title}</h2>

				{/* Если поиск, показываем "Найдено X товаров по запросу q" */}
				{!isCategoryMode && q && (
					<div style={{ marginBottom: 16, color: '#555' }}>
						{t('search.foundItems', 'Найдено')} {totalCount}{' '}
						{t('search.products', 'товаров')}{' '}
						{t('search.forQuery', 'по запросу')} «{q}»
					</div>
				)}

				<Row gutter={[16, 16]}>
					{/* ─── DESKTOP ─── */}
					<Col xs={24} sm={24} md={8} lg={6} xl={5} className="desktop-filters">
						<CategoryFilters
							facets={facets}
							selected={selectedFilters}
							onChange={handleFiltersChange}
						/>
					</Col>
					<Col xs={24} sm={24} md={16} lg={18} xl={19} style={{position:'relative'}}>
						<div className="mobile-filters-trigger">
							<MobileFilterButton
								facets={facets}
								selected={selectedFilters}
								onChange={handleFiltersChange}
							/>
						</div>
						  {/* --- ПОД-КАТЕГОРИИ --- */}
						  {isCategoryMode && subcategories.length > 0 && (
							<SubcategoryList subcats={subcategories} />
						  )}

						  {/* --- СОРТИРОВКА --- */}
						  <div style={{ display:'flex', justifyContent:'flex-end', margin:'0 0 16px 0' }}>
							<SortSelect
							  value={sort}
							  onChange={(val) => {
								setSort(val);
								setPage(1);
							  }}
							/>
						  </div>
						<div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
							{products.map((prod) => (
								<ProductCard key={prod.id} product={prod} />
							))}
						</div>

						<CategoryPagination
							page={page}
							pageSize={pageSize}
							total={totalCount}
							onChangePage={handleChangePage}
						/>
					</Col>
				</Row>
			</div>
		</LoadingWrapper>
	);
}
