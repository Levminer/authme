const { languages } = require("@levminer/languages")
const lang = languages.en
const electron = require("electron")

/**
 * Localization
 */
module.exports = {
	/**
	 * Localize the page
	 * @param {string} renderer
	 */
	localize: (renderer) => {
		const res = electron.ipcRenderer.sendSync("languageCode").language
		let loc_id = 0

		document.addEventListener("DOMContentLoaded", () => {
			document.querySelectorAll("[data-loc]").forEach(translateElements)
		})

		const translateElements = (element) => {
			element.textContent = languages[res][renderer][loc_id]

			loc_id++
		}
	},

	/**
	 * Get language code
	 * @return {lang}
	 */
	getLang: () => {
		const res = electron.ipcRenderer.sendSync("languageCode").language
		return languages[res]
	},
}
