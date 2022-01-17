const { languages } = require("@levminer/languages")
const lang = languages.en
const electron = require("electron")

/**
 * Localization
 */
module.exports = {
	/**
	 * Localize the page
	 * @param {renderer} rendererName
	 */
	localize: (renderer) => {
		const res = electron.ipcRenderer.sendSync("lang").lang_code
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
		const res = electron.ipcRenderer.sendSync("lang").lang_code
		return languages[res]
	},
}
