// src/pages/home/components/HomeBannerSlider.jsx
import { Carousel } from 'antd';
import { LoadingWrapper } from '../../../components';
import { useGetBannersQuery } from '../../../services';

export function HomeBannerSlider() {
	const { data: banners, error, isLoading } = useGetBannersQuery();
	if (banners && banners.length === 0) {
		return null;
	}

	return (
		<LoadingWrapper data={banners} loading={isLoading} error={error ? String(error) : null}>
			<Carousel autoplay>
				{(banners || []).map((banner) => (
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
