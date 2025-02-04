import React from 'react';
import { Select } from 'antd';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
	const { i18n } = useTranslation();

	const handleChange = (value) => {
		i18n.changeLanguage(value);
		// optionally, сохраните выбранный язык в localStorage, чтобы при перезагрузке
		// приложение стартовало с нужного языка:
		localStorage.setItem('lang', value);
	};

	return (
		<Select
			defaultValue={i18n.language}
			style={{ width: 120 }}
			onChange={handleChange}
			options={[
				{ label: 'Українська', value: 'ua' },
				{ label: 'Русский', value: 'ru' },
			]}
		/>
	);
}
