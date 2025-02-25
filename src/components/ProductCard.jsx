// src/components/ProductCard.jsx
import { Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PriceBlock } from './PriceBlock';
import { AddToCartButton } from './AddToCartButton';

/**
 * Отображает карточку товара (картинка, название, цена/скидка, кнопка корзины).
 * При клике на карточку переходим к странице товара.
 */
export function ProductCard({ product }) {
	const navigate = useNavigate();

	const handleCardClick = () => {
		navigate(`/product/${product.slug}`);
	};

	return (
		<Card
			hoverable
			onClick={handleCardClick}
			className="product-card"
			style={{ width: 200 }}
			cover={
				<img
					alt={product.name}
					src={product.image_filename || '/images/no-image.png'}
				/>
			}
		>
			<div className="two-lines product-name">{product.name}</div>

			{/* Блок с ценой/скидкой */}
			<PriceBlock
				price={product.price}
				discountedPrice={product.discounted_price}
			/>

			{/* Кнопка "Добавить в корзину" */}
			<div style={{ marginTop: 8 }}>
				<AddToCartButton productId={product.id} />
			</div>
		</Card>
	);
}
