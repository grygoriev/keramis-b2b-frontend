// src/pages/category/components/SubcategoryList.jsx
import { Card } from 'antd';
import { Link } from 'react-router-dom';
import './SubcategoryList.css';

export function SubcategoryList({ subcats = [] }) {
	if (!subcats.length) return null;

	/* ----- > 18 : текстовый вид ------- */
	if (subcats.length > 18) {
		return (
			<div className="subcategory-inline">
				{subcats.map((sc, idx) => (
					<span key={sc.id}>
            <Link to={`/category/${sc.slug}`}>{sc.name}</Link>
						{idx !== subcats.length - 1 && <span className="divider"> | </span>}
          </span>
				))}
			</div>
		);
	}

	/* ----- до 18 : карточки ------- */
	return (
		<div className="subcategory-grid">
			{subcats.map((sc) => (
				<Link key={sc.id} to={`/category/${sc.slug}`} className="card-link">
					<Card
						hoverable
						className="subcategory-card"
						cover={
							sc.image_url && (
								<img
									src={sc.image_url}
									alt={sc.name}
									className="subcategory-img"
								/>
							)
						}
					>
						<span className="subcategory-title">{sc.name}</span>
					</Card>
				</Link>
			))}
		</div>
	);
}
