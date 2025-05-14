// src/pages/client/components/BalanceList.jsx
import { useTranslation } from 'react-i18next';
import s from '../ClientDashboard.module.css';

/** @param {{balance:Array}} props */
export function BalanceList({ balance }) {
	const { t } = useTranslation();
	if (!balance?.length) return null;

	return (
		<div className={s.block}>
			<h3 className={s.blockTitle}>{t('clientDash.balance','Баланс взаиморасчётов')}</h3>

			<ul className={s.balanceList}>
				{balance.map(b=>(
					<li key={b.currency}>
						<span>{b.currency}:</span>
						<span>{b.balance}</span>
					</li>
				))}
			</ul>
		</div>
	);
}
