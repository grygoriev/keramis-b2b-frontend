// src/pages/category/components/category-filters/CategoryFilters.jsx
import React, { useState } from 'react';
import { SelectedFiltersBar, FacetBlock } from './components';

/**
 * @param {Array}   facets   - [{ id, code, name, collapsed, values: [{id, title, count}, ...]} ]
 * @param {Object}  selected - { color: [1, 2], surface: [10, 11], ... }
 * @param {Function} onChange - (newSelected) => void
 */
export function CategoryFilters({ facets, selected, onChange }) {
	// инициализируем состояние свёрнуто/развернуто
	const initialCollapseState = {};
	(facets || []).forEach((facet) => {
		initialCollapseState[facet.code] = facet.collapsed || false;
	});
	const [collapsedMap, setCollapsedMap] = useState(initialCollapseState);

	if (!facets || !facets.length) {
		return null;
	}

	// ================ Методы управления выбором =================

	// Удалить одно выбранное значение
	const removeSelectedValue = (facetCode, valueId) => {
		const currentValues = selected[facetCode] || [];
		const newValues = currentValues.filter((id) => id !== valueId);
		const newSelected = {
			...selected,
			[facetCode]: newValues,
		};
		onChange(newSelected);
	};

	// Сбросить все фильтры
	const clearAll = () => {
		onChange({});
	};

	// Клик по чекбоксу
	const handleValueChange = (facet, valueId, checked) => {
		const facetCode = facet.code;
		const currentSelected = selected[facetCode] || [];
		let newSelectedValues;

		if (checked) {
			newSelectedValues = [...currentSelected, valueId];
		} else {
			newSelectedValues = currentSelected.filter((id) => id !== valueId);
		}

		const updated = {
			...selected,
			[facetCode]: newSelectedValues,
		};
		onChange(updated);
	};

	// ================ Свёрнуто/развернуто =================

	const toggleFacetCollapse = (facetCode) => {
		setCollapsedMap((prev) => ({
			...prev,
			[facetCode]: !prev[facetCode],
		}));
	};

	// ================ Собираем массив выбранных "чипов" =================
	const selectedChips = [];
	facets.forEach((facet) => {
		const facetCode = facet.code;
		const facetName = facet.name;
		const selectedIds = selected[facetCode] || [];

		facet.values.forEach((val) => {
			if (selectedIds.includes(val.id)) {
				selectedChips.push({
					facetCode,
					facetName,
					valueId: val.id,
					valueName: val.title,
				});
			}
		});
	});

	return (
		<div>
			{/* Верхняя панель (выбранные фильтры) */}
			<SelectedFiltersBar
				selectedChips={selectedChips}
				onRemove={removeSelectedValue}
				onClearAll={clearAll}
			/>

			{/* Список всех фильтров */}
			{facets.map((facet) => {
				const facetCode = facet.code;
				const isCollapsed = collapsedMap[facetCode];
				const selectedValues = selected[facetCode] || [];

				return (
					<FacetBlock
						key={facet.id}
						facet={facet}
						isCollapsed={isCollapsed}
						selectedValues={selectedValues}
						onToggle={toggleFacetCollapse}
						onValueChange={handleValueChange}
					/>
				);
			})}
		</div>
	);
}
