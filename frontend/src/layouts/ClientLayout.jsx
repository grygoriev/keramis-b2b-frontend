// src/layouts/ClientLayout.jsx
import { Link, Outlet } from 'react-router-dom';
import { HomeOutlined, HistoryOutlined, HeartOutlined, DownloadOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { selectUserRole }     from '../store/authSlice';
import { selectCurrentLang }  from '../store/langSlice';
import { transformLangToServer } from '../utils';
import { getCategoryTree }    from '../api/catalogCache';
import { SideMenu, useCommonMenu, useCategoryMapItem } from '../components';

const { Content } = Layout;

export function ClientLayout() {
	const { t } = useTranslation();
	const lang   = transformLangToServer(useSelector(selectCurrentLang));
	const isAdmin = useSelector(selectUserRole) === 'client_admin';

	const { head, tail } = useCommonMenu();
	const root = [
		...head,
		{ key:'/client/dashboard', icon:<HomeOutlined/>,   label:<Link to="/client/dashboard">{t('clientLayout.main')}</Link> },
		{ key:'/client/my-orders', icon:<HistoryOutlined/>,label:<Link to="/client/my-orders">{t('clientLayout.orders')}</Link> },
		{ key:'/client/carts',     icon:<HeartOutlined/>,  label:<Link to="/client/carts">{t('clientLayout.carts')}</Link> },
		...(isAdmin ? [{
			key:'/client/api-token', icon:<DownloadOutlined/>, label:<Link to="/client/api-token">{t('clientLayout.integration')}</Link>,
		}] : []),
		...tail,
	];

	const mapCat = useCategoryMapItem();

	return (
		<Layout>
			<SideMenu
				loader={root}
				catsLoader={() => getCategoryTree(lang)}
				mapRootItem={(i)=>i}
				mapCatItem={mapCat}
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
