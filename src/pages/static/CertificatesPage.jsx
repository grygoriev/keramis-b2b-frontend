// src/pages/static/DeliveryPage.jsx
import React from 'react';
import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph } = Typography;

export function CertificatesPage() {
	const { t } = useTranslation();

	return (
		<div style={{ padding: 16 }}>
			<Title level={2}>{t('static.certificates.title')}</Title>
			<Paragraph>
				{t('static.certificates.content')}
			</Paragraph>
		</div>
	);
}
