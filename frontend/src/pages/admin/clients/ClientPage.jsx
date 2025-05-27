/* ── src/pages/admin/clients/ClientPage.jsx ── */
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Card, Select, Spin, message, Button } from 'antd';

import { selectCurrentLang } from '../../../store/langSlice';
import { transformLangToServer } from '../../../utils';

import {
	useGetClientDetailQuery,
	useGetGroupsQuery,
	usePatchClientMutation,
	usePatchUserClientMutation,
} from '../../../features/clients/clientsApi';

import { BalanceList } from '../../../shared/ui/BalanceList/BalanceList';
import { ClientUsers } from '../../../entities/client/ui/ClientUsers/ClientUsers';
import css from './ClientPage.module.css';

export function ClientPage() {
	const { id } = useParams();
	const { t } = useTranslation();
	const lang = transformLangToServer(useSelector(selectCurrentLang));

	const { data: client, isFetching: lC } = useGetClientDetailQuery({ id, lang });
	const { data: groups = [], isFetching: lG } = useGetGroupsQuery();
	const [patchClient] = usePatchClientMutation();
	const [patchUserClient] = usePatchUserClientMutation();

	if (lC || lG) return <Spin style={{ margin: 40 }} />;
	if (!client) return <p style={{ margin: 40 }}>Error</p>;

	const handleGroup = async (v) => {
		try {
			await patchClient({ id: client.id, payload: { client_group: v } }).unwrap();
			message.success(t('clients.updated', 'Обновлено'));
		} catch {
			message.error(t('clients.errUpdate', 'Ошибка'));
		}
	};

	const unlinkUser = (userId) =>
		patchUserClient({ userId, clientId: null, clientDetailId: client.id });

	const linkUser = (u) =>
		patchUserClient({ userId: u.id, clientId: client.id, clientDetailId: client.id });

	return (
		<div className={css.wrapper}>
			<Button type="link">
				<Link to="/admin/clients">{t('common.back', 'Назад к списку')}</Link>
			</Button>

			<Card className={css.card}>
				<h2>{client.name}</h2>

				<div>
					<b>{t('clients.code', 'Код')}:</b> {client.code}
				</div>

				<div>
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
				</div>

				{/* баланс */}
				{client.balances && <BalanceList balance={client.balances} />}

				{/* пользователи */}
				<ClientUsers
					users={client.users || []}
					onUnlink={unlinkUser}
					onLink={linkUser}
				/>
			</Card>
		</div>
	);
}
