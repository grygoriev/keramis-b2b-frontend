// src/layouts/ClientLayout.jsx
import { Link, Outlet } from 'react-router-dom';
import {
	UserOutlined,
	InboxOutlined,
	ShoppingCartOutlined,
	DownloadOutlined,
	MoneyCollectOutlined,
	RollbackOutlined,
} from '@ant-design/icons';
import { Layout } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { selectUserRole } from '../store/authSlice';
import { selectCurrentLang } from '../store/langSlice';
import { transformLangToServer } from '../utils';
import { getCategoryTree } from '../api/catalogCache';
import { SideMenu, useCommonMenu, useCategoryMapItem } from '../components';

const { Content } = Layout;

export function ClientLayout() {
	const { t } = useTranslation();
	const lang = transformLangToServer(useSelector(selectCurrentLang));
	const isAdmin = useSelector(selectUserRole) === 'client_admin';

	const { head, tail } = useCommonMenu();
	const root = [
		...head,
		{
			key: '/client/dashboard',
			icon: <UserOutlined />,
			label: <Link to="/client/dashboard">{t('clientLayout.main')}</Link>,
		},
		{
			key: '/client/my-orders',
			icon: <InboxOutlined />,
			label: <Link to="/client/my-orders">{t('clientLayout.orders')}</Link>,
		},
		{
			key: '/client/carts',
			icon: <ShoppingCartOutlined />,
			label: <Link to="/client/carts">{t('clientLayout.carts')}</Link>,
		},
		{
			key: '/client/price-control',
			icon: <MoneyCollectOutlined />,
			label: (
				<Link to="/client/price-control">{t('clientLayout.priceControl')}</Link>
			),
		},
		{
			key: '/client/returns',
			icon: <RollbackOutlined />,
			label: <Link to="/client/returns">{t('clientLayout.returns')}</Link>,
		},
		...(isAdmin
			? [
					{
						key: '/client/api-token',
						icon: <DownloadOutlined />,
						label: (
							<Link to="/client/api-token">
								{t('clientLayout.integration')}
							</Link>
						),
					},
				]
			: []),
		...tail,
	];

	const mapCat = useCategoryMapItem();

	return (
		<Layout>
			<SideMenu
				loader={root}
				catsLoader={() => getCategoryTree(lang)}
				mapRootItem={(i) => i}
				mapCatItem={mapCat}
				width={250}
				collapsedOnStart
			>
				<Content style={{ margin: 16, background: '#fff', padding: 16 }}>
					<Outlet />
				</Content>
			</SideMenu>
		</Layout>
	);
}
