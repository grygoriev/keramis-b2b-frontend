// src/components/header/GlobalHeader.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { logout } from '../../store/authSlice';
import { setLang } from '../../store/langSlice';
import { logoutRequest } from '../../api/auth';
import { fetchCartsAsync } from '../../store/cartSlice';

import {
	CartIcon,
	Currency,
	GlobalSearch,
	LanguageSwitcher,
	Logo,
	UserBlock,
} from './components';

export const GlobalHeader = () => {
	const navigate = useNavigate();
	const { i18n, t } = useTranslation();
	const dispatch = useDispatch();

	const currentLanguage = useSelector((state) => state.lang.currentLang);
	const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
	const username = useSelector((state) => state.auth.username);
	const role = useSelector((state) => state.auth.role);

	const dashboard = role === 'internal_manager' ? '/admin' : '/client';

	// Каждый раз при смене currentLanguage - меняем язык i18n
	useEffect(() => {
		i18n.changeLanguage(currentLanguage);
	}, [currentLanguage, i18n]);

	// Грузим корзины, если залогинены
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

	// Меняем язык через Redux
	const handleChangeLanguage = (newLang) => {
		dispatch(setLang(newLang));
		i18n.changeLanguage(newLang);
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
			</div>

			{/* Правая часть */}
			<div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
				<Currency />

				<LanguageSwitcher
					currentLanguage={currentLanguage}
					onChangeLanguage={handleChangeLanguage}
				/>

				<GlobalSearch />

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
