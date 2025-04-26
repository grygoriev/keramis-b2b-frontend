/* src/components/side-menu/SideMenu.jsx */
import { useState, useMemo } from 'react';
import { Layout, Drawer, Grid, Spin, Menu } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useSideMenu } from '../../contexts/SideMenuContext.jsx';
import s from './SideMenu.module.css';                   //  ← модуль!

const { useBreakpoint } = Grid;
const { Sider }        = Layout;

export function SideMenu({
							 loader,
							 children,
							 width            = 250,
							 collapsedOnStart = false,
							 mapItem,
						 }) {
	const screens         = useBreakpoint();
	const lgUp            = screens.lg;               // ≥ 992 px
	const { open, closeMenu } = useSideMenu();

	/* desktop-state */
	const [collapsed, setCollapsed] = useState(collapsedOnStart);

	/* menu-data */
	const [data, setData] = useState([]);
	const [busy, setBusy] = useState(false);

	useMemo(() => {
		(async () => {
			setBusy(true);
			try   {
				const res = typeof loader === 'function' ? await loader() : loader;
				setData(res ?? []);
			} finally { setBusy(false); }
		})();
	}, [loader]);

	const menuItems = (arr) => arr.map(mapItem);

	const menuJSX = busy
		? <Spin style={{ margin: 16 }} />
		: (
			<Menu
				theme="dark"
				mode="vertical"
				triggerSubMenuAction="hover"
				items={menuItems(data)}
				style={{ height: '100%' }}
			/>
		);

	return (
		<>
			{/* DESKTOP */}
			{lgUp && (
				<Sider
					width={width}
					collapsible={false}            /* «лапка» снизу не рисуем */
					collapsed={collapsed}
					theme="dark"
				>
					{/* ─ top trigger — класс из модуля ─ */}
					<div
						className={s.topTrigger}
						onClick={() => setCollapsed(!collapsed)}
					>
						{collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
					</div>
					{menuJSX}
				</Sider>
			)}

			{/* MOBILE */}
			<Drawer
				placement="left"
				open={!lgUp && open}
				onClose={closeMenu}
				width={width + 10}
				bodyStyle={{ padding:0 }}
				className="mobile-only"
			>
				{menuJSX}
			</Drawer>

			{/* контент страницы */}
			{children}
		</>
	);
}
