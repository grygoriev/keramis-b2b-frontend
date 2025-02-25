// src/pages/static/DeliveryPage.jsx
import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph } = Typography;

export function ServiceSupportPage() {
	const { t } = useTranslation();

	return (
		<div style={{ padding: 16 }}>
			<Title level={2}>{t('static.serviceSupport.title')}</Title>
			<Paragraph>
				{t('static.serviceSupport.content')}
			</Paragraph>
		</div>
	);
}
