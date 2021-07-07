const { app, BrowserWindow, Menu, Tray, shell, dialog, clipboard, globalShortcut, nativeTheme, Notification } = require("electron")
const { version, tag, release } = require("./package.json")
const contextmenu = require("electron-context-menu")
const { number } = require("./build.json")
const markdown = require("./lib/markdown")
const AutoLaunch = require("auto-launch")
const { is } = require("electron-util")
const debug = require("electron-debug")
const logger = require("./lib/logger")
const electron = require("electron")
const fetch = require("node-fetch")
const path = require("path")
const fs = require("fs")
const os = require("os")
const ipc = electron.ipcMain

// ?  init
let window_splash
let window_landing
let window_confirm
let window_application
let window_settings
let window_import
let window_export
let window_edit

let confirm_shown = false
let application_shown = false
let settings_shown = false
let import_shown = false
let export_shown = false
let edit_shown = false

let ipc_to_confirm = false
let ipc_to_application_0 = false
let ipc_to_application_1 = false

let confirmed = false
let startup = false
let offline = false
let shortcuts = false

let to_tray = false
let show_tray = false
let pass_start = false
let update_start = false

// ? development
let dev = false

if (is.development === true) {
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

// ? version and logs
const authme_version = version
const tag_name = tag
const release_date = release
const build_number = number

ipc.on("info", (event) => {
	event.returnValue = { authme_version, release_date, tag_name, build_number }
})

const v8_version = process.versions.v8
const node_version = process.versions.node
const chrome_version = process.versions.chrome
const electron_version = process.versions.electron

const os_version = `${os.type()} ${os.arch()} ${os.release()}`
const os_info = `${os.cpus()[0].model.split("@")[0]}${Math.ceil(os.totalmem() / 1024 / 1024 / 1024)}GB RAM`

// logs
logger.createFile(file_path, "main")
logger.log(`Authme ${authme_version} ${build_number}`)
logger.log(`System ${os_version}`)
logger.log(`Hardware ${os_info}`)

// ? single instance
if (dev === false) {
	const lock = app.requestSingleInstanceLock()

	if (lock === false) {
		logger.log("Already running, shutting down")

		app.quit()
	} else {
		app.on("second-instance", () => {
			logger.log("Already running, focusing window")

			window_application.maximize()
			window_application.show()
		})
	}
}

// ? force dark mode
nativeTheme.themeSource = "dark"

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
			"reset_after_copy": false,
			"save_search_results": true,
			"disable_window_capture": true
		},
		"advanced_settings":{
			"offset": null
		},
		"security": {
			"require_password": null,
			"password": null
		},
		"shortcuts": {
			"show": "CommandOrControl+q",
			"settings": "CommandOrControl+s",
			"exit": "CommandOrControl+w",
			"edit": "CommandOrControl+t",
			"import": "CommandOrControl+i",
			"export": "CommandOrControl+e",
			"release": "CommandOrControl+n",
			"support": "CommandOrControl+p",
			"docs": "CommandOrControl+d",
			"licenses": "CommandOrControl+l",
			"update": "CommandOrControl+u",
			"info": "CommandOrControl+o"
		},
		"global_shortcuts": {
			"show": "CommandOrControl+Shift+a",
			"settings": "CommandOrControl+Shift+s",
			"exit": "CommandOrControl+Shift+d"
		},
		"search_history": {
			"latest": null
		}
	}`

// create settings if not exists
if (!fs.existsSync(path.join(file_path, "settings.json"))) {
	fs.writeFileSync(path.join(file_path, "settings.json"), settings)
}

// read settings
let file = JSON.parse(fs.readFileSync(path.join(file_path, "settings.json"), "utf-8"))

// settings compatibility
if (file.advanced_settings === undefined) {
	file.advanced_settings = {
		offset: null,
	}

	fs.writeFileSync(path.join(file_path, "settings.json"), JSON.stringify(file, null, 4))
}

if (file.shortcuts.edit === undefined) {
	file.shortcuts.edit = "CommandOrControl+t"

	fs.writeFileSync(path.join(file_path, "settings.json"), JSON.stringify(file, null, 4))
}

if (file.shortcuts.support === undefined) {
	file.shortcuts.support = "CommandOrControl+p"

	fs.writeFileSync(path.join(file_path, "settings.json"), JSON.stringify(file, null, 4))
}

if (file.settings.disable_window_capture === undefined) {
	file.settings.disable_window_capture = true

	fs.writeFileSync(path.join(file_path, "settings.json"), JSON.stringify(file, null, 4))
}

// ? open tray
const showTray = () => {
	const toggle = () => {
		if (confirmed == false) {
			if (pass_start == true) {
				if (confirm_shown == false) {
					window_confirm.maximize()
					window_confirm.show()

					confirm_shown = true
				} else {
					window_confirm.hide()

					confirm_shown = false
				}
			}
		}

		if (application_shown == false) {
			// if password and password confirmed
			if (if_pass == true && confirmed == true) {
				window_application.maximize()
				window_application.show()

				application_shown = true
			}

			// if no password
			if (if_nopass == true) {
				window_application.maximize()
				window_application.show()

				application_shown = true
			}

			// if exit to tray on
			if (show_tray == true) {
				window_application.maximize()
				window_application.show()

				application_shown = true
			}
		} else {
			// if password and password confirmed
			if (if_pass == true && confirmed == true) {
				window_application.hide()

				application_shown = false
			}

			// if no password
			if (if_nopass == true) {
				window_application.hide()

				application_shown = false
			}

			// if exit to tray on
			if (show_tray == true) {
				window_application.hide()

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
const settingsTray = () => {
	const toggle = () => {
		if (settings_shown == false) {
			if (if_pass == true && confirmed == true) {
				window_settings.maximize()
				window_settings.show()

				settings_shown = true
			}

			if (if_nopass == true) {
				window_settings.maximize()
				window_settings.show()

				settings_shown = true
			}
		} else {
			if (if_pass == true && confirmed == true) {
				window_settings.hide()

				settings_shown = false
			}

			if (if_nopass == true) {
				window_settings.hide()

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
const exitTray = () => {
	to_tray = false
	app.exit()
}

// ? create window
const createWindow = () => {
	logger.log("Started creating windows")

	window_landing = new BrowserWindow({
		width: 1900,
		height: 1000,
		minWidth: 1000,
		minHeight: 600,
		show: false,
		backgroundColor: "#0A0A0A",
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true,
			enableRemoteModule: true,
			contextIsolation: false,
		},
	})

	window_confirm = new BrowserWindow({
		width: 1900,
		height: 1000,
		minWidth: 1000,
		minHeight: 600,
		show: false,
		backgroundColor: "#0A0A0A",
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true,
			enableRemoteModule: true,
			contextIsolation: false,
		},
	})

	window_application = new BrowserWindow({
		width: 1900,
		height: 1000,
		minWidth: 1000,
		minHeight: 600,
		show: false,
		backgroundColor: "#0A0A0A",
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true,
			enableRemoteModule: true,
			contextIsolation: false,
		},
	})

	window_settings = new BrowserWindow({
		width: 1900,
		height: 1000,
		minWidth: 1000,
		minHeight: 600,
		show: false,
		backgroundColor: "#0A0A0A",
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true,
			enableRemoteModule: true,
			contextIsolation: false,
		},
	})

	window_import = new BrowserWindow({
		width: 1900,
		height: 1000,
		minWidth: 1000,
		minHeight: 600,
		show: false,
		backgroundColor: "#0A0A0A",
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true,
			enableRemoteModule: true,
			contextIsolation: false,
		},
	})

	window_export = new BrowserWindow({
		width: 1900,
		height: 1000,
		minWidth: 1000,
		minHeight: 600,
		show: false,
		backgroundColor: "#0A0A0A",
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true,
			enableRemoteModule: true,
			contextIsolation: false,
		},
	})

	window_edit = new BrowserWindow({
		width: 1900,
		height: 1000,
		minWidth: 1000,
		minHeight: 600,
		show: false,
		backgroundColor: "#0A0A0A",
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true,
			enableRemoteModule: true,
			contextIsolation: false,
		},
	})

	window_landing.loadFile("./app/landing/index.html")
	window_confirm.loadFile("./app/confirm/index.html")
	window_application.loadFile("./app/application/index.html")
	window_settings.loadFile("./app/settings/index.html")
	window_import.loadFile("./app/import/index.html")
	window_export.loadFile("./app/export/index.html")
	window_edit.loadFile("./app/edit/index.html")

	if (file.security.require_password == null) {
		window_landing.maximize()
	}

	window_application.on("show", () => {
		window_application.webContents.executeJavaScript("focusSearch()")
	})

	window_landing.on("close", () => {
		app.quit()
	})

	window_confirm.on("close", () => {
		app.quit()
	})

	window_application.on("close", async (event) => {
		if (dev === true) {
			app.exit()
		}

		if (to_tray == false) {
			app.exit()
		} else {
			event.preventDefault()
			setTimeout(() => {
				window_application.hide()
			}, 100)

			show_tray = true

			application_shown = false
		}
	})

	window_settings.on("close", async (event) => {
		if (dev === true) {
			app.exit()
		} else {
			event.preventDefault()
			setTimeout(() => {
				window_settings.hide()
			}, 100)
			show_tray = true

			settings_shown = false
		}
	})

	window_import.on("close", async (event) => {
		if (dev === true) {
			app.exit()
		} else {
			event.preventDefault()
			setTimeout(() => {
				window_import.hide()
			}, 100)
			show_tray = true

			import_shown = false
		}
	})

	window_export.on("close", async (event) => {
		if (dev === true) {
			app.exit()
		} else {
			event.preventDefault()
			setTimeout(() => {
				window_export.hide()
			}, 100)
			show_tray = true

			export_shown = false
		}
	})

	window_edit.on("close", async (event) => {
		if (dev === true) {
			app.exit()
		} else {
			event.preventDefault()
			setTimeout(() => {
				window_edit.hide()
			}, 100)
			show_tray = true

			edit_shown = false
		}
	})

	// ? disable scren capture
	if (file.settings.disable_window_capture === true) {
		window_settings.setContentProtection(true)
		window_edit.setContentProtection(true)
		window_application.setContentProtection(true)
		window_import.setContentProtection(true)
		window_export.setContentProtection(true)
	}

	// ? check for auto update
	window_application.on("show", () => {
		const api = async () => {
			try {
				await fetch("https://api.levminer.com/api/v1/authme/releases")
					.then((res) => res.json())
					.then((data) => {
						try {
							if (data.tag_name > tag_name && data.tag_name != undefined && data.prerelease != true) {
								window_application.webContents.executeJavaScript("showUpdate()")

								window_settings.on("show", () => {
									window_settings.webContents.executeJavaScript("showUpdate()")
								})

								new Notification({
									title: "Authme Update",
									body: `Update available: Authme ${data.tag_name}`,
								}).show()

								logger.log("Auto update found!")
							} else {
								logger.log("No auto update found!")
							}
						} catch (error) {
							return logger.error(error)
						}
					})
			} catch (error) {
				return logger.error(error)
			}
		}

		if (update_start == false) {
			api()

			update_start = true
		}
	})

	// ? global shortcuts
	if (file.global_shortcuts.show !== "None") {
		globalShortcut.register(file.global_shortcuts.show, () => {
			showTray()
		})
	}

	if (file.global_shortcuts.settings !== "None") {
		globalShortcut.register(file.global_shortcuts.settings, () => {
			settingsTray()
		})
	}

	if (file.global_shortcuts.exit !== "None") {
		globalShortcut.register(file.global_shortcuts.exit, () => {
			exitTray()
		})
	}
}

// ? init auto launch
const authme_launcher = new AutoLaunch({
	name: "Authme",
	path: app.getPath("exe"),
})

// ? context menu
contextmenu({
	menu: (actions) => [
		actions.separator(),
		{
			label: "Dev Tools",
			click: () => {
				const window = BrowserWindow.getFocusedWindow()

				window.webContents.toggleDevTools()
			},
			visible: dev === true,
		},
		actions.separator(),
		{
			label: "Reload",
			click: () => {
				const window = BrowserWindow.getFocusedWindow()

				window.webContents.reload()
			},
			visible: dev === true,
		},
		actions.separator(),
		actions.copyImage({
			transform: (content) => content,
		}),
		actions.separator(),
		actions.copy({
			transform: (content) => content,
		}),
		actions.separator(),
		actions.paste({
			transform: (content) => content,
		}),
		actions.separator(),
		actions.copyLink({
			transform: (content) => `${content}`,
		}),
		actions.separator(),
	],
})

// ? ipcs
ipc.on("to_confirm", () => {
	if (ipc_to_confirm == false) {
		window_confirm.maximize()
		window_confirm.show()
		window_landing.hide()
		ipc_to_confirm = true
	}
})

ipc.on("to_application0", () => {
	if (ipc_to_application_0 == false && startup == false) {
		window_confirm.hide()

		setTimeout(() => {
			window_application.maximize()
			window_application.show()
		}, 300)

		setTimeout(() => {
			window_confirm.destroy()
			window_landing.destroy()
		}, 500)

		ipc_to_application_0 = true

		confirmed = true
	}
})

ipc.on("to_application1", () => {
	if (ipc_to_application_1 == false && startup == false) {
		window_landing.hide()

		setTimeout(() => {
			window_application.maximize()
			window_application.show()
		}, 300)

		setTimeout(() => {
			window_landing.destroy()
		}, 500)

		ipc_to_application_1 = true
	}
})

ipc.on("hide_settings", () => {
	if (settings_shown == false) {
		window_settings.maximize()
		window_settings.show()
		settings_shown = true
	} else {
		window_settings.hide()
		settings_shown = false
	}
})

ipc.on("hide_import", () => {
	if (import_shown == false) {
		window_import.maximize()
		window_import.show()
		import_shown = true
	} else {
		window_import.hide()
		import_shown = false
	}
})

ipc.on("hide_export", () => {
	if (export_shown == false) {
		window_export.maximize()
		window_export.show()
		export_shown = true
	} else {
		window_export.hide()
		export_shown = false
	}
})

ipc.on("hide_edit", () => {
	if (edit_shown == false) {
		window_edit.maximize()
		window_edit.show()
		edit_shown = true
	} else {
		window_edit.hide()
		edit_shown = false
	}
})

ipc.on("disable_startup", () => {
	authme_launcher.disable()

	logger.log("Startup disabled")
})

ipc.on("enable_startup", () => {
	authme_launcher.enable()

	logger.log("Startup enabled")
})

ipc.on("disable_capture", () => {
	window_settings.setContentProtection(true)
	window_edit.setContentProtection(true)
	window_application.setContentProtection(true)
	window_import.setContentProtection(true)
	window_export.setContentProtection(true)
})

ipc.on("enable_capture", () => {
	window_settings.setContentProtection(false)
	window_edit.setContentProtection(false)
	window_application.setContentProtection(false)
	window_import.setContentProtection(false)
	window_export.setContentProtection(false)
})

ipc.on("disable_tray", () => {
	to_tray = false
})

ipc.on("enable_tray", () => {
	to_tray = true
})

ipc.on("startup", () => {
	window_application.hide()
	window_confirm.hide()
	startup = true
})

ipc.on("app_path", () => {
	shell.showItemInFolder(app.getPath("exe"))
})

ipc.on("about", () => {
	about()
})

ipc.on("abort", () => {
	dialog
		.showMessageBox({
			title: "Authme",
			buttons: ["Help", "Close"],
			type: "error",
			defaultId: 0,
			cancelId: 1,
			noLink: true,
			message: `
			Failed to check the integrity of the files.
			
			You or someone messed with the settings file, shutting down for security reasons!
			`,
		})
		.then((result) => {
			if (result.response === 0) {
				shell.openExternal("https://github.com/Levminer/authme/issues")
			} else if (result.response === 1) {
				app.exit()
			}
		})

	window_landing.destroy()
	window_application.destroy()
	window_settings.destroy()
	window_export.destroy()

	process.on("uncaughtException", (error) => {
		logger.error("Execution aborted", error)
	})
})

ipc.on("offline", () => {
	if (offline === false) {
		setTimeout(() => {
			window_application.setTitle("Authme (Offline)")
			window_settings.setTitle("Authme (Offline)")
		}, 1000)
		offline = true
	} else {
		setTimeout(() => {
			window_application.setTitle("Authme")
			window_settings.setTitle("Authme ")
		}, 1000)
		offline = false
	}
})

ipc.on("release_notes", () => {
	releaseNotes()
})

ipc.on("download_update", () => {
	shell.openExternal("https://authme.levminer.com/#downloads")
})

ipc.on("support", () => {
	support()
})

// ? about
const about = () => {
	const message = `Authme: ${authme_version}\n\nV8: ${v8_version}\nNode: ${node_version}\nElectron: ${electron_version}\nChrome: ${chrome_version}\n\nOS version: ${os_version}\nHardware info: ${os_info}\n\nRelease date: ${release_date}\nBuild number: ${build_number}\n\nCreated by: Lőrik Levente\n`

	shell.beep()

	dialog
		.showMessageBox({
			title: "Authme",
			buttons: ["Copy", "Close"],
			defaultId: 1,
			cancelId: 1,
			noLink: true,
			type: "info",
			message: message,
			icon: path.join(__dirname, "img/tray.png"),
		})
		.then((result) => {
			if (result.response === 0) {
				clipboard.writeText(message)
			}
		})
}

// ? release notes
const releaseNotes = () => {
	const api = async () => {
		try {
			await fetch("https://api.levminer.com/api/v1/authme/releases")
				.then((res) => res.json())
				.then((data) => {
					try {
						dialog
							.showMessageBox({
								title: "Authme",
								buttons: ["More", "Close"],
								defaultId: 1,
								cancelId: 1,
								noLink: true,
								type: "info",
								message: markdown.convert(data.body),
							})
							.then((result) => {
								if (result.response === 0) {
									shell.openExternal("https://github.com/Levminer/authme/releases")
								}
							})
					} catch (error) {
						return logger.error(error)
					}
				})
		} catch (error) {
			return logger.error(error)
		}
	}

	api()
}

// ? support
const support = () => {
	dialog
		.showMessageBox({
			title: "Authme",
			buttons: ["PayPal", /* "OpenColletive", */ "Close"],
			defaultId: 2,
			cancelId: 2,
			noLink: true,
			type: "info",
			message: "Authme is a free, open source software. \n\n If you like the app, please consider supporting!",
		})
		.then((result) => {
			if (result.response === 0) {
				shell.openExternal("https://paypal.me/levminer")
			} /* else if (result.response === 1) {
				shell.openExternal("https://opencollective.com/authme")
			} */
		})
}

// ? start app
app.whenReady().then(() => {
	logger.log("Starting app")

	app.setAppUserModelId("Authme")

	process.on("uncaughtException", (error) => {
		logger.error("Unknown error occurred", error.stack)

		dialog
			.showMessageBox({
				title: "Authme",
				buttons: ["Report", "Close"],
				defaultId: 0,
				cancelId: 1,
				noLink: true,
				type: "error",
				message: `Unknown error occurred! \n\n ${error.stack}`,
			})
			.then((result) => {
				if (result.response === 0) {
					shell.openExternal("https://github.com/Levminer/authme/issues/")
				} else if (result.response === 1) {
					app.exit()
				}
			})
	})

	window_splash = new BrowserWindow({
		width: 500,
		height: 550,
		transparent: true,
		frame: false,
		alwaysOnTop: true,
		resizable: false,
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true,
			contextIsolation: false,
		},
	})

	window_splash.loadFile("./app/splash/index.html")

	window_splash.show()

	window_splash.once("ready-to-show", () => {
		if (is.development === true) {
			setTimeout(() => {
				createWindow()
			}, 500)

			setTimeout(() => {
				window_splash.destroy()
			}, 1000)
		} else {
			setTimeout(() => {
				createWindow()
			}, 2000)

			setTimeout(() => {
				window_splash.destroy()
			}, 2500)
		}
	})

	// ? create tray
	const iconpath = path.join(__dirname, "img/tray.png")
	tray = new Tray(iconpath)

	tray.on("click", () => {
		showTray()
	})

	// generate tray
	const createTray = () => {
		const contextmenu = Menu.buildFromTemplate([
			{
				label: `Authme ${authme_version}`,
				enabled: false,
				icon: path.join(__dirname, "img/traymenu.png"),
			},
			{
				label: `(${release_date})`,
				enabled: false,
			},
			{ type: "separator" },
			{
				label: "Show app",
				accelerator: shortcuts ? "" : file.global_shortcuts.show,
				click: () => {
					showTray()
				},
			},
			{ type: "separator" },
			{
				label: "Settings",
				accelerator: shortcuts ? "" : file.global_shortcuts.settings,
				click: () => {
					settingsTray()
				},
			},
			{ type: "separator" },
			{
				label: "Exit app",
				accelerator: shortcuts ? "" : file.global_shortcuts.exit,
				click: () => {
					exitTray()
				},
			},
		])
		tray.setToolTip("Authme")
		tray.setContextMenu(contextmenu)
	}

	createTray()

	// ? cerate menu
	const createMenu = () => {
		const template = [
			{
				label: "File",
				submenu: [
					{
						label: "Show app",
						accelerator: shortcuts ? "" : file.shortcuts.show,
						click: () => {
							showTray()
						},
					},
					{
						type: "separator",
					},
					{
						label: "Settings",
						accelerator: shortcuts ? "" : file.shortcuts.settings,
						click: () => {
							const toggle = () => {
								if (settings_shown == false) {
									if (if_pass == true && confirmed == true) {
										window_settings.maximize()
										window_settings.show()

										settings_shown = true
									}

									if (if_nopass == true) {
										window_settings.maximize()
										window_settings.show()

										settings_shown = true
									}
								} else {
									if (if_pass == true && confirmed == true) {
										window_settings.hide()

										settings_shown = false
									}

									if (if_nopass == true) {
										window_settings.hide()

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
						accelerator: shortcuts ? "" : file.shortcuts.exit,
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
						label: "Edit codes",
						accelerator: shortcuts ? "" : file.shortcuts.edit,
						click: () => {
							const toggle = () => {
								if (edit_shown == false) {
									if (if_pass == true && confirmed == true) {
										window_edit.maximize()
										window_edit.show()

										edit_shown = true
									}

									if (if_nopass == true) {
										window_edit.maximize()
										window_edit.show()

										edit_shown = true
									}
								} else {
									if (if_pass == true && confirmed == true) {
										window_edit.hide()

										edit_shown = false
									}

									if (if_nopass == true) {
										window_edit.hide()

										edit_shown = false
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
						label: "Import",
						accelerator: shortcuts ? "" : file.shortcuts.import,
						click: () => {
							const toggle = () => {
								if (import_shown == false) {
									if (if_pass == true && confirmed == true) {
										window_import.maximize()
										window_import.show()

										import_shown = true
									}

									if (if_nopass == true) {
										window_import.maximize()
										window_import.show()

										import_shown = true
									}
								} else {
									if (if_pass == true && confirmed == true) {
										window_import.hide()

										import_shown = false
									}

									if (if_nopass == true) {
										window_import.hide()

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
						accelerator: shortcuts ? "" : file.shortcuts.export,
						click: () => {
							const toggle = () => {
								if (export_shown == false) {
									if (if_pass == true && confirmed == true) {
										window_export.maximize()
										window_export.show()

										export_shown = true
									}

									if (if_nopass == true) {
										window_export.maximize()
										window_export.show()

										export_shown = true
									}
								} else {
									if (if_pass == true && confirmed == true) {
										window_export.hide()

										export_shown = false
									}

									if (if_nopass == true) {
										window_export.hide()

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
						accelerator: shortcuts ? "" : file.shortcuts.release,
						click: () => {
							releaseNotes()
						},
					},
					{
						type: "separator",
					},
					{
						label: "Support",
						accelerator: shortcuts ? "" : file.shortcuts.support,
						click: () => {
							support()
						},
					},
					{
						type: "separator",
					},
					{
						label: "Docs",
						accelerator: shortcuts ? "" : file.shortcuts.docs,
						click: () => {
							dialog
								.showMessageBox({
									title: "Authme",
									buttons: ["Open", "Close"],
									defaultId: 1,
									cancelId: 1,
									noLink: true,
									type: "info",
									message: "You can view the Authme Docs in the browser. \n\n Click open to view it in your browser!",
								})
								.then((result) => {
									if (result.response === 0) {
										shell.openExternal("https://docs.authme.levminer.com")
									}
								})
						},
					},
				],
			},
			{
				label: "About",
				submenu: [
					{
						label: "Show licenses",
						accelerator: shortcuts ? "" : file.shortcuts.licenses,
						click: () => {
							dialog
								.showMessageBox({
									title: "Authme",
									buttons: ["More", "Close"],
									defaultId: 1,
									cancelId: 1,
									noLink: true,
									type: "info",
									message: `
									This software is licensed under GPL-3.0

									Copyright © 2020 Lőrik Levente
									`,
								})
								.then((result) => {
									if (result.response === 0) {
										shell.openExternal("https://authme.levminer.com/licenses.html")
									}
								})
						},
					},
					{
						type: "separator",
					},
					{
						label: "Update",
						accelerator: shortcuts ? "" : file.shortcuts.update,
						click: () => {
							const api = async () => {
								try {
									await fetch("https://api.levminer.com/api/v1/authme/releases")
										.then((res) => res.json())
										.then((data) => {
											try {
												if (data.tag_name > tag_name && data.tag_name != undefined && data.prerelease != true) {
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
															if (result.response === 0) {
																shell.openExternal("https://authme.levminer.com#downloads")
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
												return logger.error(error)
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
										
										Can't connect to API, check your internet connection or the API status in the settings!
					
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
						accelerator: shortcuts ? "" : file.shortcuts.info,
						click: () => {
							about()
						},
					},
				],
			},
		]

		const menu = Menu.buildFromTemplate(template)
		Menu.setApplicationMenu(menu)
	}

	createMenu()

	ipc.on("shortcuts", () => {
		if (shortcuts === false) {
			shortcuts = true

			globalShortcut.unregisterAll()

			createTray()

			createMenu()
		} else {
			shortcuts = false

			file = JSON.parse(fs.readFileSync(path.join(file_path, "settings.json"), "utf-8"))

			if (file.global_shortcuts.show !== "None") {
				globalShortcut.register(file.global_shortcuts.show, () => {
					showTray()
				})
			}

			if (file.global_shortcuts.settings !== "None") {
				globalShortcut.register(file.global_shortcuts.settings, () => {
					settingsTray()
				})
			}

			if (file.global_shortcuts.exit !== "None") {
				globalShortcut.register(file.global_shortcuts.exit, () => {
					exitTray()
				})
			}

			createTray()

			createMenu()
		}
	})
})
