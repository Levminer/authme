const electron = require("electron")

let window = ""

module.exports = {
	log: (message, log) => {
		console.log(message)

		electron.ipcRenderer.send("loggerLog", { id: window, message: message, log: log })
	},

	warn: (message, warn) => {
		console.warn(message)

		electron.ipcRenderer.send("loggerWarn", { id: window, message: message, warn: warn })
	},

	error: (message, error) => {
		console.error(message)

		electron.ipcRenderer.send("loggerError", { id: window, message: message, error: error })
	},

	getWindow: (name) => {
		window = name
	},
}
