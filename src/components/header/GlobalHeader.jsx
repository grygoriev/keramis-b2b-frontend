// src/components/header/GlobalHeader.jsx

import React, { useEffect, useState } from 'react';
import { Button, Tooltip } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { logoutRequest } from '../../api/auth';
import { CartIcon } from './cart/CartIcon';
import { fetchCartsAsync } from '../../store/cartSlice';
import { GlobalSearch } from './search/GlobalSearch';
import { Logo } from './logo/Logo.jsx';


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

	const getLangStyle = (lang) => {
		if (lang === currentLanguage) {
			return {
				color: '#000',
				textDecoration: 'none',
				fontWeight: 'bold',
			};
		}
		return {
			color: '#aaa',
			textDecoration: 'none',
			cursor: 'pointer',
		};
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
				<span>$42.1 ↑</span>
				<span>€43.85 ↑</span>

				{/* Переключение языка */}
				<div style={{ display: 'flex', gap: 8 }}>
					<span
						style={getLangStyle('ua')}
						onClick={() => handleChangeLanguage('ua')}
					>
						UK
					</span>
					<span>|</span>
					<span
						style={getLangStyle('ru')}
						onClick={() => handleChangeLanguage('ru')}
					>
						RU
					</span>
				</div>

				{/* Наш новый компонент быстрого поиска */}
				<GlobalSearch />

				{/* Иконка корзины */}
				<CartIcon />

				{isLoggedIn ? (
					<>
						{username && (
							<Tooltip title={t('common.dashboard', 'Перейти в кабинет')}>
								<Link to={dashboard} style={{ color: 'inherit' }}>
									Hello, {username}
								</Link>
							</Tooltip>
						)}
						<Button danger onClick={handleLogout}>
							Logout
						</Button>
					</>
				) : (
					<Link to="/login">
						<Button type="primary">Login</Button>
					</Link>
				)}
			</div>
		</div>
	);
};
