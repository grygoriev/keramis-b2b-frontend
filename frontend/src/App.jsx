import { useEffect, useState } from 'react';
import AppRouter from './routes/AppRouter.jsx';
import { ConfigProvider, Spin } from 'antd';
import ruRU from 'antd/es/locale/ru_RU';
import ukUA from 'antd/es/locale/uk_UA';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { restoreAuth } from './store/authSlice.js';
import { fetchCurrencyRates } from './store/currencySlice';


export const App = () => {
	// Чтобы локализовать системные тексты Ant Design
	const { i18n } = useTranslation();
	const currentLocale = i18n.language === 'ua' ? ukUA : ruRU;
	const dispatch = useDispatch();
	const [appReady, setAppReady] = useState(false);

	useEffect(() => {
		const username = localStorage.getItem('username');
		const role = localStorage.getItem('role');
		if (role) {
			dispatch(restoreAuth({ username, role }));
		}
		dispatch(fetchCurrencyRates());
		setAppReady(true);
	}, [dispatch]);

	if (!appReady) {
		return <Spin />;
	}

	return (
		<ConfigProvider locale={currentLocale}>
			<AppRouter />
		</ConfigProvider>
	);
};
