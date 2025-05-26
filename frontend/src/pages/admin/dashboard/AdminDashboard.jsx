// src/pages/admin/dashboard/AdminDashboard.jsx
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectUsername } from '../../../store/authSlice';

import styles from './AdminDashboard.module.css';

/**
 * Admin dashboard (FSD-style page).
 * Пока выводим только имя менеджера, но структура оставляет место
 * для будущих «карточек» с  метриками и графиками.
 */
export function AdminDashboard() {
	const { t } = useTranslation();
	const username = useSelector(selectUsername);

	return (
		<div className={styles.wrapper}>
			<h2 className={styles.title}>{t('adminDashboard.title', 'Адмін дашборд')}</h2>

			<section className={styles.section}>
				<h3 className={styles.heading}>
					{t('adminDashboard.hello', 'Вітаємо')}{' '}
					<span className={styles.username}>{username}</span>!
				</h3>

				{/* ▸ Сюди будемо поступово додавати віджети продажів, графіки тощо */}
				<p className={styles.placeholder}>
					{t(
						'adminDashboard.placeholder',
						'Тут зʼявляться ваші ключові показники.',
					)}
				</p>
			</section>
		</div>
	);
}
