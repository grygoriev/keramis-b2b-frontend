// src/pages/orders/OrderListPage.jsx
import { useState } from 'react';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

import { useTranslation } from 'react-i18next';
import { Filters, OrderList } from './components';

import { LoadingWrapper } from '../../components';
import { useSelector } from 'react-redux';
import { selectCurrentLang } from '../../store/langSlice.js';
import { transformLangToServer } from '../../utils/index.js';
import { selectUserRole } from '../../store/authSlice.js';

import { useGetOrdersQuery, useUpdateOrderStatusMutation } from '../../services';

export function OrderListPage() {
	const { t } = useTranslation();

	const [dateRange, setDateRange] = useState([null, null]);
	const [searchTerm, setSearchTerm] = useState('');
	const [clientFilter, setClientFilter] = useState('');
	const [expandedOrderIds, setExpandedOrderIds] = useState([]);

	const currentLanguage = useSelector(selectCurrentLang);
	const serverLang = transformLangToServer(currentLanguage);
	const role = useSelector(selectUserRole);

	// 1) Загружаем список заказов через RTK Query
	const {
		data: orders = [],
		error,
		isLoading,
	} = useGetOrdersQuery({
		lang: serverLang,
		role,
		clientFilter,
	});

	// 2) Мутация обновления статуса
	const [doUpdateStatus] = useUpdateOrderStatusMutation();

	const handleDateChange = (dates) => {
		setDateRange(dates || [null, null]);
	};
	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
	};
	const handleClientFilterChange = (e) => {
		setClientFilter(e.target.value);
	};

	// При смене статуса заказа
	const handleUpdateStatus = async (orderId, newState) => {
		try {
			const result = await doUpdateStatus({ orderId, newState }).unwrap();
			// RTK Query invalidatesTags -> getOrders будет рефетч
			// Можно вывести message.success(...)
			console.log('Updated order:', result);
		} catch (err) {
			console.error(err);
			// Вывести message.error(...)
		}
	};

	const toggleExpand = (orderId) => {
		setExpandedOrderIds((prev) =>
			prev.includes(orderId)
				? prev.filter((id) => id !== orderId)
				: [...prev, orderId],
		);
	};

	// Фильтрация по дате, searchTerm
	const filteredOrders = orders.filter((order) => {
		if (dateRange[0] && dateRange[1]) {
			const orderDate = dayjs(order.create_datetime);
			const start = dayjs(dateRange[0]).startOf('day');
			const end = dayjs(dateRange[1]).endOf('day');
			if (!orderDate.isBetween(start, end, null, '[]')) return false;
		}
		if (searchTerm && !String(order.id).includes(searchTerm)) return false;
		return true;
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

			<LoadingWrapper
				loading={isLoading}
				error={error ? String(error) : null}
				data={orders}
			>
				{filteredOrders.length === 0 ? (
					<p style={{ marginTop: 16 }}>
						{t(
							'orders.noOrdersFound',
							'Заказы не найдены для заданных фильтров',
						)}
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
