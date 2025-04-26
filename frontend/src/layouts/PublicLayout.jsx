// src/layouts/PublicLayout.jsx
import { Outlet, useNavigate } from 'react-router-dom';
import { Layout } from 'antd';
import { ProductOutlined } from '@ant-design/icons';
import { fetchCategoryTree } from '../api/catalogApi';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectCurrentLang } from '../store/langSlice';
import { transformLangToServer } from '../utils';
import { SideMenu } from '../components';

const { Content } = Layout;

const iconOrDefault = i =>
	i ? <img src={`/images/icons/${i}.svg`} alt="" style={{ width:18 }}/>
		: <ProductOutlined/>;

export function PublicLayout() {
	const { t } = useTranslation();
	const navigate = useNavigate();

	/* данные загружает SideMenu – лишь передаём loader */
	const lang = transformLangToServer(useSelector(selectCurrentLang));
	const loader = () => fetchCategoryTree(lang);

	/* превращаем дерево категорий → items Menu */
	const mapItem = c => ({
		key  : c.slug,
		label: c.name,
		icon : iconOrDefault(c.icon),
		...(c.children?.length
			? { children:c.children.map(mapItem),
				onTitleClick:()=>navigate(`/category/${c.slug}`)}
			: { onClick:()=>navigate(`/category/${c.slug}`)}),
	});

	return (
		<Layout>
			<SideMenu
				loader={loader}
				mapItem={mapItem}
				collapsedOnStart          /* как у «старого» варианта */
			>
				<Content style={{ padding:16 }}>
					<Outlet/>
				</Content>
			</SideMenu>
		</Layout>
	);
}
