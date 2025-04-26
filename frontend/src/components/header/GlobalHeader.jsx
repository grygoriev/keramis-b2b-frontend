// src/components/header/GlobalHeader.jsx
import { useEffect }   from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button, Space } from 'antd';
import { MenuOutlined } from '@ant-design/icons';

import {
	logout, selectIsLoggedIn, selectUsername, selectUserRole,
} from '../../store/authSlice';
import { selectCurrentLang, setLang } from '../../store/langSlice';
import { logoutRequest } from '../../api/auth';

import { CartIcon, Currency, GlobalSearch,
	LanguageSwitcher, Logo, UserBlock } from './components';
import { getDashboardPath } from '../../utils';
import { useSideMenu } from '../../contexts/SideMenuContext';

export function GlobalHeader({ onBurgerClick = () => {} }) {

	/* — redux / i18n — */
	const dispatch   = useDispatch();
	const navigate   = useNavigate();
	const { i18n }   = useTranslation();

	const lang       = useSelector(selectCurrentLang);
	const loggedIn   = useSelector(selectIsLoggedIn);
	const username   = useSelector(selectUsername);
	const role       = useSelector(selectUserRole);
	const dashboard  = getDashboardPath(role);

	useEffect(() => { i18n.changeLanguage(lang); }, [lang, i18n]);

	const handleLogout = async () => {
		try { await logoutRequest(); } catch {/* ignore */}
		dispatch(logout());
		navigate('/login');
	};
	const { toggleMenu } = useSideMenu();
	const setLangHandler = l => dispatch(setLang(l));

	/* — render — */
	return (
		<header className="global-header header-flex">

			{/* ─ Top row ─ */}
			<div className="global-header__top">
				{/* BURGER (появляется <992 px) */}
				<Button
					type="text"
					icon={<MenuOutlined />}
					onClick={toggleMenu}
					className="mobile-only"
					style={{ fontSize:20 }}
				/>

				<Logo />

				<Space size="small" className="lang-currency">
					<LanguageSwitcher currentLanguage={lang} onChangeLanguage={setLangHandler}/>
					<Currency className="currency"/>
				</Space>
			</div>

			{/* ─ Bottom row ─ */}
			<div className="global-header__bottom">
				<GlobalSearch/>
				<CartIcon/>
				<UserBlock
					isLoggedIn={loggedIn}
					username={username}
					dashboardPath={dashboard}
					onLogout={handleLogout}
				/>
			</div>
		</header>
	);
}
