/* src/components/sider/commonItems.jsx */
import {
	HomeOutlined, UnorderedListOutlined, LogoutOutlined,
	LeftOutlined, UserOutlined,
} from '@ant-design/icons';
import { useNavigate }            from 'react-router-dom';
import { useTranslation }         from 'react-i18next';
import { message }                from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import { useSideMenu, useMenuStack } from '../../contexts';
import { logout, selectUserRole }    from '../../store/authSlice';
import { selectCurrentLang }         from '../../store/langSlice';
import { getCategoryTree }           from '../../api/catalogCache';

/* .mobile-only уже есть в global CSS: display:none → <991px> display:inline-flex  */

export function useCommonMenu({ publicRoot=false } = {}) {
	const { t }   = useTranslation();
	const nav     = useNavigate();

	const dispatch = useDispatch();
	const role     = useSelector(selectUserRole);
	const lang     = useSelector(selectCurrentLang);

	const { closeMenu }        = useSideMenu();
	const { push, pop, top, reset } = useMenuStack();

	/* ---------- общие ---------- */
	const back = { key:'_back', icon:<LeftOutlined/>, label:t('common.back'), onClick:pop };

	/* ---------- «Кабинет» (только public+mobile, прячем на desktop) ---------- */
	const cabHome =
		role?.startsWith('client') ? '/client/dashboard'
			: role==='admin'         ? '/admin/dashboard'
				: null;

	const cabinet = publicRoot && cabHome ? [{
		key:'_cab',
		icon:<UserOutlined/>,
		label:t('common.cabinet'),
		className:'mobile-only',          // скрыто на desktop
		onClick(){ nav(cabHome); closeMenu(); reset(); },
	}] : [];

	/* ---------- для приватных корней ---------- */
	const home = {
		key:'_home', icon:<HomeOutlined/>, label:t('common.home'),
		onClick(){ nav('/'); closeMenu(); reset(); },
	};

	const cats = {
		key:'_cats', icon:<UnorderedListOutlined/>, label:t('common.categories'),
		async onClick(){
			try{ await getCategoryTree(lang); push('cats'); }
			catch{ message.error(t('common.loadError')); }
		},
	};

	const exit = {
		key:'_exit', icon:<LogoutOutlined/>, label:t('common.logout'),
		onClick(){ dispatch(logout()); nav('/login'); closeMenu(); },
	};

	const div1 = { type:'divider', key:'d1' };
	const div2 = { type:'divider', key:'d2' };

	return {
		head : top==='cats'
			? [back]
			: publicRoot
				? [...cabinet]             // в публичном root только «Кабинет» (и то – на mobile)
				: [...cabinet, home, cats, div1],
		tail : publicRoot ? [] : [div2, exit],
	};
}
