import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { GlobalHeader } from '../components/GlobalHeader';
import GlobalFooter from '../components/GlobalFooter';

const { Content } = Layout;

export function RootLayout() {
	return (
		<Layout style={{ minHeight: '100vh' }}>
			{/* Глобальный Header всегда сверху */}
			<GlobalHeader />

			{/* Основная зона, куда будет подставляться контент (Home, AdminLayout, ClientLayout и т.д.) */}
			<Content style={{ background: '#fff' }}>
				<Outlet />
			</Content>

			{/* Глобальный Footer всегда внизу */}
			<GlobalFooter />
		</Layout>
	);
}
