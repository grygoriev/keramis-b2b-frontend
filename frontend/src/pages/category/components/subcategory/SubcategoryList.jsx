// src/pages/category/components/SubcategoryList.jsx
import { Card } from 'antd';
import { Link } from 'react-router-dom';
import s from './SubcategoryList.module.css';

export function SubcategoryList({ subcats = [] }) {
	if (!subcats.length) return null;

	/* ----- > 18 : текстовый вид ------- */
	if (subcats.length > 18) {
		return (
			<div className={s.inline}>
				{subcats.map((sc, idx) => (
					<span key={sc.id}>
            <Link to={`/category/${sc.slug}`}>{sc.name}</Link>
						{idx !== subcats.length - 1 && <span className={s.divider}> | </span>}
          </span>
				))}
			</div>
		);
	}

	/* ----- до 18 : карточки ------- */
	return (
		<div className={s.grid}>
			{subcats.map((sc) => (
				<Link key={sc.id} to={`/category/${sc.slug}`} className={s.cardLink}>
					<Card
						hoverable
						className={s.card}
						cover={
							sc.image_url && (
								<img
									src={sc.image_url}
									alt={sc.name}
									className={s.img}
								/>
							)
						}
					>
						<span className={s.title}>{sc.name}</span>
					</Card>
				</Link>
			))}
		</div>
	);
}
