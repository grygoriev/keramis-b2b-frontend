// src/pages/product/hooks/useProductDetail.js
import { useState, useEffect } from 'react';
import { fetchProductDetail } from '../../../api/catalogApi';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';

export function useProductDetail(slug, serverLang) {
	const { t } = useTranslation();
	const [product, setProduct] = useState(null);
	const [breadcrumbs, setBreadcrumbs] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!slug) return;
		loadProduct();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [slug, serverLang]);

	async function loadProduct() {
		setLoading(true);
		setError(null); // Очистим предыдущую ошибку перед началом запроса
		try {
			const data = await fetchProductDetail(slug, serverLang);
			if (!data.product) {
				const msg = t('productPage.notFound', 'Товар не найден');
				setError(msg);
			} else {
				setProduct(data.product);
				setBreadcrumbs(data.breadcrumbs);
			}
		} catch (err) {
			console.error(err);
			const msg = t('productPage.loadError', 'Ошибка загрузки товара');
			setError(msg);
			message.error(msg);
		} finally {
			setLoading(false);
		}
	}

	return {
		product,
		breadcrumbs,
		loading,
		error,
		refetch: loadProduct,
	};
}
