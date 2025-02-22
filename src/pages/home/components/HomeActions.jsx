// src/pages/home/components/HomeActions.jsx
import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function HomeActions() {
	const { t } = useTranslation();

	return (
		<div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
			<Link to="/certificates">
				<Button>{t('homePage.certificates')}</Button>
			</Link>
			<Link to="/catalogs">
				<Button>{t('homePage.catalogs')}</Button>
			</Link>
			<Link to="/export">
				<Button>{t('homePage.export')}</Button>
			</Link>
			<Link to="/import">
				<Button>{t('homePage.import')}</Button>
			</Link>
		</div>
	);
}
