// src/pages/orders/OrderListPage.jsx
import { useState } from 'react';
import dayjs                  from 'dayjs';
import { useTranslation }     from 'react-i18next';
import { Pagination }         from 'antd';

import { Filters, OrderList } from './components';
import { LoadingWrapper }     from '../../components';

import { useSelector }        from 'react-redux';
import { selectCurrentLang }  from '../../store/langSlice';
import { selectUserRole }     from '../../store/authSlice';
import { transformLangToServer } from '../../utils';

import {
	useGetOrdersQuery,
	useUpdateOrderStatusMutation,
} from '../../services';

export function OrderListPage() {
	const { t } = useTranslation();

	/* ---------- фильтры ---------- */
	const [dateRange, setDateRange] = useState([null, null]);  // всегда массив-из-двух
	const [extCode,   setExtCode]   = useState('');
	const [client,    setClient]    = useState('');

	/* ---------- пагинация ---------- */
	const [page, setPage] = useState(1);
	const pageSize = 20;

	/* ---------- раскрытие карточек ---------- */
	const [expandedOrderIds, setExpandedOrderIds] = useState([]);
	const toggleExpand = (id) =>
		setExpandedOrderIds(prev =>
			prev.includes(id) ? prev.filter(i=>i!==id) : [...prev, id]);

	/* ---------- параметры запроса ---------- */
	const lang = transformLangToServer(useSelector(selectCurrentLang));
	const role = useSelector(selectUserRole);

	const [startDate, endDate] = dateRange || [];     // ← безопасно, даже если null
	const after  = startDate ? dayjs(startDate).format('YYYY-MM-DD') : undefined;
	const before = endDate   ? dayjs(endDate).format('YYYY-MM-DD')   : undefined;

	const {
		data       = { results:[], total:0 },
		error,
		isLoading,
	} = useGetOrdersQuery({
		lang,
		page,
		pageSize,
		extCode : extCode.trim() || undefined,
		after,
		before,
		client  : role==='internal_manager' ? (client.trim()||undefined) : undefined,
	});

	const orders = data.results;

	/* ---------- PATCH статуса ---------- */
	const [updateStatus] = useUpdateOrderStatusMutation();
	const handleUpdateStatus = (id, st) => updateStatus({ orderId:id, newState:st });

	/* ---------- UI ---------- */
	return (
		<div style={{padding:16}}>
			<h2>{t('orders.title','Мои заказы')}</h2>

			<Filters
				dateRange={dateRange}
				onDateChange={(d)=>{                     // AntD вернёт null при очистке
					setDateRange(d ?? [null,null]);
					setPage(1);
				}}
				searchTerm={extCode}
				onSearchChange={e=>{ setExtCode(e.target.value); setPage(1);} }

				clientFilter={client}
				onClientFilterChange={e=>{ setClient(e.target.value); setPage(1);} }
				showClientFilter={role==='internal_manager'}
			/>

			<LoadingWrapper loading={isLoading}
							error={error?.toString()||null}
							data={orders}>
				{orders.length===0 ? (
					<p style={{marginTop:16}}>
						{t('orders.noOrdersFound','Заказы не найдены')}
					</p>
				) : (
					<>
						<OrderList
							orders={orders}
							expandedOrderIds={expandedOrderIds}
							onToggleExpand={toggleExpand}
							onUpdateStatus={handleUpdateStatus}
							role={role}
						/>

						<Pagination
							current={page}
							pageSize={pageSize}
							total={data.total}
							onChange={p=>setPage(p)}
							showSizeChanger={false}
							style={{marginTop:24, textAlign:'right'}}
						/>
					</>
				)}
			</LoadingWrapper>
		</div>
	);
}
