// src/pages/orders/hooks/useOrderList.js
import { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus } from '../../../api/ordersApi';
import { message } from 'antd';

/**
 * Хук для списка заказов.
 * Принимает:
 *   - serverLang (ru/uk/...)
 *   - role (например 'internal_manager')
 *   - clientFilter (строка)
 *
 * Возвращает:
 *   - orders (Array)
 *   - loading (bool)
 *   - error (null | string)
 *   - loadOrders() (refetch)
 *   - updateOrderStatus(orderId, newState)
 */
export function useOrderList(serverLang, role, clientFilter) {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// При любом изменении lang/role/clientFilter, загружаем заново
	useEffect(() => {
		loadOrders();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [serverLang, role, clientFilter]);

	async function loadOrders() {
		setLoading(true);
		setError(null);
		try {
			const params = { lang: serverLang };
			if (role === 'internal_manager' && clientFilter) {
				params.client = clientFilter;
			}
			const data = await getOrders(params);
			setOrders(data);
		} catch (err) {
			console.error(err);
			setError('Failed to load orders');
			setOrders([]);
		} finally {
			setLoading(false);
		}
	}

	async function handleUpdateStatus(orderId, newState) {
		try {
			const updatedOrder = await updateOrderStatus(orderId, newState);
			message.success(`Order #${orderId} => ${updatedOrder.state}`);
			loadOrders();
		} catch (err) {
			console.error(err);
			message.error('Failed to update order status');
		}
	}

	return {
		orders,
		loading,
		error,
		updateOrderStatus: handleUpdateStatus,
	};
}
