// src/pages/category/components/SortSelect.jsx
import React from 'react';
import { Select } from 'antd';
import { useTranslation } from 'react-i18next';

/**
 * @param {string} value - текущее выбранное значение сортировки (price_asc, price_desc и т.д.)
 * @param {Function} onChange - колбэк, (newValue) => void
 */
export function SortSelect({ value, onChange }) {
	const { t } = useTranslation();

	const options = [
		{ value: 'id_asc',     label: t('sort.byDefault', 'По умолчанию') },
		{ value: 'price_asc',  label: t('sort.priceAsc', 'Цена (возрастание)') },
		{ value: 'price_desc', label: t('sort.priceDesc', 'Цена (убывание)') },
		{ value: 'name_asc',   label: t('sort.nameAsc', 'Название A-Z') },
		{ value: 'name_desc',  label: t('sort.nameDesc', 'Название Z-A') },
	];

	return (
		<div>
			<Select
				style={{ width: 200 }}
				value={value}
				onChange={onChange}
				options={options}
			/>
		</div>
	);
}
