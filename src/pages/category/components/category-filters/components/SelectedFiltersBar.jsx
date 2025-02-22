// src/pages/category/components/category-filters/components/SelectedFiltersBar.jsx
import React from 'react';
import { Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

/**
 * Отображает выбранные фильтры (чипы) и кнопку «Сбросить всё».
 * @param {Array} selectedChips - [{ facetCode, facetName, valueId, valueName }, ...]
 * @param {Function} onRemove - (facetCode, valueId) => void
 * @param {Function} onClearAll - () => void
 */
export function SelectedFiltersBar({ selectedChips, onRemove, onClearAll }) {
	if (!selectedChips || !selectedChips.length) {
		return null; // Если ничего не выбрано, не отображаем блок
	}

	return (
		<div
			style={{
				background: '#f1f1f1',
				padding: '8px',
				marginBottom: '16px',
				borderRadius: 4,
			}}
		>
			<div style={{ marginBottom: 8 }}>Вы выбрали:</div>

			<div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
				{selectedChips.map((chip, index) => (
					<div
						key={`${chip.facetCode}-${chip.valueId}-${index}`}
						style={{
							background: '#fff',
							padding: '4px 8px',
							border: '1px solid #ccc',
							borderRadius: 16,
							display: 'flex',
							alignItems: 'center',
							gap: 4,
							cursor: 'default',
						}}
					>
            <span>
              {chip.facetName}: {chip.valueName}
            </span>
						<CloseOutlined
							style={{ fontSize: 12 }}
							onClick={() => onRemove(chip.facetCode, chip.valueId)}
						/>
					</div>
				))}
			</div>

			<div style={{ marginTop: 12 }}>
				<Button type="link" onClick={onClearAll}>
					Сбросить все
				</Button>
			</div>
		</div>
	);
}
