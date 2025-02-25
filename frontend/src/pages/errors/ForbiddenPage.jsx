// src/pages/errors/ForbiddenPage.jsx
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function ForbiddenPage() {
	const navigate = useNavigate();
	const { t } = useTranslation();

	return (
		<div style={{ textAlign: 'center', padding: 40 }}>
			<h1 style={{ fontSize: '48px', marginBottom: '16px' }}>403</h1>
			<h2 style={{ marginBottom: '16px' }}>{t('errors.forbidden')}</h2>
			<p style={{ marginBottom: '24px' }}>
				{t('errors.forbiddenText')}
			</p>
			<Button type="primary" onClick={() => navigate('/login')}>
				Login
			</Button>
		</div>
	);
}
