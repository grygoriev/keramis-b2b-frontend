// src/components/header/cart/CartIcon.jsx
import React, { useState } from 'react';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Popover, List, Button, Divider, Spin } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// RTK Query
import { useGetCartsQuery } from '../../../../services';
import { selectActiveCartId, setActiveCart } from '../../../../store/cartUiSlice.js';
import { selectIsLoggedIn } from '../../../../store/authSlice.js';

// cartUiSlice (хранит activeCartId)


/**
 * Иконка корзины в хедере.
 * - Загружаем список корзин через useGetCartsQuery (skip: если не залогинен).
 * - Активную корзину берём из cartUiSlice (activeCartId).
 * - При выборе другой корзины → setActiveCart(cartId).
 * - Показ товаров активной корзины внутри popover.
 */
export function CartIcon() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { t } = useTranslation();

	// Проверяем, авторизован ли пользователь
	const isLoggedIn = useSelector(selectIsLoggedIn);

	// Активная корзина (ID) из UI slice
	const activeCartId = useSelector(selectActiveCartId);

	// Грузим все корзины (или skip, если не залогинены)
	const { data: carts, isLoading, error } = useGetCartsQuery('ru', {
		skip: !isLoggedIn,
	});

	// Если не залогинены или ошибка загрузки – массив пустой
	const allCarts = (!isLoggedIn || error || !carts) ? [] : carts;

	// Ищем активную корзину
	const activeCart = allCarts.find((c) => c.id === activeCartId);

	// Popover управление
	const [open, setOpen] = useState(false);
	const handleOpenChange = (newOpen) => {
		setOpen(newOpen);
	};

	// Смена активной корзины
	const handleSelectCart = (cartId) => {
		dispatch(setActiveCart(cartId));
		setOpen(false);
	};

	const goToCartList = () => {
		navigate('/client/carts'); // или просто '/carts', если так у вас
		setOpen(false);
	};

	// Содержимое Popover
	const popoverContent = (
		<div style={{ minWidth: 200 }}>
			{/* Если идёт загрузка */}
			{isLoading && (
				<div style={{ marginBottom: 8 }}>
					<Spin size="small" /> {t('common.loading', 'Загрузка корзин...')}
				</div>
			)}

			{/* Если нет корзин */}
			{!isLoading && allCarts.length === 0 && (
				<div style={{ color: '#888', marginBottom: 8 }}>
					{t('common.noCarts', 'Нет корзин')}
				</div>
			)}

			{/* Текущая активная корзина */}
			<div style={{ fontWeight: 'bold', marginBottom: 6 }}>
				{activeCart
					? t('common.activeCart', { cartName: activeCart.name })
					: t('common.noActiveCart', 'Активная корзина не выбрана')}
			</div>

			<Divider style={{ margin: '8px 0' }} />

			{/* Список всех корзин */}
			<div style={{ marginBottom: 6 }}>{t('common.allCartsList', 'Все корзины')}:</div>
			<List
				size="small"
				dataSource={allCarts}
				renderItem={(cart) => (
					<List.Item
						onClick={() => handleSelectCart(cart.id)}
						style={{
							cursor: 'pointer',
							fontWeight: cart.id === activeCartId ? 'bold' : 'normal',
						}}
					>
						{cart.name}
					</List.Item>
				)}
			/>

			<Divider style={{ margin: '8px 0' }} />

			{/* Товары в активной корзине */}
			<div style={{ marginBottom: 6 }}>
				{t('common.productsInActiveCart', 'Товары в активной корзине')}:
			</div>
			{activeCart && activeCart.items.length > 0 ? (
				<List
					size="small"
					dataSource={activeCart.items}
					renderItem={(item) => (
						<List.Item style={{ fontSize: 12 }}>
							{item.quantity} x {item.product_name}
						</List.Item>
					)}
				/>
			) : (
				<div style={{ fontSize: 12, color: '#888' }}>
					{activeCart
						? t('common.emptyCart', 'Корзина пуста')
						: t('common.noCartSelected', 'Нет активной корзины')}
				</div>
			)}

			<Divider style={{ margin: '8px 0' }} />
			<Button type="link" onClick={goToCartList} style={{ padding: 0 }}>
				{t('common.goToCartList', 'Перейти к корзинам')}
			</Button>
		</div>
	);

	// Если не залогинены – иконка может быть неактивна или пустая
	if (!isLoggedIn) {
		return null; // или верните простую иконку без popover
	}

	return (
		<Popover
			content={popoverContent}
			trigger="hover"
			open={open}
			onOpenChange={handleOpenChange}
			placement="bottomRight"
		>
			<div style={{ cursor: 'pointer' }}>
				<ShoppingCartOutlined style={{ fontSize: 24 }} />
			</div>
		</Popover>
	);
}
