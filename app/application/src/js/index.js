const speakeasy = require("@levminer/speakeasy")
const { app, shell, dialog } = require("electron").remote
const fs = require("fs")
const path = require("path")
const { is } = require("electron-util")
const electron = require("electron")
const ipc = electron.ipcRenderer
const dns = require("dns")

// ? if development
let dev

if (is.development === true) {
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

const file_path = dev ? path.join(folder, "Levminer/Authme Dev") : path.join(folder, "Levminer/Authme")

// eslint-disable-next-line
let prev = false

const names = []
const secret = []
const issuer = []
const type = []

const querry = []

let clear

// ? read settings
// read settings
file = JSON.parse(fs.readFileSync(path.join(file_path, "settings.json"), "utf-8"))

const name_state = file.settings.show_2fa_names
const copy_state = file.settings.reset_after_copy
const reveal_state = file.settings.click_to_reveal
const search_state = file.settings.save_search_results

const offset_number = file.advanced_settings.offset

// ? separet values
const separation = () => {
	let c0 = 0
	let c1 = 1
	let c2 = 2
	let c3 = 3

	for (let i = 0; i < data.length; i++) {
		if (i == c0) {
			const names_before = data[i]
			const names_after = names_before.slice(8)
			names.push(names_after)
			c0 = c0 + 4
		}

		if (i == c1) {
			const secret_before = data[i]
			const secret_after = secret_before.slice(8)
			secret.push(secret_after)
			c1 = c1 + 4
		}

		if (i == c2) {
			const issuer_before = data[i]
			const issuer_after = issuer_before.slice(8)
			issuer.push(issuer_after)
			c2 = c2 + 4
		}

		if (i == c3) {
			type.push(data[i])
			c3 = c3 + 4
		}
	}

	go()
}

const go = () => {
	document.querySelector("#title").style.display = "none"
	document.querySelector("#search").style.display = "grid"
	document.querySelector(".h1").style.marginBottom = "0px"
	document.querySelector("#information").style.display = "none"

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
					<p class="text2" id="name${counter}">Code</p>
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
					<p class="text3" id="text${counter}">Text</p>
					<button class="button11" id="copy${counter}" >Copy code</button>
					</div>
					</div>
					`
				} else {
					element.innerHTML = `
					<div data-scroll class="grid" id="grid${counter}">
					<div class="div1">
					<h3>Name</h3>
					<p class="text2" id="name${counter}">Code</p>
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
					<p class="text3" id="text${counter}">Text</p>
					<button class="button11" id="copy${counter}">Copy code</button>
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
					<p class="text2" id="name${counter}">Code</p>
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
					<button class="button11" id="copy${counter}">Copy code</button>
					</div>
					</div>
					`
				} else {
					element.innerHTML = `
					<div data-scroll class="grid" id="grid${counter}">
					<div class="div1">
					<h3>Name</h3>
					<p class="text2" id="name${counter}">Code</p>
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
					<button class="button11" id="copy${counter}">Copy code</button>
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
					<p class="text2" id="name${counter}">Code</p>
					</div>
					<div class="div2">
					<h3>Code</h3>
					<input type="text" class="input1" id="code${counter}" readonly/>
					</div>
					<div class="div3">
					<h3>Time</h3>
					<p class="text2" id="time${counter}">Time</p>
					</div>
					<div class="div4">
					<p class="text3" id="text${counter}">Text</p>
					<button class="button11" id="copy${counter}" >Copy code</button>
					</div>
					</div>
					`
				} else {
					element.innerHTML = `
					<div data-scroll class="grid" id="grid${counter}">
					<div class="div1">
					<h3>Name</h3>
					<p class="text2" id="name${counter}">Code</p>
					</div>
					<div class="div2">
					<h3>Code</h3>
					<input type="text" class="input1" id="code${counter}" readonly/>
					</div>
					<div class="div3">
					<h3>Time</h3>
					<p class="text2" id="time${counter}">Time</p>
					</div>
					<div class="div4">
					<p class="text3" id="text${counter}">Text</p>
					<button class="button11" id="copy${counter}">Copy code</button>
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
					<p class="text2" id="name${counter}">Code</p>
					</div>
					<div class="div2">
					<h3>Code</h3>
					<input type="text" class="input1" id="code${counter}" readonly/>
					</div>
					<div class="div3">
					<h3>Time</h3>
					<p class="text2" id="time${counter}">Time</p>
					</div>
					<div class="div4">
					<button class="button11" id="copy${counter}">Copy code</button>
					</div>
					</div>
					`
				} else {
					element.innerHTML = `
					<div data-scroll class="grid" id="grid${counter}">
					<div class="div1">
					<h3>Name</h3>
					<p class="text2" id="name${counter}">Code</p>
					</div>
					<div class="div2">
					<h3>Code</h3>
					<input type="text" class="input1" id="code${counter}" readonly/>
					</div>
					<div class="div3">
					<h3>Time</h3>
					<p class="text2" id="time${counter}">Time</p>
					</div>
					<div class="div4">
					<button class="button11" id="copy${counter}">Copy code</button>
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
				copy.textContent = "Copied"

				window.getSelection().removeAllRanges()

				setTimeout(() => {
					copy.textContent = "Copy code"

					setTimeout(() => {
						if (copy_state === true) {
							for (let i = 0; i < names.length; i++) {
								const div = document.querySelector(`#grid${[i]}`)
								div.style.display = "grid"
							}

							document.querySelector("#search").value = ""
						}
					}, 1200)

					document.getElementById("search").focus()
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

	// set block count
	for (let i = 0; i < names.length; i++) {
		const block = document.querySelector(`#grid${i}`)
		block.style.display = "grid"
	}

	// prev
	if (prev == false) {
		document.querySelector("#input").style.display = "none"
		document.querySelector("#save").style.visibility = "visible"
	} else {
		document.querySelector("#input").style.display = "none"
		document.querySelector("#save").style.display = "none"
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

// ? seach history
const search_history = file.search_history.latest

if (search_history !== null && search_history !== "" && search_state === true) {
	document.querySelector("#search").value = file.search_history.latest

	setTimeout(() => {
		search()
	}, 300)
}

// ? block animations
setTimeout(() => {
	ScrollOut({
		onShown(el) {
			el.classList.add("animate__animated", "animate__zoomIn", "animate__faster")
		},
	})
}, 500)

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

			const h2 = document.querySelector(".h2")
			h2.classList.add("animate__animated", "animate__slideInDown")

			const input = document.querySelector(".input")
			input.classList.add("animate__animated", "animate__slideInDown")

			const button = document.querySelector(".button")
			button.classList.add("animate__animated", "animate__slideInDown")

			if (clear == true) {
				diva0 = document.querySelector(".diva0")
				diva0.classList.add("animate__animated", "animate__zoomIn")

				diva1 = document.querySelector(".diva1")
				diva1.classList.add("animate__animated", "animate__zoomIn")
			}
		} catch (error) {
			return
		}

		setTimeout(() => {
			try {
				if (clear == true) {
					diva0.classList.remove("animate__animated", "animate__zoomIn")
					diva1.classList.remove("animate__animated", "animate__zoomIn")
				}
			} catch (error) {}
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

// ? links
const link0 = () => {
	shell.openExternal("https://docs.authme.levminer.com/#/web")
}

const link1 = () => {
	shell.openExternal("https://github.com/Levminer/authme/blob/main/sample/authme_import_sample.zip?raw=true")
}
