// src/pages/CategoryPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Spin, Breadcrumb, Card } from 'antd';
import { fetchCategoryDetail } from '../api/catalogApi';

export function CategoryPage() {
	const { slug } = useParams();
	const [category, setCategory] = useState(null);
	const [breadcrumbs, setBreadcrumbs] = useState([]);
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		loadCategory();
	}, [slug]);

	const loadCategory = async () => {
		setLoading(true);
		try {
			const data = await fetchCategoryDetail(slug);
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

	return (
		<div style={{ padding: 16 }}>
			{/* Хлебные крошки */}
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
						style={{ width: 200 }}
						cover={
							<img
								alt={prod.name}
								src={
									prod.image_filename
										? `http://localhost:8000/media/products/${prod.image_filename}`
										: '/images/no-image.png'
								}
							/>
						}
					>
						<Card.Meta title={prod.name} description={`${prod.price} грн`} />
						<Link to={`/product/${prod.slug}`}>Подробнее</Link>
					</Card>
				))}
			</div>
		</div>
	);
}
