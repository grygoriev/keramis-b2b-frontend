import { DatePicker, Input, Space } from 'antd';
import { useTranslation } from 'react-i18next';

export function Filters({
	dateRange,
	onDateChange,
	search,
	onSearchChange,
	client,
	onClientChange,
	showClient = false,
}) {
	const { t } = useTranslation();
	const { RangePicker } = DatePicker;

	return (
		<Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
			<Space wrap>
				<RangePicker value={dateRange} onChange={onDateChange} />
				<Input
					placeholder={t('returns.searchById', 'Номер возврата…')}
					value={search}
					onChange={onSearchChange}
					style={{ width: 220 }}
				/>
				{showClient && (
					<Input
						placeholder={t('returns.searchByClient', 'Клиент…')}
						value={client}
						onChange={onClientChange}
						style={{ width: 220 }}
					/>
				)}
			</Space>
		</Space>
	);
}
