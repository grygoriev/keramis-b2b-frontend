// src/layouts/ClientLayout.jsx
import { useState } from 'react';
import { Layout, Menu } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import {
	HomeOutlined,
	HistoryOutlined,
	HeartOutlined,
	DownloadOutlined,
} from '@ant-design/icons';

import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const { Sider, Content } = Layout;

export function ClientLayout() {
	const { t } = useTranslation();

	const [collapsed, setCollapsed] = useState(true);

	// Берём из Redux информацию о текущем роли
	const role = useSelector((state) => state.auth.role);

	// Проверяем, админ ли клиент
	const isClientAdmin = role === 'client_admin';

	// Формируем список пунктов меню
	// Чтобы скрыть «Интеграция» для не-админов, условно добавляем этот пункт.
	const menuItems = [
		{
			key: '1',
			icon: <HomeOutlined />,
			label: <Link to="/client">{t('clientLayout.main', 'Главная клиента')}</Link>,
		},
		{
			key: '2',
			icon: <HistoryOutlined />,
			label: <Link to="/client/my-orders">{t('clientLayout.orders', 'Заказы')}</Link>,
		},
		{
			key: '3',
			icon: <HeartOutlined />,
			label: <Link to="/client/carts">{t('clientLayout.carts', 'Корзины')}</Link>,
		},
		...(isClientAdmin
			? [
				{
					key: '4',
					icon: <DownloadOutlined />,
					label: (
						<Link to="/client/api-token">
							{t('clientLayout.integration', 'Интеграция')}
						</Link>
					),
				},
			]
			: [])
	];

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
					items={menuItems}
				/>
			</Sider>

			<Content style={{ margin: '16px', background: '#fff', padding: 16 }}>
				<Outlet />
			</Content>
		</Layout>
	);
}
