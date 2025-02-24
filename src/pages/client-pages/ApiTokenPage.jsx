// src/pages/ApiTokenPage.jsx
import React, { useEffect, useState } from 'react';
import { Button, message, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { fetchMyToken, generateNewToken } from '../../api/apiTokenApi.js';

/**
 * Страница управления API-токеном:
 * - Отображает текущий токен (если есть)
 * - Кнопка для генерации/перегенерации
 * - Ссылки для скачивания товаров в формате CSV, XML, JSON
 */
export function ApiTokenPage() {
	const { t } = useTranslation();
	const [token, setToken] = useState(null);
	const [loading, setLoading] = useState(false);

	/**
	 * Загружаем текущий токен (если есть).
	 */
	const loadToken = async () => {
		setLoading(true);
		try {
			const resp = await fetchMyToken();
			const token = resp.data[0].token;
			if (resp.data && token) {
				setToken(token);
			} else {
				setToken(null);
			}
		} catch (err) {
			console.error(err);
			message.error(t('apiToken.loadError', 'Ошибка при получении токена'));
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Сгенерировать (или перегенерировать) токен.
	 * После этого нужно повторно запросить токен, чтобы показать обновлённый.
	 */
	const handleGenerate = async () => {
		setLoading(true);
		try {
			await generateNewToken();
			message.success(t('apiToken.generated', 'Токен успешно сгенерирован'));
			await loadToken(); // загружаем свежий токен
		} catch (err) {
			console.error(err);
			message.error(t('apiToken.generateError', 'Не удалось сгенерировать токен'));
			setLoading(false);
		}
	};

	useEffect(() => {
		loadToken();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/**
	 * Генерация ссылки для скачивания товаров.
	 * Эндпоинт: /api/v1/products/?format=csv|xml|json&token=...
	 */
	const getDownloadLink = (format) => {
		return `/api/v1/products/?format=${format}&token=${token}`;
	};

	return (
		<div style={{ padding: 16 }}>
			<h2>{t('apiToken.title', 'Управление API-токеном')}</h2>

			{/* Если токен есть, показываем, иначе пишем "Токен не сгенерирован" */}
			{token ? (
				<div style={{ marginBottom: 16 }}>
					<p>
						{t('apiToken.yourToken', 'Ваш токен')}:{' '}
						<strong style={{ color: '#1890ff' }}>{token}</strong>
					</p>

					<p>
						<a
							href={getDownloadLink('csv')}
							target="_blank"
							rel="noopener noreferrer"
							style={{ marginRight: 8 }}
						>
							{t('apiToken.downloadCsv', 'Скачать CSV')}
						</a>
						<a
							href={getDownloadLink('xml')}
							target="_blank"
							rel="noopener noreferrer"
							style={{ marginRight: 8 }}
						>
							{t('apiToken.downloadXml', 'Скачать XML')}
						</a>
						<a
							href={getDownloadLink('json')}
							target="_blank"
							rel="noopener noreferrer"
						>
							{t('apiToken.downloadJson', 'Скачать JSON')}
						</a>
					</p>
				</div>
			) : (
				<p style={{ marginBottom: 16 }}>
					{t('apiToken.noToken', 'Токен не сгенерирован.')}
				</p>
			)}

			<Space>
				<Button
					type="primary"
					onClick={handleGenerate}
					loading={loading}
				>
					{token
						? t('apiToken.regenerateBtn', 'Перегенерировать токен')
						: t('apiToken.generateBtn', 'Сгенерировать токен')}
				</Button>
				<Button onClick={loadToken} disabled={loading}>
					{t('common.refresh', 'Обновить')}
				</Button>
			</Space>
		</div>
	);
}
