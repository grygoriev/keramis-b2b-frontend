// src/pages/Login.jsx

import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { loginRequest } from '../api/auth';

// Подключаем Redux
import { useDispatch, useSelector } from 'react-redux';
import { setAuthData } from '../store/authSlice';

export default function Login() {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { t } = useTranslation();
	const dispatch = useDispatch();

	// Если уже залогинен, можно редиректить
	const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
	useEffect(() => {
		if (isLoggedIn) {
			const role = localStorage.getItem('role');
			if (role && role.includes('client')) {
				navigate('/client');
			} else {
				navigate('/admin');
			}
		}
	}, [isLoggedIn, navigate]);

	const onFinish = async (values) => {
		setLoading(true);
		try {
			const data = await loginRequest(values.username, values.password);

			// Записываем в Redux state
			dispatch(
				setAuthData({
					username: data.username,
					role: data.role,
				})
			);

			// Пишем в localStorage (если нужно при перезагрузке)
			localStorage.setItem('role', data.role);
			if (data.username) {
				localStorage.setItem('username', data.username);
			}

			// Редирект
			if (data.role.includes('client')) {
				navigate('/client');
			} else {
				navigate('/admin');
			}
		} catch (error) {
			console.error(error);
			message.error('Login failed');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			style={{
				display: 'flex',
				height: '100vh',
				background: '#f0f2f5',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<Card style={{ width: 300 }}>
				<h2>{t('common.login')}</h2>
				<Form onFinish={onFinish}>
					<Form.Item
						name="username"
						rules={[{ required: true, message: t('loginPage.username') }]}
					>
						<Input placeholder={t('loginPage.username')} />
					</Form.Item>
					<Form.Item
						name="password"
						rules={[{ required: true, message: t('loginPage.password') }]}
					>
						<Input.Password placeholder={t('loginPage.password')} />
					</Form.Item>
					<Button type="primary" htmlType="submit" loading={loading} block>
						{t('loginPage.button')}
					</Button>
				</Form>
			</Card>
		</div>
	);
}
