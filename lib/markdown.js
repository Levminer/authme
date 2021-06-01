module.exports = {
	convert: (text) => {
		const body = text
			.replaceAll("###", "")
			.replaceAll("*", " -")
			.replaceAll(/(#[0-9])\w+/g, "")
			.replaceAll("-  ", "- ")

		return body
	},
}
