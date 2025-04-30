// src/contexts/MenuStackContext.jsx
import { createContext, useContext, useState } from 'react';

const MenuStack = createContext(null);

export function MenuStackProvider({ children }) {
	const [stack, setStack] = useState(['root']);             // 'root' | 'cats'

	const push  = (id) => setStack(prev => [...prev, id]);    // открыть cats
	const pop   = ()  => setStack(prev => prev.length > 1 ? prev.slice(0, -1) : prev);
	const reset = ()  => setStack(['root']);                  // при навигации / закрытии

	const top   = stack[stack.length - 1];

	return (
		<MenuStack.Provider value={{ top, push, pop, reset }}>
			{children}
		</MenuStack.Provider>
	);
}

export const useMenuStack = () => useContext(MenuStack);
