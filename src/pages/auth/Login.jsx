// src/pages/auth/Login.jsx
import { useEffect, useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { loginRequest } from '../../api/auth';

import { useDispatch, useSelector } from 'react-redux';
import { setAuthData } from '../../store/authSlice';

export function Login() {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { t } = useTranslation();
	const dispatch = useDispatch();

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

			// Записать в Redux
			dispatch(
				setAuthData({
					username: data.username,
					role: data.role,
				})
			);

			// LocalStorage
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

					<div style={{ marginTop: 16, textAlign: 'center' }}>
						{/* Ссылка на регистрацию */}
						{t('loginPage.noAccount', 'Нет аккаунта?')}{' '}
						<Link to="/register">
							{t('loginPage.registerNow', 'Зарегистрируйтесь')}
						</Link>
					</div>
				</Form>
			</Card>
		</div>
	);
}
