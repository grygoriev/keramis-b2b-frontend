// src/pages/product/components/ProductGallery.jsx
import React from 'react';
import { Carousel, Image } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

export function ProductGallery({ images, image_filename, productName }) {
	// Если несколько картинок, показываем карусель
	if (images && images.length > 1) {
		return (
			<Image.PreviewGroup>
				<Carousel arrows style={{ width: 300, marginBottom: 16 }}>
					{images.map((imgObj) => (
						<div key={imgObj.url}>
							<Image
								src={imgObj.url || '/images/no-image.png'}
								alt=""
								style={{ maxWidth: '300px', maxHeight: '300px' }}
								preview={{
									mask: <EyeOutlined style={{ fontSize: 24, color: '#fff' }} />,
								}}
							/>
						</div>
					))}
				</Carousel>
			</Image.PreviewGroup>
		);
	}

	// Иначе показываем одну картинку (или заглушку)
	const src = (images && images.length === 1)
		? images[0].url
		: image_filename
			? image_filename
			: '/images/no-image.png';

	return (
		<Image
			style={{ width: 300, height: 300, objectFit: 'cover', marginBottom: 16 }}
			src={src}
			alt={productName}
			preview={{
				mask: <EyeOutlined style={{ fontSize: 24, color: '#fff' }} />,
			}}
		/>
	);
}
