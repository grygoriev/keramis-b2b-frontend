// src/pages/admin/clients/components/clients-table/ClientsTable.jsx
import { Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { SmartTable } from '../../../../../components';
import s from './ClientsTable.module.css';

const { Option } = Select;

/**
 * @param {Array} clients - список клиентов
 * @param {Array} clientGroups - [{id, name}, ...]
 * @param {boolean} loading - флаг загрузки
 * @param {Function} onUpdateClient - (clientId, field, value) => void
 * @param {string} searchText - строка поиска
 */
export function ClientsTable({
								 clients, clientGroups, loading,
								 onUpdateClient, searchText
							 }) {
	const { t } = useTranslation();

	/* --- фильтрация --- */
	const filteredData = clients.filter(c=>{
		const s = searchText.toLowerCase();
		return c.name.toLowerCase().includes(s) ||
			(c.code && c.code.toLowerCase().includes(s));
	});

	/* --- колонки --- */
	const columns = [
		{
			title : t('clients.name','Клиент'),
			dataIndex:'name',
			sorter:(a,b)=>a.name.localeCompare(b.name)
		},
		{
			title : t('clients.code','Код'),
			dataIndex:'code',
			width:120
		},
		{
			title : t('clients.clientGroup','Группа'),
			dataIndex:'client_group',
			render:(val,rec)=>(
				<Select
					size="small"
					value={val ?? ''}
					onChange={v=>onUpdateClient(rec.id,'client_group',v)}
					className={s.sel}
				>
					{clientGroups.map(g=>
						<Option key={g.id} value={g.id}>{g.name}</Option>
					)}
				</Select>
			)
		}
	];

	/* --- мобильная “карточка” --- */
	const mobileCard = rec => (
		<div className={s.mobileCard}>
			<div><b>{rec.name}</b></div>
			<div>ID: {rec.code}</div>
		</div>
	);

	return (
		<SmartTable
			data={filteredData}
			columns={columns}
			loading={loading}
			mobileRenderer={mobileCard}
			pagination={{ pageSize: 20, showSizeChanger: false }}
		/>
	);
}
