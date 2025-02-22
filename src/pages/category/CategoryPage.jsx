// src/pages/category/CategoryPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Spin, Breadcrumb, message, Row, Col } from 'antd';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { fetchCategoryDetail } from '../../api/catalogApi';
import { fetchCartsAsync } from '../../store/cartSlice';
import { ProductCard } from '../../components';
import { CategoryFilters, CategoryPagination } from './components';

import './CategoryPage.css';

export function CategoryPage() {
	const { slug } = useParams();
	const dispatch = useDispatch();
	const { t } = useTranslation();

	const [category, setCategory] = useState(null);
	const [breadcrumbs, setBreadcrumbs] = useState([]);
	const [products, setProducts] = useState([]);
	const [facets, setFacets] = useState([]);
	const [loading, setLoading] = useState(false);

	// Текущее кол-во всех товаров
	const [totalCount, setTotalCount] = useState(0);

	// Храним выбранные фильтры в виде { color: [1, 2], ... }
	const [selectedFilters, setSelectedFilters] = useState({});

	// Пагинация: текущая страница и размер
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(12); // любое дефолтное значение

	const storedLang = localStorage.getItem('lang') || 'ru';
	const serverLang = storedLang === 'ua' ? 'uk' : storedLang;

	useEffect(() => {
		dispatch(fetchCartsAsync());
	}, [dispatch]);

	// При изменении slug, filters, page или pageSize, грузим заново
	useEffect(() => {
		loadCategory();
	}, [slug, selectedFilters, page, pageSize, serverLang]);

	const loadCategory = async () => {
		setLoading(true);
		try {
			// Формируем query-параметры на основе selectedFilters
			const params = {
				lang: serverLang,
				page,
				page_size: pageSize,
			};
			Object.entries(selectedFilters).forEach(([code, arr]) => {
				if (arr.length) {
					const paramName = `fv_${code}`;
					params[paramName] = arr.join(',');
				}
			});

			const data = await fetchCategoryDetail(slug, serverLang, params);
			if (!data.category) {
				message.error(t('categoryPage.notFound'));
			} else {
				setCategory(data.category);
				setBreadcrumbs(data.breadcrumbs);
				setProducts(data.products);
				setTotalCount(data.count || 0);

				if (data.facets) {
					setFacets(data.facets);
				}
			}
		} finally {
			setLoading(false);
		}
	};

	if (loading) return <Spin />;
	if (!category) return <div>{t('categoryPage.notFound')}</div>;

	const handleFiltersChange = (newSelected) => {
		setSelectedFilters(newSelected);
		setPage(1);
	};

	// Обработка смены страницы/размера страницы
	const handleChangePage = (newPage, newPageSize) => {
		setPage(newPage);
		setPageSize(newPageSize);
	};

	return (
		<div>
			<Breadcrumb style={{ marginBottom: 16 }}>
				{breadcrumbs.map((bc) => (
					<Breadcrumb.Item key={bc.slug}>
						<Link to={`/category/${bc.slug}`}>{bc.name}</Link>
					</Breadcrumb.Item>
				))}
			</Breadcrumb>

			<h2>{category.name}</h2>

			<Row gutter={[16, 16]}>
				{/* Левая колонка - Фильтры */}
				<Col xs={24} sm={24} md={8} lg={6} xl={5}>
					<CategoryFilters
						facets={facets}
						selected={selectedFilters}
						onChange={handleFiltersChange}
					/>
				</Col>

				{/* Правая колонка - Список товаров + пагинация */}
				<Col xs={24} sm={24} md={16} lg={18} xl={19}>
					<div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
						{products.map((prod) => (
							<ProductCard key={prod.id} product={prod} />
						))}
					</div>

					{/* Компонент пагинации */}
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
