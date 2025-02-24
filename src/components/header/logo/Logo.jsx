// src/components/header/logo/Logo.jsx

import { Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import React from 'react';
import { useTranslation } from 'react-i18next';

export function Logo() {
	const { t } = useTranslation();
	return (
		<Tooltip title={t('common.headerTitle', 'Главная')}>
			<Link
				to="/"
				style={{ fontWeight: 'bold', marginRight: 20, color: 'inherit' }}
				alt="Logo"
			>
				KERAMIS B2B
			</Link>
		</Tooltip>
	);
}
