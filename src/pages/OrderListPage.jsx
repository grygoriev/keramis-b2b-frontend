// src/pages/OrderListPage.jsx
import React, { useEffect, useState } from 'react';
import { getOrders } from '../api/ordersApi';
import { Spin, List } from 'antd';

export function OrderListPage() {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		loadOrders();
	}, []);

	const loadOrders = async () => {
		setLoading(true);
		try {
			const data = await getOrders();
			setOrders(data);
		} finally {
			setLoading(false);
		}
	};

	if (loading) return <Spin />;

	return (
		<div style={{ padding: 16 }}>
			<h2>My Orders</h2>

			<List
				dataSource={orders}
				renderItem={(order) => (
					<List.Item>
						<List.Item.Meta
							title={`Order #${order.id}, state=${order.state}, total=${order.total}`}
							description={
								<div>
									{order.items && order.items.map(item => (
										<div key={item.id}>
											Product ID: {item.product}, qty: {item.quantity}, price: {item.price}
										</div>
									))}
								</div>
							}
						/>
					</List.Item>
				)}
			/>
		</div>
	);
}
