import { localeEN } from "@utils/language/en"
import { localeHU } from "@utils/language/hu"
import { localeES } from "@utils/language/es"
import { localeFR } from "@utils/language/fr"
import { localeRU } from "@utils/language/ru"
import { localeDE } from "@utils/language/de"
import { localeZH } from "@utils/language/zh"
import { localePL } from "@utils/language/pl"
import { localeJA } from "@utils/language/ja"
import { getSettings } from "@stores/settings"

export const getLanguage = () => {
	const language = navigator.language
	const settings = getSettings()

	if (settings.settings.language === 0) {
		if (language.startsWith("hu")) {
			return localeHU
		} else if (language.startsWith("es")) {
			return localeES
		} else if (language.startsWith("fr")) {
			return localeFR
		} else if (language.startsWith("ru")) {
			return localeRU
		} else if (language.startsWith("de")) {
			return localeDE
		} else if (language.startsWith("zh")) {
			return localeZH
		} else if (language.startsWith("pl")) {
			return localePL
		} else if (language.startsWith("ja")) {
			return localeJA
		} else {
			return localeEN
		}
	} else {
		const languages = [localeEN, localeHU, localeES, localeFR, localeRU, localeDE, localeZH, localePL]

		return languages[settings.settings.language - 1]
	}
}
