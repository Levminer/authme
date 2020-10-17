//preload
const fs = require("fs")
const { ipcMain } = require("electron")
const electron = require("electron")
const path = require("path")

const ipc = electron.ipcRenderer

const file_path = path.join(process.env.APPDATA, "/Levminer/Authme")

if (!fs.existsSync(file_path)) {
	console.log("Folder created!")
	fs.mkdirSync(path.join(process.env.APPDATA, "Levminer"))
	fs.mkdirSync(path.join(process.env.APPDATA, "Levminer", "Authme"))
}

fs.readFile(path.join(file_path, "pass.md"), "utf-8", (err, data) => {
	if (err) {
		return console.log("The pass.md fle dont exist!")
	} else {
		console.log("The pass.md fle  exist!")
		ipc.send("to_confirm")
	}
})

fs.readFile(path.join(file_path, "nrpw.md"), "utf-8", (err, data) => {
	if (err) {
		return console.log("The nrpw.md fle dont exist!")
	} else {
		console.log("The nrpw.md fle exist!")
		ipc.send("to_application1")
	}
})

fs.readFile(path.join(file_path, "saos.md"), "utf-8", (err, data) => {
	if (err) {
		return console.log("The saos.md file dont exist!")
	} else {
		console.log("The saos.md file exist!")
		ipc.send("startup")
	}
})
