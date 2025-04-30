/* src/components/sider/mapCategoryItem.jsx */
import {
	ProductOutlined,
	RightOutlined,
	DownOutlined,
} from '@ant-design/icons';
import { useNavigate }       from 'react-router-dom';
import { useSideMenu, useMenuStack } from '../../contexts';

/* иконка категории или дефолт */
const ico = (i) =>
	i ? <img src={`/images/icons/${i}.svg`} alt="" style={{ width:18 }}/>
		: <ProductOutlined/>;

/* стрелка ► / ▼ — абсолютно позиционируем справа,
   никаких «левых» props в DOM → warning’ов больше нет */
const Arrow = ({ isOpen, onClick }) => (
	<span
		onClick={(e)=>{ e.stopPropagation(); onClick?.(e); }}
		style={{
			position:'absolute', right:8, top:'50%',
			transform:'translateY(-50%)',
			fontSize:12,
		}}
	>
    {isOpen ? <DownOutlined/> : <RightOutlined/>}
  </span>
);

export function useCategoryMapItem() {
	const nav        = useNavigate();
	const { closeMenu } = useSideMenu();
	const { reset }  = useMenuStack();

	const go = (slug) => { nav(`/category/${slug}`); closeMenu(); reset(); };

	const map = (c) => ({
		key       : c.slug,
		icon      : ico(c.icon),
		label     : <span style={{paddingRight:30}} onClick={()=>go(c.slug)}>{c.name}</span>,
		expandIcon: Arrow,
		children  : c.children?.length ? c.children.map(map) : undefined,
	});

	return map;
}
