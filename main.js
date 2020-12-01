const electron = require("electron")
const createDesktopShortcut = require("create-desktop-shortcuts")
const fetch = require("node-fetch")
const path = require("path")
const fs = require("fs")
const os = require("os")
const { app, BrowserWindow, Menu, Tray, shell, dialog, clipboard } = require("electron")
const ipc = electron.ipcMain
const exec = require("child_process").exec

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

let authme_version = "2.0.0"
let tag_name = "2.0.0"

ipc.on("ver", (event, data) => {
	event.returnValue = authme_version
})

let v8_version = process.versions.v8
let node_version = process.versions.node
let chrome_version = process.versions.chrome
let electron_version = process.versions.electron

let os_version = `${os.type()} ${os.arch()} ${os.release()}`

let python_version

exec('python -c "import platform; print(platform.python_version())"', (err, stdout, stderr) => {
	python_version = stdout

	if (python_version === undefined) {
		python_version = "Not installed"
	}
})

let to_tray = false
let show_tray = false
let pass_start = false
let update_start = false

let folder

if (process.platform === "win32") {
	folder = process.env.APPDATA
} else {
	folder = process.env.HOME
}

let file

//? folders
const full_path = path.join(folder, "Levminer")
const file_path = path.join(folder, "Levminer/Authme")

//check if folders exists
if (!fs.existsSync(full_path)) {
	fs.mkdirSync(path.join(full_path))
}
if (!fs.existsSync(file_path)) {
	fs.mkdirSync(file_path)
}

//? settings
const settings = `{
		"settings": {
			"launch_on_startup": false,
			"close_to_tray": false,
			"show_2fa_names": false
		},

		"security": {
			"require_password": null,
			"password": null
		}
	}
	`

// create settings if not exists
if (!fs.existsSync(path.join(file_path, "settings.json"))) {
	fs.writeFileSync(path.join(file_path, "settings.json"), settings, (err) => {
		if (err) {
			return console.log(`error creating settings.json ${err}`)
		} else {
			return console.log("settings.json created")
		}
	})
}

// read settings
file = JSON.parse(
	fs.readFileSync(path.join(file_path, "settings.json"), "utf-8", (err, data) => {
		if (err) {
			return console.log(`Error reading settings.json ${err}`)
		} else {
			return console.log("settings.json readed")
		}
	})
)

//? install protbuf
const spawn = require("child_process").spawn

let src = "extract/install.py"

let py = spawn("python", [src])

//? create window
let createWindow = () => {
	window0 = new BrowserWindow({
		show: false,
		backgroundColor: "#2A2424",
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true,
			enableRemoteModule: true,
		},
	})

	window1 = new BrowserWindow({
		show: false,
		backgroundColor: "#2A2424",
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true,
			enableRemoteModule: true,
		},
	})

	window2 = new BrowserWindow({
		show: false,
		backgroundColor: "#2A2424",
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true,
			enableRemoteModule: true,
		},
	})

	window3 = new BrowserWindow({
		show: false,
		backgroundColor: "#2A2424",
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true,
			enableRemoteModule: true,
		},
	})

	window4 = new BrowserWindow({
		show: false,
		backgroundColor: "#2A2424",
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true,
			enableRemoteModule: true,
		},
	})

	window5 = new BrowserWindow({
		show: false,
		backgroundColor: "#2A2424",
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true,
			enableRemoteModule: true,
		},
	})

	window0.loadFile("./app/landing/index.html")
	window1.loadFile("./app/confirm/index.html")
	window2.loadFile("./app/application/index.html")
	window3.loadFile("./app/settings/index.html")
	window4.loadFile("./app/import/index.html")
	window5.loadFile("./app/export/index.html")

	if (file.security.require_password == null) {
		window0.maximize()
	}

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

	//? check for auto update
	window2.on("show", () => {
		let api = () => {
			fetch("https://api.github.com/repos/Levminer/authme/releases/latest")
				.then((res) => res.json())
				.then((data) => {
					try {
						if (data.tag_name != tag_name) {
							dialog
								.showMessageBox({
									title: "Authme",
									buttons: ["Yes", "No"],
									defaultId: 0,
									cancelId: 1,
									type: "info",
									message: `
							Update available: Authme ${data.tag_name}
							
							Do you want to download it?
		
							You currently running: Authme ${tag_name}
							`,
								})
								.then((result) => {
									update = true

									if (result.response === 0) {
										shell.openExternal("https://github.com/Levminer/authme/releases/latest")
									}
								})
						}
					} catch (error) {
						return console.log(error)
					}
				})
		}

		if (update_start == false) {
			 api() 

			update_start = true
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

ipc.on("after_startup0", () => {
	if (process.platform === "win32") {
		let startup_path = path.join(process.env.APPDATA, "/Microsoft/Windows/Start Menu/Programs/Startup/Authme Launcher.lnk")

		fs.unlink(startup_path, (err) => {
			if (err && err.code === "ENOENT") {
				return console.log("startup shortcut not deleted")
			} else {
				console.log("startup shortcut deleted")
			}
		})
	}
})

ipc.on("after_startup1", () => {
	if (process.platform === "win32") {
		let shortcut_created = createDesktopShortcut({
			windows: {
				filePath: app.getPath("exe"),
				outputPath: "%USERPROFILE%\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup",
				name: "Authme Launcher",
				comment: "Authme Launcher",
			},
		})
	}
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

				let if_pass = false
				let if_nopass = false

				// check if require password
				if (file.security.require_password == true) {
					if_pass = true
					pass_start = true

					toggle()
				} else {
					if_nopass = true

					toggle()
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
						let window = BrowserWindow.getFocusedWindow()

						if (c0 == false) {
							window.setFullScreen(true)

							c0 = true
						} else {
							window.setFullScreen(false)

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
						let window = BrowserWindow.getFocusedWindow()

						if (c1 == false) {
							window.webContents.openDevTools()

							c1 = true
						} else {
							window.webContents.closeDevTools()

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

						let if_pass = false
						let if_nopass = false

						// check if require password
						if (file.security.require_password == true) {
							if_pass = true
							pass_start = true

							toggle()
						} else {
							if_nopass = true

							toggle()
						}
					},
				},
				{
					type: "separator",
				},
				{
					label: "Export",
					click: () => {
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

						let if_pass = false
						let if_nopass = false

						// check if require password
						if (file.security.require_password == true) {
							if_pass = true
							pass_start = true

							toggle()
						} else {
							if_nopass = true

							toggle()
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
						let api = () => {
							fetch("https://api.github.com/repos/Levminer/authme/releases/latest")
								.then((res) => res.json())
								.then((data) => {
									try {
										if (data.tag_name != tag_name) {
											dialog
												.showMessageBox({
													title: "Authme",
													buttons: ["Yes", "No"],
													defaultId: 0,
													cancelId: 1,
													type: "info",
													message: `
													Update available: Authme ${data.tag_name}
													
													Do you want to download it?
								
													You currently running: Authme ${tag_name}
													`,
												})
												.then((result) => {
													update = true

													if (result.response === 0) {
														shell.openExternal("https://github.com/Levminer/authme/releases/latest")
													}
												})
										} else {
											dialog.showMessageBox({
												title: "Authme",
												buttons: ["Close"],
												defaultId: 0,
												cancelId: 1,
												type: "info",
												message: `
												No update available:
												
												You running the latest version!
							
												You currently running: Authme ${tag_name}
												`,
											})
										}
									} catch (error) {
										return console.log(error)
									}
								})
						}

						api()
					},
				},
				{
					type: "separator",
				},
				{
					label: "About",
					click: () => {
						const message = `Authme: ${authme_version}\n\nV8: ${v8_version}\nNode: ${node_version}\nElectron: ${electron_version}\nChrome: ${chrome_version}\n\nOS version: ${os_version}\nPython version: ${python_version}\nCreated by: Levminer\n`

						dialog
							.showMessageBox({
								title: "Authme",
								buttons: ["Close", "Copy"],
								defaultId: 0,
								cancelId: 1,
								noLink: true,
								type: "info",
								message: message,
							})
							.then((result) => {
								update = true

								if (result.response === 1) {
									clipboard.writeText(message)
								}
							})
					},
				},
			],
		},
	]

	const menu = Menu.buildFromTemplate(template)
	Menu.setApplicationMenu(menu)
})
