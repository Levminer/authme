const electron = require("electron")
const createDesktopShortcut = require("create-desktop-shortcuts")
const fetch = require("node-fetch")
const path = require("path")
const fs = require("fs")
const os = require("os")
const { app, BrowserWindow, Menu, Tray, shell, dialog, clipboard, globalShortcut } = require("electron")
const ipc = electron.ipcMain
const exec = require("child_process").exec
const { is } = require("electron-util")
const debug = require("electron-debug")

// ?  init
let splash
let window0
let window1
let window2
let window3
let window4
let window5

let confirm_shown = false
let application_shown = false
let settings_shown = false
let import_shown = false
let export_shown = false

let ipc_to_confirm = false
let ipc_to_application_0 = false
let ipc_to_application_1 = false

let confirmed = false
let startup = false

let to_tray = false
let show_tray = false
let pass_start = false
let update_start = false

// ? version
const authme_version = "2.2.1"
const tag_name = "2.2.1"

ipc.on("ver", (event, data) => {
	event.returnValue = authme_version
})

const v8_version = process.versions.v8
const node_version = process.versions.node
const chrome_version = process.versions.chrome
const electron_version = process.versions.electron

const os_version = `${os.type()} ${os.arch()} ${os.release()}`

let python_version

// eslint-disable-next-line
exec('python -c "import platform; print(platform.python_version())"', (err, stdout, stderr) => {
	if (err) {
		console.log(err)
	}

	python_version = stdout

	if (python_version === undefined) {
		python_version = "Not installed"
	}
})

// ? development
let dev

if (is.development === true) {
	setTimeout(() => {
		window2.setTitle("Authme Dev")
	}, 2000)

	// dev tools
	debug({
		showDevTools: false,
	})

	dev = true
}

// ? folders
let folder

// choose platform
if (process.platform === "win32") {
	folder = process.env.APPDATA
} else {
	folder = process.env.HOME
}

// init folders
const full_path = path.join(folder, "Levminer")
const file_path = dev ? path.join(folder, "Levminer/Authme Dev") : path.join(folder, "Levminer/Authme")

// check if folders exists
if (!fs.existsSync(full_path)) {
	fs.mkdirSync(path.join(full_path))
}
if (!fs.existsSync(file_path)) {
	fs.mkdirSync(file_path)
}

// ? settings
const settings = `{
		"version":{
			"tag": "${tag_name}"  
		},

		"settings": {
			"launch_on_startup": false,
			"close_to_tray": false,
			"show_2fa_names": false,
			"click_to_reveal": false,
			"reset_after_copy": true
		},

		"security": {
			"require_password": null,
			"password": null
		},

		"shortcuts": {
			"show": "CommandOrControl+q",
			"settings": "CommandOrControl+s",
			"exit": "CommandOrControl+w",
			"web": "CommandOrControl+a",
			"import": "CommandOrControl+i",
			"export": "CommandOrControl+e",
			"release": "CommandOrControl+r",
			"issues": "CommandOrControl+p",
			"docs": "CommandOrControl+d",
			"licenses": "CommandOrControl+l",
			"update": "CommandOrControl+u",
			"info": "CommandOrControl+o"
		},

		"global_shortcuts": {
			"show": "CommandOrControl+Shift+a",
			"settings": "CommandOrControl+Shift+s",
			"exit": "CommandOrControl+Shift+d"
		}
	}`

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
const file = JSON.parse(
	fs.readFileSync(path.join(file_path, "settings.json"), "utf-8", (err, data) => {
		if (err) {
			return console.log(`Error reading settings.json ${err}`)
		} else {
			return console.log("settings.json readed")
		}
	})
)

// ? install protbuf
const spawn = require("child_process").spawn

const src = "extract/install.py"

const py = spawn("python", [src])

// ? open tray
const tray_show = () => {
	const toggle = () => {
		if (confirmed == false) {
			if (pass_start == true) {
				if (confirm_shown == false) {
					window1.maximize()
					window1.show()

					confirm_shown = true
				} else {
					window1.hide()

					confirm_shown = false
				}
			}
		}

		if (application_shown == false) {
			// if password and password confirmed
			if (if_pass == true && confirmed == true) {
				window2.maximize()
				window2.show()

				application_shown = true
			}

			// if no password
			if (if_nopass == true) {
				window2.maximize()
				window2.show()

				application_shown = true
			}

			// if exit to tray on
			if (show_tray == true) {
				window2.maximize()
				window2.show()

				application_shown = true
			}
		} else {
			// if password and password confirmed
			if (if_pass == true && confirmed == true) {
				window2.hide()

				application_shown = false
			}

			// if no password
			if (if_nopass == true) {
				window2.hide()

				application_shown = false
			}

			// if exit to tray on
			if (show_tray == true) {
				window2.hide()

				application_shown = false
			}
		}
	}

	// ? check for required password
	let if_pass = false
	let if_nopass = false

	if (file.security.require_password == true) {
		if_pass = true
		pass_start = true

		toggle()
	} else {
		if_nopass = true

		toggle()
	}
}

// ? tray settings
const tray_settings = () => {
	const toggle = () => {
		if (settings_shown == false) {
			if (if_pass == true && confirmed == true) {
				window3.maximize()
				window3.show()

				settings_shown = true
			}

			if (if_nopass == true) {
				window3.maximize()
				window3.show()

				settings_shown = true
			}
		} else {
			if (if_pass == true && confirmed == true) {
				window3.hide()

				settings_shown = false
			}

			if (if_nopass == true) {
				window3.hide()

				settings_shown = false
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
}

// tray exit
const tray_exit = () => {
	to_tray = false
	app.exit()
}

// ? create window
const createWindow = () => {
	window0 = new BrowserWindow({
		width: 1900,
		height: 1000,
		minWidth: 1000,
		minHeight: 600,
		show: false,
		backgroundColor: "#141414",
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true,
			enableRemoteModule: true,
		},
	})

	window1 = new BrowserWindow({
		width: 1900,
		height: 1000,
		minWidth: 1000,
		minHeight: 600,
		show: false,
		backgroundColor: "#141414",
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true,
			enableRemoteModule: true,
		},
	})

	window2 = new BrowserWindow({
		width: 1900,
		height: 1000,
		minWidth: 1000,
		minHeight: 600,
		show: false,
		backgroundColor: "#141414",
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true,
			enableRemoteModule: true,
		},
	})

	window3 = new BrowserWindow({
		width: 1900,
		height: 1000,
		minWidth: 1000,
		minHeight: 600,
		show: false,
		backgroundColor: "#141414",
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true,
			enableRemoteModule: true,
		},
	})

	window4 = new BrowserWindow({
		width: 1900,
		height: 1000,
		minWidth: 1000,
		minHeight: 600,
		show: false,
		backgroundColor: "#141414",
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true,
			enableRemoteModule: true,
		},
	})

	window5 = new BrowserWindow({
		width: 1900,
		height: 1000,
		minWidth: 1000,
		minHeight: 600,
		show: false,
		backgroundColor: "#141414",
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

			application_shown = false
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

			settings_shown = false
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

			import_shown = false
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

			export_shown = false
		}
	})

	// ? check for auto update
	window2.on("show", () => {
		const api = async () => {
			try {
				await fetch("https://api.levminer.com/api/v1/authme/releases")
					.then((res) => res.json())
					.then((data) => {
						try {
							if (data.tag_name != tag_name && data.tag_name != undefined && data.prerelease != true) {
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
			} catch (error) {
				dialog.showMessageBox({
					title: "Authme",
					buttons: ["Close"],
					defaultId: 0,
					cancelId: 1,
					type: "info",
					message: `
					No update available:
					
					Can't connect to API!

					You currently running: Authme ${tag_name}
					`,
				})
			}
		}

		if (update_start == false) {
			api()

			update_start = true
		}
	})

	// ? global shortcuts
	globalShortcut.register(file.global_shortcuts.show, () => {
		tray_show()
	})

	globalShortcut.register(file.global_shortcuts.settings, () => {
		tray_settings()
	})

	globalShortcut.register(file.global_shortcuts.exit, () => {
		tray_exit()
	})
}

ipc.on("to_confirm", () => {
	if (ipc_to_confirm == false) {
		window1.maximize()
		window1.show()
		window0.hide()
		ipc_to_confirm = true
	}
})

ipc.on("to_application0", () => {
	if (ipc_to_application_0 == false && startup == false) {
		window1.hide()

		setTimeout(() => {
			window2.maximize()
			window2.show()
		}, 300)

		ipc_to_application_0 = true

		confirmed = true
	}
})

ipc.on("to_application1", () => {
	if (ipc_to_application_1 == false && startup == false) {
		window0.hide()

		setTimeout(() => {
			window2.maximize()
			window2.show()
		}, 300)

		ipc_to_application_1 = true
	}
})

ipc.on("hide0", () => {
	if (settings_shown == false) {
		window3.maximize()
		window3.show()
		settings_shown = true
	} else {
		window3.hide()
		settings_shown = false
	}
})

ipc.on("hide1", () => {
	if (import_shown == false) {
		window4.maximize()
		window4.show()
		import_shown = true
	} else {
		window4.hide()
		import_shown = false
	}
})

ipc.on("hide2", () => {
	if (export_shown == false) {
		window5.maximize()
		window5.show()
		export_shown = true
	} else {
		window5.hide()
		export_shown = false
	}
})

ipc.on("after_startup0", () => {
	if (process.platform === "win32") {
		const startup_path = path.join(process.env.APPDATA, "/Microsoft/Windows/Start Menu/Programs/Startup/Authme Launcher.lnk")

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
		const shortcut_created = createDesktopShortcut({
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
	const iconpath = path.join(__dirname, "img/iconb.png")

	tray = new Tray(iconpath)

	tray.on("click", () => {
		tray_show()
	})

	const contextmenu = Menu.buildFromTemplate([
		{
			label: "Show app",
			accelerator: file.global_shortcuts.show,
			click: () => {
				tray_show()
			},
		},
		{ type: "separator" },
		{
			label: "Settings",
			accelerator: file.global_shortcuts.settings,
			click: () => {
				tray_settings()
			},
		},
		{ type: "separator" },
		{
			label: "Exit app",
			accelerator: file.global_shortcuts.exit,
			click: () => {
				tray_exit()
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
					label: "Show app",
					accelerator: file.shortcuts.show,
					click: () => {
						tray_show()
					},
				},
				{
					type: "separator",
				},
				{
					label: "Settings",
					accelerator: file.shortcuts.settings,
					click: () => {
						const toggle = () => {
							if (settings_shown == false) {
								if (if_pass == true && confirmed == true) {
									window3.maximize()
									window3.show()

									settings_shown = true
								}

								if (if_nopass == true) {
									window3.maximize()
									window3.show()

									settings_shown = true
								}
							} else {
								if (if_pass == true && confirmed == true) {
									window3.hide()

									settings_shown = false
								}

								if (if_nopass == true) {
									window3.hide()

									settings_shown = false
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
					label: "Exit",
					accelerator: file.shortcuts.exit,
					click: () => {
						to_tray = false
						app.exit()
					},
				},
			],
		},
		{
			label: "Advanced",
			submenu: [
				{
					label: "Authme Web",
					accelerator: file.shortcuts.web,
					click: () => {
						shell.openExternal("https://web.authme.levminer.com")
					},
				},
				{
					type: "separator",
				},
				{
					label: "Import",
					accelerator: file.shortcuts.import,
					click: () => {
						const toggle = () => {
							if (import_shown == false) {
								if (if_pass == true && confirmed == true) {
									window4.maximize()
									window4.show()

									import_shown = true
								}

								if (if_nopass == true) {
									window4.maximize()
									window4.show()

									import_shown = true
								}
							} else {
								if (if_pass == true && confirmed == true) {
									window4.hide()

									import_shown = false
								}

								if (if_nopass == true) {
									window4.hide()

									import_shown = false
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
					accelerator: file.shortcuts.export,
					click: () => {
						const toggle = () => {
							if (export_shown == false) {
								if (if_pass == true && confirmed == true) {
									window5.maximize()
									window5.show()

									export_shown = true
								}

								if (if_nopass == true) {
									window5.maximize()
									window5.show()

									export_shown = true
								}
							} else {
								if (if_pass == true && confirmed == true) {
									window5.hide()

									export_shown = false
								}

								if (if_nopass == true) {
									window5.hide()

									export_shown = false
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
			label: "Help",
			submenu: [
				{
					label: "Release notes",
					accelerator: file.shortcuts.release,
					click: () => {
						shell.openExternal("https://github.com/Levminer/authme/releases")
					},
				},
				{
					type: "separator",
				},
				{
					label: "Issues",
					accelerator: file.shortcuts.issues,
					click: () => {
						shell.openExternal("https://github.com/Levminer/authme/issues")
					},
				},
				{
					type: "separator",
				},
				{
					label: "Docs",
					accelerator: file.shortcuts.docs,
					click: () => {
						shell.openExternal("https://docs.authme.levminer.com")
					},
				},
			],
		},
		{
			label: "About",
			submenu: [
				{
					label: "Show licenses",
					accelerator: file.shortcuts.licenses,
					click: () => {
						shell.openExternal("https://authme.levminer.com/licenses.html")
					},
				},
				{
					type: "separator",
				},
				{
					label: "Update",
					accelerator: file.shortcuts.update,
					click: () => {
						const api = async () => {
							try {
								await fetch("https://api.levminer.com/api/v1/authme/releases")
									.then((res) => res.json())
									.then((data) => {
										try {
											if (data.tag_name != tag_name && data.tag_name != undefined && data.prerelease != true) {
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
													
													You are running the latest version!
								
													You are currently running: Authme ${tag_name}
													`,
												})
											}
										} catch (error) {
											return console.log(error)
										}
									})
							} catch (error) {
								dialog.showMessageBox({
									title: "Authme",
									buttons: ["Close"],
									defaultId: 0,
									cancelId: 1,
									type: "info",
									message: `
									No update available:
									
									Can't connect to API!
				
									You currently running: Authme ${tag_name}
									`,
								})
							}
						}

						api()
					},
				},
				{
					type: "separator",
				},
				{
					label: "Info",
					accelerator: file.shortcuts.info,
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
