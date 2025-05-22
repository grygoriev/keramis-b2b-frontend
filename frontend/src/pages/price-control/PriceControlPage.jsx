import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useGetPriceMonitorQuery } from '../../features/price-control/priceControlApi';
import { LoadingWrapper } from '../../shared/ui/LoadingWrapper';
import { PriceMonitorList } from '../../entities/price-control/PriceMonitorList';
import { Filters } from './Filters';

export function PriceControlPage() {
	const { t } = useTranslation();

	/* ── local state / filters ── */
	const [client, setClient] = useState('');
	const [product, setProduct] = useState('');
	const [vendor, setVendor] = useState('');
	const [diffCat, setDiff] = useState(0); // 0=all, -1, 1

	/* ── query ── */
	const {
		data = [],
		isFetching,
		error,
	} = useGetPriceMonitorQuery({
		client: client.trim() || undefined,
		product: product.trim() || undefined,
		vendor: vendor.trim() || undefined,
		diffCategory: diffCat === 0 ? undefined : diffCat,
	});

	/* ── render ── */
	return (
		<div style={{ padding: 16 }}>
			<h2>{t('price.title', 'Мониторинг цен клиентов')}</h2>

			<Filters
				client={client}
				onClientChange={(e) => setClient(e.target.value)}
				product={product}
				onProductChange={(e) => setProduct(e.target.value)}
				vendor={vendor}
				onVendorChange={(e) => setVendor(e.target.value)}
				diffCat={diffCat}
				onDiffChange={(val) => setDiff(val)}
			/>

			<LoadingWrapper
				loading={isFetching}
				error={error?.toString() || null}
				data={data}
			>
				{data.length === 0 ? (
					<p style={{ marginTop: 16 }}>
						{t('price.empty', 'Ничего не найдено')}
					</p>
				) : (
					<PriceMonitorList list={data} />
				)}
			</LoadingWrapper>
		</div>
	);
}
