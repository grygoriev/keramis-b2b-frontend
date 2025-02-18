// src/layouts/ClientLayout.jsx
import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { Outlet } from 'react-router-dom';
import {
	HomeOutlined,
	HistoryOutlined,
	HeartOutlined,
} from '@ant-design/icons';

const { Sider, Content } = Layout;

export function ClientLayout() {
	const [collapsed, setCollapsed] = useState(true);

	return (
		<Layout style={{ minHeight: '100vh' }}>
			<Sider
				collapsible
				collapsed={collapsed}
				onCollapse={(value) => setCollapsed(value)}
				width={250}
				style={{ background: '#001529' }}
			>
				<Menu
					theme="dark"
					mode="inline"
					defaultSelectedKeys={['1']}
					style={{ height: '100%' }}
					items={[
						{
							key: '1',
							icon: <HomeOutlined />,
							label: 'Главная клиента',
						},
						{
							key: '2',
							icon: <HistoryOutlined />,
							label: 'История заказов',
						},
						{
							key: '3',
							icon: <HeartOutlined />,
							label: 'Избранное',
						},
					]}
				/>
			</Sider>

			<Content style={{ margin: '16px', background: '#fff', padding: 16 }}>
				<Outlet />
			</Content>
		</Layout>
	);
}
