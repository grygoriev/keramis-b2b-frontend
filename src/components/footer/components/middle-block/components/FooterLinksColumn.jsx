// src/components/footer/components/FooterLinksColumn.jsx
import { Link } from 'react-router-dom';

/**
 * @param {string} title - заголовок колонки
 * @param {Array} links - массив объектов { to: string, label: string }
 */
export function FooterLinksColumn({ title, links }) {
	return (
		<div>
			<div style={{ fontWeight: 'bold', marginBottom: 10 }}>{title}</div>
			{links.map((linkItem, idx) => (
				<Link
					key={idx}
					to={linkItem.to}
					style={{ display: 'block', color: '#fff', marginBottom: 5 }}
				>
					{linkItem.label}
				</Link>
			))}
		</div>
	);
}
