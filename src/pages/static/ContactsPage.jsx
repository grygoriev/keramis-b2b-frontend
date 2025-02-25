// src/pages/static/ContactsPage.jsx
import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph } = Typography;

export function ContactsPage() {
	const { t } = useTranslation();

	return (
		<div style={{ padding: 16 }}>
			<Title level={2}>{t('static.contacts.title')}</Title>
			<Paragraph>
				<strong>{t('static.contacts.phonesTitle')}</strong>
				<ul>
					<li>{t('static.contacts.phones.manager1')}</li>
					<li>{t('static.contacts.phones.manager2')}</li>
					<li>{t('static.contacts.phones.manager3')}</li>
				</ul>
			</Paragraph>

			<Paragraph>
				<strong>{t('static.contacts.addressesTitle')}</strong>
				<ul>
					<li>{t('static.contacts.addresses.stock1')}</li>
					<li>{t('static.contacts.addresses.stock2')}</li>
				</ul>
			</Paragraph>

			<Paragraph>
				<strong>{t('static.contacts.workingHoursTitle')}</strong><br />
				{t('static.contacts.workingHours.office')}<br />
				{t('static.contacts.workingHours.stocks')}
			</Paragraph>
		</div>
	);
}
