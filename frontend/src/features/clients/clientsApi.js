/* ── src/features/clients/clientsApi.js ── */
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../services/axiosBaseQuery';

export const clientsApi = createApi({
	reducerPath : 'clientsApi',
	baseQuery   : axiosBaseQuery(),
	tagTypes    : ['Clients', 'Groups'],

	endpoints : (builder) => ({

		/* ───  CLIENTS (зависит от lang)  ─────────────────────────────── */
		getClients : builder.query({
			query : (lang) => ({ url : '/api/auth/clients/', params:{ lang } }),
			providesTags : (res)=>
				res
					? [
						...res.map(c => ({ type:'Clients', id:c.id })),
						{ type:'Clients', id:'LIST' },
					]
					: [{ type:'Clients', id:'LIST' }],
		}),

		/* ───  GROUPS  ────────────────────────────────────────────────── */
		getGroups : builder.query({
			query : () => ({ url:'/api/auth/client-groups/' }),
			providesTags : (res)=>
				res
					? [
						...res.map(g => ({ type:'Groups', id:g.id })),
						{ type:'Groups', id:'LIST' },
					]
					: [{ type:'Groups', id:'LIST' }],
		}),

		/* ───  PATCH CLIENT  ──────────────────────────────────────────── */
		patchClient : builder.mutation({
			/* arg: { id, payload }  - lang не нужен: патчим ВСЕ кэши */
			query : ({ id, payload }) => ({
				url   : `/api/auth/clients/${id}/`,
				method: 'PATCH',
				data  : payload,
			}),

			/* ⬇️ оптимистически патчим все кеш-запросы getClients */
			async onQueryStarted({ id, payload }, { dispatch, getState, queryFulfilled }) {
				/* найдём ВСЕ сохранённые вызовы getClients (любые args — ‘lang’ ) */
				const state   = getState();
				const patches = [];

				Object.values(state.clientsApi.queries).forEach((q) => {
					if (q?.endpointName === 'getClients') {
						const langArg = q.originalArgs;   // это тот ‘lang’, с которым кеш
						const p = dispatch(
							clientsApi.util.updateQueryData('getClients', langArg, draft => {
								const client = draft.find(c => c.id === id);
								if (client) Object.assign(client, payload);
							}),
						);
						patches.push(p);
					}
				});

				try {
					await queryFulfilled;          // ← сервер ответил OK – ничего не делаем
				} catch {
					/* откатить ВСЕ оптимистические патчи */
					patches.forEach(p => p.undo && p.undo());
				}
			},

			/* кэш уже поправили →  ничего дополнительно не инвалидируем  */
			invalidatesTags : () => [],
		}),

		/* ───  BALANCE BY CODE  ──────────────────────────────────────── */
		getClientBalance : builder.query({
			query : (code) => ({ url:`/api/auth/client-balance/${code}/` }),
		}),

	}),
});

export const {
	useGetClientsQuery,
	useGetGroupsQuery,
	usePatchClientMutation,
	useGetClientBalanceQuery,
} = clientsApi;
