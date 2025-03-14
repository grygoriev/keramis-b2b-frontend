// src/pages/client/CartPage.jsx
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button, List, Space, message } from 'antd';
import { useTranslation } from 'react-i18next';

import {
	useGetCartsQuery,
	useUpdateCartItemMutation,
	useDeleteCartItemMutation,
	useCheckoutCartMutation,
} from '../../services/cartApi';

import { LoadingWrapper } from '../../components';
import { getDashboardPath } from '../../utils';
import { useSelector } from 'react-redux';
import { selectUserRole } from '../../store/authSlice';

export function CartPage() {
	const { cartId } = useParams();
	const { t } = useTranslation();
	const navigate = useNavigate();

	// Роль пользователя (чтобы определить redirect)
	const role = useSelector(selectUserRole);
	const dashboard = getDashboardPath(role);

	// Грузим все корзины (или сделайте отдельный getCartById endpoint)
	const { data: carts, error, isLoading, refetch } = useGetCartsQuery('ru');

	// Находим нужную корзину
	const cart = carts?.find((c) => c.id === Number(cartId));

	// Мутации
	const [updateCartItem, { isLoading: isUpdating }] = useUpdateCartItemMutation();
	const [deleteCartItem, { isLoading: isDeleting }] = useDeleteCartItemMutation();
	const [checkoutCart, { isLoading: isCheckout }] = useCheckoutCartMutation();

	const handleIncrement = async (item) => {
		try {
			await updateCartItem({ itemId: item.id, quantity: item.quantity + 1 }).unwrap();
			message.success(t('common.quantityUpdated', 'Quantity updated'));
		} catch {
			message.error(t('common.failedToUpdateQuantity', 'Failed to update quantity'));
		}
	};

	const handleDecrement = async (item) => {
		if (item.quantity > 1) {
			try {
				await updateCartItem({ itemId: item.id, quantity: item.quantity - 1 }).unwrap();
				message.success(t('common.quantityUpdated'));
			} catch {
				message.error(t('common.failedToUpdateQuantity'));
			}
		} else {
			handleDeleteItem(item.id);
		}
	};

	const handleDeleteItem = async (itemId) => {
		try {
			await deleteCartItem(itemId).unwrap();
			message.success(t('common.itemRemoved', 'Item removed'));
		} catch {
			message.error(t('common.failedToDeleteItem', 'Failed to delete item'));
		}
	};

	const handleCheckout = async () => {
		if (!cart) return;
		try {
			const resp = await checkoutCart(cart.id).unwrap();
			// resp = { order, cartId }, зависит от вашего кода
			if (resp.order) {
				message.success(t('common.orderCreated', `Заказ #${resp.order?.id} создан!`));
				navigate(`${dashboard}/my-orders`);
			}
		} catch {
			message.error(t('common.checkoutFailed', 'Checkout failed'));
		}
	};

	return (
		<LoadingWrapper
			loading={isLoading || isCheckout}
			error={error ? error.data || error : null}
			data={cart}
		>
			<div style={{ padding: 16 }}>
				<h2>
					{t('common.cartTitle', 'Корзина')}: {cart?.name}
				</h2>
				<p>ID: {cart?.id}</p>

				<List
					dataSource={cart?.items || []}
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
									<Button danger size="small" onClick={() => handleDeleteItem(item.id)}>
										{t('common.remove', 'Удалить')}
									</Button>
								</Space>,
							]}
						>
							<List.Item.Meta
								title={<Link to={`/product/${item.product_url}`}>{item.product_name}</Link>}
								description={
									<div>
										{t('common.quantity', 'Количество')}: <b>{item.quantity}</b>
									</div>
								}
							/>
						</List.Item>
					)}
				/>

				<div style={{ marginTop: 16 }}>
					<Button
						type="primary"
						onClick={handleCheckout}
						disabled={!cart || cart.items.length === 0}
					>
						{t('common.checkout', 'Оформить заказ')}
					</Button>
				</div>
			</div>
		</LoadingWrapper>
	);
}
