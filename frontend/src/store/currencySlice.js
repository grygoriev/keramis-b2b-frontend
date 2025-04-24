import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCurrencyRates } from '../api/pricingApi';

export const fetchCurrencyRates = createAsyncThunk(
	'currency/fetchRates',
	async (_, { rejectWithValue }) => {
		try {
			const data = await getCurrencyRates();           // [{currency_id, currency_rate}, ...]
			// превращаем в объект-мапу: { USD: 41.6, EUR: 47.8, ... }
			const map = {};
			data.forEach(r => { map[r.currency_id] = Number(r.currency_rate); });
			return map;
		} catch (e) {
			return rejectWithValue(e.message || 'Fetch error');
		}
	}
);

const currencySlice = createSlice({
	name: 'currency',
	initialState: {
		rates: {},          // { USD: 41.6, EUR: 47.8, PLN: 11.07, ... }
		status: 'idle',     // idle | loading | succeeded | failed
		error : null,
	},
	reducers: {},
	extraReducers: (builder) =>
		builder
			.addCase(fetchCurrencyRates.pending, (state) => {
				state.status = 'loading';
				state.error  = null;
			})
			.addCase(fetchCurrencyRates.fulfilled, (state, { payload }) => {
				state.status = 'succeeded';
				state.rates  = payload;
			})
			.addCase(fetchCurrencyRates.rejected, (state, { payload }) => {
				state.status = 'failed';
				state.error  = payload;
			})
});

export const selectCurrencyRates  = (s) => s.currency.rates;
export const selectCurrencyStatus = (s) => s.currency.status;

export default currencySlice.reducer;
