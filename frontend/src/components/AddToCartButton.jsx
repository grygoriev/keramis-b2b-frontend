// src/components/AddToCartButton.jsx
import React, { useState } from 'react';
import { Button, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import {
	useGetCartsQuery,
	useAddItemToCartMutation,
} from '../services/cartApi';
import { selectActiveCartId, setActiveCart } from '../store/cartUiSlice';
import { CartModal } from './CartModal';
import { selectIsLoggedIn } from '../store/authSlice.js';

export function AddToCartButton({ productId }) {
	const { t } = useTranslation();
	const dispatch = useDispatch();

	const isLoggedIn = useSelector(selectIsLoggedIn);
	const activeCartId = useSelector(selectActiveCartId);

	// Грузим списки корзин, если логин есть
	const { data: carts } = useGetCartsQuery('ru', {
		skip: !isLoggedIn,
	});

	// Мутация
	const [addItemToCart] = useAddItemToCartMutation();

	const [showCartModal, setShowCartModal] = useState(false);
	const [pendingProductId, setPendingProductId] = useState(null);

	const doAddItemToCart = async (cartId, productId) => {
		try {
			await addItemToCart({ cartId, productId, quantity: 1 }).unwrap();
			message.success(t('common.productAdded', 'Товар добавлен'));
		} catch (err) {
			console.error(err);
			message.error(t('common.productAddError', 'Ошибка добавления товара'));
		}
	};

	const handleAddToCart = (e) => {
		e.stopPropagation();
		if (!isLoggedIn) {
			message.error(t('cart.authRequired', 'Необходимо авторизоваться'));
			return;
		}
		if (!carts || carts.length === 0) {
			// Нет корзин – открываем модалку
			setPendingProductId(productId);
			setShowCartModal(true);
			return;
		}
		// Иначе добавляем в "активную" корзину
		doAddItemToCart(activeCartId, productId);
	};

	const handleCartSelected = (cartId) => {
		setShowCartModal(false);
		dispatch(setActiveCart(cartId)); // Запомним "активная" в slice
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
				{t('common.addToCart', 'В корзину')}
			</Button>
			<CartModal
				visible={showCartModal}
				onClose={handleCloseModal}
				onCartSelected={handleCartSelected}
				isLoggedIn={isLoggedIn}
			/>
		</>
	);
}
