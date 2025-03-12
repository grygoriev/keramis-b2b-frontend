// src/pages/client/CartListPage.jsx
import React, { useEffect, useState } from 'react';
import { Button, Input, List, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
	fetchCartsAsync,
	createCartAsync,
	deleteCartAsync,
	selectCarts,
	selectCartStatus,
	selectCartError,
} from '../../store/cartSlice';

import { selectCurrentLang } from '../../store/langSlice';
import { transformLangToServer } from '../../utils';
import { LoadingWrapper } from '../../components';

export function CartListPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const currentLang = useSelector(selectCurrentLang);
	const serverLang = transformLangToServer(currentLang);

	const carts = useSelector(selectCarts);
	const cartStatus = useSelector(selectCartStatus);
	const cartError = useSelector(selectCartError);

	const [cartName, setCartName] = useState('');

	useEffect(() => {
		if (cartStatus === 'idle' || cartStatus === 'failed') {
			dispatch(fetchCartsAsync(serverLang));
		}
	}, [dispatch, serverLang, cartStatus]);

	const handleCreateCart = () => {
		if (!cartName) return;
		dispatch(createCartAsync(cartName))
			.unwrap()
			.then(() => {
				message.success(t('cartsPage.created', 'Cart created'));
				setCartName('');
			})
			.catch(() => {
				message.error(t('cartsPage.createFailed', 'Failed to create cart'));
			});
	};

	const handleDeleteCart = (cartId, e) => {
		e.stopPropagation();
		if (!window.confirm(t('cartsPage.deleteConfirm', 'Are you sure?'))) return;
		dispatch(deleteCartAsync(cartId))
			.unwrap()
			.then(() => {
				message.success(t('cartsPage.deleted', 'Cart deleted'));
			})
			.catch(() => {
				message.error(t('cartsPage.deleteFailed', 'Failed to delete cart'));
			});
	};

	function goToCart(cartId) {
		navigate(`/client/carts/${cartId}`);
	}

	return (
		<LoadingWrapper loading={cartStatus === 'loading'} error={cartError} data={carts}>
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
							onClick={() => goToCart(cart.id)}
							actions={[
								<Button
									size="small"
									type="link"
									onClick={(e) => {
										e.stopPropagation();
										goToCart(cart.id);
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
		</LoadingWrapper>
	);
}
