// src/shared/ui/BalanceList/BalanceList.jsx
import { useTranslation } from 'react-i18next';
import styles from './BalanceList.module.css';

/** @param {{balance:Array<{currency,balance}>}} p */
export function BalanceList({ balance }) {
	const { t } = useTranslation();
	if (!balance?.length) return null;

	return (
		<div className={styles.block}>
			<h3 className={styles.title}>
				{t('balance.title', 'Баланс взаиморасчётов')}
			</h3>
			<ul className={styles.list}>
				{balance.map((b) => (
					<li key={b.currency}>
						<span>{b.currency}:</span>
						<span>{b.balance}</span>
					</li>
				))}
			</ul>
		</div>
	);
}
