module.exports = {
	/**
	 * Returns the current timestamp
	 * @return {String} Timestamp
	 */
	timestamp: () => {
		return new Date().toISOString().replace("T", "-").replaceAll(":", "-").substring(0, 19)
	},
}
