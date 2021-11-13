const { app, dialog } = require("@electron/remote")
const { aes, convert, time } = require("@levminer/lib")
const logger = require("@levminer/lib/logger/renderer")
const fs = require("fs")
const electron = require("electron")
const ipc = electron.ipcRenderer
const path = require("path")

// ? error in window
window.onerror = (error) => {
	ipc.send("rendererError", { renderer: "edit", error: error })
}

// ? logger
logger.getWindow("edit")

// ? if development
let dev = false

if (app.isPackaged === false) {
	dev = true
}

// ? platform
let folder

if (process.platform === "win32") {
	folder = process.env.APPDATA
} else {
	folder = process.env.HOME
}

// ? build
const res = ipc.sendSync("info")

if (res.build_number.startsWith("alpha")) {
	document.querySelector(".build-content").textContent = `You are running an alpha version of Authme - Version ${res.authme_version} - Build ${res.build_number}`
	document.querySelector(".build").style.display = "block"
}

// ? file path
const file_path = dev ? path.join(folder, "Levminer", "Authme Dev") : path.join(folder, "Levminer", "Authme")

/**
 * Read settings
 * @type{LibSettings}
 */
let file = JSON.parse(fs.readFileSync(path.join(file_path, "settings.json"), "utf-8"))

// ? refresh settings
const settings_refresher = setInterval(() => {
	file = JSON.parse(fs.readFileSync(path.join(file_path, "settings.json"), "utf-8"))

	if (file.security.require_password !== null || file.security.password !== null) {
		clearInterval(settings_refresher)

		logger.log("Settings refresh completed")
	}
}, 100)

// ? rollback
const cache_path = path.join(file_path, "cache")
const rollback_con = document.querySelector(".rollback")
const rollback_text = document.querySelector("#rollbackText")
let cache = true

fs.readFile(path.join(cache_path, "latest.authmecache"), "utf-8", (err, data) => {
	if (err) {
		logger.warn("Cache file don't exist")
	} else {
		logger.log("Cache file exists")

		rollback_con.style.display = "block"

		const edited_date = fs.statSync(cache_path).atime

		const year = edited_date.getFullYear()
		const month = edited_date.toLocaleString("en-us", { month: "long" })
		const day = edited_date.toISOString().substring(8, 10)

		const temp_date = `${year}. ${month} ${day}.`
		const temp_time = `${edited_date.getHours().toString().padStart(2, "0")}:${edited_date.getMinutes().toString().padStart(2, "0")}:${edited_date.getSeconds().toString().padStart(2, "0")}`

		rollback_text.innerHTML = `Latest rollback: <br /> ${temp_date}  ${temp_time}`
	}
})

const rollback = () => {
	dialog
		.showMessageBox({
			title: "Authme",
			buttons: ["Yes", "Cancel"],
			defaultId: 1,
			cancelId: 1,
			type: "warning",
			noLink: true,
			message: "Are you sure you want to rollback to the latest save? \n\nThis will overwrite your saved codes!",
		})
		.then((result) => {
			if (result.response === 0) {
				fs.readFile(path.join(cache_path, "latest.authmecache"), "utf-8", (err, data) => {
					if (err) {
						logger.error("Error reading hash file", err)
					} else {
						if (file.security.new_encryption === true) {
							fs.writeFile(path.join(file_path, "codes", "codes.authme"), data, (err) => {
								if (err) {
									logger.error("Failed to create codes.authme folder", err)
								} else {
									logger.log("rollback successful, codes.authme file created")

									dialog.showMessageBox({
										title: "Authme",
										buttons: ["Close"],
										type: "info",
										message: "Rollback successful! \n\nGo back to the main page to check out the changes!",
									})
								}
							})
						} else {
							fs.writeFile(path.join(file_path, "hash.authme"), data, (err) => {
								if (err) {
									logger.error("Failed to create hash.authme", err)
								} else {
									logger.log("rollback successful, hash.authme file created")

									dialog.showMessageBox({
										title: "Authme",
										buttons: ["Close"],
										type: "info",
										message: "Rollback successful! \n\nGo back to the main page to check out the changes!",
									})
								}
							})
						}
					}
				})

				reloadApplication()
				reloadSettings()
			}
		})
}

// ? separate value
const names = []
const secrets = []
const issuers = []

/**
 * Process data from saved file
 * @param {String} text
 */
const processdata = (text) => {
	const data = convert.fromText(text, 0)

	for (let i = 0; i < data.names.length; i++) {
		names.push(data.names[i])
		secrets.push(data.secrets[i])
		issuers.push(data.issuers[i])
	}

	go()
}

// block counter
let counter = 0

/**
 * Start creating edit elements
 */
const go = () => {
	document.querySelector(".codes_container").innerHTML = ""

	if (cache === true) {
		createCache()
		cache = false
	}

	document.querySelector(".beforeLoad").style.display = "none"
	document.querySelector(".rollback").style.display = "none"
	document.querySelector(".afterLoad").style.display = "block"

	for (let j = 0; j < names.length; j++) {
		const codes_container = document.querySelector(".codes_container")

		const div = document.createElement("div")

		div.innerHTML = `
		<div id="grid${[counter]}" class="flex flex-col md:w-4/5 lg:w-2/3 mx-auto rounded-2xl bg-gray-800 mb-20">
		<div class="flex justify-center items-center">
		<h2>${issuers[counter]}</h2>
		</div>
		<div class="flex justify-center items-center">
		<input class="input w-[320px]" type="text" id="edit_inp_${[counter]}" value="${names[counter]}" readonly/>
		</div>
		<div class="flex justify-center items-center mb-10 mt-5 gap-2">
		<button class="buttonr button" id="edit_but_${[counter]}" onclick="edit(${[counter]})">
		<svg id="edit_svg_${[counter]}" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
		</svg>
		</button>
		<button class="buttonr button" id="del_but_${[counter]}" onclick="del(${[counter]})">
		<svg id="del_svg_${[counter]}" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
		</svg>
		</button>
		</div>
		</div>
		`

		div.setAttribute("id", counter)
		codes_container.appendChild(div)

		counter++
	}

	save_text = ""
}

// ? edit
let edit_mode = false
const edit = (number) => {
	const edit_but = document.querySelector(`#edit_but_${number}`)
	const edit_inp = document.querySelector(`#edit_inp_${number}`)

	if (edit_mode === false) {
		edit_but.style.color = "green"
		edit_but.style.borderColor = "green"

		edit_inp.style.borderColor = "green"
		edit_inp.readOnly = false

		edit_mode = true
	} else {
		edit_but.style.color = ""
		edit_but.style.borderColor = "white"

		edit_inp.style.borderColor = "white"
		edit_inp.readOnly = true

		const inp_value = document.querySelector(`#edit_inp_${number}`)

		names[number] = inp_value.value

		edit_mode = false
	}
}

// ? delete
const del = (number) => {
	const del_but = document.querySelector(`#del_but_${number}`)

	del_but.style.color = "red"
	del_but.style.borderColor = "red"

	counter = 0

	dialog
		.showMessageBox({
			title: "Authme",
			buttons: ["Yes", "Cancel"],
			type: "warning",
			message: "Are you sure you want to delete this code? \n\nIf you want to revert this don't save and restart the app!",
		})
		.then((result) => {
			if (result.response === 0) {
				del_but.style.color = ""
				del_but.style.borderColor = "white"

				const div = document.querySelector(`#grid${number}`)
				div.remove()

				names.splice(number, 1)
				secrets.splice(number, 1)
				issuers.splice(number, 1)

				go()
			} else {
				del_but.style.color = ""
				del_but.style.borderColor = "white"
			}
		})
}

// ? create save
let save_text = ""

const createSave = () => {
	dialog
		.showMessageBox({
			title: "Authme",
			buttons: ["Yes", "Cancel"],
			defaultId: 1,
			cancelId: 1,
			type: "warning",
			noLink: true,
			message: "Are you sure you want to save the modified code(s)? \n\nThis will overwrite your saved codes!",
		})
		.then((result) => {
			if (result.response === 0) {
				for (let i = 0; i < names.length; i++) {
					const substr = `\nName:   ${names[i]} \nSecret: ${secrets[i]} \nIssuer: ${issuers[i]} \nType:   OTP_TOTP\n`
					save_text += substr
				}

				if (file.security.new_encryption === true) {
					newSaveCodes()
				} else {
					saveCodes()
				}

				/**
				 * Load storage
				 * @type {LibStorage}
				 */
				let storage

				if (dev === false) {
					storage = JSON.parse(localStorage.getItem("storage"))

					storage.issuers = issuers

					localStorage.setItem("storage", JSON.stringify(storage))
				} else {
					storage = JSON.parse(localStorage.getItem("dev_storage"))

					storage.issuers = issuers

					localStorage.setItem("dev_storage", JSON.stringify(storage))
				}

				reloadApplication()
				reloadSettings()
			}
		})
}

const newSaveCodes = () => {
	let password
	let key

	if (file.security.require_password === true) {
		password = Buffer.from(ipc.sendSync("request_password"))
		key = Buffer.from(aes.generateKey(password, Buffer.from(file.security.key, "base64")))
	} else {
		/**
		 * Load storage
		 * @type {LibStorage}
		 */
		let storage

		if (dev === false) {
			storage = JSON.parse(localStorage.getItem("storage"))
		} else {
			storage = JSON.parse(localStorage.getItem("dev_storage"))
		}

		password = Buffer.from(storage.password, "base64")
		key = Buffer.from(aes.generateKey(password, Buffer.from(storage.key, "base64")))
	}

	const encrypted = aes.encrypt(save_text, key)

	const codes = {
		codes: encrypted.toString("base64"),
		date: time.timestamp(),
		version: "2",
	}

	fs.writeFileSync(path.join(file_path, "codes", "codes.authme"), JSON.stringify(codes, null, "\t"))

	password.fill(0)
	key.fill(0)
}

// ? load more
const addMore = () => {
	dialog
		.showOpenDialog({
			title: "Import from Authme file",
			properties: ["openFile", "multiSelections"],
			filters: [{ name: "Authme file", extensions: ["authme"] }],
		})
		.then((result) => {
			canceled = result.canceled
			files = result.filePaths

			if (canceled === false) {
				for (let i = 0; i < files.length; i++) {
					fs.readFile(files[i], (err, input) => {
						if (err) {
							logger.error("Error loading file")
						} else {
							logger.log("File readed")

							const /** @type{LibAuthmeFile} */ loaded = JSON.parse(input.toString())

							if (loaded.role === "import" || loaded.role === "export") {
								dialog.showMessageBox({
									title: "Authme",
									buttons: ["Close"],
									defaultId: 0,
									cancelId: 0,
									type: "info",
									noLink: true,
									message: "Code(s) added! \n\nScroll down to view them!",
								})

								data = []

								const container = document.querySelector(".codes_container")
								container.innerHTML = ""

								counter = 0

								const codes = Buffer.from(loaded.codes, "base64")

								const /** @type{LibImportFile} */ imported = convert.fromText(codes.toString(), 0)

								for (let i = 0; i < imported.names.length; i++) {
									names.push(imported.names[i])
									secrets.push(imported.secrets[i])
									issuers.push(imported.issuers[i])
								}

								go()
							} else {
								dialog.showMessageBox({
									title: "Authme",
									buttons: ["Close"],
									defaultId: 0,
									cancelId: 0,
									type: "error",
									noLink: true,
									message: `This file is an Authme ${loaded.role} file! \n\nYou need an Authme export or import file!`,
								})
							}
						}
					})
				}
			}
		})
}

// ? create cache
const createCache = () => {
	if (file.security.new_encryption === true) {
		fs.readFile(path.join(file_path, "codes", "codes.authme"), "utf-8", (err, data) => {
			if (err) {
				logger.error("Error reading hash file", err)
			} else {
				if (!fs.existsSync(cache_path)) {
					fs.mkdirSync(cache_path)
				}

				fs.writeFile(path.join(cache_path, "latest.authmecache"), data, (err) => {
					if (err) {
						logger.error("Failed to create cache folder", err)
					} else {
						logger.log("Cache file created")
					}
				})
			}
		})
	} else {
		fs.readFile(path.join(file_path, "hash.authme"), "utf-8", (err, data) => {
			if (err) {
				logger.error("Error reading hash file", err)
			} else {
				if (!fs.existsSync(cache_path)) {
					fs.mkdirSync(cache_path)
				}

				fs.writeFile(path.join(cache_path, "latest.authmecache"), data, (err) => {
					if (err) {
						logger.error("Failed to create cache folder", err)
					} else {
						logger.log("Cache file created")
					}
				})
			}
		})
	}
}

// ? error handling
const loadError = () => {
	fs.readFile(path.join(file_path, "hash.authme"), "utf-8", (err, data) => {
		if (err) {
			dialog.showMessageBox({
				title: "Authme",
				buttons: ["Close"],
				type: "error",
				message: "No save file found. \n\nGo back to the main page and save your codes!",
			})
		}
	})
}

// ? new encryption method
const loadChooser = () => {
	if (file.security.new_encryption === true) {
		fs.readFile(path.join(file_path, "codes", "codes.authme"), "utf-8", (err, data) => {
			if (err) {
				dialog.showMessageBox({
					title: "Authme",
					buttons: ["Close"],
					type: "error",
					message: "No save file found. \n\nGo back to the main page and save your codes!",
				})
			} else {
				newLoad()
			}
		})
	} else {
		loadCodes()
	}
}

const newLoad = () => {
	let password
	let key

	if (file.security.require_password === true) {
		password = Buffer.from(ipc.sendSync("request_password"))
		key = Buffer.from(aes.generateKey(password, Buffer.from(file.security.key, "base64")))
	} else {
		/**
		 * Load storage
		 * @type {LibStorage}
		 */
		let storage

		if (dev === false) {
			storage = JSON.parse(localStorage.getItem("storage"))
		} else {
			storage = JSON.parse(localStorage.getItem("dev_storage"))
		}

		password = Buffer.from(storage.password, "base64")
		key = Buffer.from(aes.generateKey(password, Buffer.from(storage.key, "base64")))
	}

	fs.readFile(path.join(file_path, "codes", "codes.authme"), (err, content) => {
		if (err) {
			logger.warn("The file codes.authme don't exists")

			password.fill(0)
			key.fill(0)
		} else {
			const codes_file = JSON.parse(content)

			const decrypted = aes.decrypt(Buffer.from(codes_file.codes, "base64"), key)

			processdata(decrypted.toString())

			decrypted.fill(0)
			password.fill(0)
			key.fill(0)
		}
	})
}

// ? hide window
const hide = () => {
	ipc.send("hide_edit")
}

// ? reloads
const reloadApplication = () => {
	ipc.send("reload_application")
}

const reloadSettings = () => {
	ipc.send("reload_settings")
}

/**
 * Revert all current changes
 */
const revertChanges = () => {
	dialog
		.showMessageBox({
			title: "Authme",
			buttons: ["Yes", "Cancel"],
			defaultId: 1,
			cancelId: 1,
			type: "warning",
			noLink: true,
			message: "Are you sure you want to revert all current change(s)? \n\nYou will lose all current changes!",
		})
		.then((result) => {
			if (result.response === 0) {
				location.reload()
			}
		})
}

/**
 * Delete all codes
 */
const deleteCodes = () => {
	dialog
		.showMessageBox({
			title: "Authme",
			buttons: ["Yes", "Cancel"],
			defaultId: 1,
			cancelId: 1,
			type: "warning",
			noLink: true,
			message: "Are you sure you want to delete all codes? \n\nYou can revert this with a rollback.",
		})
		.then((result) => {
			if (result.response === 0) {
				// clear codes
				fs.rm(path.join(file_path, "codes", "codes.authme"), (err) => {
					if (err) {
						return logger.error(`Error deleting codes - ${err}`)
					} else {
						logger.log("Codes deleted")
					}
				})

				fs.rm(path.join(file_path, "hash.authme"), (err) => {
					if (err) {
						return logger.warn(`Error deleting hash - ${err}`)
					} else {
						logger.log("Codes deleted")
					}
				})

				/**
				 * Load storage
				 * @type {LibStorage}
				 */
				let storage

				if (dev === false) {
					storage = JSON.parse(localStorage.getItem("storage"))

					storage.issuers = undefined

					localStorage.setItem("storage", JSON.stringify(storage))
				} else {
					storage = JSON.parse(localStorage.getItem("dev_storage"))

					storage.issuers = undefined

					localStorage.setItem("dev_storage", JSON.stringify(storage))
				}

				reloadApplication()
				reloadSettings()

				setTimeout(() => {
					location.reload()
				}, 100)
			}
		})
}
