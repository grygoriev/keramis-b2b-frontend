import { useEffect } from 'react';
import AppRouter from './routes/AppRouter.jsx';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/es/locale/ru_RU';
import ukUA from 'antd/es/locale/uk_UA';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { restoreAuth } from './store/authSlice.js';

export const App = () => {
	// Чтобы локализовать системные тексты Ant Design
	const { i18n } = useTranslation();
	const currentLocale = i18n.language === 'ua' ? ukUA : ruRU;
	const dispatch = useDispatch();

	useEffect(() => {
		const token = localStorage.getItem('accessToken');
		const username = localStorage.getItem('username');
		const role = localStorage.getItem('role');

		dispatch(restoreAuth({ token, username, role }));
	}, [dispatch]);

	return (
		<ConfigProvider locale={currentLocale}>
			<AppRouter />
		</ConfigProvider>
	);
};
