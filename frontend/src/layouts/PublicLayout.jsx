/* src/layouts/PublicLayout.jsx */
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import { useSelector } from 'react-redux';

import { selectCurrentLang }      from '../store/langSlice';
import { transformLangToServer }  from '../utils';
import { getCategoryTree }        from '../api/catalogCache';
import { SideMenu, useCommonMenu, useCategoryMapItem } from '../components';

const { Content } = Layout;

export function PublicLayout() {
	const lang     = transformLangToServer(useSelector(selectCurrentLang));

	const { head } = useCommonMenu({ publicRoot:true });   // ← «Кабинет» (mobile-only)
	const mapCat   = useCategoryMapItem();

	const loader   = async () => {
		const cats = (await getCategoryTree(lang)).map(mapCat);
		return [...head, ...cats];
	};

	return (
		<Layout>
			<SideMenu
				loader={loader}          /* root = [Кабинет? + cats] */
				mapRootItem={(i)=>i}
				width={250}
				collapsedOnStart
			>
				<Content style={{padding:16}}>
					<Outlet/>
				</Content>
			</SideMenu>
		</Layout>
	);
}
