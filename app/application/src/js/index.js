const { app, shell, dialog, clipboard, Notification } = require("@electron/remote")
const logger = require("@levminer/lib/logger/renderer")
const { aes, convert } = require("@levminer/lib")
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

// ?platform
let folder

// get platform
if (process.platform === "win32") {
	folder = process.env.APPDATA
} else {
	folder = process.env.HOME
}

const file_path = dev ? path.join(folder, "Levminer", "Authme Dev") : path.join(folder, "Levminer", "Authme")

// ? show quick start
if (!fs.existsSync(path.join(file_path, "hash.authme"))) {
	document.querySelector("#starting").style.display = "block"
	document.querySelector("#choose").style.display = "block"
}

// eslint-disable-next-line
let prev = false
let save_text
const query = []
let clear

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

const name_state = file.settings.show_2fa_names
const copy_state = file.settings.reset_after_copy
const reveal_state = file.settings.click_to_reveal
const search_state = file.settings.save_search_results

const sort_number = file.experimental.sort

/**
 * Load file first time from dialog
 */
const loadFile = () => {
	dialog
		.showOpenDialog({
			title: "Import from Authme Import Text file",
			properties: ["openFile"],
			filters: [{ name: "Text file", extensions: ["txt"] }],
		})
		.then((result) => {
			canceled = result.canceled
			filepath = result.filePaths

			if (canceled === false) {
				const text = fs.readFileSync(filepath.toString(), "utf-8")
				save_text = text

				processdata(text)
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
					<p tabindex="0" class="text2 mt-11" id="name${counter}">Code</p>
					</div>
					<div class="div2">
					<h3>Code</h3>
					<p tabindex="0" class="input1" id="code${counter}">Code</p>
					</div>
					<div class="div3">
					<h3>Time</h3>
					<p tabindex="0" class="text2 mt-11" id="time${counter}">Time</p>
					</div>
					<div class="div4">
					<p tabindex="0" class="text3 name" id="text${counter}">Name</p>
					<button class="button11" id="copy${counter}" >
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
					<p tabindex="0" class="input1" id="code${counter}">Code</p>
					</div>
					<div class="div3">
					<h3>Time</h3>
					<p class="text2 mt-11" id="time${counter}">Time</p>
					</div>
					<div class="div4">
					<p tabindex="0" class="text3 name" id="text${counter}">Name</p>
					<button class="button11" id="copy${counter}" >
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
					<p tabindex="0" class="text2 mt-11" id="name${counter}">Code</p>
					</div>
					<div class="div2">
					<h3>Code</h3>
					<p tabindex="0" class="input1" id="code${counter}">Code</p>
					</div>
					<div class="div3">
					<h3>Time</h3>
					<p tabindex="0" class="text2 mt-11" id="time${counter}">Time</p>
					</div>
					<div class="div4">
					<button class="button11" id="copy${counter}" >
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
					<p tabindex="0" class="input1" id="code${counter}">Code</p>
					</div>
					<div class="div3">
					<h3>Time</h3>
					<p tabindex="0" class="text2 mt-11" id="time${counter}">Time</p>
					</div>
					<div class="div4">
					<button class="button11" id="copy${counter}" >
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
					<p tabindex="0" class="text2 mt-11" id="name${counter}">Code</p>
					</div>
					<div class="div2">
					<h3>Code</h3>
					<p tabindex="0" class="input1" id="code${counter}">Code</p>
					</div>
					<div class="div3">
					<h3>Time</h3>
					<p tabindex="0" class="text2 mt-11" id="time${counter}">Time</p>
					</div>
					<div class="div4">
					<p tabindex="0" class="text3 name" id="text${counter}">Name</p>
					<button class="button11" id="copy${counter}" >
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
					<p tabindex="0" class="input1" id="code${counter}">Code</p>
					</div>
					<div class="div3">
					<h3>Time</h3>
					<p tabindex="0" class="text2 mt-11" id="time${counter}">Time</p>
					</div>
					<div class="div4">
					<p tabindex="0" class="text3 name" id="text${counter}">Name</p>
					<button class="button11" id="copy${counter}" >
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
					<p tabindex="0" class="input1" id="code${counter}">Code</p>
					</div>
					<div class="div3">
					<h3>Time</h3>
					<p tabindex="0" class="text2 mt-11" id="time${counter}">Time</p>
					</div>
					<div class="div4">
					<button class="button11" id="copy${counter}" >
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
					<p tabindex="0" class="input1" id="code${counter}">Code</p>
					</div>
					<div class="div3">
					<h3>Time</h3>
					<p tabindex="0" class="text2 mt-11" id="time${counter}">Time</p>
					</div>
					<div class="div4">
					<button class="button11" id="copy${counter}" >
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

			// elements
			const name = document.querySelector(`#name${counter}`)
			const code = document.querySelector(`#code${counter}`)
			const time = document.querySelector(`#time${counter}`)
			const text = document.querySelector(`#text${counter}`)
			const copy = document.querySelector(`#copy${counter}`)

			// add to query
			const item = issuers[i].toLowerCase().trim()
			query.push(item)

			// setting elements
			if (name_state === true) {
				text.textContent = names[i]
			}

			// interval0
			const int0 = setInterval(() => {
				// generate token
				const token = speakeasy.totp({
					secret: secrets[i],
					encoding: "base32",
				})

				// time
				const remaining = 30 - Math.floor((new Date(Date.now()).getTime() / 1000.0) % 30)

				name.textContent = issuers[i]
				code.textContent = token
				time.textContent = remaining
			}, 100)

			// interval1
			const int1 = setInterval(() => {
				// generate token
				const token = speakeasy.totp({
					secret: secrets[i],
					encoding: "base32",
				})

				// time
				const remaining = 30 - Math.floor((new Date(Date.now()).getTime() / 1000.0) % 30)

				// setting elements
				name.textContent = issuers[i]
				code.textContent = token
				time.textContent = remaining

				clearInterval(int0)
			}, 500)

			// copy
			copy.addEventListener("click", () => {
				navigator.clipboard.writeText(code.textContent)

				copy.innerHTML = `
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
			 	 </svg>
				Copied
				`

				setTimeout(() => {
					copy.innerHTML = `
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
					</svg>
					Copy
					`

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
			})

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

	// search history
	const search_history = file.search_history.latest

	if (search_history !== null && search_history !== "" && search_state === true) {
		document.querySelector("#search").value = file.search_history.latest

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

// ? search
const search = () => {
	const search = document.querySelector("#search")
	const input = search.value.toLowerCase()
	let i = 0

	// save result
	if (search_state === true) {
		file.search_history.latest = input
		fs.writeFileSync(path.join(file_path, "settings.json"), JSON.stringify(file, null, 4))
	}

	// restart
	for (let i = 0; i < query.length; i++) {
		const div = document.querySelector(`#grid${[i]}`)
		div.style.display = "grid"
	}

	// search algorithm
	query.forEach((e) => {
		if (!e.startsWith(input)) {
			const div = document.querySelector(`#grid${[i]}`)
			div.style.display = "none"
		}
		i++
	})

	// if search empty
	if (search.value == "") {
		for (let i = 0; i < query.length; i++) {
			const div = document.querySelector(`#grid${[i]}`)
			div.style.display = "grid"
		}
	}
}

// ? block animations
try {
	setTimeout(() => {
		ScrollOut({
			onShown(el) {
				el.classList.add("animate__animated", "animate__zoomIn", "animate__faster")
			},
		})
	}, 500)
} catch (error) {
	logger.error("Block animations failed")
}

// ? animations
let focus = true

let diva0
let diva1

const animations = () => {
	if (focus === true) {
		setTimeout(() => {
			const center = document.querySelector(".content")
			center.classList.add("animate__animated", "animate__fadeIn")

			const h1 = document.querySelector(".h1")
			h1.classList.add("animate__animated", "animate__slideInDown")

			const choose = document.querySelector("#choose")
			choose.classList.add("animate__animated", "animate__slideInDown")

			const starting = document.querySelector("#starting")
			starting.classList.add("animate__animated", "animate__slideInDown")

			const search = document.querySelector("#search")
			search.classList.add("animate__animated", "animate__slideInDown")

			if (clear == true) {
				diva0 = document.querySelector(".diva0")
				diva0.classList.add("animate__animated", "animate__zoomIn")

				diva1 = document.querySelector(".diva1")
				diva1.classList.add("animate__animated", "animate__zoomIn")
			}

			setTimeout(() => {
				if (clear == true) {
					diva0.classList.remove("animate__animated", "animate__zoomIn")
					diva1.classList.remove("animate__animated", "animate__zoomIn")
				}
			}, 1500)

			focus = false
		}, 150)
	}
}

// ? focus search bar
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

// ? save chooser
const saveChooser = () => {
	if (file.security.new_encryption === true) {
		newSave()
	} else {
		save()
	}
}

// new save method
const newSave = () => {
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
		date: new Date().toISOString().replace("T", "-").replaceAll(":", "-").substring(0, 19),
		version: "2",
	}

	fs.writeFileSync(path.join(file_path, "codes", "codes.authme"), JSON.stringify(codes, null, "\t"))

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

// load save
const loadSave = () => {
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

			prev = true

			processdata(decrypted.toString())

			decrypted.fill(0)
			password.fill(0)
			key.fill(0)
		}
	})
}

if (file.security.require_password === false && file.security.new_encryption === true) {
	loadSave()
}

// ? quick copy
const quickCopy = (key) => {
	for (let i = 0; i < query.length; i++) {
		if (key.toLowerCase() === query[i]) {
			const input = document.querySelector(`#code${[i]}`).textContent

			clipboard.writeText(input)

			const notification = new Notification({ title: "Authme", body: `${key} 2FA code copied to the clipboard!` })

			notification.show()

			setTimeout(() => {
				notification.close()
			}, 2500)
		}
	}
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

// ? build
const res = ipc.sendSync("info")

if (res.build_number.startsWith("alpha")) {
	document.querySelector(".build-content").textContent = `You are running an alpha version of Authme - Version ${res.authme_version} - Build ${res.build_number}`
	document.querySelector(".build").style.display = "block"
}

// ? buttons
const createFile = () => {
	ipc.send("hide_import")
}

const configureSettings = () => {
	ipc.send("hide_settings")
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
