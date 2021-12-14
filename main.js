const { app, BrowserWindow, Menu, Tray, shell, dialog, clipboard, globalShortcut, nativeTheme, ipcMain: ipc, powerMonitor: power, screen } = require("electron")
const logger = require("@levminer/lib/logger/main")
const { autoUpdater } = require("electron-updater")
const { number, date } = require("./build.json")
const remote = require("@electron/remote/main")
const debug = require("electron-debug")
const axios = require("axios").default
const path = require("path")
const fs = require("fs")
const os = require("os")

// ? crash report
process.on("uncaughtException", (error) => {
	logger.error("Error on load", error.stack)
	dialog.showErrorBox("Authme", `Authme crashed, exiting now. \n\nPlease open a GitHub Issue with a screenshot of this error. \n\n${error.stack}`)

	shell.openExternal("https://github.com/Levminer/authme/issues")

	process.crash()
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
let manual_update = false
let tray = null
let menu = null
let display = null

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
if (number.startsWith("alpha") || number.startsWith("beta")) {
	pre_release = true
}

/**
 * Get platform
 */
let platform

if (process.platform === "win32") {
	platform = "windows"
} else if (process.platform === "darwin") {
	platform = "mac"
} else {
	platform = "linux"
}

// ? remote module
remote.initialize()

// ? init folders
const full_path = path.join(app.getPath("appData"), "Levminer")
const folder_path = dev ? path.join(app.getPath("appData"), "Levminer", "Authme Dev") : path.join(app.getPath("appData"), "Levminer", "Authme")

// check if folders exists
if (!fs.existsSync(full_path)) {
	fs.mkdirSync(path.join(full_path))
}

if (!fs.existsSync(folder_path)) {
	fs.mkdirSync(folder_path)
}

// codes folder
if (!fs.existsSync(path.join(folder_path, "codes"))) {
	fs.mkdirSync(path.join(folder_path, "codes"))
}

// settings folder
if (!fs.existsSync(path.join(folder_path, "settings"))) {
	fs.mkdirSync(path.join(folder_path, "settings"))
}

// logs folder
if (!fs.existsSync(path.join(folder_path, "logs"))) {
	fs.mkdirSync(path.join(folder_path, "logs"))
}

// rollbacks folder
if (!fs.existsSync(path.join(folder_path, "rollbacks"))) {
	fs.mkdirSync(path.join(folder_path, "rollbacks"))
}

// ? version and logs
const authme_version = app.getVersion()
const release_date = date
const build_number = number

ipc.on("info", (event) => {
	event.returnValue = { authme_version, release_date, build_number }
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
logger.createFile(folder_path, "authme")
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
	fs.writeFileSync(path.join(folder_path, "settings", "settings.json"), JSON.stringify(settings, null, "\t"))
}

const settings_file = {
	version: {
		tag: `${authme_version}`,
		build: `${build_number}`,
	},
	settings: {
		launch_on_startup: true,
		close_to_tray: true,
		show_2fa_names: false,
		click_to_reveal: false,
		reset_after_copy: false,
		save_search_results: true,
		disable_hardware_acceleration: true,
		search_bar_filter: {
			name: true,
			description: false,
		},
		default_display: 1,
	},
	experimental: {
		sort: null,
		screen_capture: false,
	},
	security: {
		require_password: null,
		password: null,
		key: null,
	},
	shortcuts: {
		show: "CmdOrCtrl+q",
		settings: "CmdOrCtrl+s",
		exit: "CmdOrCtrl+w",
		zoom_reset: "CmdOrCtrl+0",
		zoom_in: "CmdOrCtrl+1",
		zoom_out: "CmdOrCtrl+2",
		edit: "CmdOrCtrl+t",
		import: "CmdOrCtrl+i",
		export: "CmdOrCtrl+e",
		release: "CmdOrCtrl+n",
		support: "CmdOrCtrl+p",
		docs: "CmdOrCtrl+d",
		licenses: "CmdOrCtrl+l",
		update: "CmdOrCtrl+u",
		info: "CmdOrCtrl+o",
	},
	global_shortcuts: {
		show: "CmdOrCtrl+Shift+a",
		settings: "CmdOrCtrl+Shift+s",
		exit: "CmdOrCtrl+Shift+d",
	},
	quick_shortcuts: {},
	search_history: {
		latest: null,
	},
	statistics: {
		opens: 0,
		rated: null,
		feedback: null,
	},
}

// create settings if not exists
if (!fs.existsSync(path.join(folder_path, "settings", "settings.json"))) {
	fs.writeFileSync(path.join(folder_path, "settings", "settings.json"), JSON.stringify(settings_file, null, "\t"))
}

/**
 * Read settings
 * @type {LibSettings}
 */
let settings = JSON.parse(fs.readFileSync(path.join(folder_path, "settings", "settings.json"), "utf-8"))

// ? force dark mode
nativeTheme.themeSource = "dark"

// ? disable hardware acceleration
if (settings.settings.disable_hardware_acceleration === true) {
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

	if (settings.security.require_password === true && authenticated === true) {
		toggle()
	} else if (settings.security.require_password === false) {
		toggle()
	} else if (settings.security.require_password === true) {
		if (confirm_shown === false) {
			window_confirm.maximize()
			window_confirm.show()

			confirm_shown = true
			application_shown = true

			createTray()
		} else {
			window_confirm.hide()

			confirm_shown = false
			application_shown = false

			createTray()
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

	if (settings.security.require_password === true && authenticated === true) {
		toggle()
	} else if (settings.security.require_password === false) {
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

	/**
	 * Window Controls Overlay
	 */
	let wco = false

	if (platform === "windows") {
		wco = true
	}

	/**
	 * Create windows
	 */
	window_landing = new BrowserWindow({
		x: display.bounds.x,
		y: display.bounds.y,
		width: 1900,
		height: 1000,
		minWidth: 1000,
		minHeight: 600,
		show: false,
		titleBarStyle: wco ? "hidden" : null,
		titleBarOverlay: wco
			? {
					color: "black",
					symbolColor: "white",
			  }
			: null,
		backgroundColor: "#0A0A0A",
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true,
			contextIsolation: false,
		},
	})

	window_confirm = new BrowserWindow({
		x: display.bounds.x,
		y: display.bounds.y,
		width: 1900,
		height: 1000,
		minWidth: 1000,
		minHeight: 600,
		show: false,
		titleBarStyle: wco ? "hidden" : null,
		titleBarOverlay: wco
			? {
					color: "black",
					symbolColor: "white",
			  }
			: null,
		backgroundColor: "#0A0A0A",
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true,
			contextIsolation: false,
		},
	})

	window_application = new BrowserWindow({
		x: display.bounds.x,
		y: display.bounds.y,
		width: 1900,
		height: 1000,
		minWidth: 1000,
		minHeight: 600,
		show: false,
		titleBarStyle: wco ? "hidden" : null,
		titleBarOverlay: wco
			? {
					color: "black",
					symbolColor: "white",
			  }
			: null,
		backgroundColor: "#0A0A0A",
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true,
			contextIsolation: false,
		},
	})

	window_settings = new BrowserWindow({
		x: display.bounds.x,
		y: display.bounds.y,
		width: 1900,
		height: 1000,
		minWidth: 1000,
		minHeight: 600,
		show: false,
		titleBarStyle: wco ? "hidden" : null,
		titleBarOverlay: wco
			? {
					color: "black",
					symbolColor: "white",
			  }
			: null,
		backgroundColor: "#0A0A0A",
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true,
			contextIsolation: false,
		},
	})

	window_import = new BrowserWindow({
		x: display.bounds.x,
		y: display.bounds.y,
		width: 1900,
		height: 1000,
		minWidth: 1000,
		minHeight: 600,
		show: false,
		titleBarStyle: wco ? "hidden" : null,
		titleBarOverlay: wco
			? {
					color: "black",
					symbolColor: "white",
			  }
			: null,
		backgroundColor: "#0A0A0A",
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true,
			contextIsolation: false,
		},
	})

	window_export = new BrowserWindow({
		x: display.bounds.x,
		y: display.bounds.y,
		width: 1900,
		height: 1000,
		minWidth: 1000,
		minHeight: 600,
		show: false,
		titleBarStyle: wco ? "hidden" : null,
		titleBarOverlay: wco
			? {
					color: "black",
					symbolColor: "white",
			  }
			: null,
		backgroundColor: "#0A0A0A",
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true,
			contextIsolation: false,
		},
	})

	window_edit = new BrowserWindow({
		x: display.bounds.x,
		y: display.bounds.y,
		width: 1900,
		height: 1000,
		minWidth: 1000,
		minHeight: 600,
		show: false,
		titleBarStyle: wco ? "hidden" : null,
		titleBarOverlay: wco
			? {
					color: "black",
					symbolColor: "white",
			  }
			: null,
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
	if (settings.security.require_password === null) {
		window_landing.on("ready-to-show", () => {
			window_landing.maximize()
		})

		/* window_landing.maximize() */

		logger.warn("First start")

		if (dev === false) {
			authme_launcher.enable()
		}
	}

	window_landing.on("close", () => {
		app.exit()

		logger.log("Application exited from landing window")
	})

	window_confirm.on("close", () => {
		app.exit()

		logger.log("Application exited from confirm window")
	})

	// window closings
	window_application.on("close", async (event) => {
		if (dev === true) {
			try {
				password_buffer.fill(0)
			} catch (error) {}

			app.exit()
		} else {
			if (tray_minimized === false) {
				try {
					password_buffer.fill(0)
				} catch (error) {}

				app.exit()

				logger.log("Application exited from application window")
			} else {
				event.preventDefault()
				setTimeout(() => {
					window_application.hide()
				}, 100)

				show_tray = true

				application_shown = false

				createTray()
				createMenu()
			}
		}

		logger.log("Application closed")
	})

	window_settings.on("close", (event) => {
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

	window_import.on("close", (event) => {
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

	window_export.on("close", (event) => {
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

	window_edit.on("close", (event) => {
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

	/**
	 * Disables window capture by default
	 */
	window_landing.setContentProtection(true)
	window_confirm.setContentProtection(true)
	window_application.setContentProtection(true)
	window_settings.setContentProtection(true)
	window_import.setContentProtection(true)
	window_export.setContentProtection(true)
	window_edit.setContentProtection(true)

	/**
	 * Check for manual update
	 */
	window_application.on("show", () => {
		const api = () => {
			axios
				.get("https://api.levminer.com/api/v1/authme/releases")
				.then((res) => {
					if (res.data.tag_name > verify && res.data.tag_name != undefined && res.data.prerelease != true) {
						window_application.webContents.executeJavaScript("showUpdate()")

						window_settings.on("show", () => {
							window_settings.webContents.executeJavaScript("showUpdate()")
						})

						logger.log("Manual update found!")
					} else {
						logger.log("No manual update found!")
					}
				})
				.catch((error) => {
					logger.error("Error during manual update", error.stack)
				})
		}

		if (reload === false && settings.settings.launch_on_startup === true && args[1] === "--hidden") {
			application_shown = false

			window_application.hide()
			window_confirm.hide()

			reload = true
		}

		if (update_seen == false && platform !== "windows") {
			api()

			update_seen = true
		}
	})

	/**
	 * Show animations and focus searchbar on windows focus
	 */
	window_application.on("focus", () => {
		window_application.webContents.executeJavaScript("focusSearch()")
	})

	// ? auto updater
	if (dev === false && platform === "windows") {
		autoUpdater.checkForUpdates()
	}

	autoUpdater.on("checking-for-update", () => {
		logger.log("Checking for auto update")
	})

	autoUpdater.on("update-available", () => {
		logger.log("Auto update available")

		window_application.webContents.executeJavaScript("updateAvailable()")
	})

	autoUpdater.on("update-not-available", () => {
		logger.log("Auto update not available")

		if (manual_update === true) {
			dialog.showMessageBox({
				title: "Authme",
				buttons: ["Close"],
				defaultId: 0,
				cancelId: 1,
				type: "info",
				message: `No update available: \n\nYou are running the latest version! \n\nYou are currently running: Authme ${authme_version}`,
			})

			manual_update = false
		}
	})

	autoUpdater.on("update-downloaded", () => {
		logger.log("Update downloaded")

		window_application.webContents.executeJavaScript("updateDownloaded()")
	})

	autoUpdater.on("error", (error) => {
		logger.error("Error during auto update", error.stack)

		dialog.showErrorBox("Authme", "Error during auto update. \n\nTry to restart Authme!")
	})

	autoUpdater.on("download-progress", (progress) => {
		const download_percent = Math.trunc(progress.percent)
		const download_speed = (Math.round((progress.bytesPerSecond / 1000000) * 10) / 10).toFixed(1)
		const download_transferred = Math.trunc(progress.transferred / 1000000)
		const download_total = Math.trunc(progress.total / 1000000)

		logger.log(`Downloading auto update: ${download_percent}% - ${download_speed}MB/s (${download_transferred}MB/${download_total}MB)`)

		window_application.webContents.send("updateInfo", {
			download_percent: download_percent,
			download_speed: download_speed,
			download_transferred: download_transferred,
			download_total: download_total,
		})
	})

	ipc.on("updateRestart", () => {
		autoUpdater.quitAndInstall(true, true)
	})

	// ? global shortcuts
	if (settings.global_shortcuts.show !== "None") {
		globalShortcut.register(settings.global_shortcuts.show, () => {
			showAppFromTray()
		})
	}

	if (settings.global_shortcuts.settings !== "None") {
		globalShortcut.register(settings.global_shortcuts.settings, () => {
			settingsFromTray()
		})
	}

	if (settings.global_shortcuts.exit !== "None") {
		globalShortcut.register(settings.global_shortcuts.exit, () => {
			exitFromTray()
		})
	}

	// ? statistics
	let opens = settings.statistics.opens
	opens++
	settings.statistics.opens = opens

	saveSettings()

	const openInfo = () => {
		window_application.on("show", () => {
			window_application.webContents.executeJavaScript("showInfo()")
		})

		window_settings.on("show", () => {
			window_settings.webContents.executeJavaScript("showInfo()")
		})
	}

	if (settings.statistics.rate === true || settings.statistics.feedback === true) {
		if (opens % 150 === 0) {
			openInfo()
		}
	} else if (settings.statistics.rate === true && settings.statistics.feedback === true) {
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
const AutoLaunch = require("auto-launch")

const authme_launcher = new AutoLaunch({
	name: "Authme",
	path: app.getPath("exe"),
	isHidden: true,
})

// ? context menu
const contextmenu = require("electron-context-menu")

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

/**
 * Navigate to confirm
 */
ipc.on("toConfirm", () => {
	if (authenticated === false) {
		if (settings.security.require_password === null) {
			window_confirm.maximize()
			window_confirm.show()
			window_landing.hide()
		} else {
			window_confirm.on("ready-to-show", () => {
				window_confirm.maximize()
				window_confirm.show()

				try {
					window_landing.hide()
				} catch (error) {}
			})
		}

		settings = JSON.parse(fs.readFileSync(path.join(folder_path, "settings", "settings.json"), "utf-8"))
	}
})

/**
 * Navigate to application from confirm
 */
ipc.on("toApplicationFromConfirm", () => {
	if (authenticated === false) {
		window_confirm.hide()

		setTimeout(() => {
			window_application.maximize()
			window_application.show()
		}, 300)

		setTimeout(() => {
			window_landing.destroy()
		}, 500)

		authenticated = true

		createTray()
		createMenu()

		settings = JSON.parse(fs.readFileSync(path.join(folder_path, "settings", "settings.json"), "utf-8"))
	}
})

/**
 * Navigate to confirm from landing
 */
ipc.on("toConfirmFromLanding", () => {
	if (authenticated === false) {
		window_landing.hide()

		if (settings.security.require_password === null) {
			setTimeout(() => {
				window_application.maximize()
				window_application.show()
			}, 300)

			setTimeout(() => {
				window_confirm.destroy()
				window_landing.destroy()
			}, 500)
		} else {
			window_application.on("ready-to-show", () => {
				window_application.maximize()
				window_application.show()

				window_confirm.destroy()
				window_landing.destroy()
			})
		}

		authenticated = true

		createTray()
		createMenu()

		settings = JSON.parse(fs.readFileSync(path.join(folder_path, "settings", "settings.json"), "utf-8"))
	}
})

/**
 * Show/Hide settings
 */
ipc.on("toggleSettings", () => {
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

/**
 * Show/Hide import
 */
ipc.on("toggleImport", () => {
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

/**
 * Show/Hide export
 */
ipc.on("toggleExport", () => {
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

/**
 * Show/Hide edit
 */
ipc.on("toggleEdit", () => {
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

/**
 * Disable launch on startup
 */
ipc.on("disableStartup", () => {
	authme_launcher.disable()

	logger.log("Startup disabled")
})

/**
 * Enable launch on startup
 */
ipc.on("enableStartup", () => {
	authme_launcher.enable()

	logger.log("Startup enabled")
})

/**
 * Disables screen capture until restart
 */
ipc.on("disableWindowCapture", () => {
	try {
		window_landing.setContentProtection(true)
	} catch (error) {}

	try {
		window_confirm.setContentProtection(true)
	} catch (error) {}

	window_application.setContentProtection(true)
	window_settings.setContentProtection(true)
	window_import.setContentProtection(true)
	window_export.setContentProtection(true)
	window_edit.setContentProtection(true)

	if (authenticated === false) {
		window_settings.webContents.executeJavaScript("toggleWindowCaptureSwitch()")
	}

	logger.log("Screen capture disabled")
})

/**
 * Enables screen capture until restart
 */
ipc.on("enableWindowCapture", () => {
	try {
		window_landing.setContentProtection(true)
	} catch (error) {}

	try {
		window_confirm.setContentProtection(true)
	} catch (error) {}

	window_application.setContentProtection(false)
	window_settings.setContentProtection(false)
	window_import.setContentProtection(false)
	window_export.setContentProtection(false)
	window_edit.setContentProtection(false)

	if (authenticated === false) {
		window_settings.webContents.executeJavaScript("toggleWindowCaptureSwitch()")
	}

	logger.log("Screen capture enabled")
})

/**
 * Disable close to tray
 */
ipc.on("disableTray", () => {
	tray_minimized = false

	logger.log("Close to tray disabled")
})

/**
 * Enable close to tray
 */
ipc.on("enableTray", () => {
	tray_minimized = true

	logger.log("Close to tray enabled")
})

/**
 * Set logs path
 */
ipc.on("logs", () => {
	logs()
})

/**
 * Show about dialog
 */
ipc.on("about", () => {
	about()
})

/**
 * Abort execution
 */
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

	window_application.destroy()
	window_settings.destroy()
	window_import.destroy()
	window_export.destroy()
	window_edit.destroy()

	process.on("uncaughtException", (error) => {
		logger.error("Execution aborted", error.stack)
	})
})

/**
 * Offline mode
 */
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

/**
 * Display release notes
 */
ipc.on("releaseNotes", () => {
	releaseNotes()
})

/**
 * Look for manual update
 */
ipc.on("manualUpdate", () => {
	axios
		.get("https://api.levminer.com/api/v1/authme/releases")
		.then((res) => {
			if (res.data.tag_name > authme_version && res.data.tag_name != undefined && res.data.prerelease != true) {
				dialog
					.showMessageBox({
						title: "Authme",
						buttons: ["Download", "Close"],
						defaultId: 0,
						cancelId: 1,
						noLink: true,
						type: "info",
						message: `Update available: Authme ${res.data.tag_name} \n\nDo you want to download it? \n\nYou currently running: Authme ${authme_version}`,
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

/**
 * Show support Authme dialog
 */
ipc.on("support", () => {
	support()
})

/**
 * Show rate Authme dialog
 */
ipc.on("rateAuthme", () => {
	shell.openExternal("https://github.com/Levminer/authme/")

	settings.statistics.rated = true

	saveSettings()
})

/**
 * Show provide feedback dialog
 */
ipc.on("provideFeedback", () => {
	shell.openExternal("https://github.com/Levminer/authme/issues")

	settings.statistics.feedback = true

	saveSettings()
})

/**
 * Receive password from confirm page
 */
ipc.on("send_password", (event, data) => {
	password_buffer = Buffer.from(data)

	window_application.webContents.executeJavaScript("loadCodes()")
})

/**
 * Send password to requesting page
 */
ipc.on("request_password", (event) => {
	event.returnValue = password_buffer
})

/**
 * Reload application window
 */
ipc.on("reloadApplicationWindow", () => {
	window_application.reload()

	if (settings.security.require_password === true) {
		window_application.webContents.executeJavaScript("loadCodes()")
	}
})

/**
 * Reload settings window
 */
ipc.on("reloadSettingsWindow", () => {
	window_settings.reload()
})

/**
 * Receive error from renderer
 */
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

	shell.openPath(path.join(folder_path, "logs", log_path))
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
	const { markdown } = require("@levminer/lib")

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

/**
 * Register quick shortcuts
 */
const quickShortcuts = () => {
	const keys = Object.keys(settings.quick_shortcuts)
	const values = Object.values(settings.quick_shortcuts)

	for (let i = 0; i < keys.length; i++) {
		globalShortcut.register(values[i], () => {
			window_application.webContents.executeJavaScript(`quickCopy("${keys[i]}")`)
		})
	}
}

/**
 * Lock Authme when PC goes to sleep or locked
 */
power.on("lock-screen", () => {
	if (settings.security.require_password === true) {
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

		authenticated = false

		createTray()
		createMenu()

		logger.log("Authme locked by sleep")
	}
})

/**
 * Start Authme when the app is ready
 */
app.whenReady()
	.then(() => {
		logger.log("Starting app")

		if (dev === false) {
			app.setAppUserModelId("Authme")
		}

		process.on("uncaughtException", (error) => {
			logger.error("Error occurred while starting", error.stack)

			dialog
				.showMessageBox({
					title: "Authme",
					buttons: ["Report", "Close", "Exit"],
					defaultId: 0,
					cancelId: 1,
					noLink: true,
					type: "error",
					message: `Error occurred while starting Authme! \n\n${error.stack}`,
				})
				.then((result) => {
					if (result.response === 0) {
						shell.openExternal("https://github.com/Levminer/authme/issues/")
					} else if (result.response === 2) {
						app.exit()
					}
				})
		})

		/**
		 * Open Authme on selected display
		 */
		const displays = screen.getAllDisplays()
		const primary_display = screen.getPrimaryDisplay()

		// Remove primary display
		for (let i = 0; i < displays.length; i++) {
			if (displays[i].id === primary_display.id) {
				displays.splice(i, 1)
			}
		}

		// Add primary display
		displays.splice(0, 0, primary_display)

		// Get selected display
		display = displays[settings.settings.default_display - 1]

		/**
		 * Splash window
		 */
		window_splash = new BrowserWindow({
			x: display.bounds.x,
			y: display.bounds.y,
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

		window_splash.center()

		window_splash.loadFile("./app/splash/index.html")
		window_splash.setProgressBar(10)

		/**
		 * Close splash window and create the app window
		 */
		window_splash.once("ready-to-show", () => {
			window_splash.show()

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
				}, 1500)

				setTimeout(() => {
					window_splash.destroy()
				}, 2000)
			}
		})

		/**
		 * Create tray icon
		 */
		const icon_path = path.join(__dirname, "img/tray.png")
		tray = new Tray(icon_path)

		tray.on("click", () => {
			showAppFromTray()
			createTray()
			createMenu()
		})

		createTray()
		createMenu()
	})
	.catch((error) => {
		logger.error("Error occurred while starting", error.stack)

		dialog
			.showMessageBox({
				title: "Authme",
				buttons: ["Report", "Close", "Exit"],
				defaultId: 0,
				cancelId: 1,
				noLink: true,
				type: "error",
				message: `Error occurred while starting Authme! \n\n${error.stack}`,
			})
			.then((result) => {
				if (result.response === 0) {
					shell.openExternal("https://github.com/Levminer/authme/issues/")
				} else if (result.response === 2) {
					app.exit()
				}
			})
	})

/**
 * Create tray menu
 */
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
			label: application_shown ? "Hide App" : "Show App",
			accelerator: shortcuts ? "" : settings.global_shortcuts.show,
			click: () => {
				showAppFromTray()
				createTray()
				createMenu()
			},
		},
		{ type: "separator" },
		{
			label: "Settings",
			enabled: authenticated,
			accelerator: shortcuts ? "" : settings.global_shortcuts.settings,
			click: () => {
				settingsFromTray()
			},
		},
		{ type: "separator" },
		{
			label: "Exit App",
			accelerator: shortcuts ? "" : settings.global_shortcuts.exit,
			click: () => {
				exitFromTray()
			},
		},
	])

	tray.setToolTip("Authme")
	tray.setContextMenu(contextmenu)
}

/**
 * Create application menu
 */
const createMenu = () => {
	const template = [
		{
			label: "File",
			submenu: [
				{
					label: application_shown ? "Hide App" : "Show App",
					accelerator: shortcuts ? "" : settings.shortcuts.show,
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
					enabled: authenticated,
					accelerator: shortcuts ? "" : settings.shortcuts.settings,
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

						if (settings.security.require_password === true && authenticated === true) {
							toggle()
						} else if (settings.security.require_password === false) {
							toggle()
						}
					},
				},
				{
					type: "separator",
				},
				{
					label: "Exit",
					accelerator: shortcuts ? "" : settings.shortcuts.exit,
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
					role: shortcuts ? "" : "resetZoom",
					accelerator: shortcuts ? "" : settings.shortcuts.zoom_reset,
				},
				{
					type: "separator",
				},
				{
					label: "Zoom In",
					role: shortcuts ? "" : "zoomIn",
					accelerator: shortcuts ? "" : settings.shortcuts.zoom_in,
				},
				{
					type: "separator",
				},
				{
					label: "Zoom Out",
					role: shortcuts ? "" : "zoomOut",
					accelerator: shortcuts ? "" : settings.shortcuts.zoom_out,
				},
			],
		},
		{
			label: "Tools",
			submenu: [
				{
					label: "Edit Codes",
					enabled: authenticated,
					accelerator: shortcuts ? "" : settings.shortcuts.edit,
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

						if (settings.security.require_password === true && authenticated === true) {
							toggle()
						} else if (settings.security.require_password === false) {
							toggle()
						}
					},
				},
				{
					type: "separator",
				},
				{
					label: "Import",
					enabled: authenticated,
					accelerator: shortcuts ? "" : settings.shortcuts.import,
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

						if (settings.security.require_password === true && authenticated === true) {
							toggle()
						} else if (settings.security.require_password === false) {
							toggle()
						}
					},
				},
				{
					type: "separator",
				},
				{
					label: "Export",
					enabled: authenticated,
					accelerator: shortcuts ? "" : settings.shortcuts.export,
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

						if (settings.security.require_password === true && authenticated === true) {
							toggle()
						} else if (settings.security.require_password === false) {
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
					accelerator: shortcuts ? "" : settings.shortcuts.docs,
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
					label: "Release Notes",
					accelerator: shortcuts ? "" : settings.shortcuts.release,
					click: () => {
						releaseNotes()
					},
				},
				{
					type: "separator",
				},
				{
					label: "Support Development",
					accelerator: shortcuts ? "" : settings.shortcuts.support,
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
					label: "Show Licenses",
					accelerator: shortcuts ? "" : settings.shortcuts.licenses,
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
					accelerator: shortcuts ? "" : settings.shortcuts.update,
					click: () => {
						if (platform === "windows") {
							if (dev === false) {
								manual_update = true

								autoUpdater.checkForUpdates()
							}
						} else {
							axios
								.get("https://api.levminer.com/api/v1/authme/releases")
								.then((res) => {
									if (res.data.tag_name > authme_version && res.data.tag_name != undefined && res.data.prerelease != true) {
										dialog
											.showMessageBox({
												title: "Authme",
												buttons: ["Yes", "No"],
												defaultId: 0,
												cancelId: 1,
												type: "info",
												message: `Update available: Authme ${res.data.tag_name} \n\nDo you want to download it? \n\nYou currently running: Authme ${authme_version}`,
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
											message: `No update available: \n\nYou are running the latest version! \n\nYou are currently running: Authme ${authme_version}`,
										})
									}
								})
								.catch((error) => {
									dialog.showErrorBox("Authme", "Error getting update manually \n\nTry again later!")

									logger.error("Error getting update manually", error.stack)
								})
						}
					},
				},
				{
					type: "separator",
				},
				{
					label: "Info",
					accelerator: shortcuts ? "" : settings.shortcuts.info,
					click: () => {
						about()
					},
				},
			],
		},
	]

	// Set menu
	menu = Menu.buildFromTemplate(template)
	Menu.setApplicationMenu(menu)

	// Reload menu
	if (window_application !== undefined && platform === "windows") {
		window_application.webContents.send("refreshMenu")
		window_settings.webContents.send("refreshMenu")
		window_import.webContents.send("refreshMenu")
		window_export.webContents.send("refreshMenu")
		window_edit.webContents.send("refreshMenu")
	}
}

/**
 * Toggle shortcuts
 */
ipc.on("shortcuts", () => {
	if (shortcuts === false) {
		shortcuts = true

		globalShortcut.unregisterAll()

		createTray()
		createMenu()

		logger.log("Shortcuts disabled")
	} else {
		shortcuts = false

		settings = JSON.parse(fs.readFileSync(path.join(folder_path, "settings", "settings.json"), "utf-8"))

		if (settings.global_shortcuts.show !== "None") {
			globalShortcut.register(settings.global_shortcuts.show, () => {
				showAppFromTray()
			})
		}

		if (settings.global_shortcuts.settings !== "None") {
			globalShortcut.register(settings.global_shortcuts.settings, () => {
				settingsFromTray()
			})
		}

		if (settings.global_shortcuts.exit !== "None") {
			globalShortcut.register(settings.global_shortcuts.exit, () => {
				exitFromTray()
			})
		}

		quickShortcuts()
		createTray()
		createMenu()

		logger.log("Shortcuts enabled")
	}
})
