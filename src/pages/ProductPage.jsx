import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spin, Breadcrumb, Carousel, Image } from 'antd';
import { fetchProductDetail } from '../api/catalogApi';
import { EyeOutlined } from '@ant-design/icons';

export function ProductPage() {
	const { slug } = useParams();
	const [product, setProduct] = useState(null);
	const [breadcrumbs, setBreadcrumbs] = useState([]);
	const [loading, setLoading] = useState(false);

	// ...

	useEffect(() => {
		loadProduct();
	}, [slug]);

	const loadProduct = async () => {
		setLoading(true);
		try {
			const data = await fetchProductDetail(slug);
			setProduct(data.product);
			setBreadcrumbs(data.breadcrumbs);
		} finally {
			setLoading(false);
		}
	};

	if (loading) return <Spin />;
	if (!product) return <div>Product not found</div>;

	const { images = [], image_filename } = product;

	return (
		<div>
			<Breadcrumb style={{ marginBottom: 16 }}>
				{breadcrumbs.map((bc) => (
					<Breadcrumb.Item key={bc.slug}>
						<a href={`/category/${bc.slug}`}>{bc.name}</a>
					</Breadcrumb.Item>
				))}
			</Breadcrumb>

			<h2>{product.name}</h2>

			{images.length > 1 ? (
				// Обёртываем карусель в PreviewGroup, чтобы все изображения были в одной галерее
				<Image.PreviewGroup>
					<Carousel arrows style={{ width: 300, marginBottom: 16 }}>
						{images.map((imgObj) => (
							<div key={imgObj.url}>
								<Image
									src={imgObj.url || '/images/no-image.png'}
									alt=""
									style={{ maxWidth: '300px', maxHeight: '300px' }}
									preview={{
										mask: <EyeOutlined style={{ fontSize: 24, color: '#fff' }} />,
									}}
								/>
							</div>
						))}
					</Carousel>
				</Image.PreviewGroup>
			) : (
				// Если только одно или нет картинок
				<Image
					style={{ width: 300, height: 300, objectFit: 'cover', marginBottom: 16 }}
					src={
						images.length === 1
							? images[0].url
							: image_filename
								? image_filename
								: '/images/no-image.png'
					}
					alt={product.name}
					preview={{
						mask: <EyeOutlined style={{ fontSize: 24, color: '#fff' }} />,
					}}
				/>
			)}

			<div>Цена: {product.price} грн</div>
			<div>{product.description}</div>
		</div>
	);
}
