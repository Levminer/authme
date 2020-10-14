const speakeasy = require("speakeasy")

let names = []
let secret = []
let issuer = []
let type = []

let separation = () => {
	let c0 = 0
	let c1 = 1
	let c2 = 2
	let c3 = 3

	for (let i = 0; i < data.length; i++) {
		if (i == c0) {
			names.push(data[i])
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

	let generate = () => {
		// counter
		let counter = 0

		for (let i = 0; i < names.length; i++) {
			// create div
			let element = document.createElement("div")

			// set div elements
			element.innerHTML = `
				<div class="grid" id="grid${counter}">
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
				</div>`

			// set div in html
			document.querySelector(".center").appendChild(element)

			// elements
			let name = document.querySelector(`#name${counter}`)
			let code = document.querySelector(`#code${counter}`)
			let time = document.querySelector(`#time${counter}`)
			let copy = document.querySelector(`#copy${counter}`)

			// interval
			let int = setInterval(() => {
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

			// add one to counter
			counter++
		}
	}

	generate()

	// set block count
	for (let i = 0; i < names.length; i++) {
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
	}
}
