// src/pages/catalog/CatalogPage.jsx
import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Spin, Row, Col, message } from 'antd';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { fetchCartsAsync } from '../../store/cartSlice';
import { fetchCategoryDetail, fetchSearchProducts } from '../../api/catalogApi';
import { ProductCard } from '../../components';
import { CategoryFilters, CategoryPagination, SortSelect } from './components';
import { BreadcrumbsBlock } from '../../components';

export function CategoryPage() {
	const { slug } = useParams(); // slug категории (если есть)
	const location = useLocation(); // для поиска query-параметров
	const dispatch = useDispatch();
	const { t } = useTranslation();

	// Состояния
	const [category, setCategory] = useState(null);
	const [breadcrumbs, setBreadcrumbs] = useState([]);
	const [products, setProducts] = useState([]);
	const [facets, setFacets] = useState([]);
	const [totalCount, setTotalCount] = useState(0);
	const [loading, setLoading] = useState(false);

	// Фильтры
	const [selectedFilters, setSelectedFilters] = useState({});

	// Пагинация
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(12);

	// Сортировка
	const [sort, setSort] = useState('id_asc');

	const storedLang = localStorage.getItem('lang') || 'ru';
	const serverLang = storedLang === 'ua' ? 'uk' : storedLang;

	// Определяем, в каком «режиме» мы находимся: Категория или Поиск
	// Если slug есть => категория, иначе => поиск.
	const isCategoryMode = Boolean(slug);

	// Извлекаем query (например, ?q=плитка)
	const searchParams = new URLSearchParams(location.search);
	const q = searchParams.get('q') || ''; // может быть пусто

	useEffect(() => {
		dispatch(fetchCartsAsync());
	}, [dispatch]);

	// При изменении slug, filters, page, pageSize, q -> загружаем заново
	useEffect(() => {
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [slug, selectedFilters, page, pageSize, serverLang, q, sort]);

	const loadData = async () => {
		setLoading(true);

		try {
			// Общие параметры
			const params = {
				lang: serverLang,
				page,
				page_size: pageSize,
				sort
			};

			// Если у нас есть выбранные фильтры (fv_...), добавляем
			Object.entries(selectedFilters).forEach(([code, arr]) => {
				if (arr.length) {
					const paramName = `fv_${code}`;
					params[paramName] = arr.join(',');
				}
			});

			let data;
			if (isCategoryMode) {
				// Режим категории
				// slug обязателен, вызываем fetchCategoryDetail
				data = await fetchCategoryDetail(slug, serverLang, params);

				// Если нет category, возможно slug неверный
				if (!data.category) {
					message.error(t('categoryPage.notFound'));
					setLoading(false);
					return;
				}
				// Установим breadcrumbs, products и т.д.
				setCategory(data.category);
				setBreadcrumbs(data.breadcrumbs || []);
				setProducts(data.products || []);
				setTotalCount(data.count || 0);
				if (data.facets) setFacets(data.facets);

			} else {
				// Режим поиска
				// берём q (из location.search)
				if (q) {
					params.q = q;
				}

				// fetchSearchProducts
				data = await fetchSearchProducts(serverLang, params);

				// В ответе нет category/breadcrumbs — либо пустые
				setBreadcrumbs([]); // нет хлебных крошек
				setProducts(data.products || []);
				setTotalCount(data.count || 0);
				if (data.facets) setFacets(data.facets);
			}
		} finally {
			setLoading(false);
		}
	};

	// Коллбек фильтров
	const handleFiltersChange = (newSelected) => {
		setSelectedFilters(newSelected);
		setPage(1);
	};

	// Коллбек пагинации
	const handleChangePage = (newPage, newPageSize) => {
		setPage(newPage);
		setPageSize(newPageSize);
	};

	if (loading) return <Spin style={{ marginTop: 20 }} />;

	// Если поиск, отображаем "Результаты поиска: ..." (q)
	// Если категория, показываем название
	const title = isCategoryMode
		? category?.name
		: t('search.resultsFor', 'Результаты поиска');

	return (
		<div>
			{/* Блок хлебных крошек - покажется только если есть breadcrumbs */}
			<BreadcrumbsBlock breadcrumbs={breadcrumbs} />

			<div style={{
				marginBottom: 16,
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center'
			}}>
				<h2 style={{ margin: 0 }}>{title}</h2>

				{/* Блок сортировки в правом верхнем углу */}
				<SortSelect value={sort} onChange={(val) => {
					setSort(val);
					setPage(1); // при смене сортировки идём на 1-ю страницу
				}} />
			</div>

			{/* При поиске выводим: "По вашему запросу '{q}' найдено totalCount товаров" */}
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
	);
}
