// src/pages/ProductPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spin, Breadcrumb } from 'antd';
import { fetchProductDetail } from '../api/catalogApi';

export function ProductPage() {
	const { slug } = useParams();
	const [product, setProduct] = useState(null);
	const [breadcrumbs, setBreadcrumbs] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		loadProduct();
	}, [slug]);

	const loadProduct = async () => {
		setLoading(true);
		try {
			const data = await fetchProductDetail(slug);
			setProduct(data.product);
			setBreadcrumbs(data.breadcrumbs);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) return <Spin />;
	if (!product) return <div>Product not found</div>;

	return (
		<div style={{ padding: 16 }}>
			{/* Пример хлебных крошек */}
			<Breadcrumb style={{ marginBottom: 16 }}>
				{breadcrumbs.map((bc) => (
					<Breadcrumb.Item key={bc.slug}>
						<a href={`/category/${bc.slug}`}>{bc.name}</a>
					</Breadcrumb.Item>
				))}
			</Breadcrumb>

			<h2>{product.name}</h2>
			{/* ... остальная логика, фото, описание ... */}
			{/* Если нет image_filename - используем заглушку */}
			<img
				style={{ width: 300, height: 300 }}
				alt={product.name}
				src={
					product.image_filename
						? `http://localhost:8000/media/products/${product.image_filename}`
						: '/images/no-image.png'
				}
			/>
		</div>
	);
}
