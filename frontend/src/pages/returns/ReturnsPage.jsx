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

/* ------------------------------------------------------------------ */

export function ReturnsPage() {
	const { t } = useTranslation();

	/* ---------- local state ---------- */
	const [dateRange, setDateRange] = useState([null, null]);
	const [search, setSearch] = useState('');
	const [client, setClient] = useState('');
	const [page, setPage] = useState(1);
	const pageSize = 20;

	const [expandedIds, setExpanded] = useState([]);
	const toggle = (id) =>
		setExpanded((prev) =>
			prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
		);

	/* ---------- params ---------- */
	const lang = transformLangToServer(useSelector(selectCurrentLang));
	const role = useSelector(selectUserRole);

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
		returnId: search.trim() || undefined,
		after,
		before,
		client: role === 'internal_manager' ? client.trim() || undefined : undefined,
	});

	/* ---------- render ---------- */
	return (
		<div style={{ padding: 16 }}>
			<h2>{t('returns.title', 'Мои возвраты')}</h2>

			<Filters
				dateRange={dateRange}
				onDateChange={(d) => {
					setDateRange(d ?? [null, null]);
					setPage(1);
				}}
				search={search}
				onSearchChange={(e) => {
					setSearch(e.target.value);
					setPage(1);
				}}
				client={client}
				onClientChange={(e) => {
					setClient(e.target.value);
					setPage(1);
				}}
				showClient={role === 'internal_manager'}
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
