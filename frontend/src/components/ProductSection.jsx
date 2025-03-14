// src/components/ProductSection.jsx
import { ProductCard } from './ProductCard.jsx';
import { useSelector } from 'react-redux';
import { transformLangToServer } from '../utils/index.js';
import { LoadingWrapper } from './LoadingWrapper.jsx';
import { useGetProductsQuery } from '../services';

export function ProductSection({ title, filter, limit = 4 }) {
	const currentLang = useSelector((state) => state.lang.currentLang);
	const serverLang = transformLangToServer(currentLang);

	const {
		data: products,
		error,
		isLoading,
	} = useGetProductsQuery({
		lang: serverLang,
		extraParams: {
			fv_product_list: filter,
		},
	});

	const limitedProducts = (products || []).slice(0, limit);

	return (
		<LoadingWrapper
			loading={isLoading}
			error={error ? String(error) : null}
			data={limitedProducts}
		>
			<div style={{ marginBottom: 24 }}>
				<h2>{title}</h2>
				<div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
					{limitedProducts.map((p) => (
						<ProductCard key={p.id} product={p} />
					))}
				</div>
			</div>
		</LoadingWrapper>
	);
}
