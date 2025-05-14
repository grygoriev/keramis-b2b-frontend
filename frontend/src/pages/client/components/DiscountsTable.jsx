// src/pages/client/components/DiscountsTable.jsx
import { useTranslation } from 'react-i18next';
import s from '../ClientDashboard.module.css';

/** @param {{discounts:Array}} props */
export function DiscountsTable({ discounts }) {
	const { t } = useTranslation();
	if (!discounts?.length) return null;

	return (
		<div className={s.block}>
			<h3 className={s.blockTitle}>{t('clientDash.discounts','Текущие скидки')}</h3>
			<table className={s.table}>
				<thead>
				<tr>
					<th>{t('clientDash.priceGroup','Ценовая группа')}</th>
					<th style={{textAlign:'right'}}>{t('clientDash.percent','Скидка %')}</th>
				</tr>
				</thead>
				<tbody>
				{discounts.map(d=>(
					<tr key={d.price_group}>
						<td>{d.price_group_name}</td>
						<td style={{textAlign:'right'}}>{d.discount_percent}</td>
					</tr>
				))}
				</tbody>
			</table>
		</div>
	);
}
