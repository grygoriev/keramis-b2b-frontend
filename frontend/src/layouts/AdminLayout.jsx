// src/layouts/AdminLayout.jsx
import { Link, Outlet } from 'react-router-dom';
import {
	UserOutlined,
	TeamOutlined,
	InboxOutlined,
	SettingOutlined,
	RollbackOutlined, MoneyCollectOutlined,
} from '@ant-design/icons';
import { Layout } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { selectCurrentLang } from '../store/langSlice';
import { transformLangToServer } from '../utils';
import { getCategoryTree } from '../api/catalogCache';
import { SideMenu, useCommonMenu, useCategoryMapItem } from '../components';

const { Content } = Layout;

export function AdminLayout() {
	const { t } = useTranslation();
	const lang = transformLangToServer(useSelector(selectCurrentLang));

	const { head, tail } = useCommonMenu();
	const root = [
		...head,
		{
			key: '/admin/dashboard',
			icon: <UserOutlined />,
			label: <Link to="/admin/dashboard">{t('adminLayout.main')}</Link>,
		},
		{
			key: '/admin/clients',
			icon: <TeamOutlined />,
			label: <Link to="/admin/clients">{t('adminLayout.clients')}</Link>,
		},
		{
			key: '/admin/my-orders',
			icon: <InboxOutlined />,
			label: <Link to="/admin/my-orders">{t('adminLayout.orders')}</Link>,
		},
		{
			key: '/admin/returns',
			icon: <RollbackOutlined />,
			label: <Link to="/admin/returns">{t('clientLayout.returns')}</Link>,
		},
		{
			key: '/admin/discounts',
			icon: <SettingOutlined />,
			label: <Link to="/admin/discounts">{t('adminLayout.settings')}</Link>,
		},
		{
			key: '/admin/price-control',
			icon: <MoneyCollectOutlined />,
			label: (
				<Link to="/admin/price-control">{t('clientLayout.priceControl')}</Link>
			),
		},
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
