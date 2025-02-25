// src/pages/static/AboutCompanyPage.jsx
import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph } = Typography;

export function AboutCompanyPage() {
	const { t } = useTranslation();

	return (
		<div style={{ padding: 16 }}>
			<Title level={2}>{t('static.about.title')}</Title>
			<Paragraph>
				{t('static.about.content1')}
			</Paragraph>
			<Paragraph>
				{t('static.about.content2')}
			</Paragraph>
			<Paragraph>
				{t('static.about.content3')}
			</Paragraph>
			<Paragraph>
				<strong>{t('static.about.advantagesTitle')}</strong>
				<ul>
					<li>{t('static.about.advantages.item1')}</li>
					<li>{t('static.about.advantages.item2')}</li>
					<li>{t('static.about.advantages.item3')}</li>
					<li>{t('static.about.advantages.item4')}</li>
					<li>{t('static.about.advantages.item5')}</li>
				</ul>
			</Paragraph>
			<Paragraph>
				{t('static.about.conclusion')}
			</Paragraph>
		</div>
	);
}
