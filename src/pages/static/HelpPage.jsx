// src/pages/static/HelpPage.jsx
import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph } = Typography;

export function HelpPage() {
	const { t } = useTranslation();

	return (
		<div style={{ padding: 16 }}>
			<Title level={2}>{t('static.help.title')}</Title>
			<Paragraph>
				{t('static.help.content')}
			</Paragraph>
		</div>
	);
}
