// src/pages/home/components/HomeBannerSlider.jsx
import React, { useEffect, useState } from 'react';
import { Carousel, Spin } from 'antd';
import axiosInstance from '../../../api/axiosInstance';

export function HomeBannerSlider() {
	const [banners, setBanners] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		fetchBanners();
	}, []);

	const fetchBanners = async () => {
		setLoading(true);
		try {
			// Получаем массив [{id, image_url, link_url, ...}, ...]
			const resp = await axiosInstance.get('/catalog/banners/');
			setBanners(resp.data);
		} catch (err) {
			console.error('Error loading banners', err);
		} finally {
			setLoading(false);
		}
	};

	if (loading) return <Spin style={{ margin: '20px 0' }} />;

	if (!banners.length) return null; // если баннеров нет, ничего не рендерим

	return (
		<Carousel autoplay>
			{banners.map((banner) => (
				<div key={banner.id}>
					<div style={{ position: 'relative', textAlign: 'center' }}>
						{/* Картинка баннера */}
						<a href={banner.link_url} target="_blank" rel="noopener noreferrer">
							<img
								src={banner.image_url}
								alt={banner.title || ''}
								style={{ width: '100%', maxHeight: 400, objectFit: 'cover' }}
							/>
						</a>
						{/* Если нужно, можно добавить overlay с текстом */}
					</div>
				</div>
			))}
		</Carousel>
	);
}
