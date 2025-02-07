import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function GlobalFooter() {
	const { t } = useTranslation();

	return (
		<div style={{ backgroundColor: '#000', color: '#fff' }}>
			{/* Верхний блок (Доставка, Гарантія, Оплата, Сервісна підтримка) */}
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-around',
					padding: '20px 0',
					borderBottom: '1px solid #333',
					backgroundColor: '#253248',
				}}
			>
				<div style={{ textAlign: 'center' }}>
					<div style={{ fontSize: 20 }}>
						{t('footer.top.delivery')}
					</div>
					<div style={{ fontSize: 12, marginTop: 5 }}>
						{t('footer.top.deliveryDesc')}
					</div>
				</div>
				<div style={{ textAlign: 'center' }}>
					<div style={{ fontSize: 20 }}>
						{t('footer.top.warranty')}
					</div>
					<div style={{ fontSize: 12, marginTop: 5 }}>
						{t('footer.top.warrantyDesc')}
					</div>
				</div>
				<div style={{ textAlign: 'center' }}>
					<div style={{ fontSize: 20 }}>
						{t('footer.top.payment')}
					</div>
					<div style={{ fontSize: 12, marginTop: 5 }}>
						{t('footer.top.paymentDesc')}
					</div>
				</div>
				<div style={{ textAlign: 'center' }}>
					<div style={{ fontSize: 20 }}>
						{t('footer.top.service')}
					</div>
					<div style={{ fontSize: 12, marginTop: 5 }}>
						{t('footer.top.serviceDesc')}
					</div>
				</div>
			</div>

			{/* Основной темный блок футера */}
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					padding: '20px 40px',
				}}
			>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						marginBottom: 20,
					}}
				>
					{/* Левая часть: Логотип, соцсети */}
					<div>
						<div style={{ fontWeight: 'bold', fontSize: 24, marginBottom: 10 }}>
							{t('footer.middle.logo')}
						</div>
						<div style={{ marginBottom: 10 }}>
							{t('footer.middle.socialHeader')}
						</div>
						<div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
							{/* Иконки соцсетей (заглушки), все ведут на главную */}
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

					{/* Колонки ссылок */}
					<div style={{ display: 'flex', gap: 60 }}>
						<div>
							<div style={{ fontWeight: 'bold', marginBottom: 10 }}>
								{t('footer.middle.catalog')}
							</div>
							<Link to="/" style={{ display: 'block', color: '#fff', marginBottom: 5 }}>
								{t('footer.middle.sale')}
							</Link>
							<Link to="/" style={{ display: 'block', color: '#fff', marginBottom: 5 }}>
								{t('footer.middle.new')}
							</Link>
							<Link to="/" style={{ display: 'block', color: '#fff', marginBottom: 5 }}>
								{t('footer.middle.promo')}
							</Link>
							<Link to="/" style={{ display: 'block', color: '#fff', marginBottom: 5 }}>
								{t('footer.middle.categories')}
							</Link>
							<Link to="/" style={{ display: 'block', color: '#fff', marginBottom: 5 }}>
								{t('footer.middle.discounted')}
							</Link>
							<Link to="/" style={{ display: 'block', color: '#fff', marginBottom: 5 }}>
								{t('footer.middle.brands')}
							</Link>
						</div>

						<div>
							<div style={{ fontWeight: 'bold', marginBottom: 10 }}>
								{t('footer.middle.forUser')}
							</div>
							<Link to="/" style={{ display: 'block', color: '#fff', marginBottom: 5 }}>
								{t('footer.middle.profile')}
							</Link>
							<Link to="/" style={{ display: 'block', color: '#fff', marginBottom: 5 }}>
								{t('footer.middle.myOrders')}
							</Link>
							<Link to="/" style={{ display: 'block', color: '#fff', marginBottom: 5 }}>
								{t('footer.middle.favorites')}
							</Link>
							<Link to="/" style={{ display: 'block', color: '#fff', marginBottom: 5 }}>
								{t('footer.middle.messages')}
							</Link>
							<Link to="/" style={{ display: 'block', color: '#fff', marginBottom: 5 }}>
								{t('footer.middle.export')}
							</Link>
							<Link to="/" style={{ display: 'block', color: '#fff', marginBottom: 5 }}>
								{t('footer.middle.return')}
							</Link>
						</div>

						<div>
							<div style={{ fontWeight: 'bold', marginBottom: 10 }}>
								{t('footer.middle.cooperation')}
							</div>
							<Link to="/" style={{ display: 'block', color: '#fff', marginBottom: 5 }}>
								{t('footer.middle.certificates')}
							</Link>
							<Link to="/" style={{ display: 'block', color: '#fff', marginBottom: 5 }}>
								{t('footer.middle.catalogs')}
							</Link>
							<Link to="/" style={{ display: 'block', color: '#fff', marginBottom: 5 }}>
								{t('footer.middle.webResources')}
							</Link>
							<Link to="/" style={{ display: 'block', color: '#fff', marginBottom: 5 }}>
								{t('footer.middle.videoCatalog')}
							</Link>
							<Link to="/" style={{ display: 'block', color: '#fff', marginBottom: 5 }}>
								{t('footer.middle.collabTerms')}
							</Link>
						</div>

						<div>
							<div style={{ fontWeight: 'bold', marginBottom: 10 }}>
								{t('footer.middle.help')}
							</div>
							<div style={{ marginBottom: 5 }}>{t('footer.middle.hotLine')}</div>
							<div style={{ marginBottom: 5 }}>
								{t('footer.middle.serviceSupport')}
							</div>
							<div style={{ marginBottom: 5 }}>{t('footer.middle.email')}</div>
							<div style={{ marginBottom: 5 }}>
								{t('footer.middle.telegramChat')}
							</div>
							<div>{t('footer.middle.managerContact')}</div>
						</div>
					</div>
				</div>

				{/* Нижняя строка копирайта */}
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
			</div>
		</div>
	);
}
