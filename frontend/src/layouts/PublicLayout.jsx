// src/layouts/PublicLayout.jsx
import { Outlet }            from 'react-router-dom';
import { Layout }            from 'antd';
import { getCategoryTree }   from '../api/catalogCache';
import { useSelector }       from 'react-redux';
import { selectCurrentLang } from '../store/langSlice';
import { transformLangToServer } from '../utils';
import { SideMenu, useCategoryMapItem, useCommonMenu } from '../components';

const { Content } = Layout;

export function PublicLayout() {
	/* язык + загрузка дерева */
	const lang      = transformLangToServer(useSelector(selectCurrentLang));
	const loadCats    = () => getCategoryTree(lang);

	/* один-единственный мэппер для root + children
	   isPublic = true — включаем mobile-стрелку с stopPropagation */
	const mapCat = useCategoryMapItem(true);

	/* head | tail + «Кабинет» (mobile-only) */
	const { head, tail } = useCommonMenu({ publicRoot:true });

	/* ---- root-loader = head + cats + tail ---- */
	const loadRoot = async () => {
		const cats = await loadCats();
		/* cats ещё не «промаплены», поэтому сейчас применим mapCat */
		return [...cats.map(mapCat), ...tail, ...head];
	};

	return (
		<Layout>
			<SideMenu
				loader      ={loadRoot}  /* слой 0  = head + cats + tail */
				catsLoader  ={loadCats}  /* слой 1+ = только cats        */
				mapRootItem ={item=>item}/* head|tail уже готовы         */
				mapCatItem  ={mapCat}
				collapsedOnStart
			>
				<Content style={{ padding:16 }}>
					<Outlet/>
				</Content>
			</SideMenu>
		</Layout>
	);
}
