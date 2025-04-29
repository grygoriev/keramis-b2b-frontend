// src/pages/admin/discounts/components/DiscountsTable.jsx
import { Select, InputNumber, Button, Popconfirm, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { SmartTable } from '../../../../../components/index.js';
import s from './DiscountsTable.module.css';

export function DiscountsTable({
								   discounts, clientGroups, priceGroups,
								   loading, onUpdateField, onDelete, filteredData
							   }) {
	const { t } = useTranslation();

	const columns = [
		{
			title:t('clients.clientGroup'),
			dataIndex:'client_group',
			render:(val,rec)=>(
				<Select size="small" value={Number(val)}
						onChange={v=>onUpdateField(rec.id,'client_group',v)}
						className={s.sel}
				>
					{clientGroups.map(g=>
					  <Select.Option
					     key={g.id}
					     value={g.id}            // ← ② number
					     label={g.name}          // ← ③ «страховка» на случай string/number
					  >
					     {g.name}
					  </Select.Option>
					)}
				</Select>
			)
		},
		{
			title:t('discounts.priceGroup'),
			dataIndex:'price_group',
			render:(val,rec)=>(
				<Select size="small" value={Number(val)}
						onChange={v=>onUpdateField(rec.id,'price_group',v)}
						className={s.sel}
				>
					{priceGroups.map(p=>
						<Select.Option key={p.id} value={p.id} label={p.name}>
							{p.name} ({p.code})
						</Select.Option>)}
				</Select>
			)
		},
		{
			title:'%',
			dataIndex:'discount_percent',
			width:80,
			render:(val,rec)=>(
				<InputNumber min={0} max={100} size="small" value={val}
							 onChange={v=>onUpdateField(rec.id,'discount_percent',v)}
				/>
			)
		},
		{
			title:t('discounts.actions'),
			key:'x',
			width:90,
			render:(_,rec)=>(
				<Space>
					<Popconfirm
						title={t('discounts.confirmDelete')}
						onConfirm={()=>onDelete(rec.id)}
					>
						<Button size="small" danger>x</Button>
					</Popconfirm>
				</Space>
			)
		}
	];

	/* mobile */
	const mobileCard = r=>(
		<div className={s.mobileCard}>
			<div>{clientGroups.find(g=>g.id===r.client_group)?.name}</div>
			<div>{priceGroups.find(p=>p.id===r.price_group)?.name}</div>
			<b>{r.discount_percent}%</b>
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
