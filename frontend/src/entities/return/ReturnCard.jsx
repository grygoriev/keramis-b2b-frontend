import { Card, Divider, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import styles from './ReturnCard.module.css';

export function ReturnCard({ data, expanded, onToggle }) {
	const { t } = useTranslation();

	return (
		<Card className={styles.card}>
			<div className={styles.header}>
				<div>
					<b>
						{t('returns.id', 'Возврат')} #{data.return_id}
					</b>
					<Divider type="vertical" />
					{t('returns.date', 'Дата')}: {data.return_date?.slice(0, 10)}
					<Divider type="vertical" />
					{t('returns.order', 'Заказ')} #{data.order_number}
					<Divider type="vertical" />
					{data.client_name}
				</div>

				<Button size="small" onClick={() => onToggle(data.return_id)}>
					{expanded
						? t('common.collapse', 'Свернуть')
						: t('common.expand', 'Развернуть')}
				</Button>
			</div>

			{expanded && (
				<div className={styles.items}>
					{data.items.map((it) => (
						<div key={it.product_sku}>
							• {it.product_name} — {it.qty_received}/{it.qty_due_in}
						</div>
					))}
				</div>
			)}
		</Card>
	);
}
