module.exports = {
	/**
	 * Convert Markdown to text
	 * @param {string} text
	 * @return {string} body
	 */
	convert: (text) => {
		const body = text
			.replaceAll("###", "")
			.replaceAll("*", " -")
			.replaceAll(/(#[0-9])\w+/g, "")
			.replaceAll("-  ", "- ")

		return body
	},
}
