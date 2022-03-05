module.exports = {
	/**
	 * Convert codes from plain text to arrays
	 * @param {string} text
	 * @param {number} sortNumber
	 * @return {LibImportFile} Import file structure
	 */
	fromText: (text, sortNumber) => {
		const data = []
		let names = []
		let secrets = []
		const issuers = []
		const types = []

		let c0 = 0
		let c1 = 1
		let c2 = 2
		let c3 = 3

		// remove double quotes
		const pre_data1 = text.replace(/"/g, "")

		// new line
		const pre_data2 = pre_data1.replace(/,/g, "\n")

		// convert string the array
		const pre_data3 = pre_data2.split(/\n/)
		while (pre_data3.length) {
			data.push(pre_data3.shift())
		}

		// remove first blank line
		data.splice(0, 1)

		// remove blank strings
		for (let i = 0; i < data.length; i++) {
			if (data[i] === "" || data[i] === "\r" || data[i] === "\n" || data[i] === "\r\n") {
				data.splice(i, 1)
			}
		}

		for (let i = 0; i < data.length; i++) {
			// push names to array
			if (i == c0) {
				const names_before = data[i]
				const names_after = names_before.slice(8)

				if (names_after.length > 40) {
					names.push(`${names_after.trim().slice(0, 38)}...`)
				} else {
					names.push(names_after.trim())
				}

				c0 = c0 + 4
			}

			// push secrets to array
			if (i == c1) {
				const secrets_before = data[i]
				const secrets_after = secrets_before.slice(8)
				secrets.push(secrets_after.trim())
				c1 = c1 + 4
			}

			// push issuers to array
			if (i == c2) {
				const issuers_before = data[i]
				const issuers_after = issuers_before.slice(8)

				if (issuers_after.length > 16) {
					issuers.push(`${issuers_after.trim().slice(0, 14)}...`)
				} else {
					issuers.push(issuers_after.trim())
				}

				c2 = c2 + 4
			}

			// push types to array
			if (i == c3) {
				const types_before = data[i]
				const types_after = types_before.slice(8)
				types.push(types_after.trim())
				c3 = c3 + 4
			}
		}

		const issuers_original = [...issuers]

		const sort = () => {
			const names_new = []
			const secrets_new = []

			issuers.forEach((element) => {
				for (let i = 0; i < issuers_original.length; i++) {
					if (element === issuers_original[i]) {
						names_new.push(names[i])
						secrets_new.push(secrets[i])
					}
				}
			})

			names = names_new
			secrets = secrets_new
		}

		if (sortNumber === 1) {
			issuers.sort((a, b) => {
				return a.localeCompare(b)
			})

			sort()
		} else if (sortNumber === 2) {
			issuers.sort((a, b) => {
				return b.localeCompare(a)
			})

			sort()
		}

		return {
			names,
			secrets,
			issuers,
			types,
		}
	},

	/**
	 * Convert JSON to text
	 * @param {object} object
	 * @return {string} stringify
	 */
	fromJSON: (object) => {
		return JSON.stringify(object, null, "\t")
	},
}
