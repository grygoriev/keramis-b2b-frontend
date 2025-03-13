// src/layouts/AdminLayout.jsx
import { useState } from 'react';
import { Layout, Menu } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
	HomeOutlined,
	UserOutlined,
	ShoppingCartOutlined,
	SettingOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Sider, Content } = Layout;

export function AdminLayout() {
	const [collapsed, setCollapsed] = useState(true);
	const { t } = useTranslation();

	const location = useLocation();
	const { pathname } = location;

	const menuItems = [
		{
			key: '/admin/dashboard',
			icon: <HomeOutlined />,
			label: <Link to="/admin/dashboard">{t('adminLayout.main', 'Главная админа')}</Link>,
		},
		{
			key: '/admin/clients',
			icon: <UserOutlined />,
			label: <Link to="/admin/clients">{t('adminLayout.clients', 'Клиенты')}</Link>,
		},
		{
			key: '/admin/my-orders',
			icon: <ShoppingCartOutlined />,
			label: <Link to="/admin/my-orders">{t('adminLayout.orders', 'Заказы')}</Link>,
		},
		{
			key: '/admin/discounts',
			icon: <SettingOutlined />,
			label: <Link to="/admin/discounts">{t('adminLayout.settings', 'Настройки')}</Link>,
		},
	];

	let selectedKey = menuItems.find((item) => pathname.startsWith(item.key))?.key;
	if (!selectedKey) {
		selectedKey = '/admin/dashboard';
	}

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
					selectedKeys={[selectedKey]}
					style={{ height: '100%' }}
					items={menuItems}
				/>
			</Sider>

			<Content style={{ margin: '16px', background: '#fff', padding: 16 }}>
				<Outlet />
			</Content>
		</Layout>
	);
}
