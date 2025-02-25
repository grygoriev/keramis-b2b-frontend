// src/components/footer/components/FooterBottomBlock.jsx
import { useTranslation } from 'react-i18next';

export function FooterBottomBlock() {
	const { t } = useTranslation();

	return (
		<div
			style={{
				textAlign: 'center',
				fontSize: 12,
				borderTop: '1px solid #333',
				paddingTop: 10,
			}}
		>
			{t('footer.copyright.text')}
		</div>
	);
}
