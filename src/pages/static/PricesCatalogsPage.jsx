// src/pages/static/PricesCatalogsPage.jsx
import React from 'react';
import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph } = Typography;

export function PricesCatalogsPage() {
	const { t } = useTranslation();

	return (
		<div style={{ padding: 16 }}>
			<Title level={2}>{t('static.pricesCatalogs.title')}</Title>
			<Paragraph>
				{t('static.pricesCatalogs.description')}
			</Paragraph>

			<Paragraph>
				<strong>{t('static.pricesCatalogs.tileFactories')}</strong>
				<ul>
					<li>{t('static.pricesCatalogs.factories.paradyz')}</li>
					<li>{t('static.pricesCatalogs.factories.bienSeramik')}</li>
					<li>{t('static.pricesCatalogs.factories.starGres')}</li>
				</ul>
			</Paragraph>

			<Paragraph>
				<strong>{t('static.pricesCatalogs.sanitaryFactories')}</strong>
				<ul>
					<li>{t('static.pricesCatalogs.factories.omnires')}</li>
					<li>{t('static.pricesCatalogs.factories.rea')}</li>
					<li>{t('static.pricesCatalogs.factories.isvea')}</li>
					<li>{t('static.pricesCatalogs.factories.lavita')}</li>
					<li>{t('static.pricesCatalogs.factories.calani')}</li>
				</ul>
			</Paragraph>
		</div>
	);
}
