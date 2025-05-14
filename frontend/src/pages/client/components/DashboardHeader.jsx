// src/pages/client/components/DashboardHeader.jsx
import { useTranslation } from 'react-i18next';
import s from '../ClientDashboard.module.css';

/**
 * @param {{client:{name,code}, user:{username,first_name,last_name}}} props
 */
export function DashboardHeader({ client, user }) {
	const { t } = useTranslation();

	if (!client || !user) return null;

	const fullName =
		`${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username;

	return (
		<div className={s.header}>
			<h2>{t('clientDash.title','Клиентский кабинет')}</h2>
			<div className={s.headerRow}>
				<span className={s.label}>{t('clientDash.client','Клиент')}:</span>
				<span>{client.name} ({client.code})</span>
			</div>
			<div className={s.headerRow}>
				<span className={s.label}>{t('clientDash.user','Пользователь')}:</span>
				<span>{fullName}</span>
			</div>
		</div>
	);
}
