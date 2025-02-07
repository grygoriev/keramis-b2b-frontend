import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

export const GlobalHeader = () => {
	const [currentLanguage, setCurrentLanguage] = useState(
		localStorage.getItem('lang') || 'ua',
	);
	const navigate = useNavigate();
	const { i18n, t } = useTranslation();
	const dispatch = useDispatch();

	const { isLoggedIn, username } = useSelector((state) => ({
		isLoggedIn: state.auth.isLoggedIn,
		username: state.auth.username,
	}));

	useEffect(() => {
		i18n.changeLanguage(currentLanguage);
	}, [currentLanguage, i18n]);

	const handleLogout = () => {
		// Redux logout
		dispatch(logout());
		// Чистим localStorage если нужно (иначе restoreAuth подумает, что мы залогинены)
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

			{/* Правая часть */}
			<div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
				<span>$42.1 ↑</span>
				<span>€43.85 ↑</span>

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

				<Button>{t('common.find')}</Button>

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
