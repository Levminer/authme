module.exports = {
	/**
	 * Clean up Node.js stack trace
	 * @param {string} stack
	 * @return {string}
	 */
	clean: (stack) => {
		const extractPathRegex = /\s+at.*[(\s](.*)\)?/
		const pathRegex = /^(?:(?:(?:node|node:[\w/]+|(?:(?:node:)?internal\/[\w/]*|.*node_modules\/(?:babel-polyfill|pirates)\/.*)?\w+)(?:\.js)?:\d+:\d+)|native)/

		if (typeof stack !== "string") {
			return undefined
		}

		return stack
			.replace(/\\/g, "/")
			.split("\n")
			.filter((line) => {
				const pathMatches = line.match(extractPathRegex)
				if (pathMatches === null || !pathMatches[1]) {
					return true
				}

				const match = pathMatches[1]

				// Electron (windows)
				if (match.includes("node_modules/electron/dist/resources/electron.asar") || match.includes("node_modules/electron/dist/resources/default_app.asar")) {
					return false
				}

				return !pathRegex.test(match)
			})
			.filter((line) => line.trim() !== "")
			.map((line) => {
				return line
			})
			.join("\n")
	},
}
