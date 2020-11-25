const electron = require("electron")
const createDesktopShortcut = require("create-desktop-shortcuts")
const path = require("path")
const fs = require("fs")
const { app, BrowserWindow, Menu, Tray, shell, dialog } = require("electron")
const ipc = electron.ipcMain

let splash
let window0
let window1
let window2
let window3
let window4

let c0 = false
let c1 = false
let c2 = false
let c3 = false
let c4 = false
let c5 = false

let ipc0 = false
let ipc1 = false
let ipc2 = false

let confirmed = false
let startup = false

let authme_version = "1.4.2"

ipc.on("ver", (event, data) => {
	event.returnValue = authme_version
})

let v8_version = process.versions.v8
let node_version = process.versions.node
let chrome_version = process.versions.chrome
let electron_version = process.versions.electron

let to_tray = false
let show_tray = false
let pass_start = false

const file_path = path.join(process.env.APPDATA, "/Levminer/Authme")

let createWindow = () => {
	window0 = new BrowserWindow({
		show: false,
		backgroundColor: "#2A2424",
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true,
		},
	})

	window1 = new BrowserWindow({
		show: false,
		backgroundColor: "#2A2424",
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true,
		},
	})

	window2 = new BrowserWindow({
		show: false,
		backgroundColor: "#2A2424",
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true,
		},
	})

	window3 = new BrowserWindow({
		show: false,
		backgroundColor: "#2A2424",
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true,
		},
	})

	window4 = new BrowserWindow({
		show: false,
		backgroundColor: "#2A2424",
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true,
		},
	})

	window5 = new BrowserWindow({
		show: false,
		backgroundColor: "#2A2424",
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true,
		},
	})

	fs.readFile(path.join(file_path, "pass.md"), "utf-8", (err, data) => {
		if (err) {
			fs.readFile(path.join(file_path, "nrpw.md"), "utf-8", (err, data) => {
				if (err) {
					window0.maximize()
				}
			})
		} else {
			window0.maximize()
		}
	})

	window0.loadFile("./app/landing/index.html")
	window1.loadFile("./app/confirm/index.html")
	window2.loadFile("./app/application/index.html")
	window3.loadFile("./app/settings/index.html")
	window4.loadFile("./app/import/index.html")
	window5.loadFile("./app/export/index.html")

	window0.on("close", () => {
		app.quit()
	})

	window1.on("close", () => {
		app.quit()
	})

	window2.on("close", async (e) => {
		if (to_tray == false) {
			app.exit()
		} else {
			e.preventDefault()
			setTimeout(() => {
				window2.hide()
			}, 100)

			show_tray = true

			c2 = false
		}
	})

	window3.on("close", async (e) => {
		if (to_tray == false) {
			app.exit()
		} else {
			e.preventDefault()
			setTimeout(() => {
				window3.hide()
			}, 100)
			show_tray = true

			c3 = false
		}
	})

	window4.on("close", async (e) => {
		if (to_tray == false) {
			app.exit()
		} else {
			e.preventDefault()
			setTimeout(() => {
				window4.hide()
			}, 100)
			show_tray = true

			c4 = false
		}
	})

	window5.on("close", async (e) => {
		if (to_tray == false) {
			app.exit()
		} else {
			e.preventDefault()
			setTimeout(() => {
				window5.hide()
			}, 100)
			show_tray = true

			c5 = false
		}
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

ipc.on("to_application0", () => {
	if (ipc1 == false && startup == false) {
		window1.hide()

		setTimeout(() => {
			window2.maximize()
			window2.show()
		}, 300)

		ipc1 = true

		confirmed = true
	}
})

ipc.on("to_application1", () => {
	if (ipc2 == false && startup == false) {
		window0.hide()

		setTimeout(() => {
			window2.maximize()
			window2.show()
		}, 300)

		ipc2 = true
	}
})

ipc.on("hide0", () => {
	if (c3 == false) {
		window3.maximize()
		window3.show()
		c3 = true
	} else {
		window3.hide()
		c3 = false
	}
})

ipc.on("hide1", () => {
	if (c4 == false) {
		window4.maximize()
		window4.show()
		c4 = true
	} else {
		window4.hide()
		c4 = false
	}
})

ipc.on("hide2", () => {
	if (c5 == false) {
		window5.maximize()
		window5.show()
		c5 = true
	} else {
		window5.hide()
		c5 = false
	}
})

ipc.on("after_data", () => {
	setTimeout(() => {
		app.quit()
	}, 1000)
})

ipc.on("after_startup0", () => {
	let startup_path = path.join(process.env.APPDATA, "/Microsoft/Windows/Start Menu/Programs/Startup/Authme Launcher.lnk")

	fs.unlink(startup_path, (err) => {
		if (err && err.code === "ENOENT") {
			return console.log("startup shortcut not deleted")
		} else {
			console.log("startup shortcut deleted")
		}
	})
})

ipc.on("after_startup1", () => {
	let shortcut_created = createDesktopShortcut({
		windows: {
			filePath: app.getPath("exe"),
			outputPath: "%USERPROFILE%\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup",
			name: "Authme Launcher",
			comment: "Authme Launcher",
		},
	})
})

ipc.on("after_tray0", () => {
	to_tray = false
})

ipc.on("after_tray1", () => {
	to_tray = true
})

ipc.on("startup", () => {
	window2.hide()
	window1.hide()
	startup = true
})

ipc.on("app_path", () => {
	shell.showItemInFolder(app.getPath("exe"))
})

app.whenReady().then(() => {
	splash = new BrowserWindow({
		width: 500,
		height: 500,
		transparent: true,
		frame: false,
		alwaysOnTop: true,
		resizable: false,
		webPreferences: {
			nodeIntegration: true,
		},
	})

	splash.loadFile("./app/splash/index.html")

	splash.show()

	setTimeout(() => {
		createWindow()
	}, 1000)

	setTimeout(() => {
		splash.hide()
	}, 1500)

	// make tray
	let iconpath = path.join(__dirname, "img/iconb.png")

	tray = new Tray(iconpath)
	const contextmenu = Menu.buildFromTemplate([
		{
			label: "Show app",
			click: () => {
				let if_pass = false
				let if_nopass = false

				// check if require password
				fs.readFile(path.join(file_path, "pass.md"), "utf-8", (err, data) => {
					if (err) {
						return console.log("Not found pass.md")
					} else {
						console.log("IT IS PASS")
						if_pass = true
						pass_start = true

						toggle()
					}
				})

				// check if not require password
				fs.readFile(path.join(file_path, "nrpw.md"), "utf-8", (err, data) => {
					if (err) {
						return console.log("Not found nrpw.md")
					} else {
						console.log("IT IS NOPASS")
						if_nopass = true

						toggle()
					}
				})

				let toggle = () => {
					if (confirmed == false) {
						if (pass_start == true) {
							if (c1 == false) {
								window1.maximize()
								window1.show()

								c1 = true
							} else {
								window1.hide()

								c1 = false
							}
						}
					}

					if (c2 == false) {
						// if password and password confirmed
						if (if_pass == true && confirmed == true) {
							window2.maximize()
							window2.show()

							c2 = true
						}

						// if no password
						if (if_nopass == true) {
							window2.maximize()
							window2.show()

							c2 = true
						}

						// if exit to tray on
						if (show_tray == true) {
							window2.maximize()
							window2.show()

							c2 = true
						}
					} else {
						// if password and password confirmed
						if (if_pass == true && confirmed == true) {
							window2.hide()

							c2 = false
						}

						// if no password
						if (if_nopass == true) {
							window2.hide()

							c2 = false
						}

						// if exit to tray on
						if (show_tray == true) {
							window2.hide()

							c2 = false
						}
					}
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
				to_tray = false
				app.exit()
			},
		},
	])
	tray.setToolTip("Authme")
	tray.setContextMenu(contextmenu)

	// create windows

	// menubar
	const template = [
		{
			label: "File",
			submenu: [
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
				{
					type: "separator",
				},
				{
					label: "Exit",
					click: () => {
						to_tray = false
						app.exit()
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
							window3.setFullScreen(true)
							c0 = true
						} else {
							window0.setFullScreen(false)
							window1.setFullScreen(false)
							window2.setFullScreen(false)
							window3.setFullScreen(false)
							c0 = false
						}
						console.log(`FC ${c0}`)
					},
				},
				{
					type: "separator",
				},
				{
					label: "Devtools",
					click: () => {
						if (c1 == false) {
							window0.webContents.openDevTools()
							window1.webContents.openDevTools()
							window2.webContents.openDevTools()
							window3.webContents.openDevTools()
							window4.webContents.openDevTools()
							window5.webContents.openDevTools()
							c1 = true
						} else {
							window0.webContents.closeDevTools()
							window1.webContents.closeDevTools()
							window2.webContents.closeDevTools()
							window3.webContents.closeDevTools()
							window4.webContents.closeDevTools()
							window5.webContents.closeDevTools()
							c1 = false
						}
						console.log(`DT ${c1}`)
					},
				},
			],
		},
		{
			label: "Advanced",
			submenu: [
				{
					label: "Import",
					click: () => {
						let if_pass = false
						let if_nopass = false

						fs.readFile(path.join(file_path, "pass.md"), "utf-8", (err, data) => {
							if (err) {
								return console.log("Not found pass.md")
							} else {
								console.log("IT IS PASS")
								if_pass = true
								pass_start = true

								toggle()
							}
						})

						fs.readFile(path.join(file_path, "nrpw.md"), "utf-8", (err, data) => {
							if (err) {
								return console.log("Not found nrpw.md")
							} else {
								console.log("IT IS NOPASS")
								if_nopass = true

								toggle()
							}
						})

						let toggle = () => {
							if (c4 == false) {
								if (if_pass == true && confirmed == true) {
									window4.maximize()
									window4.show()

									c4 = true
								}

								if (if_nopass == true) {
									window4.maximize()
									window4.show()

									c4 = true
								}
							} else {
								if (if_pass == true && confirmed == true) {
									window4.hide()

									c4 = false
								}

								if (if_nopass == true) {
									window4.hide()

									c4 = false
								}
							}
						}
					},
				},
				{
					type: "separator",
				},
				{
					label: "Export",
					click: () => {
						let if_pass = false
						let if_nopass = false

						fs.readFile(path.join(file_path, "pass.md"), "utf-8", (err, data) => {
							if (err) {
								return console.log("Not found pass.md")
							} else {
								console.log("IT IS PASS")
								if_pass = true

								toggle()
							}
						})

						fs.readFile(path.join(file_path, "nrpw.md"), "utf-8", (err, data) => {
							if (err) {
								return console.log("Not found nrpw.md")
							} else {
								console.log("IT IS NOPASS")
								if_nopass = true

								toggle()
							}
						})

						let toggle = () => {
							if (c5 == false) {
								if (if_pass == true && confirmed == true) {
									window5.maximize()
									window5.show()

									c5 = true
								}

								if (if_nopass == true) {
									window5.maximize()
									window5.show()

									c5 = true
								}
							} else {
								if (if_pass == true && confirmed == true) {
									window5.hide()

									c5 = false
								}

								if (if_nopass == true) {
									window5.hide()

									c5 = false
								}
							}
						}
					},
				},
			],
		},
		{
			label: "Info",
			submenu: [
				{
					label: "Update",
					click: () => {
						shell.openExternal("https://github.com/Levminer/authme/releases")
					},
				},
				{
					type: "separator",
				},
				{
					label: "About",
					click: () => {
						let window = BrowserWindow.getFocusedWindow()

						dialog.showMessageBox(window, {
							title: "Authme",
							buttons: ["Close"],
							type: "info",
							message: `Authme: ${authme_version}

							V8: ${v8_version}
							Node: ${node_version}
							Electron: ${electron_version}
							Chrome: ${chrome_version}

							Created by: Levminer
							`,
						})
					},
				},
			],
		},
	]

	const menu = Menu.buildFromTemplate(template)
	Menu.setApplicationMenu(menu)
})
