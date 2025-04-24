// src/layouts/ClientLayout.jsx
import { useState } from 'react';
import { Layout, Menu } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
	HomeOutlined,
	HistoryOutlined,
	HeartOutlined,
	DownloadOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { selectUserRole } from '../store/authSlice.js';

const { Sider, Content } = Layout;

export function ClientLayout() {
	const { t } = useTranslation();
	const [collapsed, setCollapsed] = useState(true);

	const role = useSelector(selectUserRole);
	const isClientAdmin = role === 'client_admin';

	const location = useLocation();
	const { pathname } = location;

	const menuItems = [
		{
			key: '/client/dashboard',
			icon: <HomeOutlined />,
			label: <Link to="/client/dashboard">{t('clientLayout.main', 'Главная клиента')}</Link>,
		},
		{
			key: '/client/my-orders',
			icon: <HistoryOutlined />,
			label: <Link to="/client/my-orders">{t('clientLayout.orders', 'Заказы')}</Link>,
		},
		{
			key: '/client/carts',
			icon: <HeartOutlined />,
			label: <Link to="/client/carts">{t('clientLayout.carts', 'Корзины')}</Link>,
		},
		...(isClientAdmin
			? [
				{
					key: '/client/api-token',
					icon: <DownloadOutlined />,
					label: <Link to="/client/api-token">{t('clientLayout.integration', 'Интеграция')}</Link>,
				},
			]
			: []),
	];

	let selectedKey = menuItems.find((item) => pathname.startsWith(item.key))?.key;
	if (!selectedKey) {
		selectedKey = '/client/dashboard';
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
