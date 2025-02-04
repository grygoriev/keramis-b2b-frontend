import React from 'react';
import AppRouter from './routes/AppRouter';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/es/locale/ru_RU';
import ukUA from 'antd/es/locale/uk_UA';
import { useTranslation } from 'react-i18next';

export const App = () => {
	// Чтобы локализовать системные тексты Ant Design
	const { i18n } = useTranslation();
	const currentLocale = i18n.language === 'ua' ? ukUA : ruRU;

	return (
		<ConfigProvider locale={currentLocale}>
			<AppRouter />
		</ConfigProvider>
	);
};
