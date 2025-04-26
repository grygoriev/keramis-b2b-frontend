// src/layouts/AdminLayout.jsx
import { Link, Outlet } from 'react-router-dom';
import { HomeOutlined, UserOutlined, ShoppingCartOutlined, SettingOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import { useTranslation } from 'react-i18next';
import { SideMenu } from '../components/index.js';
const { Content } = Layout;

export function AdminLayout() {
	const { t } = useTranslation();

	const menuItems = [
		{ key:'/admin/dashboard', icon:<HomeOutlined/>,        label:<Link to="/admin/dashboard">{t('adminLayout.main')}</Link> },
		{ key:'/admin/clients',    icon:<UserOutlined/>,       label:<Link to="/admin/clients">{t('adminLayout.clients')}</Link> },
		{ key:'/admin/my-orders',  icon:<ShoppingCartOutlined/>, label:<Link to="/admin/my-orders">{t('adminLayout.orders')}</Link> },
		{ key:'/admin/discounts',  icon:<SettingOutlined/>,    label:<Link to="/admin/discounts">{t('adminLayout.settings')}</Link> },
	];

	return (
		<Layout>
			<SideMenu
				loader={menuItems}
				mapItem={item=>item}
				width={250}
				collapsedOnStart
			>
				<Content style={{ margin:16, background:'#fff', padding:16 }}>
					<Outlet/>
				</Content>
			</SideMenu>
		</Layout>
	);
}
