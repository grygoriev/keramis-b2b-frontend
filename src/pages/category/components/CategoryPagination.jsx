// src/pages/category/components/CategoryPagination.jsx
import { Pagination } from 'antd';

/**
 * Отдельный компонент для пагинации в категории
 * @param {number} page - Текущая страница
 * @param {number} pageSize - Размер страницы (кол-во товаров на странице)
 * @param {number} total - Общее кол-во товаров (из count)
 * @param {Function} onChangePage - колбэк (newPage, newPageSize) => void
 */
export function CategoryPagination({ page, pageSize, total, onChangePage }) {
	// Если нет товаров, или total=0 — скрываем пагинацию
	if (!total) return null;

	return (
		<div style={{ marginTop: 16 }}>
			<Pagination
				current={page}
				pageSize={pageSize}
				total={total}
				onChange={onChangePage}
				showSizeChanger
				style={{ textAlign: 'center' }}
			/>
		</div>
	);
}
