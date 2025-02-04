import React from 'react';
import { Layout, Menu } from 'antd';
import { Outlet } from 'react-router-dom';
import { GlobalHeader } from '../components/GlobalHeader';
import GlobalFooter from '../components/GlobalFooter.jsx';

const { Header, Sider, Content, Footer } = Layout;

export default function AdminLayout() {
	return (
		<Layout style={{ minHeight: '100vh' }}>
			<GlobalHeader />
			<Layout>
				<Sider>
					<Menu theme="dark" mode="inline">
						<Menu.Item key="1">Админ. Панель</Menu.Item>
						<Menu.Item key="2">Товары</Menu.Item>
						<Menu.Item key="3">Заказы</Menu.Item>
					</Menu>
				</Sider>
				<Layout>
					<Header
						style={{
							background: '#fff',
							padding: '0 16px',
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						<h2 style={{ margin: 0 }}>Admin Layout</h2>
					</Header>
					<Content style={{ margin: '16px', background: '#fff', padding: 16 }}>
						<Outlet />
					</Content>
					<Footer style={{ padding: 0 }}>
						<GlobalFooter />
					</Footer>
				</Layout>
			</Layout>
		</Layout>
	);
}
