// src/pages/Home.jsx
import React from 'react';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';

export function Home() {
	const { t } = useTranslation();

	return (
		<div>
			<h1>{t('homePage.bannerWelcome')}</h1>
			<p>{t('homePage.subtitle')}</p>

			{/* Пример "баннера" */}
			<div
				style={{
					background: 'red',
					color: '#fff',
					padding: '16px',
					marginBottom: '16px',
				}}
			>
				<h2>НОВЕ РОЗМІЩЕННЯ РЕКЛАМНИХ БАНЕРІВ!</h2>
				<p>
					Для більш точної цільової взаємодії усі рекламні банери
					знаходяться в тематичних розділах:
				</p>
				<div style={{ display: 'flex', gap: '10px' }}>
					<div>#новинки</div>
					<div>#акція</div>
					<div>#разом_дешевше</div>
					<div>#інформація</div>
				</div>
			</div>

			{/* Блоки "Сертифікати", "Каталоги", ... */}
			<div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
				<Button>{t('homePage.certificates')}</Button>
				<Button>{t('homePage.catalogs')}</Button>
				<Button>{t('homePage.export')}</Button>
				<Button>{t('homePage.import')}</Button>
			</div>

			{/* Пример "Новинки" товары */}
			<h2>{t('homePage.newProducts')}</h2>
			<div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
				<div style={{ width: 120, height: 120, background: '#f0f2f5' }}>Товар 1</div>
				<div style={{ width: 120, height: 120, background: '#f0f2f5' }}>Товар 2</div>
				<div style={{ width: 120, height: 120, background: '#f0f2f5' }}>Товар 3</div>
			</div>

			{/* Пример "Акции" */}
			<h2>{t('homePage.promo')}</h2>
			<div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
				<div style={{ width: 120, height: 120, background: '#f0f2f5' }}>Товар 1</div>
				<div style={{ width: 120, height: 120, background: '#f0f2f5' }}>Товар 2</div>
				<div style={{ width: 120, height: 120, background: '#f0f2f5' }}>Товар 3</div>
			</div>

			{/* Пример "Распродажа" */}
			<h2>{t('homePage.sales')}</h2>
			<div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
				<div style={{ width: 120, height: 120, background: '#f0f2f5' }}>Товар 1</div>
				<div style={{ width: 120, height: 120, background: '#f0f2f5' }}>Товар 2</div>
				<div style={{ width: 120, height: 120, background: '#f0f2f5' }}>Товар 3</div>
			</div>
		</div>
	);
}
