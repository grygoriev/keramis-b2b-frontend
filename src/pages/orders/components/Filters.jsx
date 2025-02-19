// src/pages/orders/components/Filters.jsx
import { useTranslation } from 'react-i18next';
import { DatePicker, Input } from 'antd';

export function Filters({ dateRange, onDateChange, searchTerm, onSearchChange }) {
	const { t } = useTranslation();
	const { RangePicker } = DatePicker;

	return (
		<div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
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
		</div>
	);
}
