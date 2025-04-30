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
	const bp      = useBreakpoint();
	const desktop = bp.lg;

	const { open, closeMenu } = useSideMenu();
	const { top, pop, reset } = useMenuStack();
	const [collapsed, setCollapsed] = useState(collapsedOnStart);

	const [root, setRoot] = useState([]);
	const [cats, setCats] = useState([]);
	const [busy, setBusy] = useState(true);

	/* — сброс стека при смене маршрута (устранён «пустой» сайд-бар) — */
	const { pathname } = useLocation();
	useEffect(() => reset(), [pathname]);

	/* — однократная загрузка — */
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

	/* текущий слой */
	const data   = top === 'cats' ? cats : root;
	const mapper = top === 'cats'
		? (mapCatItem  ?? (i=>i))
		: (mapRootItem ?? (i=>i));

	const items = top === 'cats'
		? [{ key:'_back', icon:<LeftOutlined/>, label:'Back', onClick:pop }, ...data.map(mapper)]
		: data.map(mapper);

	/* >>> mobile-only стрелка (desktop без стрелок) <<< */
	const expandIcon = desktop
		? undefined
		: ({ isOpen, onClick /* остальные пропсы нам не нужны */ }) => (
			<span
				role="button"
				className={s.arrowMobile}
				/* 1) не всплываем --> нет перехода на категорию
				   2) ***обязательно*** вызываем оригинальный onClick для раскрытия */
				onClick={e => { e.preventDefault(); e.stopPropagation(); onClick?.(e); }}
			>
          {isOpen ? '▼' : '▶'}
        </span>
		);

	const menuJSX = busy ? (
		<Spin style={{ margin:16 }}/>
	) : (
		<Menu
			theme="dark"
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
				<Sider width={width} collapsible={false} collapsed={collapsed} theme="dark">
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
				width={width+10}
				styles={{ body:{ padding:0 } }}
				className="mobile-only"
			>
				{menuJSX}
			</Drawer>

			{children}
		</>
	);
}
