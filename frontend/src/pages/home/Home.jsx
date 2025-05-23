// src/pages/home/Home.jsx
import { useTranslation } from 'react-i18next';

import { HomeBannerSlider, HomeActions } from './components/index.js';
import { ProductSection } from '../../components/index.js';

export function Home() {
	const { t } = useTranslation();

	return (
		<div className="container">
			{/* Слайдер баннеров */}
			<HomeBannerSlider />

			{/* Кнопки (Сертификаты, Каталоги ...) */}
			<HomeActions />

			{/* Раздел "Новинки" */}
			<ProductSection
				title={t('homePage.newProducts', 'Новинки')}
				filter="new"
				limit={4}
			/>

			{/* Раздел "Акции" */}
			<ProductSection
				title={t('homePage.promo', 'Акции')}
				filter="promo"
				limit={4}
			/>

			{/* Раздел "Распродажа" */}
			<ProductSection
				title={t('homePage.sales', 'Распродажа')}
				filter="sale"
				limit={4}
			/>
		</div>
	);
}
