// src/components/header/components/language-switcher/LanguageSwitcher.jsx
export function LanguageSwitcher({ currentLanguage, onChangeLanguage }) {
	const getLangStyle = (lang) => {
		return {
			color: lang === currentLanguage ? '#000' : '#aaa',
			textDecoration: 'none',
			fontWeight: lang === currentLanguage ? 'bold' : 'normal',
			cursor: 'pointer',
		};
	};

	return (
		<div style={{ display: 'flex', gap: 8 }}>
      <span style={getLangStyle('ua')} onClick={() => onChangeLanguage('ua')}>
        UK
      </span>
			<span>|</span>
			<span style={getLangStyle('ru')} onClick={() => onChangeLanguage('ru')}>
        RU
      </span>
		</div>
	);
}
