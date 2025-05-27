/* src/features/clients/clientsApi.js */
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../services/axiosBaseQuery';

export const clientsApi = createApi({
	reducerPath : 'clientsApi',
	baseQuery   : axiosBaseQuery(),
	tagTypes    : ['Clients', 'ClientDetail', 'Groups'],

	endpoints : (builder) => ({

		/* ——— список (lang) ——— */
		getClients : builder.query({
			query : (lang) => ({
				url   : '/api/auth/clients/',
				params: { lang, ordering:'name' },
			}),
			providesTags : (res)=>
				res
					? [
						...res.map(c => ({ type:'Clients', id:c.id })),
						{ type:'Clients', id:'LIST' },
					]
					: [{ type:'Clients', id:'LIST' }],
		}),

		/* ——— detail по id ——— */
		getClientDetail : builder.query({
			query : ({ id, lang }) => ({
				url   : `/api/auth/clients/${id}/detail/`,
				params: lang ? { lang } : undefined,
			}),
			providesTags : (_r,_e,{ id }) => [
				{ type:'ClientDetail', id },
				{ type:'Clients',      id },
			],
		}),

		/* ——— detail «моего» клиента (для кабинета) ——— */
		getMyClientDetail : builder.query({
			query : () => ({ url:'/api/auth/clients/my/detail/' }),
			providesTags : [{ type:'ClientDetail', id:'ME' }],
		}),

		/* ——— группы ——— */
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

		/* ——— PATCH клиента ——— */
		patchClient : builder.mutation({
			query : ({ id, payload }) => ({
				url   : `/api/auth/clients/${id}/`,
				method: 'PATCH',
				data  : payload,
			}),
			async onQueryStarted({ id, payload }, { dispatch, getState, queryFulfilled }) {
				const patches = [];

				/* списки */
				Object.values(getState().clientsApi.queries).forEach(q=>{
					if (q?.endpointName === 'getClients') {
						patches.push(
							dispatch(
								clientsApi.util.updateQueryData('getClients', q.originalArgs, d=>{
									const c = d.find(x=>x.id===id);
									if (c) c.client_group = payload.client_group;
								}),
							),
						);
					}
				});

				/* все detail-кеши этого id + «ME» */
				Object.values(getState().clientsApi.queries).forEach(q=>{
					const ep = q?.endpointName;
					if (
						(ep==='getClientDetail'   && q.originalArgs?.id===id) ||
						(ep==='getMyClientDetail' && id==='ME')
					){
						patches.push(
							dispatch(
								clientsApi.util.updateQueryData(ep, q.originalArgs, d=>{
									d.client_group = payload.client_group;
								}),
							),
						);
					}
				});

				try { await queryFulfilled; } catch { patches.forEach(p=>p.undo?.()); }
			},
			invalidatesTags : (_r,_e,{ id }) => [
				{ type:'ClientDetail', id },
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
} = clientsApi;
