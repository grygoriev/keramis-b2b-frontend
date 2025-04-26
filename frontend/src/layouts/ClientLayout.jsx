// src/layouts/ClientLayout.jsx   (отличается лишь составом menuItems)
import { Link, Outlet } from 'react-router-dom';
import { HomeOutlined, HistoryOutlined, HeartOutlined, DownloadOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectUserRole } from '../store/authSlice';
import { SideMenu } from '../components/index.js';
const { Content } = Layout;

export function ClientLayout() {
	const { t } = useTranslation();
	const isClientAdmin = useSelector(selectUserRole) === 'client_admin';

	const menuItems = [
		{ key:'/client/dashboard', icon:<HomeOutlined/>, label:<Link to="/client/dashboard">{t('clientLayout.main')}</Link> },
		{ key:'/client/my-orders', icon:<HistoryOutlined/>,  label:<Link to="/client/my-orders">{t('clientLayout.orders')}</Link> },
		{ key:'/client/carts',     icon:<HeartOutlined/>,    label:<Link to="/client/carts">{t('clientLayout.carts')}</Link> },
		...(isClientAdmin ? [{
			key:'/client/api-token', icon:<DownloadOutlined/>, label:<Link to="/client/api-token">{t('clientLayout.integration')}</Link>,
		}] : []),
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
