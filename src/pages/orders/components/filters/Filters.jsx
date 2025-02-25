// src/pages/orders/components/Filters.jsx
import { useTranslation } from 'react-i18next';
import { DatePicker, Input, Space } from 'antd';

export function Filters({
							dateRange,
							onDateChange,
							searchTerm,
							onSearchChange,
							clientFilter,
							onClientFilterChange,
							showClientFilter = false,
						}) {
	const { t } = useTranslation();
	const { RangePicker } = DatePicker;

	return (
		<Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
			<Space wrap>
				<RangePicker
					value={dateRange}
					onChange={onDateChange}
					style={{ minWidth: 220 }}
				/>
				<Input
					placeholder={t('orders.searchById', 'Искать по номеру заказа...')}
					value={searchTerm}
					onChange={onSearchChange}
					style={{ width: 220 }}
				/>
				{showClientFilter && (
					<Input
						placeholder={t('orders.searchByClient', 'Искать по клиенту...')}
						value={clientFilter}
						onChange={onClientFilterChange}
						style={{ width: 220 }}
					/>
				)}
			</Space>
		</Space>
	);
}
