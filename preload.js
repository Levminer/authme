//preload
const fs = require("fs")
const { ipcMain } = require("electron")
const electron = require("electron")

const ipc = electron.ipcRenderer

fs.readFile("pass.md", "utf-8", (err, data) => {
	if (err) {
		return console.log("The pass.md fle dont exist!")
	} else {
		return console.log("The pass.md fle  exist!")
		ipc.send("to_confirm")
	}
})

fs.readFile("nrpw.md", "utf-8", (err, data) => {
	if (err) {
		return console.log("The nrpw.md fle dont exist!")
	} else {
		console.log("The nrpw.md fle exist!")
		ipc.send("to_application1")
	}
})

fs.readFile("saos.md", "utf-8", (err, data) => {
	if (err) {
		return console.log("The saos.md file dont exist!")
	} else {
		console.log("The saos.md file exist!")
		ipc.send("startup")
	}
})
