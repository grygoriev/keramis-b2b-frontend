import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { loginRequest } from '../api/auth'; // функция, шлёт запрос на backend

export default function Login() {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { t } = useTranslation();

	const onFinish = async (values) => {
		setLoading(true);
		try {
			const data = await loginRequest(values.username, values.password);
			// Предположим, бекенд вернет { access: '...', role: 'client_manager' }
			localStorage.setItem('accessToken', data.access);
			localStorage.setItem('role', data.role);

			// Редирект по роли
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
