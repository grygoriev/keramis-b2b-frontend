// src/components/AddToCartButton.jsx
import React, { useState } from 'react';
import { Button, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCartAsync } from '../store/cartSlice';
import { CartModal } from './CartModal';
import { useTranslation } from 'react-i18next';

export function AddToCartButton({ productId }) {
	const { t } = useTranslation();
	const dispatch = useDispatch();

	// Берём информацию о логине из state.auth
	const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

	const { activeCartId, carts } = useSelector((state) => state.cart);
	const [showCartModal, setShowCartModal] = useState(false);
	const [pendingProductId, setPendingProductId] = useState(null);

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

	const handleAddToCart = (e) => {
		e.stopPropagation();

		// 1) Если пользователь НЕ залогинен — показываем предупреждение
		if (!isLoggedIn) {
			message.error(t('cart.authRequired', 'Необходимо авторизоваться или зарегистрироваться'));
			return;
		}

		// 2) Если нет активной корзины или список корзин пуст – показать модалку выбора
		if (!activeCartId || !carts || carts.length === 0) {
			setPendingProductId(productId);
			setShowCartModal(true);
			return;
		}

		// 3) Иначе добавляем в активную корзину
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
		<>
			<Button type="primary" size="small" onClick={handleAddToCart}>
				{t('common.addToCart')}
			</Button>
			<CartModal
				visible={showCartModal}
				onClose={handleCloseModal}
				onCartSelected={handleCartSelected}
			/>
		</>
	);
}
