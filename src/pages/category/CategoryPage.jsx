// src/pages/CategoryPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Spin, Breadcrumb, Card, message } from 'antd';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchCategoryDetail } from '../../api/catalogApi';
import { fetchCartsAsync } from '../../store/cartSlice';
import { AddToCartButton } from '../../components';
import './CategoryPage.css';

export function CategoryPage() {
	const { slug } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { t } = useTranslation();

	const [category, setCategory] = useState(null);
	const [breadcrumbs, setBreadcrumbs] = useState([]);
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);

	// Язык
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

	const handleCardClick = (productSlug) => {
		navigate(`/product/${productSlug}`);
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

			<div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
				{products.map((prod) => (
					<Card
						key={prod.id}
						hoverable
						onClick={() => handleCardClick(prod.slug)}
						className="product-card"
						style={{ width: 200 }}
						cover={
							<img
								alt={prod.name}
								src={prod.image_filename ? prod.image_filename : '/images/no-image.png'}
							/>
						}
					>
						<div className="two-lines product-name">{prod.name}</div>
						<div>
							{t('common.price', 'Цена')}: {prod.price} грн
						</div>

						<div style={{ marginTop: 8 }}>
							<AddToCartButton productId={prod.id} />
						</div>
					</Card>
				))}
			</div>
		</div>
	);
}
