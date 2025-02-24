// src/pages/catalog/components/BreadcrumbsBlock.jsx
import React from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';

/**
 * Рендерит хлебные крошки, если они есть.
 * @param {Array} breadcrumbs - [{slug, name}, ...] или пустой
 */
export function BreadcrumbsBlock({ breadcrumbs }) {
	if (!breadcrumbs || !breadcrumbs.length) {
		return null; // Если массив пуст, ничего не рендерим
	}

	// Формируем массив для items:
	const breadcrumbItems = breadcrumbs.map((bc) => ({
		key: bc.slug,
		title: <Link to={`/category/${bc.slug}`}>{bc.name}</Link>,
	}));

	return (
		<Breadcrumb style={{ marginBottom: 16 }} items={breadcrumbItems} />
	);
}
