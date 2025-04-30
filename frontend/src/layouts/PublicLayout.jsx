// src/layouts/PublicLayout.jsx
import { Outlet, useNavigate } from 'react-router-dom';
import { Layout, Grid } from 'antd';
import { ProductOutlined, UserOutlined } from '@ant-design/icons';
import { getCategoryTree } from '../api/catalogCache';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectCurrentLang } from '../store/langSlice';
import { selectUserRole }  from '../store/authSlice';
import { transformLangToServer } from '../utils';
import { SideMenu } from '../components';

const { Content }     = Layout;
const { useBreakpoint } = Grid;

const iconOrDefault = i =>
	i ? <img src={`/images/icons/${i}.svg`} alt="" style={{ width:18 }}/>
		: <ProductOutlined/>;

export function PublicLayout() {
	const { t }    = useTranslation();
	const nav      = useNavigate();
	const bp       = useBreakpoint();
	const mobile   = !bp.md;                  // <768 px

	/* lang + tree-loader */
	const lang   = transformLangToServer(useSelector(selectCurrentLang));
	const loader = () => getCategoryTree(lang);

	/* «Кабинет» – только mobile & авторизован */
	const role   = useSelector(selectUserRole);
	const homeCab =
		role?.startsWith('client') ? '/client/dashboard'
			: role === 'admin'         ? '/admin/dashboard'
				: null;

	/* формируем loader, который подмешивает «Кабинет» в начало */
	const rootLoader = async () => {
		const cats = await loader();
		if (mobile && homeCab){
			const cabItem   = {
				key  :'_cab',
				icon : <UserOutlined/>,
				label: t('common.cabinet'),
				onClick:()=>nav(homeCab),
			};
			const divider   = { type:'divider', key:'cab-div' };
			return [cabItem, divider, ...cats];
		}
		return cats;
	};

	/* «map» для категорий */
	const mapItem = c => ({
		key  : c.slug,
		label: c.name,
		icon : iconOrDefault(c.icon),
		...(c.children?.length
			? { children:c.children.map(mapItem),
				onTitleClick:()=>nav(`/category/${c.slug}`) }
			: { onClick:()=>nav(`/category/${c.slug}`) }),
	});

	return (
		<Layout>
			<SideMenu
				loader={rootLoader}
				catsLoader={rootLoader}
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
