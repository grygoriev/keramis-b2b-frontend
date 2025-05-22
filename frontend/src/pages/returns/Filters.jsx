// src/pages/returns/Filters.jsx
import { DatePicker, Input, Space } from 'antd';
import { useTranslation } from 'react-i18next';

export function Filters({
	/* даты */
	dateRange,
	onDateChange,

	/* № возврата */
	returnId,
	onReturnIdChange,

	/* № заказа */
	orderNumber,
	onOrderNumberChange,

	/* товар (код / название) */
	product,
	onProductChange,

	/* клиент (только internal-manager) */
	client,
	onClientChange,
	showClient = false,

	/* менеджер (только internal-manager) */
	manager,
	onManagerChange,
	showManager = false,
}) {
	const { t } = useTranslation();
	const { RangePicker } = DatePicker;

	return (
		<Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
			<Space wrap>
				{/* диапазон дат возврата */}
				<RangePicker value={dateRange} onChange={onDateChange} />

				{/* номер возврата */}
				<Input
					placeholder={t('returns.searchById', 'Возврат №…')}
					value={returnId}
					onChange={onReturnIdChange}
					style={{ width: 180 }}
				/>

				{/* номер заказа */}
				<Input
					placeholder={t('returns.orderNumber', 'Заказ №…')}
					value={orderNumber}
					onChange={onOrderNumberChange}
					style={{ width: 160 }}
				/>

				{/* товар */}
				<Input
					placeholder={t('returns.product', 'Товар (код / название)…')}
					value={product}
					onChange={onProductChange}
					style={{ width: 220 }}
				/>

				{/* клиент (видит только internal-manager) */}
				{showClient && (
					<Input
						placeholder={t('returns.client', 'Клиент…')}
						value={client}
						onChange={onClientChange}
						style={{ width: 220 }}
					/>
				)}

				{/* менеджер (internal-manager) */}
				{showManager && (
					<Input
						placeholder={t('returns.manager', 'Менеджер…')}
						value={manager}
						onChange={onManagerChange}
						style={{ width: 180 }}
					/>
				)}
			</Space>
		</Space>
	);
}
