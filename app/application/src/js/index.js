const speakeasy = require("speakeasy")
const { app } = require("electron").remote
const fs = require("fs")
const path = require("path")

let prev = false

let folder

if (process.platform === "win32") {
	folder = process.env.APPDATA
} else {
	folder = process.env.HOME
}

const file_path = path.join(folder, "Levminer/Authme")

const names = []
const secret = []
const issuer = []
const type = []

const querry = []

let clear

//? read settings
// read settings
file = JSON.parse(
	fs.readFileSync(path.join(file_path, "settings.json"), "utf-8", (err, data) => {
		if (err) {
			return console.log(`Error reading settings.json ${err}`)
		} else {
			return console.log("settings.json readed")
		}
	})
)

let name_state = file.settings.show_2fa_names

//? separet values
let separation = () => {
	let c0 = 0
	let c1 = 1
	let c2 = 2
	let c3 = 3

	for (let i = 0; i < data.length; i++) {
		if (i == c0) {
			let names_before = data[i]
			let names_after = names_before.slice(8)
			names.push(names_after)
			c0 = c0 + 4
		}

		if (i == c1) {
			let secret_before = data[i]
			let secret_after = secret_before.slice(8)
			secret.push(secret_after)
			c1 = c1 + 4
		}

		if (i == c2) {
			let issuer_before = data[i]
			let issuer_after = issuer_before.slice(8)
			issuer.push(issuer_after)
			c2 = c2 + 4
		}

		if (i == c3) {
			type.push(data[i])
			c3 = c3 + 4
		}
	}

	console.log(names)
	console.log(secret)
	console.log(issuer)
	console.log(type)

	go()
}

let go = () => {
	document.querySelector("#title").textContent = "Here are your 2FA codes"
	document.querySelector("#search").style.display = "grid"

	let generate = () => {
		// counter
		let counter = 0

		for (let i = 0; i < names.length; i++) {
			// create div
			let element = document.createElement("div")

			// set div elements
			if (name_state == true) {
				if (i < 2) {
					element.innerHTML = `
					<div class="grid diva${i}" id="grid${counter}">
					<div class="div1">
					<h3>Name</h3>
					<p class="text2" id="name${counter}">Code</p>
					</div>
					<div class="div2">
					<h3>Code</h3>
					<input type="text" class="input1" id="code${counter}" />
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
				} else {
					element.innerHTML = `
					<div data-scroll class="grid" id="grid${counter}">
					<div class="div1">
					<h3>Name</h3>
					<p class="text2" id="name${counter}">Code</p>
					</div>
					<div class="div2">
					<h3>Code</h3>
					<input type="text" class="input1" id="code${counter}" />
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
					<input type="text" class="input1" id="code${counter}" />
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
					<input type="text" class="input1" id="code${counter}" />
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
			let name = document.querySelector(`#name${counter}`)
			let code = document.querySelector(`#code${counter}`)
			let time = document.querySelector(`#time${counter}`)
			let text = document.querySelector(`#text${counter}`)
			let copy = document.querySelector(`#copy${counter}`)

			// add to query
			let item = issuer[i].toLowerCase().trim()

			querry.push(item)

			// interval0
			let int0 = setInterval(() => {
				// generate token
				let token = speakeasy.totp({
					secret: secret[i],
					encoding: "base32",
				})

				// time
				let remaining = 30 - Math.floor((new Date().getTime() / 1000.0) % 30)

				//settting elements
				try {
					text.textContent = names[i]
				} catch (error) {
					return
				}
				name.textContent = issuer[i]
				code.value = token
				time.textContent = remaining
			}, 100)

			//interval1
			let int1 = setInterval(() => {
				// generate token
				let token = speakeasy.totp({
					secret: secret[i],
					encoding: "base32",
				})

				// time
				let remaining = 30 - Math.floor((new Date().getTime() / 1000.0) % 30)

				//settting elements
				name.textContent = issuer[i]
				code.value = token
				time.textContent = remaining

				clearInterval(int0)
			}, 1000)

			//copy
			let el = copy.addEventListener("click", () => {
				code.select()
				code.setSelectionRange(0, 9999)
				document.execCommand("copy")
				copy.textContent = "Copied"
				setTimeout(() => {
					copy.textContent = "Copy code"
				}, 1000)
			})

			if (name_state) {
				let grid = document.querySelector(`#grid${i}`)
				grid.style.height = "310px"
			}

			// add one to counter
			counter++
		}

		clear = true
	}

	generate()

	// set block count
	for (let i = 0; i < name.length; i++) {
		let block = document.querySelector(`#grid${i}`)
		block.style.display = "grid"
	}

	//prev
	if (prev == false) {
		document.querySelector("#input").style.display = "none"
		document.querySelector("#save").style.visibility = "visible"
	} else {
		document.querySelector("#input").style.display = "none"
		document.querySelector("#save").style.display = "none"
		document.querySelector("#search").style.display = "grid"
	}
}

//? search
let search = () => {
	let search = document.querySelector("#search")
	let input = search.value.toLowerCase()
	let i = 0

	// restart
	for (let i = 0; i < name.length; i++) {
		let div = document.querySelector(`#grid${[i]}`)
		div.style.display = "grid"
	}

	// search
	querry.forEach((e) => {
		if (e.startsWith(input)) {
			console.log("found")
		} else {
			let div = document.querySelector(`#grid${[i]}`)
			div.style.display = "none"
		}
		i++
	})

	// if search empty
	if (search.value == "") {
		for (let i = 0; i < name.length; i++) {
			let div = document.querySelector(`#grid${[i]}`)
			div.style.display = "grid"
		}
	}
}

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

app.on("browser-window-focus", () => {
	if (focus === true) {
		try {
			let center = document.querySelector(".center")
			center.classList.add("animate__animated", "animate__fadeIn")

			let h1 = document.querySelector(".h1")
			h1.classList.add("animate__animated", "animate__slideInDown")

			let h2 = document.querySelector(".h2")
			h2.classList.add("animate__animated", "animate__slideInDown")

			let input = document.querySelector(".input")
			input.classList.add("animate__animated", "animate__slideInDown")

			let button = document.querySelector(".button")
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
			} catch (error) {
				return
			}
		}, 1500)

		focus = false
	}
})
