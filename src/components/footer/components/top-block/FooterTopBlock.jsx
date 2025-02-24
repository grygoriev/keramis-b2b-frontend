// src/components/footer/components/FooterTopBlock.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

export function FooterTopBlock() {
	const { t } = useTranslation();

	// Четыре «карточки»: delivery, warranty, payment, service
	const items = [
		{
			title: t('footer.top.delivery'),
			desc: t('footer.top.deliveryDesc'),
		},
		{
			title: t('footer.top.warranty'),
			desc: t('footer.top.warrantyDesc'),
		},
		{
			title: t('footer.top.payment'),
			desc: t('footer.top.paymentDesc'),
		},
		{
			title: t('footer.top.service'),
			desc: t('footer.top.serviceDesc'),
		},
	];

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'space-around',
				padding: '20px 0',
				borderBottom: '1px solid #333',
				backgroundColor: '#253248',
			}}
		>
			{items.map((item, idx) => (
				<div key={idx} style={{ textAlign: 'center' }}>
					<div style={{ fontSize: 20 }}>{item.title}</div>
					<div style={{ fontSize: 12, marginTop: 5 }}>{item.desc}</div>
				</div>
			))}
		</div>
	);
}
