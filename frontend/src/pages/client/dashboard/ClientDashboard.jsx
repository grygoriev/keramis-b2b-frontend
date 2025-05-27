/* src/pages/client/dashboard/ClientDashboard.jsx */
import { Spin, Alert } from 'antd';
import { useTranslation } from 'react-i18next';

import { useGetMyClientDetailQuery } from '../../../features/clients/clientsApi';

import { BalanceList } from '../../../shared/ui/BalanceList/BalanceList';
import css from './ClientDashboard.module.css';
import { useSelector } from 'react-redux';
import { selectUsername } from '../../../store/authSlice.js';

export function ClientDashboard() {
	const { t } = useTranslation();

	const currentUsername = useSelector(selectUsername);

	/* один запрос вместо двух: balances, discounts, client, user */
	const { data, isFetching, error } = useGetMyClientDetailQuery();

	if (isFetching) return <Spin style={{ margin: 40 }} />;
	if (error || !data)
		return (
			<Alert
				type="error"
				message={t('common.loadError', 'Ошибка загрузки')}
				style={{ margin: 40 }}
			/>
		);

	const { name, code, users = [], balances = [], price_groups: discounts = [] } = data;
	/* берём первого привязанного пользователя для ФИО */
	const user = users.find((usr) => usr.username === currentUsername) || {};
	const fullName =
		`${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username;

	return (
		<div className={css.container}>
			<h2>{t('clientDash.title', 'Клиентский кабинет')}</h2>

			<div className={css.headerRow}>
				<span className={css.label}>{t('clientDash.client', 'Клиент')}:</span>
				<span>
					{name} ({code})
				</span>
			</div>

			<div className={css.headerRow}>
				<span className={css.label}>{t('clientDash.user', 'Пользователь')}:</span>
				<span>{fullName}</span>
			</div>

			{/* ─── скидки ─── */}
			{discounts.length > 0 && (
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
							{discounts.map((pg) => (
								<tr key={pg.price_group}>
									<td>{pg.price_group_name}</td>
									<td style={{ textAlign: 'right' }}>
										{pg.discount_percent}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			{/* ─── баланс ─── */}
			<BalanceList balance={balances} />
		</div>
	);
}
