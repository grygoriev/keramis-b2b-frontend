/* ─── src/pages/admin/clients/ClientPage.jsx ─── */
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Card, Select, Spin, message, Button } from 'antd';

import { selectCurrentLang } from '../../../store/langSlice';
import { transformLangToServer } from '../../../utils';

import {
	useGetClientsQuery,
	useGetGroupsQuery,
	usePatchClientMutation,
	useGetClientBalanceQuery,
} from '../../../features/clients/clientsApi';

import { BalanceList } from '../../../shared/ui/BalanceList/BalanceList';
import css from './ClientPage.module.css';

export function ClientPage() {
	const { id } = useParams(); // numeric id
	const { t } = useTranslation();

	/* — текущий язык (как в списке) — */
	const lang = transformLangToServer(useSelector(selectCurrentLang));

	/* — клиенты и группы — */
	const { data: clients = [], isFetching: loadC } = useGetClientsQuery(lang);
	const { data: groups = [], isFetching: loadG } = useGetGroupsQuery();
	const client = clients.find((c) => String(c.id) === id);

	/* — баланс — */
	const { data: balance = [], isFetching: loadB } = useGetClientBalanceQuery(
		client?.code,
		{ skip: !client },
	);

	const [patchClient] = usePatchClientMutation();

	if (loadC || loadG || !client) return <Spin style={{ margin: 40 }} />;

	/* — смена группы — */
	const handleGroup = async (val) => {
		try {
			await patchClient({
				id: client.id,
				payload: { client_group: val },
				lang,
			}).unwrap();
			message.success(t('clients.updated', 'Обновлено'));
		} catch {
			message.error(t('clients.errUpdate', 'Ошибка'));
		}
	};

	return (
		<div className={css.wrapper}>
			<Button type="link">
				<Link to="/admin/clients">{t('common.back', 'Назад к списку')}</Link>
			</Button>

			<Card className={css.card}>
				<h2>{client.name}</h2>

				<p>
					<b>{t('clients.code', 'Код')}:</b> {client.code}
				</p>

				<p>
					<b>{t('clients.group', 'Группа')}:</b>{' '}
					<Select
						size="small"
						value={client.client_group ?? ''}
						onChange={handleGroup}
						style={{ width: 200 }}
					>
						{groups.map((g) => (
							<Select.Option key={g.id} value={g.id}>
								{g.name}
							</Select.Option>
						))}
					</Select>
				</p>

				{loadB ? <Spin /> : <BalanceList balance={balance} />}
			</Card>
		</div>
	);
}
