import { ReturnCard } from './ReturnCard';

export function ReturnList({ list, expandedIds, onToggle }) {
	return (
		<>
			{list.map((r) => (
				<ReturnCard
					key={r.return_id}
					data={r}
					expanded={expandedIds.includes(r.return_id)}
					onToggle={onToggle}
				/>
			))}
		</>
	);
}
