// src/pages/CartPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
	getCarts,
	deleteCartItem,
	updateCartItem
} from '../api/cartApi';
import { checkoutCart } from '../api/ordersApi'; // <-- импортируем функцию чекаута
import { Spin, List, Button, message, Space } from 'antd';
import { useTranslation } from 'react-i18next';

export function CartPage() {
	const { cartId } = useParams();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [cart, setCart] = useState(null);
	const [loading, setLoading] = useState(false);

	// Язык
	const storedLang = localStorage.getItem('lang') || 'ru';
	const serverLang = storedLang === 'ua' ? 'uk' : storedLang;

	useEffect(() => {
		loadCart();
		// eslint-disable-next-line
	}, [cartId, serverLang]);

	const loadCart = async () => {
		setLoading(true);
		try {
			const carts = await getCarts(serverLang);
			const c = carts.find((x) => x.id === parseInt(cartId));
			if (!c) {
				message.error(t('common.cartFoundError', 'Корзина не найдена'));
			} else {
				setCart(c);
			}
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteItem = async (itemId) => {
		try {
			await deleteCartItem(itemId);
			message.success(t('common.itemRemoved', 'Товар удален'));
			loadCart();
		} catch (err) {
			console.error(err);
			message.error(t('common.failedToDeleteItem', 'Не удалось удалить товар'));
		}
	};

	const handleQuantityChange = async (item, newQty) => {
		if (newQty < 1) {
			message.warning(t('common.quantityLessWarning', 'Количество не может быть меньше 1'));
			return;
		}
		try {
			await updateCartItem(item.id, newQty);
			message.success(t('common.quantityUpdated', 'Количество обновлено'));
			loadCart();
		} catch (err) {
			console.error(err);
			message.error(t('common.failedToUpdateQuantity', 'Не удалось обновить количество'));
		}
	};

	const handleIncrement = (item) => {
		handleQuantityChange(item, item.quantity + 1);
	};

	const handleDecrement = (item) => {
		handleQuantityChange(item, item.quantity - 1);
	};

	// оформить заказ (Checkout)
	const handleCheckout = async () => {
		if (!cart) return;
		try {
			const order = await checkoutCart(cart.id); // {id, state, total, ...}
			message.success(t('common.orderCreated', `Заказ #${order.id} создан!`));
			// После успешного оформления → переходим на список заказов
			navigate('/my-orders');
			// Или если хотите более конкретно: navigate(`/my-orders/${order.id}`)
		} catch (err) {
			console.error(err);
			message.error(t('common.checkoutFailed', 'Не удалось оформить заказ'));
		}
	};

	if (loading) return <Spin />;
	if (!cart) return <div>{t('common.cartNotFound')}</div>;

	return (
		<div style={{ padding: 16 }}>
			<h2>{t('common.cartTitle', 'Корзина')}: {cart.name}</h2>
			<p>{t('common.id')}: {cart.id}</p>

			<List
				dataSource={cart.items}
				renderItem={(item) => (
					<List.Item
						actions={[
							<Space>
								<Button size="small" onClick={() => handleDecrement(item)}>
									-
								</Button>
								<Button size="small" onClick={() => handleIncrement(item)}>
									+
								</Button>
								<Button danger onClick={() => handleDeleteItem(item.id)}>
									{t('common.remove', 'Удалить')}
								</Button>
							</Space>,
						]}
					>
						<List.Item.Meta
							title={
								<Link to={`/product/${item.product_url}/`}>
									{item.product_name}
								</Link>
							}
							description={
								<div>
									{t('common.quantity', 'Количество')}: <b>{item.quantity}</b>
								</div>
							}
						/>
					</List.Item>
				)}
			/>

			{/* Кнопка "Оформить заказ" */}
			<div style={{ marginTop: 16 }}>
				<Button type="primary" onClick={handleCheckout}>
					{t('common.checkout', 'Оформить заказ')}
				</Button>
			</div>
		</div>
	);
}
