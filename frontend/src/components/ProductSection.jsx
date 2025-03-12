// src/components/ProductSection.jsx
import { useEffect, useState } from 'react';
import { Spin, message } from 'antd';
import axiosInstance from '../api/axiosInstance.js';
import { ProductCard } from './ProductCard.jsx';

/**
 * @param {string} title - заголовок (e.g. "Новинки")
 * @param {string} filter - тип отбора товаров (e.g. "new", "promo", "sale")
 * @param {number} limit - сколько товаров отображать на главной (например, 4)
 */
export function ProductSection({ title, filter, limit = 4 }) {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);

	// Язык
	const storedLang = localStorage.getItem('lang') || 'ru';
	const serverLang = storedLang === 'ua' ? 'uk' : storedLang;

	useEffect(() => {
		fetchProducts();
	}, [filter, serverLang]);

	const fetchProducts = async () => {
		setLoading(true);
		try {
			const resp = await axiosInstance.get('/catalog/products', {
				params: { lang: serverLang, filter },
			});
			const data = resp.data.slice(0, limit);
			setProducts(data);
		} catch (err) {
			console.error(err);
			message.error('Ошибка при загрузке товаров');
		} finally {
			setLoading(false);
		}
	};

	if (loading) return <Spin style={{ margin: '20px 0' }} />;

	return (
		<div style={{ marginBottom: 24 }}>
			<h2>{title}</h2>
			<div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
				{products.map((p) => (
					<ProductCard key={p.id} product={p} />
				))}
			</div>
		</div>
	);
}
