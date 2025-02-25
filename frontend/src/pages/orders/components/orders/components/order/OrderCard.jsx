// src/pages/orders/components/orders/components/order/OrderCard.jsx
import React from 'react';
import { Card, Button, Divider, Space } from 'antd';
import { useTranslation } from 'react-i18next';

export function OrderCard({
							  order,
							  expanded,
							  onToggleExpand,
							  onUpdateStatus,
							  role,
						  }) {
	const { t } = useTranslation();

	return (
		<Card
			key={order.id}
			style={{ marginBottom: 16, border: '1px solid #e8e8e8' }}
		>
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<div>
					<b>{t('orders.order', 'Заказ')} #{order.id}</b>
					<Divider type="vertical" />
					{t('orders.date', 'Дата')}: {order.create_datetime?.slice(0, 10)}
					<Divider type="vertical" />
					{t('orders.total', 'Сумма')}: {order.total}
					<Divider type="vertical" />
					{t('orders.state', 'Статус')}: {order.state}
				</div>
				<Button size="small" onClick={() => onToggleExpand(order.id)}>
					{expanded ? t('orders.collapse', 'Свернуть') : t('orders.expand', 'Развернуть')}
				</Button>
			</div>

			{expanded && (
				<div style={{ marginTop: 16 }}>
					<h4>{t('orders.productsTitle', 'Состав заказа')}:</h4>
					{order.items && order.items.length > 0 ? (
						order.items.map((item) => (
							<div key={item.id} style={{ paddingLeft: 16 }}>
								• {t('orders.productName', 'Товар')}: {item.product_name} (
								{t('orders.quantity', 'Кол-во')}: {item.quantity},{' '}
								{t('orders.price', 'Цена')}: {item.price})
							</div>
						))
					) : (
						<div style={{ color: '#999' }}>{t('orders.empty', 'Пусто')}</div>
					)}
					<Divider />
					{role === 'internal_manager' && (
						<Space>
							<Button size="small" onClick={() => onUpdateStatus(order.id, 'confirmed')}>
								{t('orders.confirm', 'Подтвердить')}
							</Button>
							<Button size="small" onClick={() => onUpdateStatus(order.id, 'paid')}>
								{t('orders.paid', 'Оплачено')}
							</Button>
						</Space>
					)}
				</div>
			)}
		</Card>
	);
}
