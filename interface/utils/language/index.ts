import { localeEN } from "@utils/language/en"
import { localeHU } from "@utils/language/hu"
import { localeES } from "@utils/language/es"

export const getLanguage = () => {
	const language = navigator.language

	if (language.startsWith("es")) {
		return localeES
	} else if (language.startsWith("hu")) {
		return localeHU
	} else {
		return localeEN
	}
}
