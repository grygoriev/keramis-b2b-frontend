import { ClientCard } from './ClientCard';

export function PriceMonitorList({ list = [] }) {
	return (
		<>
			{list.map((c) => (
				<ClientCard key={c.client_code} data={c} />
			))}
		</>
	);
}
