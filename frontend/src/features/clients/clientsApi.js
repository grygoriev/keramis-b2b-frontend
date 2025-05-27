/* ── src/features/clients/clientsApi.js ── */
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../services/axiosBaseQuery';

export const clientsApi = createApi({
	reducerPath: 'clientsApi',
	baseQuery: axiosBaseQuery(),
	tagTypes: ['Clients', 'ClientDetail', 'Groups'],

	endpoints: (b) => ({
		/* === СПИСКИ / DETAIL ================================================= */
		getClients: b.query({
			query: (lang) => ({
				url: '/api/auth/clients/',
				params: { lang, ordering: 'name' },
			}),
			providesTags: (r) =>
				r
					? [
							...r.map((c) => ({ type: 'Clients', id: c.id })),
							{ type: 'Clients', id: 'LIST' },
						]
					: [{ type: 'Clients', id: 'LIST' }],
		}),

		getClientDetail: b.query({
			query: ({ id, lang }) => ({
				url: `/api/auth/clients/${id}/detail/`,
				params: lang ? { lang } : undefined,
			}),
			providesTags: (_, _2, { id }) => [
				{ type: 'ClientDetail', id },
				{ type: 'Clients', id },
			],
		}),

		getMyClientDetail: b.query({
			query: () => ({ url: '/api/auth/clients/my/detail/' }),
			providesTags: [{ type: 'ClientDetail', id: 'ME' }],
		}),

		getGroups: b.query({
			query: () => ({ url: '/api/auth/client-groups/' }),
			providesTags: (r) =>
				r
					? [
							...r.map((g) => ({ type: 'Groups', id: g.id })),
							{ type: 'Groups', id: 'LIST' },
						]
					: [{ type: 'Groups', id: 'LIST' }],
		}),

		/* === PATCH CLIENT (смена группы) ==================================== */
		patchClient: b.mutation({
			query: ({ id, payload }) => ({
				url: `/api/auth/clients/${id}/`,
				method: 'PATCH',
				data: payload,
			}),
			async onQueryStarted(
				{ id, payload },
				{ dispatch, getState, queryFulfilled },
			) {
				const patches = [];
				/* патчим все списки */
				Object.values(getState().clientsApi.queries).forEach((q) => {
					if (q?.endpointName === 'getClients') {
						patches.push(
							dispatch(
								clientsApi.util.updateQueryData(
									'getClients',
									q.originalArgs,
									(d) => {
										const c = d.find((x) => x.id === id);
										if (c) c.client_group = payload.client_group;
									},
								),
							),
						);
					}
				});
				/* и все detail-кеши данного id */
				Object.values(getState().clientsApi.queries).forEach((q) => {
					if (
						q?.endpointName === 'getClientDetail' &&
						q.originalArgs?.id === id
					) {
						patches.push(
							dispatch(
								clientsApi.util.updateQueryData(
									'getClientDetail',
									q.originalArgs,
									(d) => {
										d.client_group = payload.client_group;
									},
								),
							),
						);
					}
				});
				try {
					await queryFulfilled;
				} catch {
					patches.forEach((p) => p.undo?.());
				}
			},
			invalidatesTags: (_, _e, { id }) => [{ type: 'ClientDetail', id }],
		}),

		/* === USERS  ========================================================== */

		/* список ВСЕХ клиент-юзеров (с поиском) – для модалки добавления */
		searchClientUsers: b.query({
			query: ({ search, page = 1 }) => ({
				url: '/api/auth/client-users/',
				params: { search, page },
			}),
		}),

		/* PATCH user.client  {client_id|null} */
		patchUserClient: b.mutation({
			query: ({ userId, clientId }) => ({
				url: `/api/auth/users/${userId}/client/`,
				method: 'PATCH',
				data: { client_id: clientId },
			}),
			/* оптимистично обновляем detail-кеш клиента */
			async onQueryStarted(
				{ userId, clientId, clientDetailId },
				{ dispatch, queryFulfilled },
			) {
				const patch = dispatch(
					clientsApi.util.updateQueryData(
						'getClientDetail',
						{ id: clientDetailId },
						(d) => {
							if (!d.users) d.users = [];
							if (clientId) {
								//  Привязка
								/* если пользователя ещё нет в списке – добавляем */
								if (!d.users.find((u) => u.id === userId)) {
									d.users.push({
										id: userId,
										username: '',
										first_name: '',
										last_name: '',
										email: '',
									});
								}
							} else {
								//  Отвязка
								d.users = d.users.filter((u) => u.id !== userId);
							}
						},
					),
				);
				try {
					await queryFulfilled;
				} catch {
					patch.undo();
				}
			},
			invalidatesTags: (_, _e, { clientDetailId }) => [
				{ type: 'ClientDetail', id: clientDetailId },
			],
		}),
	}),
});

export const {
	useGetClientsQuery,
	useGetClientDetailQuery,
	useGetMyClientDetailQuery,
	useGetGroupsQuery,
	usePatchClientMutation,

	useSearchClientUsersQuery,
	usePatchUserClientMutation,
} = clientsApi;
