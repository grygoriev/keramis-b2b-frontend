// src/pages/client/CartListPage.jsx
import React, { useState } from 'react';
import { Button, Input, List, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
	useGetCartsQuery,
	useCreateCartMutation,
	useDeleteCartMutation,
} from '../../services/cartApi';
import { LoadingWrapper } from '../../components';

export function CartListPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const [cartName, setCartName] = useState('');

	// Загружаем список carts
	const {
		data: carts,
		error,
		isLoading,
		refetch,
	} = useGetCartsQuery('ru'); // язык, если нужно

	// Мутации
	const [createCart, { isLoading: isCreating }] = useCreateCartMutation();
	const [deleteCart, { isLoading: isDeleting }] = useDeleteCartMutation();

	const handleCreateCart = async () => {
		if (!cartName) return;
		try {
			await createCart(cartName).unwrap();
			message.success(t('cartsPage.created', 'Cart created'));
			setCartName('');
		} catch (err) {
			console.error(err);
			message.error(t('cartsPage.createFailed', 'Failed to create cart'));
		}
	};

	const handleDeleteCart = async (cartId, e) => {
		e.stopPropagation();
		if (!window.confirm(t('cartsPage.deleteConfirm', 'Are you sure?'))) return;
		try {
			await deleteCart(cartId).unwrap();
			message.success(t('cartsPage.deleted', 'Cart deleted'));
		} catch (err) {
			console.error(err);
			message.error(t('cartsPage.deleteFailed', 'Failed to delete cart'));
		}
	};

	function goToCart(cartId) {
		navigate(`/client/carts/${cartId}`);
	}

	return (
		<LoadingWrapper
			loading={isLoading || isCreating || isDeleting}
			error={error ? error.data || error : null}
			data={carts}
		>
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
					<Button onClick={() => refetch()}>
						{t('common.refresh', 'Refresh')}
					</Button>
				</div>

				<List
					itemLayout="horizontal"
					dataSource={carts || []}
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
