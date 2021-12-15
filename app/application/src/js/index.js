const { app, shell, dialog, clipboard, Notification } = require("@electron/remote")
const logger = require("@levminer/lib/logger/renderer")
const { aes, convert, time } = require("@levminer/lib")
const speakeasy = require("@levminer/speakeasy")
const fs = require("fs")
const path = require("path")
const electron = require("electron")
const ipc = electron.ipcRenderer
const dns = require("dns")

// ? error in window
window.onerror = (error) => {
	ipc.send("rendererError", { renderer: "application", error: error })
}

// ? logger
logger.getWindow("application")

// ? if development
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

// ? show quick start
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
let clear

const name_state = settings.settings.show_2fa_names
const copy_state = settings.settings.reset_after_copy
const reveal_state = settings.settings.click_to_reveal
const search_state = settings.settings.save_search_results

const sort_number = settings.experimental.sort

/**
 * Load file first time from dialog
 */
const loadFile = () => {
	dialog
		.showOpenDialog({
			title: "Import from Authme import file",
			properties: ["openFile"],
			filters: [{ name: "Authme file", extensions: ["authme"] }],
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
			if (reveal_state === true && name_state === true) {
				if (i < 2) {
					element.innerHTML = `
					<div class="grid diva${i}" id="grid${counter}">
					<div class="div1">
					<h3>Name</h3>
					<p tabindex="0" class="text2 mt-11" id="name${counter}">Name</p>
					</div>
					<div class="div2">
					<h3>Code</h3>
					<p tabindex="0" class="input w-[126px] m-0 text-xl -top-1.5 relative select-all filter blur-sm hover:blur-0" id="code${counter}">Code</p>
					</div>
					<div class="div3">
					<h3>Time</h3>
					<p tabindex="0" class="text2 mt-11" id="time${counter}">Time</p>
					</div>
					<div class="div4">
					<p tabindex="0" class="text3 name" id="text${counter}">Description</p>
					<button onclick="copyCode(${i})" class="buttoni w-[194px] -mt-1" id="copy${counter}">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
					</svg>
					Copy
					</button>
					</div>
					</div>
					`
				} else {
					element.innerHTML = `
					<div data-scroll class="grid" id="grid${counter}">
					<div class="div1">
					<h3>Name</h3>
					<p tabindex="0" class="text2 mt-11" id="name${counter}">Name</p>
					</div>
					<div class="div2">
					<h3>Code</h3>
					<p tabindex="0" class="input w-[126px] m-0 text-xl -top-1.5 relative select-all filter blur-sm hover:blur-0" id="code${counter}">Code</p>
					</div>
					<div class="div3">
					<h3>Time</h3>
					<p tabindex="0" class="text2 mt-11" id="time${counter}">Time</p>
					</div>
					<div class="div4">
					<p tabindex="0" class="text3 name" id="text${counter}">Description</p>
					<button onclick="copyCode(${i})" class="buttoni w-[194px] -mt-1" id="copy${counter}">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
					</svg>
					Copy
					</button>
					</div>
					</div>
					`
				}
			} else if (reveal_state === true) {
				if (i < 2) {
					element.innerHTML = `
					<div class="grid diva${i}" id="grid${counter}">
					<div class="div1">
					<h3>Name</h3>
					<p tabindex="0" class="text2 mt-11" id="name${counter}">Name</p>
					</div>
					<div class="div2">
					<h3>Code</h3>
					<p tabindex="0" class="input w-[126px] m-0 text-xl -top-1.5 relative select-all filter blur-sm hover:blur-0" id="code${counter}">Code</p>
					</div>
					<div class="div3">
					<h3>Time</h3>
					<p tabindex="0" class="text2 mt-11" id="time${counter}">Time</p>
					</div>
					<div class="div4">
					<button onclick="copyCode(${i})" class="buttoni w-[194px] -mt-3" id="copy${counter}">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
					</svg>
					Copy
					</button>
					</div>
					</div>
					`
				} else {
					element.innerHTML = `
					<div data-scroll class="grid" id="grid${counter}">
					<div class="div1">
					<h3>Name</h3>
					<p tabindex="0" class="text2 mt-11" id="name${counter}">Code</p>
					</div>
					<div class="div2">
					<h3>Code</h3>
					<p tabindex="0" class="input w-[126px] m-0 text-xl -top-1.5 relative select-all filter blur-sm hover:blur-0" id="code${counter}">Code</p>
					</div>
					<div class="div3">
					<h3>Time</h3>
					<p tabindex="0" class="text2 mt-11" id="time${counter}">Time</p>
					</div>
					<div class="div4">
					<button onclick="copyCode(${i})" class="buttoni w-[194px] -mt-3" id="copy${counter}">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
					</svg>
					Copy
					</button>
					</div>
					</div>
					`
				}
			} else if (name_state === true) {
				if (i < 2) {
					element.innerHTML = `
					<div class="grid diva${i}" id="grid${counter}">
					<div class="div1">
					<h3>Name</h3>
					<p tabindex="0" class="text2 mt-11" id="name${counter}">Name</p>
					</div>
					<div class="div2">
					<h3>Code</h3>
					<p tabindex="0" class="input w-[126px] m-0 text-xl -top-1.5 relative select-all" id="code${counter}">Code</p>
					</div>
					<div class="div3">
					<h3>Time</h3>
					<p tabindex="0" class="text2 mt-11" id="time${counter}">Time</p>
					</div>
					<div class="div4">
					<p tabindex="0" class="text3 name" id="text${counter}">Description</p>
					<button onclick="copyCode(${i})" class="buttoni w-[194px] -mt-1" id="copy${counter}">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
					</svg>
					Copy
					</button>
					</div>
					</div>
					`
				} else {
					element.innerHTML = `
					<div data-scroll class="grid" id="grid${counter}">
					<div class="div1">
					<h3>Name</h3>
					<p tabindex="0" class="text2 mt-11" id="name${counter}">Name</p>
					</div>
					<div class="div2">
					<h3>Code</h3>
					<p tabindex="0" class="input w-[126px] m-0 text-xl -top-1.5 relative select-all" id="code${counter}">Code</p>
					</div>
					<div class="div3">
					<h3>Time</h3>
					<p tabindex="0" class="text2 mt-11" id="time${counter}">Time</p>
					</div>
					<div class="div4">
					<p tabindex="0" class="text3 name" id="text${counter}">Description</p>
					<button onclick="copyCode(${i})" class="buttoni w-[194px] -mt-1" id="copy${counter}">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
					</svg>
					Copy
					</button>
					</div>
					</div>
					`
				}
			} else {
				if (i < 2) {
					element.innerHTML = `
					<div class="grid diva${i}" id="grid${counter}">
					<div class="div1">
					<h3>Name</h3>
					<p tabindex="0" class="text2 mt-11" id="name${counter}">Code</p>
					</div>
					<div class="div2">
					<h3>Code</h3>
					<p tabindex="0" class="input w-[126px] m-0 text-xl -top-1.5 relative select-all" id="code${counter}">Code</p>
					</div>
					<div class="div3">
					<h3>Time</h3>
					<p tabindex="0" class="text2 mt-11" id="time${counter}">Time</p>
					</div>
					<div class="div4">
					<button onclick="copyCode(${i})" class="buttoni w-[194px] -mt-3" id="copy${counter}">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
					</svg>
					Copy
					</button>
					</div>
					</div>
					`
				} else {
					element.innerHTML = `
					<div data-scroll class="grid" id="grid${counter}">
					<div class="div1">
					<h3>Name</h3>
					<p tabindex="0" class="text2 mt-11" id="name${counter}">Name</p>
					</div>
					<div class="div2">
					<h3>Code</h3>
					<p tabindex="0" class="input w-[126px] m-0 text-xl -top-1.5 relative select-all" id="code${counter}">Code</p>
					</div>
					<div class="div3">
					<h3>Time</h3>
					<p tabindex="0" class="text2 mt-11" id="time${counter}">Time</p>
					</div>
					<div class="div4">
					<button class="buttoni w-[194px] -mt-3" id="copy${counter}">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
					</svg>
					Copy
					</button>
					</div>
					</div>
					`
				}
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
			const copy = document.querySelector(`#copy${counter}`)

			// add to query
			query.push(`${issuers[i].toLowerCase().trim()} ${names[i].toLowerCase().trim()}`)
			name_query.push(issuers[i].toLowerCase().trim())
			description_query.push(names[i].toLowerCase().trim())

			// setting elements
			if (name_state === true) {
				text.textContent = names[i]
			}

			// generate token
			const token = speakeasy.totp({
				secret: secrets[i],
				encoding: "base32",
			})

			// time
			const remaining = 30 - Math.floor((new Date(Date.now()).getTime() / 1000.0) % 30)

			// set content
			name.textContent = issuers[i]
			code.textContent = token
			time.textContent = remaining

			if (name_state === true) {
				const grid = document.querySelector(`#grid${i}`)
				grid.style.height = "310px"
			}

			// add one to counter
			counter++
		}

		clear = true
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
		const block = document.querySelector(`#grid${i}`)
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
 * @param {Number} secrets
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
				Copied
				`

	// copy button
	setTimeout(() => {
		button.innerHTML = `
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
					</svg>
					Copy
					`

		// reset search bar
		setTimeout(() => {
			if (copy_state === true) {
				for (let i = 0; i < names.length; i++) {
					const div = document.querySelector(`#grid${[i]}`)
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
		const div = document.querySelector(`#grid${[i]}`)
		div.style.display = "grid"
	}

	// remove no results div
	try {
		document.querySelector("#noResult").remove()
	} catch (error) {}

	// search algorithm
	name_query.forEach((result) => {
		if (settings.settings.search_bar_filter.name === true && settings.settings.search_bar_filter.description === false) {
			if (!result.startsWith(input)) {
				const div = document.querySelector(`#grid${[i]}`)
				div.style.display = "none"

				if (div.style.display === "none") {
					no_results++
				}
			}
		} else if (settings.settings.search_bar_filter.description === true && settings.settings.search_bar_filter.name === false) {
			if (!description_query[i].startsWith(input)) {
				const div = document.querySelector(`#grid${[i]}`)
				div.style.display = "none"

				if (div.style.display === "none") {
					no_results++
				}
			}
		} else {
			if (!query[i].includes(input)) {
				const div = document.querySelector(`#grid${[i]}`)
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
		<h3 class="pt-3">No results found!</h3>
		<h4>Not found search results for "${document.querySelector("#search").value}".</h4>
		</div>
		</div>
		`

		element.setAttribute("id", "noResult")
		document.querySelector(".content").appendChild(element)
	}

	// if search empty
	if (search.value == "") {
		for (let i = 0; i < name_query.length; i++) {
			const div = document.querySelector(`#grid${[i]}`)
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

// ? show update
const showUpdate = () => {
	document.querySelector(".update").style.display = "block"
}

// ? show info
const showInfo = () => {
	document.querySelector(".info").style.display = "block"
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

			ipc.send("offline")

			logger.warn("Can't connect to the internet")
		} else if (err === null && offline_mode === true && online_closed === false) {
			document.querySelector(".online").style.display = "block"
			document.querySelector(".offline").style.display = "none"

			offline_mode = false
			online_closed = true

			ipc.send("offline")

			logger.warn("Connected to the internet")
		} else if ((online_closed === true || offline_closed === true) && err === null) {
			offline_mode = false
			offline_closed = false
			online_closed = false

			logger.warn("Connection restored")
		}
	})
}

check_for_internet()

setInterval(() => {
	check_for_internet()
}, 5000)

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
		buttons: ["Close"],
		defaultId: 0,
		cancelId: 1,
		type: "info",
		message: "Code(s) saved! \n\nIf you want to add more code(s) or delete code(s) go to Edit codes!",
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
						buttons: ["Close", "Migration guide"],
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

let dropdown_state = false
// ? dropdown
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

document.querySelector("#checkbox0").checked = settings.settings.search_bar_filter.name
document.querySelector("#checkbox1").checked = settings.settings.search_bar_filter.description

// ? dropdown checkboxes
document.querySelector("#checkbox0").addEventListener("click", () => {
	if (settings.settings.search_bar_filter.name === true) {
		settings.settings.search_bar_filter.name = false
	} else {
		settings.settings.search_bar_filter.name = true
	}

	fs.writeFileSync(path.join(folder_path, "settings", "settings.json"), JSON.stringify(settings, null, "\t"))
})

document.querySelector("#checkbox1").addEventListener("click", () => {
	if (settings.settings.search_bar_filter.description === true) {
		settings.settings.search_bar_filter.description = false
	} else {
		settings.settings.search_bar_filter.description = true
	}

	fs.writeFileSync(path.join(folder_path, "settings", "settings.json"), JSON.stringify(settings, null, "\t"))
})

// ? quick copy
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

// ? rate
const rateAuthme = () => {
	ipc.send("rateAuthme")
}

// ? feedback
const provideFeedback = () => {
	ipc.send("provideFeedback")
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

// ? buttons
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
	shell.openExternal("https://github.com/Levminer/authme/blob/main/sample/authme_import_sample.zip?raw=true")
}

// ? dismiss dialog on click outside
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
