// src/pages/orders/OrderListPage.jsx
import { useEffect, useState } from 'react';
import { Spin, message } from 'antd';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

import { useTranslation } from 'react-i18next';

import { Filters, OrderList } from './components/index.js';

import { getOrders, updateOrderStatus } from '../../api/ordersApi.js';

export function OrderListPage() {
	const { t } = useTranslation();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(false);

	// Фильтры
	const [dateRange, setDateRange] = useState([null, null]);
	const [searchTerm, setSearchTerm] = useState('');
	const [clientFilter, setClientFilter] = useState('');
	const [expandedOrderIds, setExpandedOrderIds] = useState([]);

	const storedLang = localStorage.getItem('lang') || 'ru';
	const serverLang = storedLang === 'ua' ? 'uk' : storedLang;

	const role = localStorage.getItem('role');

	useEffect(() => {
		loadOrders();
	}, [serverLang, clientFilter]);

	const loadOrders = async () => {
		setLoading(true);
		try {
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

	/** Обработчики фильтров **/
	const handleDateChange = (dates) => {
		setDateRange(dates || [null, null]);
	};
	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
	};
	const handleClientFilterChange = (e) => {
		setClientFilter(e.target.value);
	};

	/** Обновление статуса **/
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

	/** Развернуть / свернуть заказ **/
	const toggleExpand = (orderId) => {
		setExpandedOrderIds((prev) =>
			prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
		);
	};

	/** Фильтрация **/
	const filteredOrders = orders.filter((order) => {
		let passDate = true;
		if (dateRange[0] && dateRange[1]) {
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

	/** Рендер логики */
	if (loading && orders.length === 0) {
		// При первой загрузке
		return <Spin style={{ margin: 16 }} />;
	}

	// Если после загрузки нет заказов
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

			<OrderList
				orders={filteredOrders}
				expandedOrderIds={expandedOrderIds}
				onToggleExpand={toggleExpand}
				onUpdateStatus={handleUpdateStatus}
				role={role}
			/>
		</div>
	);
}
