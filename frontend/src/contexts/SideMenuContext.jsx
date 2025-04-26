// src/contexts/SideMenuContext.jsx
import { createContext, useContext, useState, useCallback } from 'react';

const SideMenuContext = createContext(null);

/* ===== provider ===== */
export function SideMenuProvider({ children }) {
	const [open, setOpen] = useState(false);

	/* функции-обёртки */
	const openMenu   = useCallback(() => setOpen(true),  []);
	const closeMenu  = useCallback(() => setOpen(false), []);
	const toggleMenu = useCallback(() => setOpen(o => !o), []);

	return (
		<SideMenuContext.Provider value={{ open, openMenu, closeMenu, toggleMenu }}>
			{children}
		</SideMenuContext.Provider>
	);
}

/* ===== удобный хук ===== */
export const useSideMenu = () => {
	const ctx = useContext(SideMenuContext);
	if (!ctx) throw new Error('useSideMenu must be used inside <SideMenuProvider>');
	return ctx;
};
