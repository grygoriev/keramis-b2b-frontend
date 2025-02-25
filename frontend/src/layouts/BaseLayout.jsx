// src/layouts/BaseLayout.jsx
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { GlobalHeader, GlobalFooter } from '../components/index.js';

const { Content } = Layout;

/**
 * Базовый лейаут – на всех страницах есть GlobalHeader (сверху)
 * и GlobalFooter (снизу). Посередине Content с <Outlet>.
 */
export function BaseLayout() {
	return (
		<Layout style={{ minHeight: '100vh', flexDirection: 'column' }}>
			{/* Глобальный Header */}
			<GlobalHeader />

			<Layout style={{ flex: '1 0 auto' }}>
				<Content style={{ background: '#fff', padding: 16 }}>
					<Outlet />
				</Content>
			</Layout>

			{/* Глобальный Footer */}
			<GlobalFooter />
		</Layout>
	);
}
