import React, { useEffect } from 'react';
import { Card, Button, Input, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { loginRequest } from '../../api/auth';
import { selectIsLoggedIn, selectUserRole, setAuthData } from '../../store/authSlice';

const schema = yup.object().shape({
	username: yup.string().required('Username is required'),
	password: yup.string().required('Password is required'),
});

export function Login() {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const dispatch = useDispatch();

	const isLoggedIn = useSelector(selectIsLoggedIn);
	const role = useSelector(selectUserRole);

	useEffect(() => {
		if (isLoggedIn) {
			if (role && role.includes('client')) {
				navigate('/client');
			} else {
				navigate('/admin');
			}
		}
	}, [isLoggedIn, role, navigate]);

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm({
		resolver: yupResolver(schema),
	});

	const onSubmit = async (values) => {
		try {
			const data = await loginRequest(values.username, values.password);

			dispatch(
				setAuthData({
					username: data.username,
					role: data.role,
				}),
			);

			if (data.role.includes('client')) {
				navigate('/client');
			} else {
				navigate('/admin');
			}
		} catch (error) {
			if (error.response) {
				if (error.response.status === 400 || error.response.status === 401) {
					const detail = error.response.data?.detail;
					if (detail) {
						message.error(detail);
					} else {
						message.error(
							t(
								'loginPage.invalidCredentials',
								'Неверный логин или пароль',
							),
						);
					}
				} else {
					message.error(t('loginPage.loginFailed', 'Login failed'));
				}
			} else {
				message.error(t('errors.networkError', 'Ошибка сети'));
			}
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
				<h2>{t('common.login', 'Login')}</h2>

				<form onSubmit={handleSubmit(onSubmit)}>
					{/* Поле: username */}
					<div style={{ marginBottom: 12 }}>
						<label>{t('loginPage.username', 'Username')}</label>
						<Controller
							name="username"
							control={control}
							render={({ field, fieldState }) => (
								<>
									<Input
										{...field}
										placeholder={t('loginPage.username', 'Username')}
										status={fieldState.error ? 'error' : ''}
									/>
									{fieldState.error && (
										<div style={{ color: 'red', fontSize: 12 }}>
											{fieldState.error.message}
										</div>
									)}
								</>
							)}
						/>
					</div>

					{/* Поле: password */}
					<div style={{ marginBottom: 12 }}>
						<label>{t('loginPage.password', 'Password')}</label>
						<Controller
							name="password"
							control={control}
							render={({ field, fieldState }) => (
								<>
									<Input.Password
										{...field}
										placeholder={t('loginPage.password', 'Password')}
										status={fieldState.error ? 'error' : ''}
									/>
									{fieldState.error && (
										<div style={{ color: 'red', fontSize: 12 }}>
											{fieldState.error.message}
										</div>
									)}
								</>
							)}
						/>
					</div>

					<Button type="primary" htmlType="submit" loading={isSubmitting} block>
						{t('loginPage.button', 'Login')}
					</Button>

					<div style={{ marginTop: 16, textAlign: 'center' }}>
						{t('loginPage.noAccount', 'Нет аккаунта?')}{' '}
						<Link to="/register">
							{t('loginPage.registerNow', 'Зарегистрируйтесь')}
						</Link>
					</div>
				</form>
			</Card>
		</div>
	);
}
