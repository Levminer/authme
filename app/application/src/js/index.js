const { app, shell, dialog, clipboard, Notification } = require("@electron/remote")
const { aes, convert, time, localization } = require("@levminer/lib")
const logger = require("@levminer/lib/logger/renderer")
const { ipcRenderer: ipc } = require("electron")
const speakeasy = require("@levminer/speakeasy")
const path = require("path")
const fs = require("fs")

/**
 * Send error to main process
 */
window.onerror = (error) => {
	ipc.send("rendererError", { renderer: "application", error: error })
}

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
const settings_refresher = setInterval(() => {
	settings = JSON.parse(fs.readFileSync(path.join(folder_path, "settings", "settings.json"), "utf-8"))

	if (settings.security.require_password !== null || settings.security.password !== null) {
		clearInterval(settings_refresher)

		logger.log("Settings refresh completed")
	}
}, 100)

/**
 * Show quick start div
 */
if (!fs.existsSync(path.join(folder_path, "codes", "codes.authme"))) {
	document.querySelector("#starting").style.display = "block"
	document.querySelector("#choose").style.display = "block"
}

// eslint-disable-next-line
let prev = false
let text
let save_text
const query = []
const description_query = []
const name_query = []

const description_state = settings.settings.codes_description
const copy_state = settings.settings.reset_after_copy
const blur_state = settings.settings.blur_codes
const search_state = settings.settings.search_history
const sort_number = settings.settings.sort

/**
 * Load file first time from dialog
 */
const loadFile = () => {
	dialog
		.showOpenDialog({
			title: lang.application_dialog.choose_import_file,
			properties: ["openFile"],
			filters: [{ name: lang.application_dialog.authme_file, extensions: ["authme"] }],
		})
		.then((result) => {
			canceled = result.canceled
			filepath = result.filePaths

			if (canceled === false) {
				const /** @type{LibAuthmeFile} */ loaded = JSON.parse(fs.readFileSync(filepath.toString(), "utf-8"))

				if (loaded.role === "import" || loaded.role === "export") {
					text = Buffer.from(loaded.codes, "base64").toString()
					save_text = text

					processdata(text)
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
 * Process data from saved source
 * @param {String} text
 */
const processdata = (text) => {
	const data = convert.fromText(text, sort_number)

	go(data)
}

/**
 * Start creating 2FA elements
 * @param {LibImportFile} data
 */
const go = (data) => {
	document.querySelector("#search").style.display = "grid"
	document.querySelector(".h1").style.marginBottom = "0px"
	document.querySelector(".content").style.top = "80px"
	document.querySelector("#choose").style.display = "none"
	document.querySelector("#starting").style.display = "none"
	document.querySelector("#searchIcon").style.display = "inline-block"
	document.querySelector("#filterIcon").style.display = "inline-block"

	const names = data.names
	const secrets = data.secrets
	const issuers = data.issuers

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

	const generate = () => {
		// counter
		let counter = 0

		for (let i = 0; i < names.length; i++) {
			// create div
			const element = document.createElement("div")

			// set div elements
			if (blur_state === true && description_state === true) {
				element.innerHTML = `
					<div id="codes${counter}" class="lg:w-2/3 md:w-11/12 bg-gray-800 mt-10 mb-10 pb-2 rounded-2xl mx-auto flex flex-col">
					<div class="flex flex-row justify-center items-center">
						<div class="flex flex-col flex-1 justify-center items-center">
							<h3>${lang.text.name}</h3>
							<h2 id="name${counter}" tabindex="0" class="text-2xl font-normal mt-3">${lang.text.name}</h2>
						</div>
						<div class="flex flex-col flex-1 justify-center items-center">
							<h3 class="relative -top-1">${lang.text.code}</h3>
							<p id="code${counter}" tabindex="0" class="input w-[126px] text-xl relative -top-2.5 select-all filter blur-sm hover:blur-0" id="code${counter}">${lang.text.code}</p>
						</div>
						<div class="flex flex-col flex-1 justify-center items-center">
							<h3>${lang.text.time}</h3>
							<h2 id="time${counter}" class="text-center text-2xl font-normal mt-3">${lang.text.time}</h2>
						</div>
					</div>
					<div class="flex flex-col justify-center items-center">
						<p tabindex="0" class="text-2xl bg-gray-700 px-3 py-1.5 rounded-2xl select-all mb-3" id="text${counter}">Description</p>
						<button onclick="copyCode(${i})" id="copy${counter}" class="buttoni w-[194px] mb-4">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
							</svg>
							${lang.button.copy}
						</button>
					</div>
					</div>
					`
			} else if (blur_state === true) {
				element.innerHTML = `
					<div id="codes${counter}" class="lg:w-2/3 md:w-11/12 bg-gray-800 mt-10 mb-10 rounded-2xl mx-auto flex flex-col">
					<div class="flex flex-row justify-center items-center">
						<div class="flex flex-col flex-1 justify-center items-center">
							<h3>${lang.text.name}</h3>
							<h2 id="name${counter}" tabindex="0" class="text-2xl font-normal mt-3">${lang.text.name}</h2>
						</div>
						<div class="flex flex-col flex-1 justify-center items-center">
							<h3 class="relative -top-1">${lang.text.code}</h3>
							<p id="code${counter}" tabindex="0" class="input w-[126px] text-xl relative -top-2.5 select-all filter blur-sm hover:blur-0" id="code${counter}">${lang.text.code}</p>
						</div>
						<div class="flex flex-col flex-1 justify-center items-center">
							<h3>${lang.text.time}</h3>
							<h2 id="time${counter}" class="text-center text-2xl font-normal mt-3">${lang.text.time}</h2>
						</div>
					</div>
					<div class="flex flex-col justify-center items-center">
						<button onclick="copyCode(${i})" id="copy${counter}" class="buttoni w-[194px] mb-4">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
							</svg>
							${lang.button.copy}
						</button>
					</div>
					</div>
					`
			} else if (description_state === true) {
				element.innerHTML = `					
					<div id="codes${counter}" class="lg:w-2/3 md:w-11/12 bg-gray-800 mt-10 mb-10 pb-2 rounded-2xl mx-auto flex flex-col">
					<div class="flex flex-row justify-center items-center">
						<div class="flex flex-col flex-1 justify-center items-center">
							<h3>${lang.text.name}</h3>
							<h2 id="name${counter}" tabindex="0" class="text-2xl font-normal mt-3">${lang.text.name}</h2>
						</div>
						<div class="flex flex-col flex-1 justify-center items-center">
							<h3 class="relative -top-1">${lang.text.code}</h3>
							<p id="code${counter}" tabindex="0" class="input w-[126px] text-xl relative -top-2.5 select-all" id="code${counter}">${lang.text.code}</p>
						</div>
						<div class="flex flex-col flex-1 justify-center items-center">
							<h3>${lang.text.time}</h3>
							<h2 id="time${counter}" class="text-center text-2xl font-normal mt-3">${lang.text.time}</h2>
						</div>
					</div>
					<div class="flex flex-col justify-center items-center">
						<p tabindex="0" class="text-2xl bg-gray-700 px-3 py-1.5 rounded-2xl select-all mb-3" id="text${counter}">Description</p>
						<button onclick="copyCode(${i})" id="copy${counter}" class="buttoni w-[194px] mb-4">
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
					<div id="codes${counter}" class="lg:w-2/3 md:w-11/12 bg-gray-800 mt-10 mb-10 rounded-2xl mx-auto flex flex-col">
					<div class="flex flex-row justify-center items-center">
						<div class="flex flex-col flex-1 justify-center items-center">
							<h3>${lang.text.name}</h3>
							<h2 id="name${counter}" tabindex="0" class="text-2xl font-normal mt-3">${lang.text.name}</h2>
						</div>
						<div class="flex flex-col flex-1 justify-center items-center">
							<h3 class="relative -top-1">${lang.text.code}</h3>
							<p id="code${counter}" tabindex="0" class="input w-[126px] text-xl relative -top-2.5 select-all" id="code${counter}">${lang.text.code}</p>
						</div>
						<div class="flex flex-col flex-1 justify-center items-center">
							<h3>${lang.text.time}</h3>
							<h2 id="time${counter}" class="text-center text-2xl font-normal mt-3">${lang.text.time}</h2>
						</div>
					</div>
					<div class="flex flex-col justify-center items-center">
						<button onclick="copyCode(${i})" id="copy${counter}" class="buttoni w-[194px] mb-4">
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

			if (i == names.length - 1) {
				element.style.paddingBottom = "8px"
			}

			// elements
			const name = document.querySelector(`#name${counter}`)
			const code = document.querySelector(`#code${counter}`)
			const time = document.querySelector(`#time${counter}`)
			const text = document.querySelector(`#text${counter}`)

			// add to query
			query.push(`${issuers[i].toLowerCase().trim()} ${names[i].toLowerCase().trim()}`)
			name_query.push(issuers[i].toLowerCase().trim())
			description_query.push(names[i].toLowerCase().trim())

			// setting elements
			if (description_state === true) {
				text.textContent = names[i]
			}

			// generate token
			const token = speakeasy.totp({
				secret: secrets[i],
				encoding: "base32",
			})

			// remaining time
			const remaining_time = 30 - Math.floor((new Date(Date.now()).getTime() / 1000.0) % 30)

			// set content
			name.textContent = issuers[i]
			code.textContent = token
			time.textContent = remaining_time

			if (description_state === true) {
				const grid = document.querySelector(`#codes${i}`)
				grid.style.height = "310px"
			}

			// add one to counter
			counter++
		}
	}

	generate()

	setInterval(() => {
		refreshCodes(secrets)
	}, 500)

	// search history
	const search_history = settings.search_history.latest

	if (search_history !== null && search_history !== "" && search_state === true) {
		document.querySelector("#search").value = settings.search_history.latest

		setTimeout(() => {
			search()
		}, 100)
	}

	// set block count
	for (let i = 0; i < names.length; i++) {
		const block = document.querySelector(`#codes${i}`)
		block.style.display = "grid"
	}

	// prev
	if (prev === false) {
		document.querySelector("#input").style.display = "none"
		document.querySelector("#save").style.display = "block"
	} else {
		document.querySelector("#input").style.display = "none"
		document.querySelector("#search").style.display = "grid"
	}
}

/**
 * Refresh codes every 500ms
 * @param {number} secrets
 */
const refreshCodes = (secrets) => {
	for (let i = 0; i < secrets.length; i++) {
		const code = document.querySelector(`#code${i}`)
		const time = document.querySelector(`#time${i}`)

		// generate token
		const token = speakeasy.totp({
			secret: secrets[i],
			encoding: "base32",
		})

		// generate time
		const remaining = 30 - Math.floor((new Date(Date.now()).getTime() / 1000.0) % 30)

		// set content
		code.textContent = token
		time.textContent = remaining
	}
}

/**
 * Copy 2FA code
 * @param {Number} id
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
			if (copy_state === true) {
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
	if (search_state === true) {
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
	document.querySelector(".info").style.display = "block"
}

/**
 * Save imported codes to disk
 */
const saveCodes = () => {
	let password
	let key

	if (settings.security.require_password === true) {
		password = Buffer.from(ipc.sendSync("request_password"))
		key = Buffer.from(aes.generateKey(password, Buffer.from(settings.security.key, "base64")))
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
const loadCodes = () => {
	let password
	let key

	if (settings.security.require_password === true) {
		password = Buffer.from(ipc.sendSync("request_password"))
		key = Buffer.from(aes.generateKey(password, Buffer.from(settings.security.key, "base64")))
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

	fs.readFile(path.join(folder_path, "codes", "codes.authme"), (err, content) => {
		if (err) {
			logger.warn("The file codes.authme don't exists")

			password.fill(0)
			key.fill(0)
		} else {
			const codes_file = JSON.parse(content)

			if (codes_file.version === 3) {
				const decrypted = aes.decrypt(Buffer.from(codes_file.codes, "base64"), key)

				prev = true

				processdata(decrypted.toString())

				decrypted.fill(0)
				password.fill(0)
				key.fill(0)
			} else {
				dialog
					.showMessageBox({
						title: "Authme",
						buttons: [lang.button.close, lang.application_dialog.guide],
						defaultId: 0,
						cancelId: 0,
						type: "error",
						noLink: true,
						message: "The saved codes are only compatible with Authme 2. \n\nPlease read the migration guide!",
					})
					.then((result) => {
						if (result.response === 1) {
							shell.openExternal("https://docs.authme.levminer.com/migration")
						}
					})
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
 * Quick copy shortcuts
 * @param {string} key
 */
const quickCopy = (key) => {
	for (let i = 0; i < name_query.length; i++) {
		if (key.toLowerCase() === name_query[i]) {
			const input = document.querySelector(`#code${[i]}`).textContent
			const time = document.querySelector(`#time${[i]}`).textContent

			clipboard.writeText(input)

			const notification = new Notification({ title: "Authme", body: `${key} 2FA code copied to the clipboard (${time}s remaining).` })

			notification.show()

			setTimeout(() => {
				notification.close()
			}, 3000)
		}
	}
}

/**
 * Get app information
 */
const res = ipc.sendSync("info")

/**
 * Show build number if version is pre release
 */
if (res.build_number.startsWith("alpha")) {
	document.querySelector(".build-content").textContent = `You are running an alpha version of Authme - Version ${res.authme_version} - Build ${res.build_number}`
	document.querySelector(".build").style.display = "block"
} else if (res.build_number.startsWith("beta")) {
	document.querySelector(".build-content").textContent = `You are running a beta version of Authme - Version ${res.authme_version} - Build ${res.build_number}`
	document.querySelector(".build").style.display = "block"
}

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

const createFile = () => {
	ipc.send("toggleImport")
}

const configureSettings = () => {
	ipc.send("toggleSettings")
}

const supportDevelopment = () => {
	ipc.send("support")
}

const readDocs = () => {
	shell.openExternal("https://docs.authme.levminer.com/#/import")
}

const sampleImport = () => {
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
 * Display release notes
 */
const releaseNotes = () => {
	ipc.send("releaseNotes")
}

/**
 * Download manual update
 */
const manualUpdate = () => {
	ipc.send("manualUpdate")
}

/**
 * Display auto update download info
 */
ipc.on("updateInfo", (event, info) => {
	document.querySelector("#updateText").textContent = `Downloading update: ${info.download_percent}% - ${info.download_speed}MB/s (${info.download_transferred}MB/${info.download_total}MB)`
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
	document.querySelector("#updateText").textContent = "Successfully downloaded update! Please restart the app, Authme will install the updates in the background and restart automatically."
	document.querySelector("#updateButton").style.display = "block"
	document.querySelector("#updateClose").style.display = "block"
}

/**
 * Restart app after the download finished
 */
const updateRestart = () => {
	ipc.send("updateRestart")
}

/* info bar */
const random = Math.floor(Math.random() * 1)

const infoBar = () => {
	const { opens } = ipc.sendSync("statistics")
	const bar = document.querySelector(".bar")
	const bar_link = document.querySelector(".barLink")
	const info_bar = document.querySelector(".infoBar")

	if (opens % 3 === 0) {
		switch (random) {
			case 0:
				info_bar.style.display = "flex"
				break

			default:
				info_bar.style.display = "flex"
				break
		}
	}
}

infoBar()

const barLink = () => {
	switch (random) {
		case 0:
			provideFeedback()
			break

		default:
			provideFeedback()
			break
	}
}
