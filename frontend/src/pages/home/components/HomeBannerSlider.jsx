// src/pages/home/components/HomeBannerSlider.jsx
import { useEffect, useState } from 'react';
import { Carousel, message } from 'antd';
import { fetchBanners } from '../../../api/catalogApi.js';
import { LoadingWrapper } from '../../../components/index.js';

export function HomeBannerSlider() {
	const [banners, setBanners] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		loadBanners();
	}, []);

	async function loadBanners() {
		setLoading(true);
		try {
			const data = await fetchBanners();
			setBanners(data);
		} catch (err) {
			console.error(err);
			const msg = 'Error loading banners';
			setError(msg);
			message.error(msg);
		} finally {
			setLoading(false);
		}
	}

	if (!banners.length) {
		return null;
	}

	return (
		<LoadingWrapper loading={loading} error={error} data={banners}>
			<Carousel autoplay>
				{banners.map((banner) => (
					<div key={banner.id}>
						<div style={{ position: 'relative', textAlign: 'center' }}>
							<a
								href={banner.link_url}
								target="_blank"
								rel="noopener noreferrer"
							>
								<img
									src={banner.image_url}
									alt={banner.title || ''}
									style={{
										width: '100%',
										maxHeight: 400,
										objectFit: 'cover',
									}}
								/>
							</a>
						</div>
					</div>
				))}
			</Carousel>
		</LoadingWrapper>
	);
}
