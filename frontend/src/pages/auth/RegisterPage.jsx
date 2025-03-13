// src/pages/auth/RegisterPage.jsx
import React from 'react';
import { Card, Button, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
/* import ReCAPTCHA from 'react-google-recaptcha'; // <-- комментируем пока не нужно */

import { useDispatch } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { setAuthData } from '../../store/authSlice';
import { registerRequest } from '../../api/auth';

// Описание схемы валидации Yup
const registerSchema = yup.object().shape({
	username: yup.string().required('Введите имя пользователя'),
	email: yup
		.string()
		.required('Введите email')
		.email('Некорректный email'),
	password: yup
		.string()
		.required('Введите пароль')
		.min(6, 'Минимум 6 символов'),
	confirm_password: yup
		.string()
		.required('Подтвердите пароль')
		.oneOf([yup.ref('password')], 'Пароли не совпадают'),
});

export function RegisterPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	// Настраиваем React Hook Form
	// mode: 'onChange' → валидация будет на каждом изменении ввода
	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting, isValid },
	} = useForm({
		mode: 'onChange',              // валидация в режиме "onChange"
		resolver: yupResolver(registerSchema),
	});

	// /* const recaptchaRef = useRef(null);
	// const RECAPTCHA_SITE_KEY = '...'; // когда будет домен */

	const onSubmit = async (values) => {
		const { username, email, password, confirm_password } = values;
		// if (recaptchaRef.current) { const recaptchaToken = await recaptchaRef.current.executeAsync(); }

		try {
			const regData = await registerRequest(
				username,
				email,
				password,
				confirm_password
			);

			message.success(t('register.success', 'Вы успешно зарегистрированы!'));

			const { role, username: newUser } = regData;

			// Запись в Redux
			dispatch(
				setAuthData({
					username: newUser,
					role,
				}),
			);

			localStorage.setItem('role', role);
			if (newUser) {
				localStorage.setItem('username', newUser);
			}

			// Редирект
			if (role && role.includes('client')) {
				navigate('/client/dashboard');
			} else {
				navigate('/admin/dashboard');
			}
		} catch (err) {
			console.error(err);
			if (err.response && err.response.data) {
				message.error(JSON.stringify(err.response.data));
			} else {
				message.error(t('register.failed', 'Ошибка регистрации'));
			}
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

				<form onSubmit={handleSubmit(onSubmit)}>
					{/* username */}
					<div style={{ marginBottom: 12 }}>
						<label>{t('register.username', 'Имя пользователя')}</label>
						<Controller
							name="username"
							control={control}
							render={({ field, fieldState }) => (
								<>
									<Input
										{...field}
										placeholder={t('register.username', 'Имя пользователя')}
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

					{/* email */}
					<div style={{ marginBottom: 12 }}>
						<label>{t('register.email', 'Email')}</label>
						<Controller
							name="email"
							control={control}
							render={({ field, fieldState }) => (
								<>
									<Input
										{...field}
										placeholder={t('register.email', 'Email')}
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

					{/* password */}
					<div style={{ marginBottom: 12 }}>
						<label>{t('register.password', 'Пароль')}</label>
						<Controller
							name="password"
							control={control}
							render={({ field, fieldState }) => (
								<>
									<Input.Password
										{...field}
										placeholder={t('register.password', 'Пароль')}
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

					{/* confirm_password */}
					<div style={{ marginBottom: 12 }}>
						<label>{t('register.confirmPassword', 'Подтвердите пароль')}</label>
						<Controller
							name="confirm_password"
							control={control}
							render={({ field, fieldState }) => (
								<>
									<Input.Password
										{...field}
										placeholder={t('register.confirmPassword', 'Подтвердите пароль')}
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

					{/* Кнопка заблокирована, если форма не валидна или идёт сабмит */}
					<Button
						type="primary"
						htmlType="submit"
						loading={isSubmitting}
						disabled={!isValid || isSubmitting}
						block
					>
						{t('register.submitBtn', 'Зарегистрироваться')}
					</Button>
				</form>

				{/* reCAPTCHA (invisible) была бы здесь:
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
