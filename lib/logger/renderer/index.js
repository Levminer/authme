const electron = require("electron")

let window = ""

module.exports = {
	/**
	 * Writes a log to the console
	 * @param {string} message
	 * @param {string|object} arg
	 */
	log: (message, arg) => {
		console.log(message)

		electron.ipcRenderer.send("loggerLog", { window, message, arg })
	},

	/**
	 * Writes a warn to the console
	 * @param {string} message
	 * @param {string|object} arg
	 */
	warn: (message, arg) => {
		console.log(message)

		electron.ipcRenderer.send("loggerWarn", { window, message, arg })
	},

	/**
	 * Writes an error to the console
	 * @param {string} message
	 * @param {string|object} arg
	 */
	error: (message, arg) => {
		console.error(message)

		electron.ipcRenderer.send("loggerError", { window, message, arg })
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
