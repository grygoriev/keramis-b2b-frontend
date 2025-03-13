import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button, List, Space, Spin, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import {
	selectCartById,
	updateCartItemAsync,
	deleteCartItemAsync,
	checkoutCartAsync, selectCartStatus, selectCartError,
} from '../../store/cartSlice';

import { selectUserRole } from '../../store/authSlice';
import { getDashboardPath } from '../../utils';
import { LoadingWrapper } from '../../components';

export function CartPage() {
	const { cartId } = useParams();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const dispatch = useDispatch();

	const role = useSelector(selectUserRole);
	const dashboard = getDashboardPath(role);

	const cartStatus = useSelector(selectCartStatus);
	const cartError = useSelector(selectCartError);

	const cart = useSelector((state) => {
		const cId = Number(cartId);
		return selectCartById(state, cId);
	});

	const handleIncrement = (item) => {
		dispatch(updateCartItemAsync({ itemId: item.id, quantity: item.quantity + 1 }))
			.unwrap()
			.then(() => message.success(t('common.quantityUpdated')))
			.catch(() => message.error(t('common.failedToUpdateQuantity')));
	};

	const handleDecrement = (item) => {
		if (item.quantity > 1) {
			dispatch(updateCartItemAsync({ itemId: item.id, quantity: item.quantity - 1 }))
				.unwrap()
				.then(() => message.success(t('common.quantityUpdated')))
				.catch(() => message.error(t('common.failedToUpdateQuantity')));
		} else {
			handleDeleteItem(item.id);
		}
	};

	const handleDeleteItem = (itemId) => {
		dispatch(deleteCartItemAsync(itemId))
			.unwrap()
			.then(() => message.success(t('common.itemRemoved')))
			.catch(() => message.error(t('common.failedToDeleteItem')));
	};

	const handleCheckout = () => {
		dispatch(checkoutCartAsync(cart.id))
			.unwrap()
			.then(({ order }) => {
				if (order) {
					message.success(
						t('common.orderCreated', `Заказ #${order?.id} создан!`),
					);
					navigate(`${dashboard}/my-orders`);
				}
			})
			.catch(() => message.error(t('common.checkoutFailed')));
	};

	return (
		<LoadingWrapper loading={cartStatus === 'loading'} error={cartError} data={cart}>
		<div style={{ padding: 16 }}>
			<h2>{t('common.cartTitle', 'Корзина')}: {cart?.name}</h2>
			<p>ID: {cart?.id}</p>

			<List
				dataSource={cart?.items}
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
							title={
								<Link to={`/product/${item.product_url}`}>
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

			<div style={{ marginTop: 16 }}>
				<Button
					type="primary"
					onClick={handleCheckout}
					disabled={cart?.items.length === 0}
				>
					{t('common.checkout', 'Оформить заказ')}
				</Button>
			</div>
		</div>
		</LoadingWrapper>
	);
}
