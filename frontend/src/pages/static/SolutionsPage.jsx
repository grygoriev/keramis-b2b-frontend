// src/pages/static/SolutionsPage.jsx
import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph } = Typography;

export function SolutionsPage() {
	const { t } = useTranslation();

	return (
		<div style={{ padding: 16 }}>
			<Title level={2}>{t('static.solutions.title')}</Title>
			<Paragraph>
				{t('static.solutions.content')}
			</Paragraph>
		</div>
	);
}
