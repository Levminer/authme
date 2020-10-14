const electron = require("electron")
const AutoLaunch = require("auto-launch")
const path = require("path")
const { app, BrowserWindow, Menu, Tray, shell, Notification } = require("electron")
const ipc = electron.ipcMain

let window0
let window1
let window2
let window3

let c0 = false
let c1 = false

let c2 = false
let c3 = false

let ipc0 = false
let ipc1 = false
let ipc2 = false

let autoLaunch

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

	window3 = new BrowserWindow({
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
	window3.hide()

	window0.loadFile("./app/landing/index.html")
	window1.loadFile("./app/confirm/index.html")
	window2.loadFile("./app/application/index.html")
	window3.loadFile("./app/settings/index.html")

	window0.on("close", () => {
		app.quit()
	})

	window1.on("close", () => {
		app.quit()
	})

	window2.on("close", () => {
		app.quit()
	})

	window3.on("close", () => {
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
		window1.hide()
		ipc1 = true
	}
})

ipc.on("to_application1", () => {
	if (ipc2 == false) {
		window0.hide()
		window2.maximize()
		window2.show()
		ipc1 = true
	}
})

ipc.on("hide", () => {
	if (c3 == false) {
		window3.maximize()
		window3.show()
		c3 = true
	} else {
		window3.hide()
		c3 = false
	}
})

ipc.on("after_data", () => {
	setTimeout(() => {
		app.quit()
	}, 1000)
})

app.whenReady().then(() => {
	// autolaunch
	autoLaunch = new AutoLaunch({
		name: "Authme Starter",
		path: app.getPath("exe"),
	})

	autoLaunch.isEnabled().then((isEnabled) => {
		if (!isEnabled) autoLaunch.enable()
	})

	// make tray
	let iconpath = path.join(__dirname, "img/icon.png")

	tray = new Tray(iconpath)
	const contextMenu = Menu.buildFromTemplate([
		{
			label: "Show app",
			click: () => {
				if (c2 == false) {
					window2.maximize()
					window2.show()
					c2 = true
				} else {
					window2.hide()
					c2 = false
				}
			},
		},
		{ type: "separator" },
		{
			label: "Settings",
			click: () => {
				if (c3 == false) {
					window3.maximize()
					window3.show()
					c3 = true
				} else {
					window3.hide()
					c3 = false
				}
			},
		},
		{ type: "separator" },
		{
			label: "Exit app",
			click: () => {
				app.quit()
			},
		},
	])
	tray.setToolTip("Authme")
	tray.setContextMenu(contextMenu)

	// create windows
	createWindow()

	// menubar
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
					label: "Settings",
					click: () => {
						if (c3 == false) {
							window3.maximize()
							window3.show()
							c3 = true
						} else {
							window3.hide()
							c3 = false
						}
					},
				},
			],
		},
		{
			label: "Window",
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
							window3.webContents.openDevTools()
							c1 = true
						} else {
							window0.webContents.closeDevTools()
							window1.webContents.closeDevTools()
							window2.webContents.closeDevTools()
							window3.webContents.closeDevTools()
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

ipc.on("after_startup0", () => {
	autoLaunch.disable()
})

ipc.on("after_startup1", () => {
	autoLaunch.enable()
})

ipc.on("startup", () => {
	window2.hide()
})
