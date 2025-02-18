// src/pages/CategoryPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
	Spin,
	Breadcrumb,
	Card,
	Button,
	message,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next'; // <-- импортируем хук
import { fetchCategoryDetail } from '../../api/catalogApi';
import {
	addItemToCartAsync,
	fetchCartsAsync,
} from '../../store/cartSlice';
import { CartModal } from '../../components/CartModal';
import './CategoryPage.css';

export function CategoryPage() {
	const { slug } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { t } = useTranslation(); // <-- получаем функцию t()

	const { activeCartId } = useSelector((state) => state.cart);

	const [category, setCategory] = useState(null);
	const [breadcrumbs, setBreadcrumbs] = useState([]);
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);

	// Модалка
	const [showCartModal, setShowCartModal] = useState(false);
	const [pendingProductId, setPendingProductId] = useState(null);

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

	const doAddItemToCart = async (cartId, productId) => {
		try {
			await dispatch(
				addItemToCartAsync({ cartId, productId, quantity: 1 })
			).unwrap();
			message.success(t('common.productAdded'));
		} catch (err) {
			console.error(err);
			message.error(t('common.productAddError'));
		}
	};

	const handleAddToCart = (e, productId) => {
		e.stopPropagation();
		if (!activeCartId) {
			setPendingProductId(productId);
			setShowCartModal(true);
			return;
		}
		doAddItemToCart(activeCartId, productId);
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
							<Button
								type="primary"
								size="small"
								onClick={(e) => handleAddToCart(e, prod.id)}
							>
								{t('common.addToCart')}
							</Button>
						</div>
					</Card>
				))}
			</div>

			<CartModal
				visible={showCartModal}
				onClose={handleCloseModal}
				onCartSelected={handleCartSelected}
			/>
		</div>
	);
}
