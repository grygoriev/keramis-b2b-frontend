// src/pages/catalog/CategoryPage.jsx
import { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Row, Col } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { selectCurrentLang } from '../../store/langSlice';
import { transformLangToServer } from '../../utils';

import { useCategoryOrSearch } from './hooks';

import {
	ProductCard,
	BreadcrumbsBlock,
	LoadingWrapper,
} from '../../components';

import { CategoryFilters, CategoryPagination, SortSelect } from './components';

export function CategoryPage() {
	const { slug } = useParams();
	const location = useLocation();
	const dispatch = useDispatch();
	const { t } = useTranslation();

	// Язык из Redux + трансформ
	const currentLanguage = useSelector(selectCurrentLang);
	const serverLang = transformLangToServer(currentLanguage);

	// Извлекаем query (например ?q=...)
	const searchParams = new URLSearchParams(location.search);
	const q = searchParams.get('q') || '';

	// Фильтры
	const [selectedFilters, setSelectedFilters] = useState({});

	// Пагинация
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(12);

	// Сортировка
	const [sort, setSort] = useState('id_asc');

	// Вызываем кастомный хук
	const {
		isCategoryMode,
		loading,
		error,
		category,
		breadcrumbs,
		products,
		facets,
		totalCount,
	} = useCategoryOrSearch({
		slug,
		q,
		selectedFilters,
		page,
		pageSize,
		sort,
		serverLang,
	});

	// Коллбек изменения фильтров
	const handleFiltersChange = (newSelected) => {
		setSelectedFilters(newSelected);
		setPage(1);
	};

	// Коллбек пагинации
	const handleChangePage = (newPage, newPageSize) => {
		setPage(newPage);
		setPageSize(newPageSize);
	};

	// Заголовок
	const title = isCategoryMode
		? category?.name
		: t('search.resultsFor', 'Результаты поиска');

	return (
		<LoadingWrapper loading={loading} error={error} data={products}>
			<div>
				<BreadcrumbsBlock breadcrumbs={breadcrumbs} />

				<div style={{
					marginBottom: 16,
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center'
				}}>
					<h2 style={{ margin: 0 }}>{title}</h2>

					<SortSelect
						value={sort}
						onChange={(val) => {
							setSort(val);
							setPage(1);
						}}
					/>
				</div>

				{/* Если поиск, показываем info */}
				{!isCategoryMode && q && (
					<div style={{ marginBottom: 16, color: '#555' }}>
						{t('search.foundItems', 'Найдено')} {totalCount}
						{' '} {t('search.products', 'товаров')}
						{' '} {t('search.forQuery', 'по запросу')} «{q}»
					</div>
				)}

				<Row gutter={[16, 16]}>
					<Col xs={24} sm={24} md={8} lg={6} xl={5}>
						<CategoryFilters
							facets={facets}
							selected={selectedFilters}
							onChange={handleFiltersChange}
						/>
					</Col>
					<Col xs={24} sm={24} md={16} lg={18} xl={19}>
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
