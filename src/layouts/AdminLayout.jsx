import React from 'react';
import { Layout, Menu } from 'antd';
import { Outlet } from 'react-router-dom';
import { GlobalHeader } from '../components/GlobalHeader';

const { Header, Sider, Content } = Layout;

export default function AdminLayout() {
	return (
		<Layout style={{ minHeight: '100vh' }}>
			<Sider>
				<Menu theme="dark" mode="inline">
					<Menu.Item key="1">Админ. Панель</Menu.Item>
					<Menu.Item key="2">Товары</Menu.Item>
					<Menu.Item key="3">Заказы</Menu.Item>
				</Menu>
			</Sider>
			<Layout>
				<Header style={{ background: '#fff', padding: '0 16px',
					display: 'flex', justifyContent: 'space-between',
					alignItems: 'center' }}>
					<h2 style={{ margin: 0 }}>Admin Layout</h2>
					+          <GlobalHeader />
				</Header>
				<Content style={{ margin: '16px', background: '#fff', padding: 16 }}>
					<Outlet />
				</Content>
			</Layout>
		</Layout>
	);
}
