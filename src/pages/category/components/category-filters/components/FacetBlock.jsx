// src/pages/category/components/category-filters/components/FacetBlock.jsx
import { Checkbox } from 'antd';

/**
 * Отображает один блок фильтра (заголовок, кнопка свернуть, чекбоксы).
 * @param {object} facet - один объект фильтра { id, code, name, collapsed, values:[...] }
 * @param {boolean} isCollapsed - текущее состояние свернут/развернут
 * @param {Array} selectedValues - массив id выбранных значений для этого фильтра
 * @param {Function} onToggle - (facetCode) => void (свернуть/развернуть)
 * @param {Function} onValueChange - (facet, valueId, checked) => void (клик по чекбоксу)
 */
export function FacetBlock({
							   facet,
							   isCollapsed,
							   selectedValues,
							   onToggle,
							   onValueChange,
						   }) {
	const handleTitleClick = () => {
		onToggle(facet.code);
	};

	return (
		<div
			style={{
				marginBottom: '16px',
				border: '1px solid #eee',
				borderRadius: 4,
				padding: '8px',
			}}
		>
			{/* Заголовок + кнопка свернуть/развернуть */}
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					cursor: 'pointer',
				}}
				onClick={handleTitleClick}
			>
				<strong>{facet.name}</strong>
				<span style={{ fontSize: 12, color: '#999' }}>
          {isCollapsed ? 'Развернуть' : 'Свернуть'}
        </span>
			</div>

			{/* Список значений (чекбоксы), показываем только если не свернуто */}
			{!isCollapsed && (
				<div style={{ marginTop: 8 }}>
					{(facet.values || []).map((v) => {
						const checked = selectedValues.includes(v.id);
						const disabled = v.count === 0; // нет товаров => disabled
						return (
							<div key={v.id} style={{ marginBottom: 4 }}>
								<Checkbox
									disabled={disabled}
									checked={checked}
									onChange={(e) => onValueChange(facet, v.id, e.target.checked)}
								>
									{v.title} ({v.count})
								</Checkbox>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
