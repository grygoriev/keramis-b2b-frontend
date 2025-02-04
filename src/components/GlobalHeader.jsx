import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

export const GlobalHeader = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [username, setUsername] = useState('');
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem('accessToken');
		const userName = localStorage.getItem('username');
		setIsLoggedIn(!!token);
		if (userName) {
			setUsername(userName);
		}
	}, []);

	const handleLogout = () => {
		// Удаляем токен и роль (и username, если хранится)
		localStorage.removeItem('accessToken');
		localStorage.removeItem('role');
		localStorage.removeItem('username');
		setIsLoggedIn(false);
		setUsername('');
		// Перенаправляем на /login
		navigate('/login');
	};

	return (
		<div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
	);
}
