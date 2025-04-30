/* src/components/sider/SideMenu.jsx */
import { useState, useEffect } from 'react';
import { Layout, Drawer, Grid, Spin, Menu } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, LeftOutlined } from '@ant-design/icons';

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
	const desktop = useBreakpoint().lg;

	const { open, closeMenu } = useSideMenu();
	const { top, pop, reset } = useMenuStack();   // 'root' | 'cats'

	const [collapsed, setCollapsed] = useState(collapsedOnStart);
	const [root, setRoot] = useState([]);
	const [cats, setCats] = useState([]);
	const [busy, setBusy] = useState(true);

	/* ---- загрузка ---- */
	useEffect(() => {
		let ok = true;
		(async () => {
			setBusy(true);
			try{
				const r = typeof loader     === 'function' ? await loader()     : loader;
				const c = catsLoader
					? (typeof catsLoader === 'function' ? await catsLoader() : catsLoader)
					: [];
				ok && (setRoot(r ?? []), setCats(c ?? []));
			}finally{ ok && setBusy(false); }
		})();
		return () => { ok = false; };
	}, [loader, catsLoader]);

	/* пустой cats → авторесет (фикс «пустого меню») */
	useEffect(() => { if (top==='cats' && !cats.length) reset(); }, [top, cats.length, reset]);

	/* mapper + back */
	const map = top==='cats' ? (mapCatItem ?? (x=>x)) : (mapRootItem ?? (x=>x));
	const items = top==='cats'
		? [{ key:'_back', icon:<LeftOutlined/>, label:'Back', onClick:pop },
			...cats.map(map)]
		: root.map(map);

	const menu = busy
		? <Spin style={{margin:16}}/>
		: <Menu theme="dark" mode="inline" triggerSubMenuAction="hover"
				items={items} style={{height:'100%'}}/>;

	return (
		<>
			{desktop && (
				<Sider width={width} collapsed={collapsed} collapsible={false} theme="dark">
					<div className={s.topTrigger} onClick={()=>setCollapsed(!collapsed)}>
						{collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
					</div>
					{menu}
				</Sider>
			)}

			<Drawer
				placement="left"
				open={!desktop && open}
				onClose={()=>{ closeMenu(); reset(); }}
				width={width+10}
				styles={{ body:{padding:0} }}
				className="mobile-only"
			>
				{menu}
			</Drawer>

			{children}
		</>
	);
}
