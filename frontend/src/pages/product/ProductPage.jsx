// src/pages/product/ProductPage.jsx
import { AddToCartButton, BreadcrumbsBlock, LoadingWrapper, PriceBlock } from '../../components/index.js';
import { useGetProductDetailQuery } from '../../services';
import { useSelector } from 'react-redux';
import { selectCurrentLang } from '../../store/langSlice.js';
import { transformLangToServer } from '../../utils/index.js';
import { useParams } from 'react-router-dom';
import { ProductFeatures, ProductGallery, StockInfo } from './components/index.js';

export function ProductPage() {
	const { slug } = useParams();

	const currentLanguage = useSelector(selectCurrentLang);
	const serverLang = transformLangToServer(currentLanguage);

	const { data, error, isLoading } = useGetProductDetailQuery({
		slug,
		lang: serverLang,
	});

	// data = { product, breadcrumbs }
	const product = data?.product;
	const breadcrumbs = data?.breadcrumbs || [];

	return (
		<LoadingWrapper
			loading={isLoading}
			error={error ? String(error) : null}
			data={product}
		>
			<div>
				<BreadcrumbsBlock breadcrumbs={breadcrumbs} />

				<div style={{ display: 'flex', gap: 24 }}>
					{/* Левая колонка (галерея) */}
					<div style={{ width: 320 }}>
						<ProductGallery
							images={product?.images || []}
							image_filename={product?.image_filename}
							productName={product?.name}
						/>
					</div>

					{/* Правая колонка (информация) */}
					<div style={{ flex: 1 }}>
						<h2>{product?.name}</h2>

						<PriceBlock
							price={product?.price}
							discountedPrice={product?.discounted_price}
						/>

						<div style={{ marginTop: 16, marginBottom: 16 }}>
							{product?.description}
						</div>

						<div style={{ marginBottom: 16 }}>
							<AddToCartButton productId={product?.id} />
						</div>

						<StockInfo
							unit={product?.unit_of_measure}
							stocks={product?.stocks}
						/>
						<ProductFeatures features={product?.features} />
					</div>
				</div>
			</div>
		</LoadingWrapper>
	);
}
