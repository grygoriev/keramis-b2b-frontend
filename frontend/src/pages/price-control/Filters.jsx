import { Input, Space, Segmented } from 'antd';
import { useTranslation } from 'react-i18next';

/**
 * @param client, product, vendor – строки
 * @param on…Change               – handlers
 * @param diffCat                 – -1 | 1 | undefined
 * @param onDiffChange            – handler
 */
export function Filters({
	client,
	onClientChange,
	product,
	onProductChange,
	vendor,
	onVendorChange,
	diffCat,
	onDiffChange,
}) {
	const { t } = useTranslation();

	return (
		<Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
			<Space wrap>
				<Input
					placeholder={t('price.client', 'Клиент…')}
					value={client}
					onChange={onClientChange}
					style={{ width: 220 }}
				/>
				<Input
					placeholder={t('price.product', 'Товар (sku / название)…')}
					value={product}
					onChange={onProductChange}
					style={{ width: 260 }}
				/>
				<Input
					placeholder={t('price.vendor', 'Бренд…')}
					value={vendor}
					onChange={onVendorChange}
					style={{ width: 180 }}
				/>

				{/* –1 / 0 / 1  */}
				<Segmented
					value={diffCat ?? 0}
					onChange={onDiffChange}
					options={[
						{ label: t('price.all', 'Все'), value: 0 },
						{ label: t('price.lower', 'Ниже РРЦ'), value: -1 },
						{ label: t('price.higher', 'Выше РРЦ'), value: 1 },
					]}
				/>
			</Space>
		</Space>
	);
}
