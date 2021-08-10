const { shell, app, dialog } = require("@electron/remote")
const fs = require("fs")
const electron = require("electron")
const ipc = electron.ipcRenderer
const path = require("path")
const fetch = require("node-fetch")
const dns = require("dns")

// ? error in window
window.onerror = (error) => {
	ipc.send("rendererError", { renderer: "settings", error: error })
}

// ? choose settings
document.querySelector("#setting").click()

// ? get app infos
const res = ipc.sendSync("info")

// set app version
document.querySelector("#but7").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg> Authme ${res.authme_version}`

// ? if development
let dev = false

if (app.isPackaged === false) {
	dev = true
}

// ? platform
let folder

if (process.platform === "win32") {
	folder = process.env.APPDATA
} else if (process.platform === "darwin") {
	folder = process.env.HOME
} else {
	folder = process.env.HOME
	document.querySelector("#disable_screen_capture_div").style.display = "none"
}

// ? settings
const file_path = dev ? path.join(folder, "Levminer", "Authme Dev") : path.join(folder, "Levminer", "Authme")

// ? read settings
let file = JSON.parse(fs.readFileSync(path.join(file_path, "settings.json"), "utf-8"))

// ? refresh settings
const settings_refresher = setInterval(() => {
	file = JSON.parse(fs.readFileSync(path.join(file_path, "settings.json"), "utf-8"))

	if (file.security.require_password !== null || file.security.password !== null) {
		clearInterval(settings_refresher)

		console.warn("Authme - Settings refresh completed")
	}

	console.warn("Authme - Settings refreshed")
}, 100)

// ? elements
const but0 = document.querySelector("#but0")
const but2 = document.querySelector("#but2")
const but5 = document.querySelector("#but5")
const but10 = document.querySelector("#but10")
const but11 = document.querySelector("#but11")
const but13 = document.querySelector("#but13")
const but15 = document.querySelector("#but15")

const inp0 = document.querySelector("#inp0")
const drp0 = document.querySelector("#drp0")

const tgl0 = document.querySelector("#tgl0")
const tgt0 = document.querySelector("#tgt0")
const tgl1 = document.querySelector("#tgl1")
const tgt1 = document.querySelector("#tgt1")
const tgl2 = document.querySelector("#tgl2")
const tgt2 = document.querySelector("#tgt2")
const tgl3 = document.querySelector("#tgl3")
const tgt3 = document.querySelector("#tgt3")
const tgl4 = document.querySelector("#tgl4")
const tgt4 = document.querySelector("#tgt4")
const tgl5 = document.querySelector("#tgl5")
const tgt5 = document.querySelector("#tgt5")
const tgl6 = document.querySelector("#tgl6")
const tgt6 = document.querySelector("#tgt6")

// launch on startup
let startup_state = file.settings.launch_on_startup
if (startup_state === true) {
	tgt0.textContent = "On"
	tgl0.checked = true
} else {
	tgt0.textContent = "Off"
	tgl0.checked = false
}

// close to tray
let tray_state = file.settings.close_to_tray
if (tray_state === true) {
	tgt1.textContent = "On"
	tgl1.checked = true

	ipc.send("enable_tray")
} else {
	tgt1.textContent = "Off"
	tgl1.checked = false

	ipc.send("disable_tray")
}

// capture
let capture_state = file.settings.disable_window_capture
if (capture_state === true) {
	tgt2.textContent = "On"
	tgl2.checked = true

	ipc.send("disable_capture")
} else {
	tgt2.textContent = "Off"
	tgl2.checked = false

	ipc.send("enable_capture")
}

// names
let names_state = file.settings.show_2fa_names
if (names_state === true) {
	tgt3.textContent = "On"
	tgl3.checked = true
} else {
	tgt3.textContent = "Off"
	tgl3.checked = false
}

// reveal
let reveal_state = file.settings.click_to_reveal
if (reveal_state === true) {
	tgt4.textContent = "On"
	tgl4.checked = true
} else {
	tgt4.textContent = "Off"
	tgl4.checked = false
}

// search
let search_state = file.settings.save_search_results
if (search_state === true) {
	tgt5.textContent = "On"
	tgl5.checked = true
} else {
	tgt5.textContent = "Off"
	tgl5.checked = false
}

// copy
let copy_state = file.settings.reset_after_copy
if (copy_state === true) {
	tgt6.textContent = "On"
	tgl6.checked = true
} else {
	tgt6.textContent = "Off"
	tgl6.checked = false
}

// offset
const offset_number = file.experimental.offset

if (offset_number === null) {
	inp0.value = 0
}

// sort
const sort_number = file.experimental.sort

if (sort_number === 1) {
	drp0.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
	</svg> A-Z`
} else if (sort_number === 2) {
	drp0.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
	</svg> Z-A`
}

// ? startup
const startup = () => {
	if (startup_state == true) {
		file.settings.launch_on_startup = false

		save()

		tgt0.textContent = "Off"
		tgl0.checked = false

		startup_state = false

		ipc.send("disable_startup")
	} else {
		file.settings.launch_on_startup = true

		save()

		tgt0.textContent = "On"
		tgl0.checked = true

		startup_state = true

		ipc.send("enable_startup")
	}
}

// ? tray
const tray = () => {
	if (tray_state == true) {
		file.settings.close_to_tray = false

		save()

		tgt1.textContent = "Off"
		tray_state = false

		ipc.send("disable_tray")
	} else {
		file.settings.close_to_tray = true

		save()

		tgt1.textContent = "On"
		tray_state = true

		ipc.send("enable_tray")
	}
}

// ? capture
const capture = () => {
	if (capture_state == true) {
		file.settings.disable_window_capture = false

		save()

		tgt2.textContent = "Off"
		tgl2.checked = false

		capture_state = false

		ipc.send("enable_capture")
	} else {
		file.settings.disable_window_capture = true

		save()

		tgt2.textContent = "On"
		tgl2.checked = true

		capture_state = true

		ipc.send("disable_capture")
	}
}

// ? reset
const reset = () => {
	dialog
		.showMessageBox({
			title: "Authme",
			buttons: ["Yes", "No"],
			defaultId: 1,
			cancelId: 1,
			noLink: true,
			type: "warning",
			message: "Are you sure you want to clear all data? \n\nThis cannot be undone!",
		})
		.then((result) => {
			if (result.response === 0) {
				dialog
					.showMessageBox({
						title: "Authme",
						buttons: ["Yes", "No"],
						defaultId: 1,
						cancelId: 1,
						noLink: true,
						type: "warning",
						message: "Are you absolutely sure? \n\nThere is no way back!",
					})
					.then((result) => {
						if (result.response === 0) {
							// remove settings file
							fs.unlink(path.join(file_path, "settings.json"), (err) => {
								if (err && err.code === "ENOENT") {
									return console.warn(`Authme - Error deleting settings.json - ${err}`)
								} else {
									console.warn("Authme - File settings.json deleted")
								}
							})

							// remove hash file
							fs.unlink(path.join(file_path, "hash.authme"), (err) => {
								if (err && err.code === "ENOENT") {
									return console.warn(`Authme - Error deleting hash.authme - ${err}`)
								} else {
									console.warn("Authme - File hash.authme deleted")
								}
							})

							// clear logs
							fs.rmdir(path.join(file_path, "logs"), { recursive: true }, (err) => {
								if (err) {
									return console.warn(`Authme - Error deleting logs - ${err}`)
								} else {
									console.warn("Authme - Logs deleted")
								}
							})

							// clear cache files
							fs.rmdir(path.join(file_path, "cache"), { recursive: true }, (err) => {
								if (err) {
									return console.warn(`Authme - Error deleting caches - ${err}`)
								} else {
									console.warn("Authme - Caches deleted")
								}
							})

							// remove start shortcut
							if (dev !== true) {
								ipc.send("disable_startup")
							}

							// clear storage
							if (dev !== true) {
								localStorage.clear()
								sessionStorage.clear()
							}

							// restart
							restart()
						}
					})
			}
		})
}

// ? names
const names = () => {
	dialog
		.showMessageBox({
			title: "Authme",
			buttons: ["Yes", "No", "Cancel"],
			defaultId: 2,
			cancelId: 2,
			noLink: true,
			type: "warning",
			message: "If you want to change this setting you have to restart the app! \n\nDo you want to restart it now?",
		})
		.then((result) => {
			const toggle = () => {
				if (names_state === true) {
					file.settings.show_2fa_names = false

					save()

					tgt3.textContent = "Off"
					tgl3.checked = false

					names_state = false
				} else {
					file.settings.show_2fa_names = true

					save()

					tgt3.textContent = "On"
					tgl3.checked = true

					names_state = true
				}
			}

			if (result.response === 0) {
				toggle()
				restart()
			}

			if (result.response === 1) {
				toggle()
			}
		})
}

// ? reveal
const reveal = () => {
	dialog
		.showMessageBox({
			title: "Authme",
			buttons: ["Yes", "No", "Cancel"],
			defaultId: 2,
			cancelId: 2,
			noLink: true,
			type: "warning",
			message: "If you want to change this setting you have to restart the app! \n\nDo you want to restart it now?",
		})
		.then((result) => {
			const toggle = () => {
				if (reveal_state === true) {
					file.settings.click_to_reveal = false

					save()

					tgt4.textContent = "Off"
					tgl4.checked = false

					reveal_state = false
				} else {
					file.settings.click_to_reveal = true

					save()

					tgt4.textContent = "On"
					tgl4.checked = true

					reveal_state = true
				}
			}

			if (result.response === 0) {
				toggle()
				restart()
			}

			if (result.response === 1) {
				toggle()
			}
		})
}

// ? search
const results = () => {
	dialog
		.showMessageBox({
			title: "Authme",
			buttons: ["Yes", "No", "Cancel"],
			defaultId: 2,
			cancelId: 2,
			noLink: true,
			type: "warning",
			message: "If you want to change this setting you have to restart the app! \n\nDo you want to restart it now?",
		})
		.then((result) => {
			const toggle = () => {
				if (search_state === true) {
					file.settings.save_search_results = false

					save()

					tgt5.textContent = "Off"
					tgl5.checked = false

					search_state = false
				} else {
					file.settings.save_search_results = true

					save()

					tgt5.textContent = "On"
					tgl5.checked = true

					search_state = true
				}
			}

			if (result.response === 0) {
				toggle()
				restart()
			}

			if (result.response === 1) {
				toggle()
			}
		})
}

// ? copy
const copy = () => {
	dialog
		.showMessageBox({
			title: "Authme",
			buttons: ["Yes", "No", "Cancel"],
			defaultId: 2,
			cancelId: 2,
			noLink: true,
			type: "warning",
			message: "If you want to change this setting you have to restart the app! \n\nDo you want to restart it now?",
		})
		.then((result) => {
			const toggle = () => {
				if (copy_state === true) {
					file.settings.reset_after_copy = false

					save()

					tgt6.textContent = "Off"
					tgl6.checked = false

					copy_state = false
				} else {
					file.settings.reset_after_copy = true

					save()

					tgt6.textContent = "On"
					tgl6.checked = true

					copy_state = true
				}
			}

			if (result.response === 0) {
				toggle()
				restart()
			}

			if (result.response === 1) {
				toggle()
			}
		})
}

// ? offset
inp0.addEventListener("keyup", (event) => {
	if (event.key === "Enter") {
		const offset_input = document.querySelector("#inp0").value

		console.log(event)

		dialog
			.showMessageBox({
				title: "Authme",
				buttons: ["Yes", "No", "Cancel"],
				defaultId: 2,
				cancelId: 2,
				noLink: true,
				type: "warning",
				message: "If you want to change this setting you have to restart the app! \n\nDo you want to restart it now?",
			})
			.then((result) => {
				if (result.response === 0) {
					file.experimental.offset = parseInt(offset_input)

					save()

					restart()
				}

				if (result.response === 1) {
					file.experimental.offset = parseInt(offset_input)

					save()
				}
			})
	}
})

let dropdown_state = false
// ? dropdown
const dropdown = (id) => {
	const dropdown_content = document.querySelector(".dropdown-content")

	if (dropdown_state === false) {
		dropdown_content.style.display = "block"

		dropdown_state = true
	} else {
		dropdown_content.style.display = ""

		dropdown_state = false
	}
}

const dropdownChoose = (id) => {
	const dropdown_button = document.querySelector(".dropdown-button")

	dialog
		.showMessageBox({
			title: "Authme",
			buttons: ["Yes", "No", "Cancel"],
			defaultId: 2,
			cancelId: 2,
			noLink: true,
			type: "warning",
			message: "If you want to change this setting you have to restart the app! \n\nDo you want to restart it now?",
		})
		.then((result) => {
			if (result.response === 0) {
				dropdown()
				sort()
				save()
				restart()
			}

			if (result.response === 1) {
				dropdown()
				sort()
				save()
			}
		})

	const sort = () => {
		switch (id) {
			case 0:
				dropdown_button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
					 </svg> Default`

				file.experimental.sort = null
				break

			case 1:
				dropdown_button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
					 </svg> A-Z`

				file.experimental.sort = 1
				break

			case 2:
				dropdown_button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
					</svg> Z-A`

				file.experimental.sort = 2
				break
		}
	}
}

// ? save settings
const save = () => {
	fs.writeFileSync(path.join(file_path, "settings.json"), JSON.stringify(file, null, "\t"))
}

// ? release notes
const releaseNotes = () => {
	ipc.send("release_notes")
}

// ? download update
const downloadUpdate = () => {
	ipc.send("download_update")
}

// ? rate
const rateAuthme = () => {
	ipc.send("rate_authme")
}

// ? feedback
const provideFeedback = () => {
	ipc.send("provide_feedback")
}

// ? show ifno
const showInfo = () => {
	document.querySelector(".info").style.display = "block"
}

// ? show update
const showUpdate = () => {
	document.querySelector(".update").style.display = "block"
}

// ? authme folder
const folder0 = () => {
	ipc.send("app_path")
}

// ? settings folder
const folder1 = () => {
	shell.openPath(file_path)
}

// ? cache folder
const folder2 = () => {
	let cache_path

	if (process.platform === "win32") {
		cache_path = path.join(process.env.APPDATA, "/Authme")
	} else if (process.platform === "linux") {
		cache_path = path.join(process.env.HOME, "/.config/Authme")
	} else if (process.platform === "darwin") {
		cache_path = path.join(process.env.HOME, "/Library/Application Support/Authme")
	}

	shell.openPath(cache_path)
}

// ? status api
const status = document.querySelector("#but6")

const api = async () => {
	try {
		await fetch("https://api.levminer.com/api/v1/status/all")
			.then((res) => res.json())
			.then((data) => {
				try {
					if (data.state === "up") {
						status.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
					  </svg> \n All systems online`
					} else {
						status.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
					  </svg> \n Some systems offline`
					}
				} catch (error) {
					return console.warn(`Authme - Error loading API - ${error}`)
				}
			})
	} catch (error) {
		status.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
	  </svg> \n Can't connect to API`
	}
}

api()

// ? open status
const statusLink = () => {
	shell.openExternal("https://status.levminer.com")
}

// ? shortcuts docs
const shortcutsLink = () => {
	shell.openExternal("https://docs.authme.levminer.com/#/settings?id=shortcuts")
}

// ? shortcuts docs
const globalShortcutsLink = () => {
	shell.openExternal("https://docs.authme.levminer.com/#/settings?id=gobal-shortcuts")
}

const hide = () => {
	ipc.send("hide_settings")
}

document.querySelector(".settings").disabled = true
document.querySelector(".settings").classList.add("buttonmselected")

const removeButtonStyles = () => {
	document.querySelector(".shortcuts").classList.remove("buttonmselected")
	document.querySelector(".settings").classList.remove("buttonmselected")
	document.querySelector(".experimental").classList.remove("buttonmselected")
	document.querySelector(".codes").classList.remove("buttonmselected")
}

// ? menu
let shortcut = false

const menu = (evt, name) => {
	let i

	if (name === "shortcuts") {
		removeButtonStyles()

		document.querySelector(".shortcuts").classList.add("buttonmselected")

		document.querySelector(".shortcuts").disabled = true
		document.querySelector(".settings").disabled = false
		document.querySelector(".experimental").disabled = false
		document.querySelector(".codes").disabled = false

		shortcut = true

		ipc.send("shortcuts")
	} else if (name === "setting") {
		removeButtonStyles()

		document.querySelector(".settings").classList.add("buttonmselected")

		document.querySelector(".settings").disabled = true
		document.querySelector(".shortcuts").disabled = false
		document.querySelector(".experimental").disabled = false
		document.querySelector(".codes").disabled = false

		if (shortcut === true) {
			ipc.send("shortcuts")

			shortcut = false
		}
	} else if (name === "experimental") {
		removeButtonStyles()

		document.querySelector(".experimental").classList.add("buttonmselected")

		document.querySelector(".experimental").disabled = true
		document.querySelector(".settings").disabled = false
		document.querySelector(".shortcuts").disabled = false
		document.querySelector(".codes").disabled = false

		if (shortcut === true) {
			ipc.send("shortcuts")

			shortcut = false
		}
	} else if (name === "codes") {
		removeButtonStyles()

		document.querySelector(".codes").classList.add("buttonmselected")

		document.querySelector(".experimental").disabled = false
		document.querySelector(".settings").disabled = false
		document.querySelector(".shortcuts").disabled = false
		document.querySelector(".codes").disabled = true

		if (shortcut === true) {
			ipc.send("shortcuts")

			shortcut = false
		}
	}

	const tabcontent = document.getElementsByClassName("tabcontent")
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none"
	}

	const tablinks = document.getElementsByClassName("tablinks")
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "")
	}

	document.getElementById(name).style.display = "block"
	evt.currentTarget.className += " active"
}

// ? restart
const restart = () => {
	setTimeout(() => {
		app.relaunch()
		app.exit()
	}, 300)
}

// ? about
const about = () => {
	ipc.send("about")
}

// ? edit
const edit = () => {
	ipc.send("hide_edit")
}
// ? logs
const logs = () => {
	ipc.send("logs")
}

// ? build
if (res.build_number.startsWith("alpha")) {
	document.querySelector(".build-content").textContent = `You are running an alpha version of Authme - Version ${res.authme_version} - Build ${res.build_number}`
	document.querySelector(".build").style.display = "block"
}

// ? offline mode
let offline_mode = false
let offline_closed = false
let online_closed = false

const check_for_internet = () => {
	dns.lookup("google.com", (err) => {
		if (err && err.code == "ENOTFOUND" && offline_closed === false) {
			document.querySelector(".online").style.display = "none"
			document.querySelector(".offline").style.display = "block"

			offline_mode = true
			offline_closed = true

			console.warn("Authme - Can't connect to the internet")
		} else if (err === null && offline_mode === true && online_closed === false) {
			document.querySelector(".online").style.display = "block"
			document.querySelector(".offline").style.display = "none"

			offline_mode = false
			online_closed = true

			console.warn("Authme - Connected to the internet")
		} else if ((online_closed === true || offline_closed === true) && err === null) {
			offline_mode = false
			offline_closed = false
			online_closed = false

			console.warn("Authme - Connection resetted")
		}
	})
}

check_for_internet()

setInterval(() => {
	check_for_internet()
	api()
}, 10000)
