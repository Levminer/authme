const { passwords } = require("./passwords.json")

module.exports = {
	/**
	 * Match the input with the top 1000 passwords
	 * @param {String} input - Password to check for
	 * @return {Boolean}
	 */
	search: (input) => {
		let match = false

		for (let i = 0; i < passwords.length; i++) {
			console.log(i)

			if (passwords[i] === input) {
				return (match = true)
			}
		}

		return match
	},
}
