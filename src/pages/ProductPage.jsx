// src/pages/ProductPage.jsx
import React, { useEffect, useState } from 'react';
import { Spin, Breadcrumb, Carousel, Image, Button, message } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchCartsAsync, addItemToCartAsync } from '../store/cartSlice';
import { CartModal } from '../components/CartModal';
import { fetchProductDetail } from '../api/catalogApi';

export function ProductPage() {
	const { slug } = useParams();
	const dispatch = useDispatch();
	const { activeCartId } = useSelector((state) => state.cart);
	const { t } = useTranslation(); // <-- i18n

	const [product, setProduct] = useState(null);
	const [breadcrumbs, setBreadcrumbs] = useState([]);
	const [loading, setLoading] = useState(false);

	const [showCartModal, setShowCartModal] = useState(false);
	const [pendingProductId, setPendingProductId] = useState(null);

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

	const doAddItemToCart = async (cartId, productId) => {
		try {
			await dispatch(addItemToCartAsync({ cartId, productId, quantity: 1 })).unwrap();
			message.success(t('productPage.added', 'Товар добавлен в корзину!'));
		} catch (err) {
			console.error(err);
			message.error(t('productPage.addError', 'Ошибка добавления'));
		}
	};

	const handleAddToCart = () => {
		if (!activeCartId) {
			setPendingProductId(product.id);
			setShowCartModal(true);
			return;
		}
		doAddItemToCart(activeCartId, product.id);
	};

	const handleCartSelected = (cartId) => {
		setShowCartModal(false);
		if (pendingProductId) {
			doAddItemToCart(cartId, pendingProductId);
		}
		setPendingProductId(null);
	};

	const handleCloseModal = () => {
		setShowCartModal(false);
		setPendingProductId(null);
	};

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

			<div>
				{t('common.price', 'Цена')}: {product.price} грн
			</div>
			<div>{product.description}</div>

			<Button type="primary" style={{ marginTop: 16 }} onClick={handleAddToCart}>
				{t('common.addToCart', 'В корзину')}
			</Button>

			<CartModal
				visible={showCartModal}
				onClose={handleCloseModal}
				onCartSelected={handleCartSelected}
			/>
		</div>
	);
}
