// src/components/sider/SideMenu.jsx
import { useState, useEffect } from 'react';
import { Layout, Drawer, Grid, Spin, Menu } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, LeftOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';

import { useSideMenu, useMenuStack } from '../../contexts';
import s from './SideMenu.module.css';

const { useBreakpoint } = Grid;
const { Sider } = Layout;

export function SideMenu({
							 loader,
							 catsLoader,
							 mapRootItem,
							 mapCatItem,
							 children,
							 width = 250,
							 collapsedOnStart = false,
						 }) {
	/* ——— breakpoint ——— */
	const bp       = useBreakpoint();
	const desktop  = bp.lg;                   // ≥ 992 px

	/* ——— Drawer open/close ——— */
	const { open, closeMenu } = useSideMenu();

	/* ——— stack ——— */
	const { top, pop, reset } = useMenuStack();     // 'root' | 'cats'

	/* ——— collapse (desktop) ——— */
	const [collapsed, setCollapsed] = useState(collapsedOnStart);

	/* ——— menu-data ——— */
	const [root, setRoot] = useState([]);
	const [cats, setCats] = useState([]);
	const [busy, setBusy] = useState(true);

	/* auto-reset стека - при смене маршрута «пустое меню» исчезает */
	const { pathname } = useLocation();
	useEffect(() => reset(), [pathname]);

	/* однократная загрузка данных */
	useEffect(() => {
		let alive = true;
		(async () => {
			setBusy(true);
			try {
				const r = typeof loader === 'function' ? await loader() : loader;
				const c = catsLoader
					? (typeof catsLoader === 'function' ? await catsLoader() : catsLoader)
					: [];
				if (alive) { setRoot(r ?? []); setCats(c ?? []); }
			} finally { if (alive) setBusy(false); }
		})();
		return () => { alive = false; };
	}, [loader, catsLoader]);

	/* ——— какой набор пунктов сейчас? ——— */
	const data    = top === 'cats' ? cats : root;
	const mapper  = top === 'cats'
		? (mapCatItem  ?? ((x)=>x))
		: (mapRootItem ?? ((x)=>x));

	/* «Назад» для слоя категорий */
	const items = top === 'cats'
		? [{ key:'_back', icon:<LeftOutlined/>, label:'Back', onClick:pop }, ...data.map(mapper)]
		: data.map(mapper);

	/* Стрелка нужна ТОЛЬКО на mobile.  На desktop expand-control убираем. */
	const expandIcon = desktop
		? undefined                  // стрелки отсутствуют
		: ({ isOpen, onClick }) => (
			<span
				className={s.arrowMobile}
				onClick={(e) => {        // остановили всплытие → не переходим по ссылке
					e.stopPropagation();
					onClick?.(e);
				}}
			>
          {isOpen ? '▼' : '▶'}
        </span>
		);

	const menuJSX = busy ? (
		<Spin style={{ margin:16 }}/>
	) : (
		<Menu
			theme="dark"
			/* desktop: «vertical» + hover ;  mobile: «inline» + click */
			mode={desktop ? 'vertical' : 'inline'}
			triggerSubMenuAction={desktop ? 'hover' : 'click'}
			items={items}
			expandIcon={expandIcon}
			style={{ height:'100%' }}
		/>
	);

	return (
		<>
			{/* —— DESKTOP —— */}
			{desktop && (
				<Sider
					width={width}
					collapsible={false}
					collapsed={collapsed}
					theme="dark"
				>
					<div className={s.topTrigger} onClick={()=>setCollapsed(!collapsed)}>
						{collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
					</div>
					{menuJSX}
				</Sider>
			)}

			{/* —— MOBILE —— */}
			<Drawer
				placement="left"
				open={!desktop && open}
				onClose={() => { closeMenu(); reset(); }}
				width={width + 10}
				styles={{ body:{ padding:0 } }}
				className="mobile-only"
			>
				{menuJSX}
			</Drawer>

			{children}
		</>
	);
}
