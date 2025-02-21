// src/pages/CategoryPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Spin, Breadcrumb, message } from 'antd';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { fetchCategoryDetail } from '../../api/catalogApi';
import { fetchCartsAsync } from '../../store/cartSlice';
import { ProductCard } from '../../components'; // <-- импортируем новый компонент
import './CategoryPage.css';

export function CategoryPage() {
	const { slug } = useParams();
	const dispatch = useDispatch();
	const { t } = useTranslation();

	const [category, setCategory] = useState(null);
	const [breadcrumbs, setBreadcrumbs] = useState([]);
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);

	const storedLang = localStorage.getItem('lang') || 'ru';
	const serverLang = storedLang === 'ua' ? 'uk' : storedLang;

	useEffect(() => {
		loadCategory();
	}, [slug, serverLang]);

	useEffect(() => {
		dispatch(fetchCartsAsync());
	}, [dispatch]);

	const loadCategory = async () => {
		setLoading(true);
		try {
			const data = await fetchCategoryDetail(slug, serverLang);
			if (!data.category) {
				message.error(t('categoryPage.notFound'));
			} else {
				setCategory(data.category);
				setBreadcrumbs(data.breadcrumbs);
				setProducts(data.products);
			}
		} finally {
			setLoading(false);
		}
	};

	if (loading) return <Spin />;
	if (!category) return <div>{t('categoryPage.notFound')}</div>;

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

			<div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
				{products.map((prod) => (
					<ProductCard key={prod.id} product={prod} />
				))}
			</div>
		</div>
	);
}
