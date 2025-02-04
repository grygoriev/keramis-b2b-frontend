import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationRu from './locales/ru/translation.json';
import translationUa from './locales/ua/translation.json';

const resources = {
	ru: { translation: translationRu },
	ua: { translation: translationUa },
};

const savedLang = localStorage.getItem('lang') || 'ua';

i18n
	.use(initReactI18next)
	.init({
		resources,
		lng: savedLang,
		fallbackLng: 'ru',
		interpolation: {
			escapeValue: false,
		},
	});

export default i18n;
