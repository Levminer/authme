const speakeasy = require("@levminer/speakeasy")
const { app, shell, dialog } = require("@electron/remote")
const fs = require("fs")
const path = require("path")
const electron = require("electron")
const ipc = electron.ipcRenderer
const dns = require("dns")

// ? error in window
window.onerror = (error) => {
	console.log(error)
	ipc.send("rendererError", { renderer: "application", error: error })
}

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

let names = []
let secret = []
const issuer = []
const type = []

const querry = []

let clear

// ? read settings
file = JSON.parse(fs.readFileSync(path.join(file_path, "settings.json"), "utf-8"))

const name_state = file.settings.show_2fa_names
const copy_state = file.settings.reset_after_copy
const reveal_state = file.settings.click_to_reveal
const search_state = file.settings.save_search_results

const offset_number = file.experimental.offset
const sort_number = file.experimental.sort

// ? separet values
const separation = () => {
	let c0 = 0
	let c1 = 1
	let c2 = 2
	let c3 = 3

	for (let i = 0; i < data.length; i++) {
		if (i == c0) {
			const names_before = data[i]
			const names_after = names_before.slice(8).trim()
			names.push(names_after)
			c0 = c0 + 4
		}

		if (i == c1) {
			const secret_before = data[i]
			const secret_after = secret_before.slice(8).trim()
			secret.push(secret_after)
			c1 = c1 + 4
		}

		if (i == c2) {
			const issuer_before = data[i]
			const issuer_after = issuer_before.slice(8).trim()
			issuer.push(issuer_after)
			c2 = c2 + 4
		}

		if (i == c3) {
			type.push(data[i])
			c3 = c3 + 4
		}
	}

	const issuer_original = [...issuer]

	const sort = () => {
		const names_new = []
		const secret_new = []

		issuer.forEach((element) => {
			for (let i = 0; i < issuer_original.length; i++) {
				if (element === issuer_original[i]) {
					names_new.push(names[i])
					secret_new.push(secret[i])
				}
			}
		})

		names = names_new
		secret = secret_new
	}

	if (sort_number === 1) {
		issuer.sort((a, b) => {
			return a.localeCompare(b)
		})

		sort()
	} else if (sort_number === 2) {
		issuer.sort((a, b) => {
			return b.localeCompare(a)
		})

		sort()
	}

	go()
}

const go = () => {
	document.querySelector("#search").style.display = "grid"
	document.querySelector(".h1").style.marginBottom = "0px"
	document.querySelector(".center").style.top = "80px"
	document.querySelector("#choose").style.display = "none"
	document.querySelector("#starting").style.display = "none"

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
					<p tabindex="0" class="text2" id="name${counter}">Code</p>
					</div>
					<div class="div2">
					<h3>Code</h3>
					<input type="text" class="input1 blur" id="code${counter}" readonly/>
					</div>
					<div class="div3">
					<h3>Time</h3>
					<p tabindex="0" class="text2" id="time${counter}">Time</p>
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
					<p tabindex="0" class="text2" id="name${counter}">Code</p>
					</div>
					<div class="div2">
					<h3>Code</h3>
					<input type="text" class="input1 blur" id="code${counter}" readonly/>
					</div>
					<div class="div3">
					<h3>Time</h3>
					<p class="text2" id="time${counter}">Time</p>
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
					<p tabindex="0" class="text2" id="name${counter}">Code</p>
					</div>
					<div class="div2">
					<h3>Code</h3>
					<input type="text" class="input1 blur" id="code${counter}" readonly/>
					</div>
					<div class="div3">
					<h3>Time</h3>
					<p tabindex="0" class="text2" id="time${counter}">Time</p>
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
					<p tabindex="0" class="text2" id="name${counter}">Code</p>
					</div>
					<div class="div2">
					<h3>Code</h3>
					<input type="text" class="input1 blur" id="code${counter}" readonly/>
					</div>
					<div class="div3">
					<h3>Time</h3>
					<p tabindex="0" class="text2" id="time${counter}">Time</p>
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
					<p tabindex="0" class="text2" id="name${counter}">Code</p>
					</div>
					<div class="div2">
					<h3>Code</h3>
					<input type="text" class="input1" id="code${counter}" readonly/>
					</div>
					<div class="div3">
					<h3>Time</h3>
					<p tabindex="0" class="text2" id="time${counter}">Time</p>
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
					<p tabindex="0" class="text2" id="name${counter}">Code</p>
					</div>
					<div class="div2">
					<h3>Code</h3>
					<input type="text" class="input1" id="code${counter}" readonly/>
					</div>
					<div class="div3">
					<h3>Time</h3>
					<p tabindex="0" class="text2" id="time${counter}">Time</p>
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
					<p tabindex="0" class="text2" id="name${counter}">Code</p>
					</div>
					<div class="div2">
					<h3>Code</h3>
					<input type="text" class="input1" id="code${counter}" readonly/>
					</div>
					<div class="div3">
					<h3>Time</h3>
					<p tabindex="0" class="text2" id="time${counter}">Time</p>
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
					<p tabindex="0" class="text2" id="name${counter}">Code</p>
					</div>
					<div class="div2">
					<h3>Code</h3>
					<input type="text" class="input1" id="code${counter}" readonly/>
					</div>
					<div class="div3">
					<h3>Time</h3>
					<p tabindex="0" class="text2" id="time${counter}">Time</p>
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
			document.querySelector(".center").appendChild(element)

			// elements
			const name = document.querySelector(`#name${counter}`)
			const code = document.querySelector(`#code${counter}`)
			const time = document.querySelector(`#time${counter}`)
			const text = document.querySelector(`#text${counter}`)
			const copy = document.querySelector(`#copy${counter}`)

			// add to query
			const item = issuer[i].toLowerCase().trim()

			querry.push(item)

			// interval0
			const int0 = setInterval(() => {
				// generate token
				const token = speakeasy.totp({
					secret: secret[i],
					encoding: "base32",
					epoch: offset_number,
				})

				// time
				let remaining

				if (offset_number === undefined || null || 0) {
					remaining = 30 - Math.floor((new Date(Date.now()).getTime() / 1000.0) % 30)
				} else {
					remaining = 30 - Math.floor((new Date(Date.now() - offset_number * 1000).getTime() / 1000.0) % 30)
				}

				// settting elements
				try {
					text.textContent = names[i]
				} catch (error) {
					console.warn(`Authme - Setting names - ${error}`)
				}

				name.textContent = issuer[i]
				code.value = token
				time.textContent = remaining
			}, 100)

			// interval1
			const int1 = setInterval(() => {
				// generate token
				const token = speakeasy.totp({
					secret: secret[i],
					encoding: "base32",
					epoch: offset_number,
				})

				// time
				let remaining

				if (offset_number === undefined || null || 0) {
					remaining = 30 - Math.floor((new Date(Date.now()).getTime() / 1000.0) % 30)
				} else {
					remaining = 30 - Math.floor((new Date(Date.now() - offset_number * 1000).getTime() / 1000.0) % 30)
				}

				// settting elements
				name.textContent = issuer[i]
				code.value = token
				time.textContent = remaining

				clearInterval(int0)
			}, 500)

			// copy
			const el = copy.addEventListener("click", () => {
				code.select()
				code.setSelectionRange(0, 9999)
				document.execCommand("copy")
				copy.innerHTML = `
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
			 	 </svg>
				Copied
				`

				window.getSelection().removeAllRanges()

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
	if (prev == false) {
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
	for (let i = 0; i < names.length; i++) {
		const div = document.querySelector(`#grid${[i]}`)
		div.style.display = "grid"
	}

	// search algorithm
	querry.forEach((e) => {
		if (e.startsWith(input)) {
			console.warn("Authme - Search result found")
		} else {
			const div = document.querySelector(`#grid${[i]}`)
			div.style.display = "none"
		}
		i++
	})

	// if search empty
	if (search.value == "") {
		for (let i = 0; i < names.length; i++) {
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
	console.error("Authme - Block animations failed")
}

let focus = true

let diva0
let diva1

// ? animations
app.on("browser-window-focus", () => {
	if (focus === true) {
		try {
			const center = document.querySelector(".center")
			center.classList.add("animate__animated", "animate__fadeIn")

			const h1 = document.querySelector(".h1")
			h1.classList.add("animate__animated", "animate__slideInDown")

			const choose = document.querySelector("#choose")
			choose.classList.add("animate__animated", "animate__slideInDown")

			const starting = document.querySelector("#starting")
			starting.classList.add("animate__animated", "animate__slideInDown")

			const search = document.querySelector("#search")
			search.classList.add("animate__animated", "animate__slideInDown")

			const button = document.querySelector(".button")
			button.classList.add("animate__animated", "animate__slideInDown")

			if (clear == true) {
				diva0 = document.querySelector(".diva0")
				diva0.classList.add("animate__animated", "animate__zoomIn")

				diva1 = document.querySelector(".diva1")
				diva1.classList.add("animate__animated", "animate__zoomIn")
			}
		} catch (error) {
			console.error("Authme - Animations failed")
		}

		setTimeout(() => {
			try {
				if (clear == true) {
					diva0.classList.remove("animate__animated", "animate__zoomIn")
					diva1.classList.remove("animate__animated", "animate__zoomIn")
				}
			} catch (error) {
				console.error("Authme - Code animations failed")
			}
		}, 1500)

		focus = false
	}
})

// ? focus search bar
const focusSearch = () => {
	document.getElementById("search").focus()
}

// ? show update
const showUpdate = () => {
	document.querySelector(".update").style.display = "block"
}

// ? show ifno
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

			console.warn("Authme - Can't connect to the internet")
		} else if (err === null && offline_mode === true && online_closed === false) {
			document.querySelector(".online").style.display = "block"
			document.querySelector(".offline").style.display = "none"

			offline_mode = false
			online_closed = true

			ipc.send("offline")

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
}, 5000)

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
