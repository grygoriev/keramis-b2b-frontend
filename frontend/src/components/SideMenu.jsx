import { useState, useMemo } from 'react';
import { Layout, Drawer, Grid, Spin, Menu } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useSideMenu } from '../contexts/SideMenuContext.jsx';

const { Sider }       = Layout;
const { useBreakpoint }= Grid;

/**
 * Универсальный компонент левого меню.
 *
 * @param {() => Promise<any[]> | any[]} loader    функция / массив данных меню
 * @param {node}                 children содержимое <Content>
 * @param {number}               width     ширина сайдера (по-умолчанию 250)
 * @param {boolean}              collapsedOnStart  сразу свёрнут?
 * @param {(item)=>ReactNode}    mapItem   кастомная сборка <Menu> пункта
 */
export function SideMenu({
							 loader,
							 children,
							 width = 250,
							 collapsedOnStart = false,
							 mapItem,
						 }) {
	const screens          = useBreakpoint();
	const lgUp             = screens.lg;          // ≥ 992 px
	const { open, closeMenu} = useSideMenu();

	/* desktop-state */
	const [collapsed, setCollapsed] = useState(collapsedOnStart);

	/* данные меню */
	const [data, setData] = useState([]);
	const [busy, setBusy] = useState(false);

	/* загружаем, когда компонент впервые показался */
	useMemo(() => {
		(async () => {
			setBusy(true);
			try   {
				const res = typeof loader === 'function' ? await loader() : loader;
				setData(res ?? []);
			} finally { setBusy(false); }
		})();
	}, [loader]);

	/* -------
	   helpers
	------- */
	const buildMenu = (items) => items.map(mapItem);

	const menuJSX = busy
		? <Spin style={{ margin:16 }}/>
		: <Menu
			theme="dark"
			mode="vertical"
			triggerSubMenuAction="hover"
			items={buildMenu(data)}
			style={{ height:'100%' }}
		/>;

	/* -------
	   render
	------- */
	return (
		<>
			{lgUp && (
				<Sider
					width={width}
					collapsible={false}            /* «лапка» не появится */
					collapsed={collapsed}
					theme="dark"
				>
					<div className="sider-top-trigger" onClick={()=>setCollapsed(!collapsed)}>
						{collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
					</div>
					{menuJSX}
				</Sider>
			)}

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

			{children /* то, что будет внутри <Content> */}
		</>
	);
}
