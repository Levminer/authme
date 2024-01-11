import { localeEN } from "@utils/language/en"

export const getLanguage = () => {
	const language = navigator.language

	if (language.startsWith("en")) {
		return localeEN
	} else {
		return localeEN
	}
}
