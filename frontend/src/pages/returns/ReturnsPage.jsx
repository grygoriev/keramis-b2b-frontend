// src/pages/returns/ReturnsPage.jsx
import { useState } from 'react';
import { Pagination } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import { useSelector } from 'react-redux';
import { selectCurrentLang } from '../../store/langSlice';
import { selectUserRole } from '../../store/authSlice';
import { transformLangToServer } from '../../utils';

import { useGetReturnsQuery } from '../../features/returns/returnsApi';

import { LoadingWrapper } from '../../shared/ui/LoadingWrapper';
import { ReturnList } from '../../entities/return/ReturnList';
import { Filters } from './Filters';

export function ReturnsPage() {
	const { t } = useTranslation();

	/* -------- local state ---------- */
	const [dateRange, setDateRange] = useState([null, null]);
	const [returnId, setReturnId] = useState('');
	const [orderNumber, setOrderNumber] = useState('');
	const [product, setProduct] = useState('');
	const [client, setClient] = useState('');
	const [manager, setManager] = useState('');

	/* пагинация */
	const [page, setPage] = useState(1);
	const pageSize = 20;

	/* раскрытие карточек */
	const [expandedIds, setExpanded] = useState([]);
	const toggle = (id) =>
		setExpanded((prev) =>
			prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
		);

	/* -------- query params ---------- */
	const role = useSelector(selectUserRole);
	const lang = transformLangToServer(useSelector(selectCurrentLang));

	const [afterDate, beforeDate] = dateRange || [];
	const after = afterDate ? dayjs(afterDate).format('YYYY-MM-DD') : undefined;
	const before = beforeDate ? dayjs(beforeDate).format('YYYY-MM-DD') : undefined;

	const {
		data = { results: [], total: 0 },
		isFetching,
		error,
	} = useGetReturnsQuery({
		page,
		pageSize,
		returnId: returnId.trim() || undefined,
		orderNumber: orderNumber.trim() || undefined,
		product: product.trim() || undefined,
		after,
		before,
		client: role === 'internal_manager' ? client.trim() || undefined : undefined,
		manager: role === 'internal_manager' ? manager.trim() || undefined : undefined,
	});

	/* -------- render ---------- */
	return (
		<div style={{ padding: 16 }}>
			<h2>{t('returns.title', 'Мои возвраты')}</h2>

			<Filters
				/* даты */
				dateRange={dateRange}
				onDateChange={(d) => {
					setDateRange(d ?? [null, null]);
					setPage(1);
				}}
				/* № возврата */
				returnId={returnId}
				onReturnIdChange={(e) => {
					setReturnId(e.target.value);
					setPage(1);
				}}
				/* № заказа */
				orderNumber={orderNumber}
				onOrderNumberChange={(e) => {
					setOrderNumber(e.target.value);
					setPage(1);
				}}
				/* товар */
				product={product}
				onProductChange={(e) => {
					setProduct(e.target.value);
					setPage(1);
				}}
				/* клиент */
				client={client}
				onClientChange={(e) => {
					setClient(e.target.value);
					setPage(1);
				}}
				showClient={role === 'internal_manager'}
				/* менеджер */
				manager={manager}
				onManagerChange={(e) => {
					setManager(e.target.value);
					setPage(1);
				}}
				showManager={role === 'internal_manager'}
			/>

			<LoadingWrapper
				loading={isFetching}
				error={error?.toString() || null}
				data={data.results}
			>
				{data.results.length === 0 ? (
					<p style={{ marginTop: 16 }}>
						{t('returns.empty', 'Возвраты не найдены')}
					</p>
				) : (
					<>
						<ReturnList
							list={data.results}
							expandedIds={expandedIds}
							onToggle={toggle}
						/>
						<Pagination
							current={page}
							pageSize={pageSize}
							total={data.total}
							onChange={(p) => setPage(p)}
							showSizeChanger={false}
							style={{ marginTop: 24, textAlign: 'right' }}
						/>
					</>
				)}
			</LoadingWrapper>
		</div>
	);
}
