// src/components/ProductSection.jsx
import { useEffect, useState } from 'react';
import { message } from 'antd';
import { ProductCard } from './ProductCard.jsx';
import { useSelector } from 'react-redux';
import { transformLangToServer } from '../utils/index.js';
import { LoadingWrapper } from './LoadingWrapper.jsx';
import { fetchHomeProducts } from '../api/catalogApi.js';

/**
 * @param {string} title - заголовок (e.g. "Новинки")
 * @param {string} filter - тип отбора товаров (e.g. "new", "promo", "sale")
 * @param {number} limit - сколько товаров отображать на главной (например, 4)
 */
export function ProductSection({ title, filter, limit = 4 }) {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const currentLang = useSelector((state) => state.lang.currentLang);
	const serverLang = transformLangToServer(currentLang);

	useEffect(() => {
		loadProducts();
	}, [filter, serverLang]);

	async function loadProducts() {
		setLoading(true);
		try {
			const data = await fetchHomeProducts(serverLang, {fv_product_list: filter });
			setProducts(data.slice(0, limit));
		} catch (err) {
			console.error(err);
			const msg = 'Ошибка при загрузке товаров';
			setError(msg);
			message.error(msg);
		} finally {
			setLoading(false);
		}
	}

	return (
		<LoadingWrapper loading={loading} error={error} data={products}>
			<div style={{ marginBottom: 24 }}>
				<h2>{title}</h2>
				<div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
					{products.map((p) => (
						<ProductCard key={p.id} product={p} />
					))}
				</div>
			</div>
		</LoadingWrapper>
	);
}
