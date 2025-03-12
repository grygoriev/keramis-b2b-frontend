// src/components/product/components/StockInfo.jsx
import { useTranslation } from 'react-i18next';

/**
 * Компонент для отображения единицы измерения и остатков по складам
 * @param {object} props
 * @param {object} props.unit - Объект unit_of_measure: { id, name, code }
 * @param {Array}  props.stocks - Массив остатков [{ id, stock_id, stock_name, count }, ...]
 */
export function StockInfo({ unit, stocks }) {
	const { t } = useTranslation();

	if (!stocks || stocks.length === 0) {
		return null; // Если нет остатков, ничего не отображаем
	}

	return (
		<div style={{ border: '1px solid #ccc', padding: 12, marginTop: 16 }}>
			<h3 style={{ marginBottom: 8 }}>{t('productPage.availability')}</h3>
			{unit && (
				<div style={{ marginBottom: 8 }}>
					{t('productPage.units')}: <strong>{unit.name}</strong>
				</div>
			)}
			{stocks.map((stock) => (
				<div key={stock.id} style={{ marginBottom: 4 }}>
					<strong>{stock.stock_name}:</strong> {stock.count} {unit?.name || ''}
				</div>
			))}
		</div>
	);
}
