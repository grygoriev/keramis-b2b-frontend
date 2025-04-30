// src/layouts/PublicLayout.jsx
import { Outlet }            from 'react-router-dom';
import { Layout }            from 'antd';
import { getCategoryTree }   from '../api/catalogCache';
import { useSelector }       from 'react-redux';
import { selectCurrentLang } from '../store/langSlice';
import { transformLangToServer } from '../utils';
import { SideMenu, useCategoryMapItem } from '../components';

const { Content } = Layout;

export function PublicLayout() {
	/* язык + загрузка дерева */
	const lang      = transformLangToServer(useSelector(selectCurrentLang));
	const loader    = () => getCategoryTree(lang);

	/* один-единственный мэппер для root + children
	   isPublic = true — включаем mobile-стрелку с stopPropagation */
	const mapItem = useCategoryMapItem(true);

	return (
		<Layout>
			<SideMenu
				loader={loader}             /* root = дерево категорий */
				mapRootItem={mapItem}
				mapCatItem={mapItem}
				collapsedOnStart
			>
				<Content style={{ padding:16 }}>
					<Outlet/>
				</Content>
			</SideMenu>
		</Layout>
	);
}
