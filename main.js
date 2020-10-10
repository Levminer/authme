const electron = require("electron")
const path = require("path")
const { app, BrowserWindow, Menu, shell } = require("electron")
const ipc = electron.ipcMain

let window0
let window1
let window2

let c0 = false
let c1 = false
let c2 = false

let ipc0 = false
let ipc1 = false

let createWindow = () => {
	window0 = new BrowserWindow({
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true,
		},
	})

	window1 = new BrowserWindow({
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true,
		},
	})

	window2 = new BrowserWindow({
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true,
		},
	})

	// DEVTOOLS
	/* window1.webContents.openDevTools() */

	window0.maximize()

	window1.hide()
	window2.hide()

	window0.loadFile("./app/landing/index.html")
	window1.loadFile("./app/confirm/index.html")
	window2.loadFile("./app/application/index.html")

	window0.on("close", () => {
		app.quit()
	})

	window1.on("close", () => {
		app.quit()
	})

	window2.on("close", () => {
		app.quit()
	})
}

ipc.on("to_confirm", () => {
	if (ipc0 == false) {
		window1.maximize()
		window1.show()
		window0.hide()
		ipc0 = true
	}
})

ipc.on("to_application", () => {
	if (ipc1 == false) {
		window2.maximize()
		window2.show()
		window1.hide()
		ipc1 = true
	}
})

app.whenReady().then(() => {
	createWindow()
	const template = [
		{
			label: "File",
			submenu: [
				{
					label: "Exit",
					click: () => {
						app.quit()
					},
				},
				{
					type: "separator",
				},
				{
					label: "Support",
					click: () => {
						shell.openExternal("https://paypal.me/levminer")
					},
				},
			],
		},
		{
			label: "Settings",
			submenu: [
				{
					label: "Fullscreen",
					click: () => {
						if (c0 == false) {
							window0.setFullScreen(true)
							window1.setFullScreen(true)
							window2.setFullScreen(true)
							c0 = true
						} else {
							window0.setFullScreen(false)
							window1.setFullScreen(false)
							window2.setFullScreen(false)
							c0 = false
						}
						console.log(`FC ${c0}`)
					},
				},
				{
					type: "separator",
				},
				{
					label: "Dev Tools",
					click: () => {
						if (c1 == false) {
							window0.webContents.openDevTools()
							window1.webContents.openDevTools()
							window2.webContents.openDevTools()
							c1 = true
						} else {
							window0.webContents.closeDevTools()
							window1.webContents.closeDevTools()
							window2.webContents.openDevTools()
							c1 = false
						}
						console.log(`DT ${c1}`)
					},
				},
			],
		},
		{
			label: "Update",
			submenu: [
				{
					label: "Info",
					click: () => {
						shell.openExternal("https://www.levminer.com")
					},
				},
				{
					type: "separator",
				},
				{
					label: "Update",
					click: () => {
						shell.openExternal("https://github.com/Levminer/authme/releases")
					},
				},
			],
		},
	]

	const menu = Menu.buildFromTemplate(template)
	Menu.setApplicationMenu(menu)

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})
