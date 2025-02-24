// src/pages/home/components/HomeActions.jsx
import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function HomeActions() {
	const { t } = useTranslation();

	return (
		<div style={{ display: 'flex', gap: '16px', marginBottom: '16px', marginTop: '16px' }}>
			<Link to="/certificates">
				<Button>{t('homePage.certificates')}</Button>
			</Link>
			<Link to="/prices-catalogs">
				<Button>{t('homePage.catalogs')}</Button>
			</Link>
			<Link to="/cooperation">
				<Button>{t('homePage.cooperation')}</Button>
			</Link>
			<Link to="/service-support">
				<Button>{t('homePage.support')}</Button>
			</Link>
		</div>
	);
}
