import { Card, Collapse, Divider } from 'antd';
import { useTranslation } from 'react-i18next';
import styles from './ClientCard.module.css';

export function ClientCard({ data }) {
	const { t } = useTranslation();

	/* ---------- формируем items для Collapse ---------- */
	const items = data.vendors.map((v) => ({
		key: v.vendor,
		label: `${v.vendor} • ${v.total_items}`,
		children: (
			<table className={styles.table}>
				<thead>
					<tr>
						<th>{t('price.name', 'Товар')}</th>
						<th>{t('price.our', 'Наша')}</th>
						<th>{t('price.comp', 'Конк.')}</th>
						<th>%</th>
					</tr>
				</thead>
				<tbody>
					{v.products.map((p) => (
						<tr key={p.name}>
							<td><a href={p.url}>{p.name}</a></td>
							<td>{p.our_price}</td>
							<td>{p.competitor_price}</td>
							<td>{p.diff_percent.toFixed(1)}</td>
						</tr>
					))}
				</tbody>
			</table>
		),
	}));

	/* ---------- UI ---------- */
	return (
		<Card className={styles.card}>
			<b>{data.client_name}</b>
			<Divider type="vertical" />
			{t('price.total', 'Всего')}: {data.total_items}
			<Divider type="vertical" />
			{t('price.lower', 'Ниже')}: {data.items_cheaper}
			<Divider type="vertical" />
			{t('price.higher', 'Выше')}: {data.items_pricier}
			<Collapse ghost items={items} style={{ marginTop: 12 }} />
		</Card>
	);
}
