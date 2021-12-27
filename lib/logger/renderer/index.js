const electron = require("electron")

let window = ""

module.exports = {
	/**
	 * Writes a log to the console
	 * @param {string} message
	 * @param {string|object} log
	 * @return {string} log
	 */
	log: (message, log) => {
		console.log(message)

		electron.ipcRenderer.send("loggerLog", { id: window, message: message, log: log })
	},

	/**
	 * Writes a warn to the console
	 * @param {string} message
	 * @param {string|object} warn
	 * @return {string} warn
	 */
	warn: (message, warn) => {
		console.warn(message)

		electron.ipcRenderer.send("loggerWarn", { id: window, message: message, warn: warn })
	},

	/**
	 * Writes a error to the console
	 * @param {string} message
	 * @param {string|object} error
	 * @return {string} error
	 */
	error: (message, error) => {
		console.error(message)

		electron.ipcRenderer.send("loggerError", { id: window, message: message, error: error })
	},

	/**
	 * Get window name
	 * @param {string} name
	 * @return {string} window name
	 */
	getWindow: (name) => {
		window = name
	},
}
