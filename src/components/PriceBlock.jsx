// src/components/PriceBlock.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

export function PriceBlock({ price, discountedPrice }) {
	const { t } = useTranslation();

	// Приводим цены к числу и форматируем
	const mainPrice = Number(price).toFixed(0);
	const discountPrice = discountedPrice ? Number(discountedPrice).toFixed(0) : null;

	return (
		<div>
			<div>
				{t('common.price', 'Цена')}: {mainPrice} грн
			</div>
			{discountPrice && discountPrice !== mainPrice && (
				<div style={{ color: 'red', fontWeight: 'bold' }}>
					{t('common.discounted_price', 'Оптовая цена')}: {discountPrice} грн
				</div>
			)}
		</div>
	);
}
