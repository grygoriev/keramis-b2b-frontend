// src/pages/ProductPage.jsx
import React, { useEffect, useState } from 'react';
import { Spin, Breadcrumb, Carousel, Image, message } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchCartsAsync } from '../../store/cartSlice';
import { AddToCartButton, PriceBlock } from '../../components';
import { StockInfo } from './components';
import { fetchProductDetail } from '../../api/catalogApi';

export function ProductPage() {
	const { slug } = useParams();
	const dispatch = useDispatch();
	const { t } = useTranslation();

	const [product, setProduct] = useState(null);
	const [breadcrumbs, setBreadcrumbs] = useState([]);
	const [loading, setLoading] = useState(false);

	const storedLang = localStorage.getItem('lang') || 'ru';
	const serverLang = storedLang === 'ua' ? 'uk' : storedLang;

	useEffect(() => {
		loadProduct();
	}, [slug, serverLang]);

	useEffect(() => {
		dispatch(fetchCartsAsync());
	}, [dispatch]);

	const loadProduct = async () => {
		setLoading(true);
		try {
			const data = await fetchProductDetail(slug, serverLang);
			if (!data.product) {
				message.error(t('productPage.notFound'));
			} else {
				setProduct(data.product);
				setBreadcrumbs(data.breadcrumbs);
			}
		} finally {
			setLoading(false);
		}
	};

	if (loading) return <Spin />;
	if (!product) return <div>{t('productPage.notFound')}</div>;

	const { images = [], image_filename } = product;

	return (
		<div>
			<Breadcrumb style={{ marginBottom: 16 }}>
				{breadcrumbs.map((bc) => (
					<Breadcrumb.Item key={bc.slug}>
						<Link to={`/category/${bc.slug}`}>{bc.name}</Link>
					</Breadcrumb.Item>
				))}
			</Breadcrumb>

			<div style={{ display: 'flex', gap: 24 }}>
				{/* Левая колонка (картинки) */}
				<div style={{ width: 320 }}>
					{/* Если несколько картинок, показываем слайдер */}
					{images.length > 1 ? (
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
				</div>

				{/* Правая колонка (информация) */}
				<div style={{ flex: 1 }}>
					<h2>{product.name}</h2>

					{/* Блок с ценами */}
					<PriceBlock
						price={product.price}
						discountedPrice={product.discounted_price}
					/>

					<div style={{ marginTop: 16, marginBottom: 16 }}>
						{product.description}
					</div>

					{/* Кнопка добавить в корзину */}
					<div style={{ marginBottom: 16 }}>
						<AddToCartButton productId={product.id} />
					</div>

					{/* Компонент с остатками и единицами измерения */}
					<StockInfo unit={product.unit_of_measure} stocks={product.stocks} />
				</div>
			</div>
		</div>
	);
}
