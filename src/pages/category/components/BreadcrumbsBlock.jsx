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

	return (
		<Breadcrumb style={{ marginBottom: 16 }}>
			{breadcrumbs.map((bc) => (
				<Breadcrumb.Item key={bc.slug}>
					<Link to={`/category/${bc.slug}`}>{bc.name}</Link>
				</Breadcrumb.Item>
			))}
		</Breadcrumb>
	);
}
