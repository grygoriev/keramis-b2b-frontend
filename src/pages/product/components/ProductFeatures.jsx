// src/pages/product/components/ProductFeatures.jsx
/**
 * @param {Array} features - Массив характеристик из бэкенда:
 *    [
 *      {
 *        "id": 1,
 *        "status": true,
 *        "name": "Список товарів",
 *        "value": ["new","sale"]
 *      },
 *      ...
 *    ]
 */
export function ProductFeatures({ features }) {
	if (!features || !features.length) {
		return null;
	}

	// Фильтруем только те, у которых status = true
	const publicFeatures = features.filter((feat) => feat.status);

	if (!publicFeatures.length) {
		return null; // Если после фильтрации ничего не осталось, не рендерим блок
	}

	return (
		<div style={{ marginTop: 16 }}>
			<h3>Характеристики</h3>
			<ul style={{ listStyleType: 'none', padding: 0 }}>
				{publicFeatures.map((feat) => {
					// Если value — массив, соединяем через запятую
					let displayValue;
					if (Array.isArray(feat.value)) {
						displayValue = feat.value.join(', ');
					} else {
						// Если не массив, предположим, что это просто строка/число
						displayValue = feat.value;
					}

					return (
						<li key={feat.id} style={{ marginBottom: 4 }}>
							<strong>{feat.name}:</strong> {displayValue}
						</li>
					);
				})}
			</ul>
		</div>
	);
}
