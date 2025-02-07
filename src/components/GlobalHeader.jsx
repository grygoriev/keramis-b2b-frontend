import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const GlobalHeader = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [username, setUsername] = useState('');
	const [currentLanguage, setCurrentLanguage] = useState(
		localStorage.getItem('lang') || 'ua',
	);
	const navigate = useNavigate();
	const { i18n, t } = useTranslation();

	useEffect(() => {
		const token = localStorage.getItem('accessToken');
		const userName = localStorage.getItem('username');
		// Если нужна смена языка при загрузке:
		i18n.changeLanguage(currentLanguage);

		setIsLoggedIn(!!token);
		if (userName) {
			setUsername(userName);
		}
	}, [currentLanguage, i18n]);

	const handleLogout = () => {
		localStorage.removeItem('accessToken');
		localStorage.removeItem('role');
		localStorage.removeItem('username');
		setIsLoggedIn(false);
		setUsername('');
		navigate('/login');
	};

	const handleChangeLanguage = (value) => {
		setCurrentLanguage(value);
		i18n.changeLanguage(value);
		localStorage.setItem('lang', value);
	};

	// Простейшая стилизация: активный язык – синий и подчеркнутый, неактивный – серый
	const getLangStyle = (lang) => {
		if (lang === currentLanguage) {
			return {
				color: '#1890ff',
				textDecoration: 'underline',
				cursor: 'pointer',
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
			{/* Левая часть: логотип + ссылки */}
			<div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
				<Link
					to="/"
					style={{ fontWeight: 'bold', marginRight: 20, color: 'inherit' }}
				>
					KERAMIS+B2B
				</Link>
				<Link to="/help" style={{ color: 'inherit' }}>
					{t('common.help')}
				</Link>
				<Link to="/solutions" style={{ color: 'inherit' }}>
					{t('common.solutions')}
				</Link>
				<Link to="/orders" style={{ color: 'inherit' }}>
					{t('common.orders')}
				</Link>
				<Link to="#" style={{ color: 'inherit' }}>
					{t('common.more')}
				</Link>
			</div>

			{/* Правая часть: валюта, язык, поиск, Login/Logout */}
			<div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
				{/* Пример «курсов» */}
				<span>$42.1 ↑</span>
				<span>€43.85 ↑</span>

				{/* Переключение языка (UK | RU) */}
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

				{/* Кнопка поиска (можно сделать форму) */}
				<Button>{t('common.find')}</Button>

				{/* Если залогинен → «Hello, username» + Logout, иначе → Login */}
				{isLoggedIn ? (
					<>
						{username && <span>Hello, {username}</span>}
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
