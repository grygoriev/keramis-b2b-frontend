// src/pages/product/ProductPage.jsx
import { useEffect, useState } from 'react';
import { Spin, message } from 'antd';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchCartsAsync } from '../../store/cartSlice';
import { fetchProductDetail } from '../../api/catalogApi';
import { AddToCartButton, PriceBlock, BreadcrumbsBlock } from '../../components';
import { StockInfo, ProductFeatures, ProductGallery } from './components';

export function ProductPage() {
	const { slug } = useParams();
	const dispatch = useDispatch();
	const { t } = useTranslation();

	const [product, setProduct] = useState(null);
	const [breadcrumbs, setBreadcrumbs] = useState([]);
	const [loading, setLoading] = useState(false);

	const storedLang = localStorage.getItem('lang') || 'ru';
	const serverLang = storedLang === 'ua' ? 'uk' : storedLang;

	useEffect(() => {
		loadProduct();
	}, [slug, serverLang]);

	useEffect(() => {
		dispatch(fetchCartsAsync());
	}, [dispatch]);

	const loadProduct = async () => {
		setLoading(true);
		try {
			const data = await fetchProductDetail(slug, serverLang);
			if (!data.product) {
				message.error(t('productPage.notFound'));
			} else {
				setProduct(data.product);
				setBreadcrumbs(data.breadcrumbs);
			}
		} finally {
			setLoading(false);
		}
	};

	if (loading) return <Spin />;
	if (!product) return <div>{t('productPage.notFound')}</div>;

	return (
		<div>
			<BreadcrumbsBlock breadcrumbs={breadcrumbs} />

			<div style={{ display: 'flex', gap: 24 }}>
				{/* Левая колонка (галерея) */}
				<div style={{ width: 320 }}>
					<ProductGallery
						images={product.images || []}
						image_filename={product.image_filename}
						productName={product.name}
					/>
				</div>

				{/* Правая колонка (информация) */}
				<div style={{ flex: 1 }}>
					<h2>{product.name}</h2>

					<PriceBlock
						price={product.price}
						discountedPrice={product.discounted_price}
					/>

					<div style={{ marginTop: 16, marginBottom: 16 }}>
						{product.description}
					</div>

					<div style={{ marginBottom: 16 }}>
						<AddToCartButton productId={product.id} />
					</div>

					<StockInfo unit={product.unit_of_measure} stocks={product.stocks} />
					<ProductFeatures features={product.features} />
				</div>
			</div>
		</div>
	);
}
