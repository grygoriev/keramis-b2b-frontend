// src/pages/admin/discounts/components/DiscountsTable.jsx
import { Table, Select, InputNumber, Button, Popconfirm, Space } from 'antd';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

export function DiscountsTable({
								   discounts,
								   clientGroups,
								   priceGroups,
								   loading,
								   onUpdateField,
								   onDelete,
								   filteredData
							   }) {
	const { t } = useTranslation();

	const columns = [
		{
			title: t('discounts.clientGroup', 'Группа клиента'),
			dataIndex: 'client_group',
			key: 'client_group',
			render: (clientGroupId, record) => (
				<Select
					style={{ width: 180 }}
					value={clientGroupId}
					onChange={(newGroupId) => onUpdateField(record.id, 'client_group', newGroupId)}
				>
					{clientGroups.map((grp) => (
						<Option key={grp.id} value={grp.id}>
							{grp.name}
						</Option>
					))}
				</Select>
			),
		},
		{
			title: t('discounts.priceGroup', 'Ценовая группа'),
			dataIndex: 'price_group',
			key: 'price_group',
			render: (priceGroupId, record) => (
				<Select
					style={{ width: 180 }}
					value={priceGroupId}
					onChange={(newPriceGroupId) =>
						onUpdateField(record.id, 'price_group', newPriceGroupId)
					}
				>
					{priceGroups.map((pg) => (
						<Option key={pg.id} value={pg.id}>
							{pg.name} ({pg.code})
						</Option>
					))}
				</Select>
			),
		},
		{
			title: t('discounts.discountPercent', 'Скидка (%)'),
			dataIndex: 'discount_percent',
			key: 'discount_percent',
			render: (value, record) => (
				<InputNumber
					min={0}
					max={100}
					value={value}
					onChange={(newVal) => onUpdateField(record.id, 'discount_percent', newVal)}
					style={{ width: 80 }}
				/>
			),
		},
		{
			title: t('discounts.actions', 'Действия'),
			key: 'actions',
			render: (text, record) => (
				<Space>
					<Popconfirm
						title={t('discounts.confirmDelete', 'Удалить эту скидку?')}
						onConfirm={() => onDelete(record.id)}
						okText={t('common.delete', 'Удалить')}
						cancelText={t('common.cancel', 'Отмена')}
					>
						<Button danger>{t('common.delete', 'Удалить')}</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<Table
			columns={columns}
			dataSource={filteredData}
			rowKey="id"
			loading={loading}
		/>
	);
}
