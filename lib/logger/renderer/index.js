const electron = require("electron")

let window = ""

module.exports = {
	/**
	 * Writes a log to the console
	 * @param {String} message
	 * @param {String} log
	 * @return {String} log
	 */
	log: (message, log) => {
		console.log(message)

		electron.ipcRenderer.send("loggerLog", { id: window, message: message, log: log })
	},

	/**
	 * Writes a warn to the console
	 * @param {String} message
	 * @param {String} warn
	 * @return {String} warn
	 */
	warn: (message, warn) => {
		console.warn(message)

		electron.ipcRenderer.send("loggerWarn", { id: window, message: message, warn: warn })
	},

	/**
	 * Writes a error to the console
	 * @param {String} message
	 * @param {String} error
	 * @return {String} error
	 */
	error: (message, error) => {
		console.error(message)

		electron.ipcRenderer.send("loggerError", { id: window, message: message, error: error })
	},

	/**
	 * Get window name
	 * @param {String} name
	 * @return {String} window name
	 */
	getWindow: (name) => {
		window = name
	},
}
