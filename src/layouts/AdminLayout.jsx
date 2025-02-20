// src/layouts/AdminLayout.jsx
import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import { UserOutlined, ShoppingCartOutlined, SettingOutlined } from '@ant-design/icons';

const { Sider, Content } = Layout;

export function AdminLayout() {
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
							icon: <UserOutlined />,
							label: <Link to="/admin/clients">Клиенты</Link>,
						},
						{
							key: '2',
							icon: <ShoppingCartOutlined />,
							label: <Link to="/admin/my-orders">Заказы</Link>,
						},
						{
							key: '3',
							icon: <SettingOutlined />,
							label: <Link to="/admin/discounts">Настройки</Link>,
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
