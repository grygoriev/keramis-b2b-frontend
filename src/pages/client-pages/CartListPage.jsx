// src/pages/CartListPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	getCarts,
	createCart,
	deleteCart,       // <-- импортируем
} from '../../api/cartApi.js';
import { Button, Spin, Input, List, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

export function CartListPage() {
	const { t } = useTranslation();
	const [carts, setCarts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [cartName, setCartName] = useState('');
	const navigate = useNavigate();

	useEffect(() => {
		loadCarts();
	}, []);

	const loadCarts = async () => {
		setLoading(true);
		try {
			const data = await getCarts();
			setCarts(data);
		} catch (err) {
			// console.error(err);
			message.error('Failed to load carts');
		} finally {
			setLoading(false);
		}
	};

	const handleCreateCart = async () => {
		if (!cartName) return;
		try {
			const newCart = await createCart(cartName);
			message.success('Cart created');
			setCartName('');
			setCarts([...carts, newCart]);
		} catch (err) {
			console.error(err);
			message.error('Failed to create cart');
		}
	};

	const handleGoToCart = (cartId) => {
		navigate(`/client/carts/${cartId}`);
	};

	/** Удаление корзины */
	const handleDeleteCart = async (cartId, e) => {
		// чтобы не срабатывало onClick на всю строку
		e.stopPropagation();

		// Можно спросить подтверждение
		if (!window.confirm('Are you sure you want to delete this cart?')) {
			return;
		}

		try {
			await deleteCart(cartId);
			message.success('Cart deleted');
			// Убираем из локального стейта
			setCarts(carts.filter((c) => c.id !== cartId));
		} catch (err) {
			console.error(err);
			message.error('Failed to delete cart');
		}
	};

	if (loading) return <Spin />;

	return (
		<div style={{ padding: 16 }}>
			<h2>{t('cartsPage.title', 'Your Carts')}</h2>

			<div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
				<Input
					placeholder={t('cartsPage.newCartName', 'New Cart Name')}
					value={cartName}
					onChange={(e) => setCartName(e.target.value)}
					style={{ width: 200 }}
				/>
				<Button
					type="primary"
					icon={<PlusOutlined />}
					onClick={handleCreateCart}
				>
					{t('cartsPage.create', 'Create')}
				</Button>
			</div>

			<List
				itemLayout="horizontal"
				dataSource={carts}
				renderItem={(cart, index) => (
					<List.Item
						key={cart.id}
						style={{ cursor: 'pointer' }}
						onClick={() => handleGoToCart(cart.id)}
						actions={[
							<Button
								size="small"
								type="link"
								onClick={(e) => {
									e.stopPropagation();
									handleGoToCart(cart.id);
								}}
							>
								{t('cartsPage.open', 'Open')}
							</Button>,
							<Button
								danger
								size="small"
								type="link"
								onClick={(e) => handleDeleteCart(cart.id, e)}
							>
								{t('cartsPage.delete', 'Delete')}
							</Button>,
						]}
					>
						<List.Item.Meta
							avatar={
								<div
									style={{
										width: 32,
										height: 32,
										backgroundColor: '#eee',
										borderRadius: '50%',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontWeight: 'bold',
									}}
								>
									{index + 1}
								</div>
							}
							title={<b>{cart.name}</b>}
							description={<small>ID: {cart.id}</small>}
						/>
					</List.Item>
				)}
			/>
		</div>
	);
}
