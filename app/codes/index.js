const { app, shell, dialog } = require("@electron/remote")
const { aes, convert, time, localization } = require("@levminer/lib")
const logger = require("@levminer/lib/logger/renderer")
const { ipcRenderer: ipc } = require("electron")
const speakeasy = require("@levminer/speakeasy")
const path = require("path")
const fs = require("fs")

/**
 * Send error to main process
 */
window.addEventListener("error", (err) => {
	ipc.invoke("rendererError", { renderer: "codes", error: err.error.stack })
})

/**
 * Start logger
 */
logger.getWindow("application")

/**
 * Localization
 */
localization.localize("application")

const lang = localization.getLang()

/**
 * If running in development
 */
let dev = false

if (app.isPackaged === false) {
	dev = true
}

/**
 * Get Authme folder path
 */
const folder_path = dev ? path.join(app.getPath("appData"), "Levminer", "Authme Dev") : path.join(app.getPath("appData"), "Levminer", "Authme")

/**
 * Read settings
 * @type {LibSettings}
 */
let settings = JSON.parse(fs.readFileSync(path.join(folder_path, "settings", "settings.json"), "utf-8"))

/**
 * Refresh settings
 */
if (settings.security.require_password === null && settings.security.password === null) {
	const settings_refresher = setInterval(() => {
		try {
			settings = JSON.parse(fs.readFileSync(path.join(folder_path, "settings", "settings.json"), "utf-8"))

			if (settings.security.require_password !== null || settings.security.password !== null) {
				clearInterval(settings_refresher)
			}
		} catch (error) {
			logger.error("Error refreshing settings")
			clearInterval(settings_refresher)
		}
	}, 100)
}

/**
 * Show quick start div
 */
if (!fs.existsSync(path.join(folder_path, "codes", "codes.authme"))) {
	document.querySelector("#starting").style.display = "block"
	document.querySelector("#choose").style.display = "block"
}

let saved_codes = false
let save_text = ""
let query = []
let description_query = []
let name_query = []

const codes_description = settings.settings.codes_description
const reset_after_copy = settings.settings.reset_after_copy
const search_history = settings.settings.search_history
const sort = settings.settings.sort

/**
 * Load file first time from dialog
 */
const chooseImportFile = () => {
	dialog
		.showOpenDialog({
			title: lang.application_dialog.choose_import_file,
			properties: ["openFile"],
			filters: [{ name: lang.application_dialog.authme_file, extensions: ["authme"] }],
		})
		.then((result) => {
			const canceled = result.canceled
			const filepath = result.filePaths

			if (canceled === false) {
				const /** @type{LibAuthmeFile} */ loaded = JSON.parse(fs.readFileSync(filepath.toString(), "utf-8"))

				if (loaded.role === "import" || loaded.role === "export") {
					save_text = Buffer.from(loaded.codes, "base64").toString()

					processData(save_text)
				} else {
					dialog.showMessageBox({
						title: "Authme",
						buttons: [lang.button.close],
						defaultId: 0,
						cancelId: 0,
						type: "error",
						noLink: true,
						message: `${lang.application_dialog.old_file_0} ${loaded.role} ${lang.application_dialog.old_file_1}`,
					})
				}
			}
		})
}

/**
 * Automatically import when creating import file
 * @param {string} res
 */
const importCodes = (res) => {
	const text = Buffer.from(res, "base64").toString()
	save_text = text

	processData(text)
}

/**
 * Automatically import when creating import file
 * @param {string} res
 */
const importExistingCodes = async (res) => {
	let password
	let key

	if (settings.security.require_password === true) {
		password = Buffer.from(await ipc.invoke("requestPassword"))
		key = Buffer.from(aes.generateKey(password, Buffer.from(settings.security.key, "base64")))
	} else {
		const /** @type{LibStorage} */ storage = dev ? JSON.parse(localStorage.getItem("dev_storage")) : JSON.parse(localStorage.getItem("storage"))

		password = Buffer.from(storage.password, "base64")
		key = Buffer.from(aes.generateKey(password, Buffer.from(storage.key, "base64")))
	}

	fs.readFile(path.join(folder_path, "codes", "codes.authme"), async (err, content) => {
		if (err) {
			logger.error("Error loading codes", err)
		}

		const codes_file = JSON.parse(content.toString())

		const decrypted = aes.decrypt(Buffer.from(codes_file.codes, "base64"), key)

		const text = Buffer.from(res, "base64").toString()
		save_text = decrypted + text

		for (let i = 0; i < query.length; i++) {
			document.querySelector(`#codes${i}`).remove()
		}

		document.querySelector("#save").style.display = "block"

		processData(save_text)

		decrypted.fill(0)
		password.fill(0)
		key.fill(0)
	})
}

/**
 * Process data from saved source
 * @param {string} text
 */
const processData = (text) => {
	query = []
	description_query = []
	name_query = []

	const data = convert.fromText(text, sort)

	generateCodeElements(data)
}

/**
 * Start creating 2FA elements
 * @param {LibImportFile} data
 */
const generateCodeElements = (data) => {
	document.querySelector("#searchContainer").style.display = "inline-block"
	document.querySelector("#choose").style.display = "none"
	document.querySelector("#starting").style.display = "none"

	const names = data.names
	const secrets = data.secrets
	const issuers = data.issuers

	// Load storage
	const /** @type{LibStorage} */ storage = dev ? JSON.parse(localStorage.getItem("dev_storage")) : JSON.parse(localStorage.getItem("storage"))

	storage.issuers = issuers

	// Save storage
	dev ? localStorage.setItem("dev_storage", JSON.stringify(storage)) : localStorage.setItem("storage", JSON.stringify(storage))

	const generate = () => {
		for (let i = 0; i < names.length; i++) {
			// create div
			const element = document.createElement("div")

			if (codes_description === false) {
				element.innerHTML = `					
					<div id="codes${i}" class="lg:w-2/3 md:w-11/12 3xl:w-2/4 bg-gray-800 mt-10 mb-10 rounded-2xl mx-auto flex flex-col">
					<div class="flex flex-row py-6 justify-center items-center px-10">
						<div class="flex flex-1 justify-start">
							<h3 id="name${i}" tabindex="0" class="text-3xl font-normal mt-3">${lang.text.name}</h3>
						</div>
						<div class="flex flex-1 justify-center">
							<p id="code${i}" tabindex="0" class="bg-gray-600 px-5 py-3 rounded-2xl text-2xl relative -top-[6px] select-all" id="code${i}">${lang.text.code}</p>
						</div>
						<div class="flex flex-1 justify-end">
							<h3 id="time${i}" tabindex="0" class="text-3xl font-normal mt-3">${lang.text.time}</h3>
						</div>
					</div>
					<div class="flex flex-col justify-center items-center -mt-5">
						<div class="progress">
						<div id="progress${i}" class="progressFill"></div>
					</div>
					<div class="flex flex-col justify-center items-center pt-6">
						<button onclick="copyCode(${i})" id="copy${i}" class="buttoni w-[180px] mb-7">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
							</svg>
							${lang.button.copy}
						</button>
					</div>
					</div>
					`
			} else {
				element.innerHTML = `					
					<div id="codes${i}" class="lg:w-2/3 md:w-11/12 3xl:w-2/4 bg-gray-800 mt-10 mb-10 rounded-2xl mx-auto flex flex-col">
					<div class="flex flex-row py-6 justify-center items-center px-10">
						<div class="flex flex-1 justify-start">
							<h3 id="name${i}" tabindex="0" class="text-3xl font-normal mt-3">${lang.text.name}</h3>
						</div>
						<div class="flex flex-1 justify-center">
							<p id="code${i}" tabindex="0" class="bg-gray-600 px-5 py-3 rounded-2xl text-2xl relative -top-[6px] select-all" id="code${i}">${lang.text.code}</p>
						</div>
						<div class="flex flex-1 justify-end">
							<h3 id="time${i}" tabindex="0" class="text-3xl font-normal mt-3">${lang.text.time}</h3>
						</div>
					</div>
					<div class="flex flex-col justify-center items-center -mt-5">
						<div class="progress">
						<div id="progress${i}" class="progressFill"></div>
					</div>
					<p tabindex="0" class="text-2xl bg-gray-600 px-5 py-3 rounded-2xl select-all mt-6" id="description${i}">Description</p>
					<div class="flex flex-col justify-center items-center pt-6">
						<button onclick="copyCode(${i})" id="copy${i}" class="buttoni w-[170px] mb-7">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
							</svg>
							${lang.button.copy}
						</button>
					</div>
					</div>
				`
			}

			// set div in html
			document.querySelector(".content").appendChild(element)

			// remove margin from first element
			if (i === 0) {
				element.style.marginTop = "-24px"
			}

			// add padding to last element
			if (i == names.length - 1) {
				element.style.paddingBottom = "8px"
			}

			// elements
			const name = document.querySelector(`#name${i}`)
			const code = document.querySelector(`#code${i}`)
			const time = document.querySelector(`#time${i}`)
			const description = document.querySelector(`#description${i}`)
			const progress = document.querySelector(`#progress${i}`)

			// add to query
			query.push(`${issuers[i].toLowerCase().trim()} ${names[i].toLowerCase().trim()}`)
			name_query.push(issuers[i].toLowerCase().trim())
			description_query.push(names[i].toLowerCase().trim())

			// setting elements
			if (codes_description === true) {
				description.textContent = names[i]
			}

			// generate token
			const token = speakeasy.totp({
				secret: secrets[i],
				encoding: "base32",
			})

			// remaining time
			const remaining_time = 30 - Math.floor((new Date(Date.now()).getTime() / 1000.0) % 30)

			// progress bar
			const value = remaining_time * (100 / 30)
			progress.style.width = `${value}%`

			// set content
			name.textContent = issuers[i]
			code.textContent = token
			time.textContent = remaining_time.toString()
		}
	}

	generate()

	setInterval(() => {
		try {
			refreshCodes(secrets)
		} catch (error) {
			logger.error("Error refreshing codes")
		}
	}, 500)

	if (settings.settings.integrations === true) {
		const http = require("http")

		/**
		 * Handle requests
		 * @type {http.RequestListener}
		 */
		const requestListener = (req, res) => {
			const headers = {
				"Access-Control-Allow-Origin": "*",
			}

			/** @type{LibStorage} */ const storage = dev ? JSON.parse(localStorage.getItem("dev_storage")) : JSON.parse(localStorage.getItem("storage"))

			const key = storage.apiKey
			const url = req.url
			let param = req.url.split("apiKey=")[1]

			if (param !== undefined) {
				param = aes.hash(param)
			}

			if (url.startsWith("/codes") && param === key) {
				res.writeHead(200, headers)
				res.end(JSON.stringify({ names, secrets, issuers }))
			} else {
				res.writeHead(403, headers)
				res.end(JSON.stringify({ message: "403 - Access denied" }))
			}
		}

		const server = http.createServer(requestListener)

		server.listen(1010, () => {
			logger.log("Server started")
		})
	}

	// latest search from history
	const latest_search = settings.search_history.latest

	if (latest_search !== null && latest_search.trim() !== "" && search_history === true) {
		document.querySelector("#search").value = settings.search_history.latest

		setTimeout(() => {
			search()
		}, 100)
	}

	// prev
	if (saved_codes === false) {
		document.querySelector("#save").style.display = "block"
	}
}

/**
 * Refresh codes every 500ms
 * @param {string[]} secrets
 */
const refreshCodes = (secrets) => {
	for (let i = 0; i < secrets.length; i++) {
		const code = document.querySelector(`#code${i}`)
		const time = document.querySelector(`#time${i}`)
		const progress = document.querySelector(`#progress${i}`)

		// generate token
		const token = speakeasy.totp({
			secret: secrets[i],
			encoding: "base32",
		})

		// generate time
		const remaining = 30 - Math.floor((new Date(Date.now()).getTime() / 1000.0) % 30)

		// progress bar
		const value = remaining * (100 / 30)
		progress.style.width = `${value}%`

		// set content
		code.textContent = token
		time.textContent = remaining.toString()
	}
}

/**
 * Copy 2FA code
 * @param {number} id
 */
const copyCode = (id) => {
	const button = document.querySelector(`#copy${id}`)
	const code = document.querySelector(`#code${id}`)

	// copy code
	navigator.clipboard.writeText(code.textContent)

	// copied button
	button.innerHTML = `
	<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
	</svg>
	${lang.button.copied}
	`

	// copy button
	setTimeout(() => {
		button.innerHTML = `
		<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
		</svg>
		${lang.button.copy}
		`

		// reset search bar
		setTimeout(() => {
			if (reset_after_copy === true) {
				for (let i = 0; i < query.length; i++) {
					const div = document.querySelector(`#codes${[i]}`)
					div.style.display = "grid"
				}

				document.querySelector("#search").value = ""
				document.getElementById("search").focus()
			}
		}, 1200)
	}, 1000)
}

/**
 * Search codes
 */
const search = () => {
	const search = document.querySelector("#search")
	const input = search.value.toLowerCase()
	let i = 0
	let no_results = 0

	// save result
	if (search_history === true) {
		settings.search_history.latest = input
		fs.writeFileSync(path.join(folder_path, "settings", "settings.json"), JSON.stringify(settings, null, "\t"))
	}

	// restart
	for (let i = 0; i < name_query.length; i++) {
		const div = document.querySelector(`#codes${[i]}`)
		div.style.display = "grid"
	}

	// remove no results div
	try {
		document.querySelector("#noResult").remove()
	} catch (error) {}

	// search algorithm
	name_query.forEach((result) => {
		if (settings.settings.search_filter.name === true && settings.settings.search_filter.description === false) {
			if (!result.startsWith(input)) {
				const div = document.querySelector(`#codes${[i]}`)
				div.style.display = "none"

				if (div.style.display === "none") {
					no_results++
				}
			}
		} else if (settings.settings.search_filter.description === true && settings.settings.search_filter.name === false) {
			if (!description_query[i].startsWith(input)) {
				const div = document.querySelector(`#codes${[i]}`)
				div.style.display = "none"

				if (div.style.display === "none") {
					no_results++
				}
			}
		} else {
			if (!query[i].includes(input)) {
				const div = document.querySelector(`#codes${[i]}`)
				div.style.display = "none"

				if (div.style.display === "none") {
					no_results++
				}
			}
		}

		i++
	})

	// display no results
	if (name_query.length === no_results) {
		const element = document.createElement("div")

		element.innerHTML = `
		<div class="flex justify-center">
		<div class="mx-auto rounded-2xl bg-gray-800 mb-8 w-2/3">
		<h3 class="pt-3">${lang.application_text.no_results}</h3>
		<h4 id="searchResult"></h4>
		</div>
		</div>
		`

		element.setAttribute("id", "noResult")
		document.querySelector(".content").appendChild(element)

		document.querySelector("#searchResult").textContent = `${lang.application_text.not_found_results} "${document.querySelector("#search").value}".`
	}

	// if search empty
	if (search.value == "") {
		for (let i = 0; i < name_query.length; i++) {
			const div = document.querySelector(`#codes${[i]}`)
			div.style.display = "grid"
		}
	}
}

/**
 * Focus searchbar
 */
const focusSearch = () => {
	setTimeout(() => {
		document.getElementById("search").focus()
	}, 150)
}

/**
 * Show manual update popup
 */
const showUpdate = () => {
	document.querySelector(".update").style.display = "block"
}

/**
 * Show info popup
 */
const showInfo = () => {
	return "Removed"
}

/**
 * Save imported codes to disk
 */
const saveCodes = async () => {
	ipc.send("reloadSettingsWindow")

	let password
	let key

	if (settings.security.require_password === true) {
		password = Buffer.from(await ipc.invoke("requestPassword"))
		key = Buffer.from(aes.generateKey(password, Buffer.from(settings.security.key, "base64")))
	} else {
		const /** @type{LibStorage} */ storage = dev ? JSON.parse(localStorage.getItem("dev_storage")) : JSON.parse(localStorage.getItem("storage"))

		password = Buffer.from(storage.password, "base64")
		key = Buffer.from(aes.generateKey(password, Buffer.from(storage.key, "base64")))
	}

	const encrypted = aes.encrypt(save_text, key)

	/**
	 * Save codes
	 * @type{LibAuthmeFile}
	 * */
	const codes = {
		role: "codes",
		encrypted: true,
		codes: encrypted.toString("base64"),
		date: time.timestamp(),
		version: 3,
	}

	fs.writeFileSync(path.join(folder_path, "codes", "codes.authme"), JSON.stringify(codes, null, "\t"))

	document.querySelector("#save").style.display = "none"

	dialog.showMessageBox({
		title: "Authme",
		buttons: [lang.button.close],
		defaultId: 0,
		cancelId: 0,
		noLink: true,
		type: "info",
		message: lang.application_dialog.codes_saved,
	})

	password.fill(0)
	key.fill(0)
}

/**
 * Load saved codes from disk
 */
const loadCodes = async () => {
	let password
	let key

	if (settings.security.require_password === true) {
		password = Buffer.from(await ipc.invoke("requestPassword"))
		key = Buffer.from(aes.generateKey(password, Buffer.from(settings.security.key, "base64")))
	} else {
		const /** @type{LibStorage} */ storage = dev ? JSON.parse(localStorage.getItem("dev_storage")) : JSON.parse(localStorage.getItem("storage"))

		password = Buffer.from(storage.password, "base64")
		key = Buffer.from(aes.generateKey(password, Buffer.from(storage.key, "base64")))
	}

	fs.readFile(path.join(folder_path, "codes", "codes.authme"), async (err, content) => {
		if (err) {
			logger.warn("The file codes.authme don't exists")

			password.fill(0)
			key.fill(0)
		} else {
			const codes_file = JSON.parse(content.toString())

			if (codes_file.version === 3) {
				const decrypted = aes.decrypt(Buffer.from(codes_file.codes, "base64"), key)

				saved_codes = true

				processData(decrypted.toString())

				decrypted.fill(0)
				password.fill(0)
				key.fill(0)
			} else {
				const result = await dialog.showMessageBox({
					title: "Authme",
					buttons: [lang.button.close, lang.application_dialog.guide],
					defaultId: 0,
					cancelId: 0,
					type: "error",
					noLink: true,
					message: "The saved codes are only compatible with Authme 2. \n\nPlease read the migration guide!",
				})

				if (result.response === 1) {
					shell.openExternal("https://docs.authme.levminer.com/migration")
				}
			}
		}
	})
}

if (settings.security.require_password === false) {
	loadCodes()
}

/**
 * Dropdown
 */
let dropdown_state = false

const dropdown = () => {
	const dropdown_content = document.querySelector("#dropdownContent0")

	if (dropdown_state === false) {
		dropdown_content.style.visibility = "visible"

		setTimeout(() => {
			dropdown_content.style.display = "block"
		}, 10)

		dropdown_state = true
	} else {
		dropdown_content.style.display = ""

		dropdown_state = false
	}
}

document.querySelector("#checkbox0").checked = settings.settings.search_filter.name
document.querySelector("#checkbox1").checked = settings.settings.search_filter.description

document.querySelector("#checkbox0").addEventListener("click", () => {
	if (settings.settings.search_filter.name === true) {
		settings.settings.search_filter.name = false
	} else {
		settings.settings.search_filter.name = true
	}

	fs.writeFileSync(path.join(folder_path, "settings", "settings.json"), JSON.stringify(settings, null, "\t"))

	setTimeout(() => {
		search()
	}, 100)
})

document.querySelector("#checkbox1").addEventListener("click", () => {
	if (settings.settings.search_filter.description === true) {
		settings.settings.search_filter.description = false
	} else {
		settings.settings.search_filter.description = true
	}

	fs.writeFileSync(path.join(folder_path, "settings", "settings.json"), JSON.stringify(settings, null, "\t"))

	setTimeout(() => {
		search()
	}, 100)
})

/**
 * Build number
 */
const buildNumber = async () => {
	const info = await ipc.invoke("info")

	if (info.build_number.startsWith("alpha")) {
		document.querySelector(".build-content").textContent = `You are running an alpha version of Authme - Version ${info.authme_version} - Build ${info.build_number}`
		document.querySelector(".build").style.display = "block"
	} else if (info.build_number.startsWith("beta")) {
		document.querySelector(".build-content").textContent = `You are running a beta version of Authme - Version ${info.authme_version} - Build ${info.build_number}`
		document.querySelector(".build").style.display = "block"
	}
}

buildNumber()

/**
 * Buttons
 */
const rateAuthme = () => {
	ipc.send("rateAuthme")
}

const starAuthme = () => {
	ipc.send("starAuthme")
}

const provideFeedback = () => {
	ipc.send("provideFeedback")
}

const importPage = () => {
	ipc.invoke("toggleImportWindow")
}

const settingsPage = () => {
	ipc.send("toggleSettings")
}

const support = () => {
	ipc.send("support")
}

const help = () => {
	shell.openExternal("https://docs.authme.levminer.com/#/import")
}

const sampleFile = () => {
	shell.openExternal("https://github.com/Levminer/authme/blob/dev/samples/authme/authme_import_sample.zip?raw=true")
}

/**
 * Dismiss dialog of clicking outside of it
 */
window.addEventListener("click", (event) => {
	const dropdown_content = document.querySelector("#dropdownContent0")
	const filter = document.querySelector("#filterIcon")
	const filter_path = document.querySelector("#filterPath")
	const checkbox0 = document.querySelector("#checkbox0")
	const checkbox1 = document.querySelector("#checkbox1")
	const link0 = document.querySelector("#link0")
	const link1 = document.querySelector("#link1")

	if (event.target != filter && event.target != filter_path && event.target != checkbox0 && event.target != checkbox1 && event.target != link0 && event.target != link1) {
		dropdown_content.style.display = ""

		dropdown_state = false
	}
})

/**
 * Download manual update
 */
const manualUpdate = () => {
	shell.openExternal("https://authme.levminer.com/#downloads")
}

/**
 * Display auto update download info
 */
ipc.on("updateInfo", (event, info) => {
	document.querySelector("#updateText").textContent = `${lang.popup.downloading_update} ${info.download_percent}% - ${info.download_speed}MB/s (${info.download_transferred}MB/${info.download_total}MB)`
})

/**
 * Display auto update popup if update available
 */
const updateAvailable = () => {
	document.querySelector(".autoupdate").style.display = "block"
}

/**
 * Display restart button if download finished
 */
const updateDownloaded = () => {
	document.querySelector("#updateText").textContent = lang.popup.update_downloaded
	document.querySelector("#updateButton").style.display = "block"
	document.querySelector("#updateClose").style.display = "block"
}

/**
 * Restart app after the download finished
 */
const updateRestart = () => {
	ipc.send("updateRestart")
}

/* Focus search with ctrl+k */
document.addEventListener("keypress", (event) => {
	if (event.ctrlKey === true && event.code === "KeyK") {
		focusSearch()
	}
})

/* Deprecation notice */
const date = new Date()
const release = new Date("2021-11-08")

if (date > release) {
	document.querySelector(".deprecation").style.display = "block"
	document.querySelector(".deprecationNotice").style.display = "none"
}

const downloadUpdate = () => {
	shell.openExternal("https://authme.levminer.com/#downloads")
}

const releaseNotes = () => {
	shell.openExternal("https://github.com/Levminer/authme/releases/latest")
}

const migrationGuide = () => {
	shell.openExternal("https://github.com/Levminer/authme#migration")
}
