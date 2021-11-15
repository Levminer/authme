const { app, BrowserWindow, Menu, Tray, shell, dialog, clipboard, globalShortcut, nativeTheme, Notification } = require("electron")
const contextmenu = require("electron-context-menu")
const logger = require("@levminer/lib/logger/main")
const { version, tag } = require("./package.json")
const { number, date } = require("./build.json")
const sentry = require("@sentry/electron/main")
const remote = require("@electron/remote/main")
const { markdown } = require("@levminer/lib")
const AutoLaunch = require("auto-launch")
const debug = require("electron-debug")
const electron = require("electron")
const path = require("path")
const fs = require("fs")
const os = require("os")
const axios = require("axios").default
const ipc = electron.ipcMain

// ? crash report
process.on("uncaughtException", (error) => {
	logger.error("Error on load", error.stack)
	dialog.showErrorBox("Authme", `Authme crashed, crash report is sent. \n\nPlease open a GitHub Issue with a screenshot of this error. \n\n${error.stack}`)

	shell.openExternal("https://github.com/Levminer/authme/issues")

	process.crash()
})

sentry.init({
	dsn: "https://173234c94f8f4294a28e114c9113c1ce@o1020924.ingest.sentry.io/5986541",
	release: `authme@${version}`,
})

// ? windows
let /** @type{BrowserWindow} */ window_splash
let /** @type{BrowserWindow} */ window_landing
let /** @type{BrowserWindow} */ window_confirm
let /** @type{BrowserWindow} */ window_application
let /** @type{BrowserWindow} */ window_settings
let /** @type{BrowserWindow} */ window_import
let /** @type{BrowserWindow} */ window_export
let /** @type{BrowserWindow} */ window_edit

// ? window states
let confirm_shown = false
let application_shown = true
let settings_shown = false
let import_shown = false
let export_shown = false
let edit_shown = false

// ? other states
let authenticated = false
let offline = false
let shortcuts = false
let reload = false
let tray_minimized = false
let update_seen = false

// ? development
let dev = false

if (app.isPackaged === false) {
	debug({
		showDevTools: false,
	})

	dev = true
} else {
	if (process.platform === "darwin") {
		debug({
			isEnabled: true,
			showDevTools: false,
		})
	}
}

// pre release
let pre_release = false
if (number.startsWith("alpha")) {
	pre_release = true
}

// ? remote module
remote.initialize()

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

// codes folder
if (!fs.existsSync(path.join(file_path, "codes"))) {
	fs.mkdirSync(path.join(file_path, "codes"))
}

// ? version and logs
const authme_version = version
const tag_name = tag
const release_date = date
const build_number = number

ipc.on("info", (event) => {
	event.returnValue = { authme_version, release_date, tag_name, build_number }
})

const chrome_version = process.versions.chrome
const electron_version = process.versions.electron
const args = process.argv

const os_version = `${os.type()} ${os.arch()} ${os.release()}`
const os_info = `${os.cpus()[0].model.split("@")[0]} ${Math.ceil(os.totalmem() / 1024 / 1024 / 1024)}GB RAM`
	.replaceAll("(R)", "")
	.replaceAll("(TM)", "")
	.replace(/ +(?= )/g, "")

// logs
logger.createFile(file_path, "authme")
logger.log(`Authme ${authme_version} ${build_number}`)
logger.log(`System ${os_version}`)
logger.log(`Hardware ${os_info}`)

// ? single instance
if (dev === false) {
	const lock = app.requestSingleInstanceLock()

	if (lock === false) {
		logger.log("Already running, shutting down")

		app.exit()
	} else {
		app.on("second-instance", () => {
			logger.log("Already running, focusing window")

			window_application.maximize()
			window_application.show()
		})
	}
}

// ? settings
const saveSettings = () => {
	fs.writeFileSync(path.join(file_path, "settings.json"), JSON.stringify(file, null, "\t"))
}

const settings = `{
		"version":{
			"tag": "${tag_name}",
			"build": "${build_number}"
		},
		"settings": {
			"launch_on_startup": true,
			"close_to_tray": true,
			"show_2fa_names": false,
			"click_to_reveal": false,
			"reset_after_copy": false,
			"save_search_results": true,
			"disable_window_capture": true,
			"disable_hardware_acceleration": true,
			"search_bar_filter": {
				"name": true,
				"description": false
			}
		},
		"experimental":{
			"sort": null,
			"webcam": "null"
		},
		"security": {
			"require_password": null,
			"password": null,
			"new_encryption": null,
			"key": null
		},
		"shortcuts": {
			"show": "CmdOrCtrl+q",
			"settings": "CmdOrCtrl+s",
			"exit": "CmdOrCtrl+w",
			"zoom_reset": "CmdOrCtrl+0",
			"zoom_in": "CmdOrCtrl+1",
			"zoom_out": "CmdOrCtrl+2",
			"edit": "CmdOrCtrl+t",
			"import": "CmdOrCtrl+i",
			"export": "CmdOrCtrl+e",
			"release": "CmdOrCtrl+n",
			"support": "CmdOrCtrl+p",
			"docs": "CmdOrCtrl+d",
			"licenses": "CmdOrCtrl+l",
			"update": "CmdOrCtrl+u",
			"info": "CmdOrCtrl+o"
		},
		"global_shortcuts": {
			"show": "CmdOrCtrl+Shift+a",
			"settings": "CmdOrCtrl+Shift+s",
			"exit": "CmdOrCtrl+Shift+d"
		},
		"quick_shortcuts:": {},
		"search_history": {
			"latest": null
		},
		"statistics": {
			"opens": 0,
			"rated": null,
			"feedback": null
		}
	}`

// create settings if not exists
if (!fs.existsSync(path.join(file_path, "settings.json"))) {
	fs.writeFileSync(path.join(file_path, "settings.json"), settings)
}

/**
 * Read settings
 * @type {LibSettings}
 */
let file = JSON.parse(fs.readFileSync(path.join(file_path, "settings.json"), "utf-8"))

// settings compatibility
if (file.experimental === undefined) {
	file.experimental = {
		sort: null,
	}

	saveSettings()
}

if (file.quick_shortcuts === undefined) {
	file.quick_shortcuts = {}

	saveSettings()
}

if (file.settings.search_bar_filter === undefined) {
	file.settings.search_bar_filter = {
		name: true,
		description: false,
	}

	saveSettings()
}

if (file.experimental.webcam === undefined) {
	file.experimental.webcam = null

	saveSettings()
}

if (file.shortcuts.edit === undefined) {
	file.shortcuts.edit = "CmdOrCtrl+t"

	saveSettings()
}

if (file.shortcuts.support === undefined) {
	file.shortcuts.support = "CmdOrCtrl+p"

	saveSettings()
}

if (file.settings.disable_window_capture === undefined) {
	file.settings.disable_window_capture = true

	saveSettings()
}

if (file.statistics === undefined) {
	file.statistics = {
		opens: 0,
		rated: null,
		feedback: null,
	}

	saveSettings()
}

if (file.settings.disable_hardware_acceleration === undefined) {
	file.settings.disable_hardware_acceleration = false

	saveSettings()
}

if (file.shortcuts.zoom_reset === undefined) {
	file.shortcuts.zoom_reset = "CmdOrCtrl+0"
	file.shortcuts.zoom_in = "CmdOrCtrl+1"
	file.shortcuts.zoom_out = "CmdOrCtrl+2"
}

// ? force dark mode
nativeTheme.themeSource = "dark"

// ? disable hardware acceleration
if (file.settings.disable_hardware_acceleration === true) {
	app.disableHardwareAcceleration()
}

// ? open app from tray
const showAppFromTray = () => {
	const toggle = () => {
		if (application_shown === false) {
			window_application.maximize()
			window_application.show()

			application_shown = true

			logger.log("App shown from tray")
		} else {
			window_application.hide()
			window_settings.hide()
			window_import.hide()
			window_export.hide()
			window_edit.hide()

			application_shown = false
			settings_shown = false
			import_shown = false
			export_shown = false
			edit_shown = false

			logger.log("App hidden from tray")
		}
	}

	if (file.security.require_password === true && authenticated === true) {
		toggle()
	} else if (file.security.require_password === false) {
		toggle()
	} else if (file.security.require_password === true) {
		if (confirm_shown === false) {
			window_confirm.maximize()
			window_confirm.show()

			confirm_shown = true
		} else {
			window_confirm.hide()

			confirm_shown = false
		}
	}
}

// ? open settings from tray
const settingsFromTray = () => {
	const toggle = () => {
		if (settings_shown === false) {
			window_settings.maximize()
			window_settings.show()

			settings_shown = true

			logger.log("Settings shown from tray")
		} else {
			window_settings.hide()

			settings_shown = false

			logger.log("Settings hidden from tray")
		}
	}

	if (file.security.require_password === true && authenticated === true) {
		toggle()
	} else if (file.security.require_password === false) {
		toggle()
	}
}

// ? exit app from tray
const exitFromTray = () => {
	tray_minimized = false
	app.exit()

	logger.log("Exited from tray")
}

// ? create window
const createWindow = () => {
	logger.log("Started creating windows")

	// ? create windows
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
			contextIsolation: false,
		},
	})

	// remote module
	remote.enable(window_landing.webContents)
	remote.enable(window_confirm.webContents)
	remote.enable(window_application.webContents)
	remote.enable(window_settings.webContents)
	remote.enable(window_import.webContents)
	remote.enable(window_export.webContents)
	remote.enable(window_edit.webContents)

	// load window files
	window_landing.loadFile("./app/landing/index.html")
	window_confirm.loadFile("./app/confirm/index.html")
	window_application.loadFile("./app/application/index.html")
	window_settings.loadFile("./app/settings/index.html")
	window_import.loadFile("./app/import/index.html")
	window_export.loadFile("./app/export/index.html")
	window_edit.loadFile("./app/edit/index.html")

	// window states
	if (file.security.require_password === null) {
		window_landing.maximize()

		logger.warn("First start")

		if (dev === false) {
			authme_launcher.enable()
		}
	}

	window_landing.on("close", () => {
		app.exit()

		logger.log("Landing closed")
	})

	window_confirm.on("close", () => {
		app.exit()

		logger.log("Confirm closed")
	})

	// window closings
	window_application.on("close", async (event) => {
		if (dev === true) {
			try {
				password_buffer.fill(0)
			} catch (error) {}

			app.exit()
		}

		if (tray_minimized === false) {
			try {
				password_buffer.fill(0)
			} catch (error) {}

			app.exit()

			logger.log("Application exited")
		} else {
			event.preventDefault()
			setTimeout(() => {
				window_application.hide()
			}, 100)

			show_tray = true

			application_shown = false
		}

		logger.log("Application closed")
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

		logger.log("Settings closed")
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

		logger.log("Import closed")
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

		logger.log("Export closed")
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

		logger.log("Edit closed")
	})

	// ? disable screen capture by default
	if (file.settings.disable_window_capture === true) {
		window_settings.setContentProtection(true)
		window_edit.setContentProtection(true)
		window_application.setContentProtection(true)
		window_import.setContentProtection(true)
		window_export.setContentProtection(true)
	}

	// ? check for auto update
	window_application.on("show", () => {
		const api = () => {
			axios
				.get("https://api.levminer.com/api/v1/authme/releases")
				.then((res) => {
					if (res.data.tag_name > tag_name && res.data.tag_name != undefined && res.data.prerelease != true) {
						window_application.webContents.executeJavaScript("showUpdate()")

						window_settings.on("show", () => {
							window_settings.webContents.executeJavaScript("showUpdate()")
						})

						new Notification({
							title: "Authme Update",
							body: `Update available: Authme ${res.data.tag_name}`,
						}).show()

						logger.log("Auto update found!")
					} else {
						logger.log("No auto update found!")
					}
				})
				.catch((error) => {
					logger.error("Error during auto update", error.stack)
				})
		}

		if (reload === false && file.settings.launch_on_startup === true && args[1] === "--hidden") {
			application_shown = false

			window_application.hide()
			window_confirm.hide()

			reload = true
		}

		if (update_seen == false) {
			api()

			update_seen = true
		}
	})

	window_application.on("focus", () => {
		window_application.webContents.executeJavaScript("focusSearch()")
	})

	// ? global shortcuts
	if (file.global_shortcuts.show !== "None") {
		globalShortcut.register(file.global_shortcuts.show, () => {
			showAppFromTray()
		})
	}

	if (file.global_shortcuts.settings !== "None") {
		globalShortcut.register(file.global_shortcuts.settings, () => {
			settingsFromTray()
		})
	}

	if (file.global_shortcuts.exit !== "None") {
		globalShortcut.register(file.global_shortcuts.exit, () => {
			exitFromTray()
		})
	}

	// ? statistics
	let opens = file.statistics.opens
	opens++
	file.statistics.opens = opens

	saveSettings()

	const openInfo = () => {
		window_application.on("show", () => {
			window_application.webContents.executeJavaScript("showInfo()")
		})

		window_settings.on("show", () => {
			window_settings.webContents.executeJavaScript("showInfo()")
		})
	}

	if (file.statistics.rate === true || file.statistics.feedback === true) {
		if (opens % 150 === 0) {
			openInfo()
		}
	} else if (file.statistics.rate === true && file.statistics.feedback === true) {
		if (opens % 1000 === 0) {
			openInfo()
		}
	} else {
		if (opens % 50 === 0) {
			openInfo()
		}
	}
}

// ? init auto launch
const authme_launcher = new AutoLaunch({
	name: "Authme",
	path: app.getPath("exe"),
	isHidden: true,
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
			transform: (content) => content,
		}),
		actions.separator(),
	],
})

// ? ipcs
ipc.on("to_confirm", () => {
	if (authenticated === false) {
		window_confirm.maximize()
		window_confirm.show()
		window_landing.hide()

		file = JSON.parse(fs.readFileSync(path.join(file_path, "settings.json"), "utf-8"))
	}
})

ipc.on("to_application0", () => {
	if (authenticated === false) {
		window_confirm.hide()

		setTimeout(() => {
			window_application.maximize()
			window_application.show()
		}, 300)

		setTimeout(() => {
			window_confirm.destroy()
			window_landing.destroy()
		}, 500)

		authenticated = true

		file = JSON.parse(fs.readFileSync(path.join(file_path, "settings.json"), "utf-8"))
	}
})

ipc.on("to_application1", () => {
	if (authenticated === false) {
		window_landing.hide()

		setTimeout(() => {
			window_application.maximize()
			window_application.show()
		}, 300)

		setTimeout(() => {
			window_landing.destroy()
		}, 500)

		authenticated = true

		file = JSON.parse(fs.readFileSync(path.join(file_path, "settings.json"), "utf-8"))
	}
})

ipc.on("hide_settings", () => {
	if (settings_shown == false) {
		window_settings.maximize()
		window_settings.show()
		settings_shown = true

		logger.log("Settings shown")
	} else {
		window_settings.hide()
		settings_shown = false

		logger.log("Settings hidden")
	}
})

ipc.on("hide_import", () => {
	if (import_shown == false) {
		window_import.maximize()
		window_import.show()
		import_shown = true

		logger.log("Import shown")
	} else {
		window_import.hide()
		import_shown = false

		logger.log("Import hidden")
	}
})

ipc.on("hide_export", () => {
	if (export_shown == false) {
		window_export.maximize()
		window_export.show()
		export_shown = true

		logger.log("Export shown")
	} else {
		window_export.hide()
		export_shown = false

		logger.log("Export hidden")
	}
})

ipc.on("hide_edit", () => {
	if (edit_shown == false) {
		window_edit.maximize()
		window_edit.show()
		edit_shown = true

		logger.log("Edit shown")
	} else {
		window_edit.hide()
		edit_shown = false

		logger.log("Edit hidden")
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
	window_application.setContentProtection(false)

	logger.log("Screen capture disabled")
})

ipc.on("enable_capture", () => {
	window_settings.setContentProtection(false)
	window_edit.setContentProtection(false)
	window_application.setContentProtection(false)
	window_import.setContentProtection(false)
	window_export.setContentProtection(false)

	logger.log("Screen capture enabled")
})

ipc.on("disable_tray", () => {
	tray_minimized = false

	logger.log("Close to tray disabled")
})

ipc.on("enable_tray", () => {
	tray_minimized = true

	logger.log("Close to tray enabled")
})

ipc.on("app_path", () => {
	shell.showItemInFolder(app.getPath("exe"))
})

ipc.on("logs", () => {
	logs()
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
			message: "Failed to check the integrity of the files. \n\nYou or someone messed with the settings file, shutting down for security reasons!",
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

		logger.warn("Running in offline mode")
	} else {
		setTimeout(() => {
			window_application.setTitle("Authme")
			window_settings.setTitle("Authme ")
		}, 1000)
		offline = false

		logger.log("Running in online mode")
	}
})

ipc.on("release_notes", () => {
	releaseNotes()
})

ipc.on("download_update", () => {
	axios
		.get("https://api.levminer.com/api/v1/authme/releases")
		.then((res) => {
			if (res.data.tag_name > tag_name && res.data.tag_name != undefined && res.data.prerelease != true) {
				const notes = markdown.convert(res.data.body).split("\n").slice(4).join("\n").split("Bug")[0]
				const message = `Update available: Authme ${res.data.tag_name}\n\nYou currently running: Authme ${tag_name}\n\nNotable changes:\n\n${notes}Check out release note for all changes.`

				dialog
					.showMessageBox({
						title: "Authme",
						buttons: ["Download", "Close"],
						defaultId: 0,
						cancelId: 1,
						noLink: true,
						type: "info",
						message: message,
					})
					.then((result) => {
						if (result.response === 0) {
							shell.openExternal("https://authme.levminer.com/#downloads")
						}
					})
			}
		})
		.catch((error) => {
			dialog.showErrorBox("Authme", "Error getting latest update. \n\nTry again later!")

			logger.error("Error getting latest update", error.stack)
		})
})

ipc.on("support", () => {
	support()
})

ipc.on("rate_authme", () => {
	shell.openExternal("https://github.com/Levminer/authme/")

	file.statistics.rated = true

	saveSettings()
})

ipc.on("provide_feedback", () => {
	shell.openExternal("https://github.com/Levminer/authme/issues")

	file.statistics.feedback = true

	saveSettings()
})

// ? new encryption method
let password_buffer
ipc.on("send_password", (event, data) => {
	password_buffer = Buffer.from(data)

	window_application.webContents.executeJavaScript("loadSave()")
})

ipc.on("request_password", (event) => {
	event.returnValue = password_buffer
})

// ? reload application window
ipc.on("reload_application", () => {
	window_application.reload()

	if (file.security.new_encryption === true && file.security.require_password === true) {
		window_application.webContents.executeJavaScript("loadSave()")
	}
})

// ? reload settings window
ipc.on("reload_settings", () => {
	window_settings.reload()
})

// ? error in window
ipc.on("rendererError", (event, data) => {
	logger.error(`Error in ${data.renderer}`, data.error)
})

// ? logger

ipc.on("loggerLog", (event, data) => {
	logger.rendererLog(data.id, data.message, data.log)
})

ipc.on("loggerWarn", (event, data) => {
	logger.rendererWarn(data.id, data.message, data.warn)
})

ipc.on("loggerError", (event, data) => {
	logger.rendererError(data.id, data.message, data.error)
})

// ? logs
const logs = () => {
	const log_path = logger.fileName()

	shell.openPath(path.join(file_path, "logs", log_path))
}

// ? about
const about = () => {
	const message = `Authme: ${authme_version} \n\nElectron: ${electron_version}\nChrome: ${chrome_version} \n\nOS version: ${os_version}\nHardware info: ${os_info} \n\nRelease date: ${release_date}\nBuild number: ${build_number} \n\nCreated by: Lőrik Levente\n`

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
	axios
		.get("https://api.levminer.com/api/v1/authme/releases")
		.then((res) => {
			dialog
				.showMessageBox({
					title: "Authme",
					buttons: ["More", "Close"],
					defaultId: 1,
					cancelId: 1,
					noLink: true,
					type: "info",
					message: markdown.convert(res.data.body),
				})
				.then((result) => {
					if (result.response === 0) {
						shell.openExternal("https://github.com/Levminer/authme/releases")
					}
				})
		})
		.catch((error) => {
			dialog.showErrorBox("Authme", "Error getting release notes. \n\nTry again later!")

			logger.error("Error getting release notes", error.stack)
		})
}

// ? support
const support = () => {
	dialog
		.showMessageBox({
			title: "Authme",
			buttons: ["PayPal", /* "OpenCollective", */ "Close"],
			defaultId: 2,
			cancelId: 2,
			noLink: true,
			type: "info",
			message: "Authme is a free, open source software. \n\nIf you like the app, please consider supporting!",
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
app.whenReady()
	.then(() => {
		logger.log("Starting app")

		if (dev === false) {
			app.setAppUserModelId("Authme")
		}

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
					message: `Unknown error occurred! \n\n${error.stack}`,
				})
				.then((result) => {
					if (result.response === 0) {
						shell.openExternal("https://github.com/Levminer/authme/issues/")
					} else if (result.response === 1) {
						app.exit()
					}
				})
		})

		// ? quick shortcuts
		const quickShortcuts = () => {
			const keys = Object.keys(file.quick_shortcuts)
			const values = Object.values(file.quick_shortcuts)

			for (let i = 0; i < keys.length; i++) {
				globalShortcut.register(values[i], () => {
					window_application.webContents.executeJavaScript(`quickCopy("${keys[i]}")`)
				})
			}
		}

		window_splash = new BrowserWindow({
			width: 500,
			height: 550,
			transparent: true,
			frame: false,
			alwaysOnTop: true,
			resizable: false,
			webPreferences: {
				nodeIntegration: true,
				contextIsolation: false,
			},
		})

		window_splash.loadFile("./app/splash/index.html")

		window_splash.setProgressBar(10)

		window_splash.show()

		window_splash.once("ready-to-show", () => {
			if (dev === true) {
				setTimeout(() => {
					createWindow()
					quickShortcuts()
				}, 500)

				setTimeout(() => {
					window_splash.destroy()
				}, 1000)
			} else {
				setTimeout(() => {
					createWindow()
					quickShortcuts()
				}, 2000)

				setTimeout(() => {
					window_splash.destroy()
				}, 2500)
			}
		})

		// ? create tray
		const icon_path = path.join(__dirname, "img/tray.png")
		const tray = new Tray(icon_path)

		tray.on("click", () => {
			showAppFromTray()
			createTray()
			createMenu()
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
					label: pre_release ? `(${build_number})` : `(${release_date})`,
					enabled: false,
				},
				{ type: "separator" },
				{
					label: application_shown ? "Hide app" : "Show app",
					accelerator: shortcuts ? "" : file.global_shortcuts.show,
					click: () => {
						showAppFromTray()
						createTray()
						createMenu()
					},
				},
				{ type: "separator" },
				{
					label: "Settings",
					accelerator: shortcuts ? "" : file.global_shortcuts.settings,
					click: () => {
						settingsFromTray()
					},
				},
				{ type: "separator" },
				{
					label: "Exit app",
					accelerator: shortcuts ? "" : file.global_shortcuts.exit,
					click: () => {
						exitFromTray()
					},
				},
			])

			tray.setToolTip("Authme")
			tray.setContextMenu(contextmenu)
		}

		createTray()

		// ? create menu
		const createMenu = () => {
			const template = [
				{
					label: "File",
					submenu: [
						{
							label: application_shown ? "Hide app" : "Show app",
							accelerator: shortcuts ? "" : file.shortcuts.show,
							click: () => {
								showAppFromTray()
								createMenu()
								createTray()
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
									if (settings_shown === false) {
										window_settings.maximize()
										window_settings.show()

										settings_shown = true

										logger.log("Settings shown")
									} else {
										window_settings.hide()

										window_application.focus()

										settings_shown = false

										logger.log("Settings hidden")
									}
								}

								if (file.security.require_password === true && authenticated === true) {
									toggle()
								} else if (file.security.require_password === false) {
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
								tray_minimized = false
								app.exit()

								logger.log("App exited from menu")
							},
						},
					],
				},
				{
					label: "View",
					submenu: [
						{
							label: "Reset",
							role: "resetZoom",
							accelerator: shortcuts ? "" : file.shortcuts.zoom_reset,
						},
						{
							type: "separator",
						},
						{
							label: "Zoom in",
							role: "zoomIn",
							accelerator: shortcuts ? "" : file.shortcuts.zoom_in,
						},
						{
							type: "separator",
						},
						{
							label: "Zoom out",
							role: "zoomOut",
							accelerator: shortcuts ? "" : file.shortcuts.zoom_out,
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
									if (edit_shown === false) {
										window_edit.maximize()
										window_edit.show()

										edit_shown = true

										logger.log("Edit shown")
									} else {
										window_edit.hide()

										window_application.focus()

										edit_shown = false

										logger.log("Edit hidden")
									}
								}

								if (file.security.require_password === true && authenticated === true) {
									toggle()
								} else if (file.security.require_password === false) {
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
									if (import_shown === false) {
										window_import.maximize()
										window_import.show()

										import_shown = true

										logger.log("Import shown")
									} else {
										window_import.hide()

										window_application.focus()

										import_shown = false

										logger.log("Import hidden")
									}
								}

								if (file.security.require_password === true && authenticated === true) {
									toggle()
								} else if (file.security.require_password === false) {
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
									if (export_shown === false) {
										window_export.maximize()
										window_export.show()

										export_shown = true

										logger.log("Export shown")
									} else {
										window_export.hide()

										window_application.focus()

										export_shown = false

										logger.log("Export hidden")
									}
								}

								if (file.security.require_password === true && authenticated === true) {
									toggle()
								} else if (file.security.require_password === false) {
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
							label: "Documentation",
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
										message: "You can view the Authme Docs in the browser. \n\nClick open to view it in your browser!",
									})
									.then((result) => {
										if (result.response === 0) {
											shell.openExternal("https://docs.authme.levminer.com")
										}
									})
							},
						},
						{
							type: "separator",
						},
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
							label: "Support development",
							accelerator: shortcuts ? "" : file.shortcuts.support,
							click: () => {
								support()
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
										message: "This software is licensed under GPL-3.0 \n\nCopyright © 2020 Lőrik Levente",
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
								axios
									.get("https://api.levminer.com/api/v1/authme/releases")
									.then((res) => {
										if (res.data.tag_name > tag_name && res.data.tag_name != undefined && res.data.prerelease != true) {
											dialog
												.showMessageBox({
													title: "Authme",
													buttons: ["Yes", "No"],
													defaultId: 0,
													cancelId: 1,
													type: "info",
													message: `Update available: Authme ${res.data.tag_name} \n\nDo you want to download it? \n\nYou currently running: Authme ${tag_name}`,
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
												message: `No update available: \n\nYou are running the latest version! \n\nYou are currently running: Authme ${tag_name}`,
											})
										}
									})
									.catch((error) => {
										dialog.showErrorBox("Authme", "Error getting update manually \n\nTry again later!")

										logger.error("Error getting update manually", error.stack)
									})
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

				logger.log("Shortcuts disabled")
			} else {
				shortcuts = false

				file = JSON.parse(fs.readFileSync(path.join(file_path, "settings.json"), "utf-8"))

				if (file.global_shortcuts.show !== "None") {
					globalShortcut.register(file.global_shortcuts.show, () => {
						showAppFromTray()
					})
				}

				if (file.global_shortcuts.settings !== "None") {
					globalShortcut.register(file.global_shortcuts.settings, () => {
						settingsFromTray()
					})
				}

				if (file.global_shortcuts.exit !== "None") {
					globalShortcut.register(file.global_shortcuts.exit, () => {
						exitFromTray()
					})
				}

				quickShortcuts()

				createTray()

				createMenu()

				logger.log("Shortcuts enabled")
			}
		})
	})
	.catch((error) => {
		logger.error("Unknown error occurred", error.stack)

		dialog
			.showMessageBox({
				title: "Authme",
				buttons: ["Report", "Close", "Exit"],
				defaultId: 0,
				cancelId: 1,
				noLink: true,
				type: "error",
				message: `Unknown error occurred! \n\n${error.stack}`,
			})
			.then((result) => {
				if (result.response === 0) {
					shell.openExternal("https://github.com/Levminer/authme/issues/")
				} else if (result.response === 2) {
					app.exit()
				}
			})
	})
