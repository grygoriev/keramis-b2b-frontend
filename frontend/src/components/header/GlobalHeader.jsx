// src/components/header/GlobalHeader.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice.js';
import { logoutRequest } from '../../api/auth.js';
import { CartIcon, Currency, GlobalSearch, LanguageSwitcher, Logo, UserBlock } from './components/index.js';
import { fetchCartsAsync } from '../../store/cartSlice.js';

export const GlobalHeader = () => {
	const [currentLanguage, setCurrentLanguage] = useState(
		localStorage.getItem('lang') || 'ua',
	);
	const navigate = useNavigate();
	const { i18n, t } = useTranslation();
	const dispatch = useDispatch();

	const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
	const username = useSelector((state) => state.auth.username);
	const role = useSelector((state) => state.auth.role);
	const dashboard = role === 'internal_manager' ? '/admin' : '/client';

	useEffect(() => {
		i18n.changeLanguage(currentLanguage);
	}, [currentLanguage, i18n]);

	useEffect(() => {
		if (isLoggedIn) {
			const langParam = currentLanguage === 'ua' ? 'uk' : currentLanguage;
			dispatch(fetchCartsAsync(langParam));
		}
	}, [isLoggedIn, currentLanguage, dispatch]);

	const handleLogout = async () => {
		try {
			await logoutRequest();
		} catch (err) {
			console.error('Logout error:', err);
		}
		dispatch(logout());
		localStorage.removeItem('role');
		localStorage.removeItem('username');
		navigate('/login');
	};

	const handleChangeLanguage = (value) => {
		setCurrentLanguage(value);
		i18n.changeLanguage(value);
		localStorage.setItem('lang', value);
	};

	return (
		<div
			style={{
				background: '#fff',
				height: 50,
				padding: '0 16px',
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
			}}
		>
			{/* Левая часть */}
			<div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
				<Logo />
				{/*<Link to="/help" style={{ color: 'inherit' }}>*/}
				{/*	{t('common.help')}*/}
				{/*</Link>*/}
				{/*<Link to="/solutions" style={{ color: 'inherit' }}>*/}
				{/*	{t('common.solutions')}*/}
				{/*</Link>*/}
				{/*<Link to={dashboard} style={{ color: 'inherit' }}>*/}
				{/*	{t('common.dashboard')}*/}
				{/*</Link>*/}
				{/*<Link to="#" style={{ color: 'inherit' }}>*/}
				{/*	{t('common.more')}*/}
				{/*</Link>*/}
			</div>

			{/* Правая часть */}
			<div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
				{/* Курсы валют */}
				<Currency />

				{/* Переключение языка */}
				<LanguageSwitcher
					currentLanguage={currentLanguage}
					onChangeLanguage={handleChangeLanguage}
				/>

				{/* Быстрый поиск */}
				<GlobalSearch />

				{/* Иконка корзины */}
				<CartIcon />

				<UserBlock
					isLoggedIn={isLoggedIn}
					username={username}
					dashboardPath={dashboard}
					onLogout={handleLogout}
				/>
			</div>
		</div>
	);
};
