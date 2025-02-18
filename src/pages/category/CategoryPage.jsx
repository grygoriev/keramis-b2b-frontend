// src/pages/CategoryPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Spin, Breadcrumb, Card } from 'antd';
import { fetchCategoryDetail } from '../../api/catalogApi.js';
import './CategoryPage.css'; // подключаем стили

export function CategoryPage() {
	const { slug } = useParams();
	const navigate = useNavigate();

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

	const loadCategory = async () => {
		setLoading(true);
		try {
			const data = await fetchCategoryDetail(slug, serverLang);
			setCategory(data.category);
			setBreadcrumbs(data.breadcrumbs);
			setProducts(data.products);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) return <Spin />;
	if (!category) return <div>Category not found</div>;

	// Клик по карточке → переход к /product/:slug
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
								src={
									prod.image_filename
										? `${prod.image_filename}`
										: '/images/no-image.png'
								}
							/>
						}
					>
						<div className="two-lines product-name">{prod.name}</div>
						<div>{prod.price} грн</div>

						<Link to={`/product/${prod.slug}`} onClick={(e) => e.stopPropagation()}>
							Подробнее
						</Link>
					</Card>
				))}
			</div>
		</div>
	);
}
