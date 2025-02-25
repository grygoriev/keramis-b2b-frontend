// src/pages/orders/components/orders/OrderList.jsx
import React from 'react';
import { OrderCard } from './components';

/**
 * @param {Array} orders - список заказов
 * @param {function} onToggleExpand - (orderId) => void
 * @param {function} onUpdateStatus - (orderId, newState) => void
 * @param {Array} expandedOrderIds - список ID заказов, которые развернуты
 * @param {string} role - роль пользователя
 */
export function OrderList({
							  orders,
							  onToggleExpand,
							  onUpdateStatus,
							  expandedOrderIds,
							  role,
						  }) {
	return (
		<>
			{orders.map((order) => {
				const expanded = expandedOrderIds.includes(order.id);
				return (
					<OrderCard
						key={order.id}
						order={order}
						expanded={expanded}
						onToggleExpand={onToggleExpand}
						onUpdateStatus={onUpdateStatus}
						role={role}
					/>
				);
			})}
		</>
	);
}
