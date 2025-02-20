// src/pages/orders/OrderListPage.jsx
import React, { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus } from '../../api/ordersApi';
import { Spin, Card, Button, Space, message, Divider } from 'antd';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

import { useTranslation } from 'react-i18next';
import { Filters } from './components/Filters';

export function OrderListPage() {
	const { t } = useTranslation();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(false);

	// Фильтры
	const [dateRange, setDateRange] = useState([null, null]);
	const [searchTerm, setSearchTerm] = useState('');
	const [clientFilter, setClientFilter] = useState('');
	const [expandedOrderIds, setExpandedOrderIds] = useState([]);

	// Язык: если в localStorage значение 'ua' – преобразуем в 'uk' для бекенда
	const storedLang = localStorage.getItem('lang') || 'ru';
	const serverLang = storedLang === 'ua' ? 'uk' : storedLang;

	// Роль пользователя (например, 'internal_manager' или 'client_manager' и т.п.)
	const role = localStorage.getItem('role');

	useEffect(() => {
		loadOrders();
		// eslint-disable-next-line
	}, [serverLang, clientFilter]);

	const loadOrders = async () => {
		setLoading(true);
		try {
			// Если internal_manager и задан фильтр по клиенту – передаем параметр client
			const params = { lang: serverLang };
			if (role === 'internal_manager' && clientFilter) {
				params.client = clientFilter;
			}
			const data = await getOrders(params);
			setOrders(data);
		} finally {
			setLoading(false);
		}
	};

	const handleDateChange = (dates) => {
		setDateRange(dates ? dates : [null, null]);
	};

	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
	};

	const handleClientFilterChange = (e) => {
		setClientFilter(e.target.value);
	};

	const handleUpdateStatus = async (orderId, newState) => {
		try {
			const updatedOrder = await updateOrderStatus(orderId, newState);
			message.success(
				`${t('orders.order')} #${orderId}: ${t('orders.state')} = ${updatedOrder.state}`
			);
			loadOrders();
		} catch (err) {
			console.error(err);
			message.error(t('orders.statusUpdateError', 'Не удалось обновить статус'));
		}
	};

	const toggleExpand = (orderId) => {
		setExpandedOrderIds((prev) =>
			prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
		);
	};

	// Фильтрация заказов
	const filteredOrders = orders.filter((order) => {
		let passDate = true;
		if (dateRange && dateRange.length === 2 && dateRange[0] && dateRange[1]) {
			const orderDate = dayjs(order.create_datetime);
			const start = dayjs(dateRange[0]).startOf('day');
			const end = dayjs(dateRange[1]).endOf('day');
			passDate = orderDate.isBetween(start, end, null, '[]');
		}
		let passSearch = true;
		if (searchTerm) {
			passSearch = String(order.id).includes(searchTerm);
		}
		return passDate && passSearch;
	});

	if (loading) return <Spin />;

	if (!loading && filteredOrders.length === 0) {
		return (
			<div style={{ padding: 16 }}>
				<h2>{t('orders.title', 'Мои заказы')}</h2>
				<Filters
					dateRange={dateRange}
					onDateChange={handleDateChange}
					searchTerm={searchTerm}
					onSearchChange={handleSearchChange}
					clientFilter={clientFilter}
					onClientFilterChange={handleClientFilterChange}
					showClientFilter={role === 'internal_manager'}
				/>
				<p style={{ marginTop: 16 }}>
					{t('orders.noOrdersFound', 'Заказы не найдены для заданных фильтров')}
				</p>
			</div>
		);
	}

	return (
		<div style={{ padding: 16 }}>
			<h2>{t('orders.title', 'Мои заказы')}</h2>
			<Filters
				dateRange={dateRange}
				onDateChange={handleDateChange}
				searchTerm={searchTerm}
				onSearchChange={handleSearchChange}
				clientFilter={clientFilter}
				onClientFilterChange={handleClientFilterChange}
				showClientFilter={role === 'internal_manager'}
			/>
			{filteredOrders.map((order) => {
				const expanded = expandedOrderIds.includes(order.id);
				return (
					<Card
						key={order.id}
						style={{ marginBottom: 16, border: '1px solid #e8e8e8' }}
						styles={{ body: { padding: 16 } }}
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
							<Button size="small" onClick={() => toggleExpand(order.id)}>
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
											{t('orders.quantity', 'Кол-во')}: {item.quantity}, {t('orders.price', 'Цена')}: {item.price})
										</div>
									))
								) : (
									<div style={{ color: '#999' }}>{t('orders.empty', 'Пусто')}</div>
								)}
								<Divider />
								{role === 'internal_manager' && (
									<Space>
										<Button size="small" onClick={() => handleUpdateStatus(order.id, 'confirmed')}>
											{t('orders.confirm', 'Подтвердить')}
										</Button>
										<Button size="small" onClick={() => handleUpdateStatus(order.id, 'paid')}>
											{t('orders.paid', 'Оплачено')}
										</Button>
									</Space>
								)}
							</div>
						)}
					</Card>
				);
			})}
		</div>
	);
}
