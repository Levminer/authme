//preload
const fs = require("fs")
const { ipcMain } = require("electron")
const electron = require("electron")
const ipc = electron.ipcRenderer

fs.readFile("pass.md", "utf-8", (err, data) => {
	if (err) {
		console.log("The pass.md fle dont exist!")
	} else {
		ipc.send("to_confirm")
	}
})
