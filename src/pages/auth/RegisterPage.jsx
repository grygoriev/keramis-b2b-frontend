// src/pages/auth/RegisterPage.jsx
import { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
/* import ReCAPTCHA from 'react-google-recaptcha'; // <-- комментируем пока не нужно */

import { useDispatch } from 'react-redux';
import { setAuthData } from '../../store/authSlice';

import { registerRequest } from '../../api/auth';

export function RegisterPage() {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { t } = useTranslation();
	const dispatch = useDispatch();

	// /* const recaptchaRef = useRef(null); */
	// const RECAPTCHA_SITE_KEY = '...'; // когда будет домен

	const onFinish = async (values) => {
		const { username, email, password, confirm_password } = values;

		if (password !== confirm_password) {
			message.error(t('register.passwordMismatch', 'Пароли не совпадают'));
			return;
		}

		setLoading(true);
		try {
			// invisible reCAPTCHA:
			// const recaptchaToken = await recaptchaRef.current.executeAsync();
			// И передать recaptchaToken в registerRequest(...recaptchaToken).
			const regData = await registerRequest(username, email, password, confirm_password);

			// Бэкенд при регистрации установил HttpOnly cookie
			message.success(t('register.success', 'Вы успешно зарегистрированы!'));

			// Достаем поля (role, username) из ответа
			const { role, username: newUser } = regData;

			// Запись в Redux store
			dispatch(
				setAuthData({
					username: newUser,
					role,
				})
			);

			localStorage.setItem('role', role);
			if (newUser) {
				localStorage.setItem('username', newUser);
			}

			// Редирект
			if (role && role.includes('client')) {
				navigate('/client');
			} else {
				navigate('/admin');
			}
		} catch (err) {
			console.error(err);
			if (err.response && err.response.data) {
				message.error(JSON.stringify(err.response.data));
			} else {
				message.error(t('register.failed', 'Ошибка регистрации'));
			}
		} finally {
			setLoading(false);
			// if (recaptchaRef.current) recaptchaRef.current.reset();
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
			<Card style={{ width: 400 }}>
				<h2>{t('register.title', 'Регистрация')}</h2>
				<Form layout="vertical" onFinish={onFinish}>
					<Form.Item
						name="username"
						label={t('register.username', 'Имя пользователя')}
						rules={[{ required: true, message: t('register.usernameReq', 'Введите имя пользователя') }]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						name="email"
						label={t('register.email', 'Email')}
						rules={[
							{ required: true, message: t('register.emailReq', 'Введите email') },
							{ type: 'email', message: t('register.emailValid', 'Некорректный email') },
						]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						name="password"
						label={t('register.password', 'Пароль')}
						rules={[{ required: true, message: t('register.passwordReq', 'Введите пароль') }]}
					>
						<Input.Password />
					</Form.Item>

					<Form.Item
						name="confirm_password"
						label={t('register.confirmPassword', 'Подтвердите пароль')}
						rules={[{ required: true, message: t('register.confirmReq', 'Подтвердите пароль') }]}
					>
						<Input.Password />
					</Form.Item>

					<Form.Item>
						<Button type="primary" htmlType="submit" loading={loading} block>
							{t('register.submitBtn', 'Зарегистрироваться')}
						</Button>
					</Form.Item>
				</Form>

		{/* reCAPTCHA была бы здесь, но мы её закомментировали
        <ReCAPTCHA
          sitekey={RECAPTCHA_SITE_KEY}
          size="invisible"
          ref={recaptchaRef}
        />
        */}
			</Card>
		</div>
	);
}
