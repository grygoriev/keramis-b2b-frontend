// src/api/catalogCache.js   ← новый файл
import { fetchCategoryTree } from './catalogApi';

const cache = new Map();           // lang → Promise

/**
 * Возвращает тот же Promise, что и первый вызов с данным lang.
 * Ошибочный запрос не кешируем.
 */
export function getCategoryTree(lang = 'ru') {
	if (!cache.has(lang)) {
		const p = fetchCategoryTree(lang)
			.catch(err => {              // если упало – чистим, чтобы можно было попробовать снова
				cache.delete(lang);
				throw err;
			});
		cache.set(lang, p);
	}
	return cache.get(lang);          // Promise<tree>
}
