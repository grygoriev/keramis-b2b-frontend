// src/pages/orders/OrderListPage.jsx
import { useState } from 'react';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

import { useTranslation } from 'react-i18next';
import { Filters, OrderList } from './components';

import { useOrderList } from './hooks';
import { LoadingWrapper } from '../../components';
import { useSelector } from 'react-redux';
import { selectCurrentLang } from '../../store/langSlice.js';
import { transformLangToServer } from '../../utils/index.js';
import { selectUserRole } from '../../store/authSlice.js';

export function OrderListPage() {
	const { t } = useTranslation();

	const [dateRange, setDateRange] = useState([null, null]);
	const [searchTerm, setSearchTerm] = useState('');
	const [clientFilter, setClientFilter] = useState([]);
	const [expandedOrderIds, setExpandedOrderIds] = useState([]);

	const currentLanguage = useSelector(selectCurrentLang);
	const serverLang = transformLangToServer(currentLanguage);

	const role = useSelector(selectUserRole);

	const {
		orders,
		loading,
		error,
		updateOrderStatus,
	} = useOrderList(serverLang, role, clientFilter);

	const handleDateChange = (dates) => {
		setDateRange(dates || [null, null]);
	};
	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
	};
	const handleClientFilterChange = (e) => {
		setClientFilter(e.target.value);
	};

	const handleUpdateStatus = async (orderId, newState) => {
		await updateOrderStatus(orderId, newState);
	};

	const toggleExpand = (orderId) => {
		setExpandedOrderIds((prev) =>
			prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
		);
	};

	const filteredOrders = orders.filter((order) => {
		if (dateRange[0] && dateRange[1]) {
			const orderDate = dayjs(order.create_datetime);
			const start = dayjs(dateRange[0]).startOf('day');
			const end = dayjs(dateRange[1]).endOf('day');
			if (!orderDate.isBetween(start, end, null, '[]')) return false;
		}
		return !(searchTerm && !String(order.id).includes(searchTerm));
	});

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

			{/* Обёртка загрузки и ошибки */}
			<LoadingWrapper loading={loading} error={error} data={orders}>
				{filteredOrders.length === 0 ? (
					<p style={{ marginTop: 16 }}>
						{t('orders.noOrdersFound', 'Заказы не найдены для заданных фильтров')}
					</p>
				) : (
					<OrderList
						orders={filteredOrders}
						expandedOrderIds={expandedOrderIds}
						onToggleExpand={toggleExpand}
						onUpdateStatus={handleUpdateStatus}
						role={role}
					/>
				)}
			</LoadingWrapper>
		</div>
	);
}
