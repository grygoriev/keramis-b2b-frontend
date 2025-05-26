/* src/entities/client/ui/ClientsTable/ClientsTable.jsx */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Select, Input } from 'antd';
import { useTranslation } from 'react-i18next';
import { SmartTable } from '../../../../components';
import css from './ClientsTable.module.css';

const { Option } = Select;
const { Search } = Input;

/**
 * @param {{
 *   clients: Array,
 *   groups : Array,
 *   loading: boolean,
 *   onPatch: (id:number, groupId:number)=>void
 * }} p */
export function ClientsTable({ clients, groups, loading, onPatch }) {
	const { t } = useTranslation();
	const [query, setQuery] = useState('');

	/* ---- фильтр ---- */
	const data = clients.filter((c) => {
		const q = query.toLowerCase();
		return (
			c.name.toLowerCase().includes(q) || (c.code || '').toLowerCase().includes(q)
		);
	});

	/* ---- колонки ---- */
	const columns = [
		{
			title: t('clients.name', 'Клиент'),
			dataIndex: 'name',
			sorter: (a, b) => a.name.localeCompare(b.name),
			render: (text, rec) => (
				<Link to={`/admin/clients/${rec.id}`} className={css.link}>
					{text}
				</Link>
			),
		},
		{ title: t('clients.code', 'Код'), dataIndex: 'code', width: 120 },
		{
			title: t('clients.group', 'Группа'),
			dataIndex: 'client_group',
			render: (val, rec) => (
				<Select
					size="small"
					value={val ?? ''}
					onChange={(v) => onPatch(rec.id, v)}
					className={css.sel}
				>
					{groups.map((g) => (
						<Option key={g.id} value={g.id}>
							{g.name}
						</Option>
					))}
				</Select>
			),
		},
	];

	/* ---- мобильная карточка ---- */
	const mobileCard = (rec) => (
		<div className={css.mobCard}>
			<Link to={`/admin/clients/${rec.id}`} className={css.link}>
				<b>{rec.name}</b>
			</Link>
			<br />
			{rec.code}
		</div>
	);

	return (
		<>
			<div style={{ marginBottom: 16 }}>
				<Search
					placeholder={t('clients.search', 'Поиск…')}
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					style={{ width: 300 }}
				/>
			</div>

			<SmartTable
				data={data}
				columns={columns}
				loading={loading}
				rowKey="id"
				mobileRenderer={mobileCard}
				pagination={{ pageSize: 20, showSizeChanger: false }}
			/>
		</>
	);
}
