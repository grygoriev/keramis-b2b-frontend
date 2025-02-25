// src/components/footer/GlobalFooter.jsx
import { FooterTopBlock, FooterMiddleBlock, FooterBottomBlock } from './components/index.js';

export function GlobalFooter() {
	return (
		<div style={{ backgroundColor: '#000', color: '#fff' }}>
			{/* Верхний блок */}
			<FooterTopBlock />

			{/* Основной темный блок со ссылками и логотипом */}
			<FooterMiddleBlock />

			{/* Нижняя строка копирайта */}
			<FooterBottomBlock />
		</div>
	);
}
