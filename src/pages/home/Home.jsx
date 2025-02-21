// src/pages/Home.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

import { HomeBannerSlider, HomeActions } from './components';
import { ProductSection } from '../../components';

export function Home() {
	const { t } = useTranslation();

	return (
		<div>
			{/* Слайдер баннеров */}
			<HomeBannerSlider />

			{/* Кнопки (Сертификаты, Каталоги, Экспорт, Импорт) */}
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
