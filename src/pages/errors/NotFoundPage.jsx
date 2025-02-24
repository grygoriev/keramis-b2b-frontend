// src/pages/errors/NotFoundPage.jsx

import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function NotFoundPage() {
	const navigate = useNavigate();
	const { t } = useTranslation();

	const goHome = () => {
		navigate('/'); // на главную или любой другой маршрут
	};

	return (
		<div style={{ textAlign: 'center', padding: '40px' }}>
			<h1 style={{ fontSize: '48px', marginBottom: '16px' }}>404</h1>
			<h2 style={{ marginBottom: '16px' }}>{t('errors.pageNotFound')}</h2>
			<p style={{ marginBottom: '24px' }}>
				{t('errors.error404line1')}
				<br/>
				{t('errors.error404line2')}
			</p>
			<Button type="primary" onClick={goHome}>
				{t('errors.backToMainPage')}
			</Button>
		</div>
	);
}
