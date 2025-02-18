// src/components/header/cart/CartIcon.jsx
import React, { useState } from 'react';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Popover, List, Button, Divider } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setActiveCart } from '../../../store/cartSlice';
import { useTranslation } from 'react-i18next';

export function CartIcon() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { t } = useTranslation();

	// Берём carts и activeCartId из Redux
	const { carts, activeCartId } = useSelector((state) => state.cart);

	// Находим активную корзину
	const activeCart = carts.find((c) => c.id === activeCartId);

	// Чтобы показывать Popover при hover
	const [visible, setVisible] = useState(false);

	const handleVisibleChange = (newVisible) => {
		setVisible(newVisible);
	};

	const handleSelectCart = (cartId) => {
		dispatch(setActiveCart(cartId));
		setVisible(false);
	};

	const goToCartList = () => {
		navigate('/carts');
		setVisible(false);
	};

	const popoverContent = (
		<div style={{ minWidth: 200 }}>
			<div style={{ fontWeight: 'bold', marginBottom: 6 }}>
				{activeCart
					? t('common.activeCart', { cartName: activeCart.name })
					: t('common.noActiveCart')
				}
			</div>

			<Divider style={{ margin: '8px 0' }} />

			<div style={{ marginBottom: 6 }}>
				{t('common.allCartsList')}
			</div>
			<List
				size="small"
				dataSource={carts}
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

			<div style={{ marginBottom: 6 }}>
				{t('common.productsInActiveCart')}
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
					{activeCart ? t('common.emptyCart') : t('common.noCart')}
				</div>
			)}

			<Divider style={{ margin: '8px 0' }} />
			<Button
				type="link"
				onClick={goToCartList}
				style={{ padding: 0 }}
			>
				{t('common.goToCartList')}
			</Button>
		</div>
	);

	return (
		<Popover
			content={popoverContent}
			trigger="hover"
			visible={visible}
			onVisibleChange={handleVisibleChange}
			placement="bottomRight"
		>
			<div style={{ cursor: 'pointer' }}>
				<ShoppingCartOutlined style={{ fontSize: 24 }} />
			</div>
		</Popover>
	);
}
