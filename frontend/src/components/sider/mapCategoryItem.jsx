// src/components/sider/mapCategoryItem.jsx
import { ProductOutlined }       from '@ant-design/icons';
import { useNavigate }           from 'react-router-dom';
import { useSideMenu, useMenuStack } from '../../contexts';
import { useSelector }           from 'react-redux';
import { selectUserRole }        from '../../store/authSlice';
import { Grid }                  from 'antd';

const { useBreakpoint } = Grid;

/* helper: иконка категории или дефолтная */
const icon = (i) =>
	i ? <img src={`/images/icons/${i}.svg`} alt="" style={{ width:18 }}/>
		: <ProductOutlined/>;

/**
 * Хук-конструктор пунктов “дерева категорий”
 * @param {boolean} isPublic – используется ли в PublicLayout
 */
export function useCategoryMapItem(isPublic = false){
	const nav           = useNavigate();
	const { closeMenu } = useSideMenu();
	const { reset }     = useMenuStack();

	const bp      = useBreakpoint();
	const mobile  = !bp.lg;          // mobile → < 992 px

	/* переход + закрыть бургер */
	const go = (slug) => {
		nav(`/category/${slug}`);
		closeMenu();
		if (!isPublic) reset();
	};

	/* 👉 кастомная стрелка ТОЛЬКО на mobile
	   – останавливаем всплытие, чтобы label-клик не отработал */
	const makeExpandIcon = (open) => (
		<span
			onClick={(e)=>e.stopPropagation()}
			style={{ marginLeft:'auto', display:'flex', width:16, justifyContent:'center' }}
		>
      {open ? '∨' : '›'}
    </span>
	);

	/* рекурсивный мэппер */
	const map = (c) => {
		const kids = c.children?.length;

		return {
			key : c.slug,
			icon: icon(c.icon),

			label: (
				<span onClick={() => go(c.slug)}>
          {c.name}
        </span>
			),

			// на desktop кликаем по заголовку, на mobile – только label
			...(kids && !mobile && { onTitleClick: () => go(c.slug) }),

			// стрелка-раскрыватель – только mobile
			...(kids && mobile && {
				expandIcon: ({ isOpen }) => makeExpandIcon(isOpen),
			}),

			children: kids ? c.children.map(map) : undefined,
		};
	};

	return map;
}
