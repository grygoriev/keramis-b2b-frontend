// src/components/footer/components/FooterMiddleBlock.jsx
import { useTranslation } from 'react-i18next';
import { FooterLinksColumn, FooterSocialBlock } from './components';

export function FooterMiddleBlock() {
	const { t } = useTranslation();

	// Массив колонок
	const columns = [
		{
			title: t('footer.middle.catalog'),
			links: [
				{ to: '/search?fv_product_list=sale', label: t('footer.middle.sale') },
				{ to: '/search?fv_product_list=new', label: t('footer.middle.new') },
				{ to: '/search?fv_product_list=promo', label: t('footer.middle.promo') },
				// { to: '/', label: t('footer.middle.categories') },
				// { to: '/', label: t('footer.middle.discounted') },
				// { to: '/', label: t('footer.middle.brands') },
			],
		},
		{
			title: t('footer.middle.forUser'),
			links: [
				// { to: '/', label: t('footer.middle.profile') },
				{ to: '/my-orders', label: t('footer.middle.myOrders') },
				{ to: '/carts', label: t('footer.middle.favorites') },
				// { to: '/', label: t('footer.middle.messages') },
				// { to: '/', label: t('footer.middle.export') },
				// { to: '/', label: t('footer.middle.return') },
			],
		},
		{
			title: t('footer.middle.cooperation'),
			links: [
				{ to: '/certificates', label: t('footer.middle.certificates') },
				{ to: '/prices-catalogs', label: t('footer.middle.catalogs') },
				// { to: '/', label: t('footer.middle.webResources') },
				// { to: '/', label: t('footer.middle.videoCatalog') },
				{ to: '/cooperation', label: t('footer.middle.collabTerms') },
			],
		},
		{
			title: t('footer.middle.help'),
			links: [
				{ to: '/service-support', label: t('footer.middle.hotLine') },
				{ to: '/service-support', label: t('footer.middle.serviceSupport') },
				{ to: '/contacts', label: t('footer.middle.email') },
				{ to: '/contacts', label: t('footer.middle.telegramChat') },
				{ to: '/contacts', label: t('footer.middle.managerContact') },
			],
		},
	];

	return (
		<div style={{ display: 'flex', flexDirection: 'column', padding: '20px 40px' }}>
			<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
				{/* Левая часть (Логотип, соцсети) */}
				<FooterSocialBlock />

				{/* Колонки ссылок */}
				<div style={{ display: 'flex', gap: 60 }}>
					{columns.map((col, idx) => (
						<FooterLinksColumn
							key={idx}
							title={col.title}
							links={col.links}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
