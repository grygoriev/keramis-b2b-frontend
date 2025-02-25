// src/components/footer/components/FooterSocialBlock.jsx
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function FooterSocialBlock() {
	const { t } = useTranslation();

	return (
		<div>
			<div style={{ fontWeight: 'bold', fontSize: 24, marginBottom: 10 }}>
				{t('footer.middle.logo')}
			</div>
			<div style={{ marginBottom: 10 }}>{t('footer.middle.socialHeader')}</div>
			<div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
				<Link to="/">
					<img
						src="https://img.icons8.com/ios-filled/24/ffffff/telegram-app.png"
						alt="telegram"
					/>
				</Link>
				<Link to="/">
					<img
						src="https://img.icons8.com/ios-glyphs/24/ffffff/instagram-new.png"
						alt="instagram"
					/>
				</Link>
				<Link to="/">
					<img
						src="https://img.icons8.com/ios-filled/24/ffffff/facebook--v1.png"
						alt="facebook"
					/>
				</Link>
			</div>
		</div>
	);
}
