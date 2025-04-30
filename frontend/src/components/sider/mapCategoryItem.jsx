import { ProductOutlined } from '@ant-design/icons';
import { useNavigate }     from 'react-router-dom';
import { useSideMenu }     from '../../contexts';

const icon = (i) =>
	i ? <img src={`/images/icons/${i}.svg`} alt="" style={{ width:18 }}/>
		: <ProductOutlined/>;

export function useCategoryMapItem() {
	const nav           = useNavigate();
	const { closeMenu } = useSideMenu();

	const go = (slug) => { nav(`/category/${slug}`); closeMenu(); };

	const map = (c) => ({
		key  : c.slug,
		label: c.name,
		icon : icon(c.icon),
		...(c.children?.length
				? { children    : c.children.map(map),
					onTitleClick: () => go(c.slug) }      // click on name → navigate
				: { onClick     : () => go(c.slug) }
		),
	});

	return map;
}
