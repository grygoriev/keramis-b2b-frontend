// src/layouts/AdminLayout.jsx
import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import { UserOutlined, ShoppingCartOutlined, SettingOutlined, HomeOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Sider, Content } = Layout;

export function AdminLayout() {
	const [collapsed, setCollapsed] = useState(true);

	const { t } = useTranslation();

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
							label: (
								<Link to="/admin">
									{t('adminLayout.main', 'Главная админа')}
								</Link>
							),
						},
						{
							key: '2',
							icon: <UserOutlined />,
							label: (
								<Link to="/admin/clients">
									{t('adminLayout.clients', 'Клиенты')}
								</Link>
							),
						},
						{
							key: '3',
							icon: <ShoppingCartOutlined />,
							label: (
								<Link to="/admin/my-orders">
									{t('adminLayout.orders', 'Заказы')}
								</Link>
							),
						},
						{
							key: '4',
							icon: <SettingOutlined />,
							label: (
								<Link to="/admin/discounts">
									{t('adminLayout.settings', 'Настройки')}
								</Link>
							),
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
