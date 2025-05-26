// src/pages/client/dashboard/ClientDashboard.jsx
import { Spin, Alert } from 'antd';
import { useTranslation } from 'react-i18next';

import {
	useMyDiscountsQuery,
	useMyBalanceQuery,
} from '../../../features/clientDashboard/dashboardApi';

import { BalanceList } from '../../../shared/ui/BalanceList/BalanceList';
import css from './ClientDashboard.module.css';

export function ClientDashboard() {
	const { t } = useTranslation();
	const { data: disc, isFetching: loadD, error: errD } = useMyDiscountsQuery();
	const { data: bal, isFetching: loadB, error: errB } = useMyBalanceQuery();

	if (loadD || loadB) return <Spin style={{ margin: 40 }} />;
	if (errD || errB)
		return (
			<Alert
				type="error"
				message={t('common.loadError', 'Ошибка загрузки')}
				style={{ margin: 40 }}
			/>
		);

	const { client, user, discounts } = disc;

	const fullName =
		`${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username;

	return (
		<div className={css.container}>
			<h2>{t('clientDash.title', 'Клиентский кабинет')}</h2>

			<div className={css.headerRow}>
				<span className={css.label}>{t('clientDash.client', 'Клиент')}:</span>
				<span>
					{client.name} ({client.code})
				</span>
			</div>

			<div className={css.headerRow}>
				<span className={css.label}>{t('clientDash.user', 'Пользователь')}:</span>
				<span>{fullName}</span>
			</div>

			{/* скидки */}
			{discounts?.length > 0 && (
				<div className={css.block}>
					<h3 className={css.blockTitle}>
						{t('clientDash.discounts', 'Текущие скидки')}
					</h3>
					<table className={css.table}>
						<thead>
							<tr>
								<th>{t('clientDash.priceGroup', 'Ценовая группа')}</th>
								<th style={{ textAlign: 'right' }}>%</th>
							</tr>
						</thead>
						<tbody>
							{discounts.map((d) => (
								<tr key={d.price_group}>
									<td>{d.price_group_name}</td>
									<td style={{ textAlign: 'right' }}>
										{d.discount_percent}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			{/* баланс */}
			<BalanceList balance={bal} />
		</div>
	);
}
