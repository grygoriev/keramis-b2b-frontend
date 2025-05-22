// src/components/LoadingWrapper.jsx
import { Spin, Alert } from 'antd';

/**
 * Универсальная обёртка для отображения:
 * - Спиннера при loading
 * - Ошибки, если error не пуст
 * - Или children, если всё ок
 *
 * @param {boolean} loading
 * @param {any} error - строка или объект с сообщением
 * @param {any} data - если нужно проверить, что есть данные
 * @param {ReactNode} children
 */
export function LoadingWrapper({ loading, error, data, children }) {
	if (loading) {
		return <Spin style={{ display: 'block', margin: '20px auto' }} />;
	}
	if (error) {
		// Можно передавать error как строку. Или если объект — вывести error.message.
		const errMsg = typeof error === 'string' ? error : (error?.message || 'Error');
		return <Alert message={errMsg} type="error" />;
	}
	if (!data) {
		// Если data=null/undefined — покажем "нет данных"
		return <div style={{ color: '#999' }}>Нет данных</div>;
	}

	// Если дошли сюда — всё ок, рендерим children
	return <>{children}</>;
}
