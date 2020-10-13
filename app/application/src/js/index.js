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
	//? blocks

	// set block count
	for (let i = 0; i < names.length; i++) {
		let block = document.querySelector(`#grid${i}`)
		block.style.display = "grid"
	}

	//set center block size
	let center = document.querySelector(".center")
	let height = names.length * 300
	center.style.height = `${height}px`

	//buttons

	if (prev == false) {
		let input = (document.querySelector("#input").style.display = "none")
		let save = (document.querySelector("#save").style.visibility = "visible")
	} else {
		let input = (document.querySelector("#input").style.display = "none")
		let save = (document.querySelector("#save").style.visibility = "none")
	}

	//? declare elements
	let name0 = document.querySelector("#name0")
	let code0 = document.querySelector("#code0")
	let time0 = document.querySelector("#time0")
	document.getElementById("copy0").addEventListener("click", () => {
		code0.select()
		code0.setSelectionRange(0, 9999)
		code0.value = "Copied"
		document.execCommand("copy")
	})

	let name1 = document.querySelector("#name1")
	let code1 = document.querySelector("#code1")
	let time1 = document.querySelector("#time1")
	document.getElementById("copy1").addEventListener("click", () => {
		code1.select()
		code1.setSelectionRange(0, 9999)
		code1.value = "Copied"
		document.execCommand("copy")
	})

	let name2 = document.querySelector("#name2")
	let code2 = document.querySelector("#code2")
	let time2 = document.querySelector("#time2")
	document.getElementById("copy2").addEventListener("click", () => {
		code2.select()
		code2.setSelectionRange(0, 9999)
		code2.value = "Copied"
		document.execCommand("copy")
	})

	let name3 = document.querySelector("#name3")
	let code3 = document.querySelector("#code3")
	let time3 = document.querySelector("#time3")
	document.getElementById("copy3").addEventListener("click", () => {
		code3.select()
		code3.setSelectionRange(0, 9999)
		code3.value = "Copied"
		document.execCommand("copy")
	})

	let name4 = document.querySelector("#name4")
	let code4 = document.querySelector("#code4")
	let time4 = document.querySelector("#time4")
	document.getElementById("copy4").addEventListener("click", () => {
		code4.select()
		code4.setSelectionRange(0, 9999)
		code4.value = "Copied"
		document.execCommand("copy")
	})

	let name5 = document.querySelector("#name5")
	let code5 = document.querySelector("#code5")
	let time5 = document.querySelector("#time5")
	document.getElementById("copy5").addEventListener("click", () => {
		code5.select()
		code5.setSelectionRange(0, 9999)
		code5.value = "Copied"
		document.execCommand("copy")
	})

	let name6 = document.querySelector("#name6")
	let code6 = document.querySelector("#code6")
	let time6 = document.querySelector("#time6")
	document.getElementById("copy6").addEventListener("click", () => {
		code6.select()
		code6.setSelectionRange(0, 9999)
		code6.value = "Copied"
		document.execCommand("copy")
	})

	let name7 = document.querySelector("#name7")
	let code7 = document.querySelector("#code7")
	let time7 = document.querySelector("#time7")
	document.getElementById("copy7").addEventListener("click", () => {
		code7.select()
		code7.setSelectionRange(0, 9999)
		code7.value = "Copied"
		document.execCommand("copy")
	})

	let name8 = document.querySelector("#name8")
	let code8 = document.querySelector("#code8")
	let time8 = document.querySelector("#time8")
	document.getElementById("copy8").addEventListener("click", () => {
		code8.select()
		code8.setSelectionRange(0, 9999)
		code8.value = "Copied"
		document.execCommand("copy")
	})

	let name9 = document.querySelector("#name9")
	let code9 = document.querySelector("#code9")
	let time9 = document.querySelector("#time9")
	document.getElementById("copy9").addEventListener("click", () => {
		code9.select()
		code9.setSelectionRange(0, 9999)
		code9.value = "Copied"
		document.execCommand("copy")
	})

	let name10 = document.querySelector("#name10")
	let code10 = document.querySelector("#code10")
	let time10 = document.querySelector("#time10")
	document.getElementById("copy10").addEventListener("click", () => {
		code10.select()
		code10.setSelectionRange(0, 9999)
		code10.value = "Copied"
		document.execCommand("copy")
	})

	let name11 = document.querySelector("#name11")
	let code11 = document.querySelector("#code11")
	let time11 = document.querySelector("#time11")
	document.getElementById("copy11").addEventListener("click", () => {
		code11.select()
		code11.setSelectionRange(0, 9999)
		code11.value = "Copied"
		document.execCommand("copy")
	})

	let name12 = document.querySelector("#name12")
	let code12 = document.querySelector("#code12")
	let time12 = document.querySelector("#time12")
	document.getElementById("copy12").addEventListener("click", () => {
		code12.select()
		code12.setSelectionRange(0, 9999)
		code12.value = "Copied"
		document.execCommand("copy")
	})

	let name13 = document.querySelector("#name13")
	let code13 = document.querySelector("#code13")
	let time13 = document.querySelector("#time13")
	document.getElementById("copy13").addEventListener("click", () => {
		code13.select()
		code13.setSelectionRange(0, 9999)
		code13.value = "Copied"
		document.execCommand("copy")
	})

	let name14 = document.querySelector("#name14")
	let code14 = document.querySelector("#code14")
	let time14 = document.querySelector("#time14")
	document.getElementById("copy14").addEventListener("click", () => {
		code14.select()
		code14.setSelectionRange(0, 9999)
		code14.value = "Copied"
		document.execCommand("copy")
	})

	let name15 = document.querySelector("#name15")
	let code15 = document.querySelector("#code15")
	let time15 = document.querySelector("#time15")
	document.getElementById("copy15").addEventListener("click", () => {
		code15.select()
		code15.setSelectionRange(0, 9999)
		code15.value = "Copied"
		document.execCommand("copy")
	})

	let name16 = document.querySelector("#name16")
	let code16 = document.querySelector("#code16")
	let time16 = document.querySelector("#time16")
	document.getElementById("copy16").addEventListener("click", () => {
		code16.select()
		code16.setSelectionRange(0, 9999)
		code16.value = "Copied"
		document.execCommand("copy")
	})

	let name17 = document.querySelector("#name17")
	let code17 = document.querySelector("#code17")
	let time17 = document.querySelector("#time17")
	document.getElementById("copy17").addEventListener("click", () => {
		code17.select()
		code17.setSelectionRange(0, 9999)
		code17.value = "Copied"
		document.execCommand("copy")
	})

	let name18 = document.querySelector("#name18")
	let code18 = document.querySelector("#code18")
	let time18 = document.querySelector("#time18")
	document.getElementById("copy18").addEventListener("click", () => {
		code18.select()
		code18.setSelectionRange(0, 9999)
		code18.value = "Copied"
		document.execCommand("copy")
	})

	let name19 = document.querySelector("#name19")
	let code19 = document.querySelector("#code19")
	let time19 = document.querySelector("#time19")
	document.getElementById("copy10").addEventListener("click", () => {
		code19.select()
		code19.setSelectionRange(0, 9999)
		code19.value = "Copied"
		document.execCommand("copy")
	})

	//? set elements
	setInterval(() => {
		let token = speakeasy.totp({
			secret: secret[0],
			encoding: "base32",
		})

		let remaining = 30 - Math.floor((new Date().getTime() / 1000.0) % 30)

		name0.textContent = issuer[0]
		code0.value = token
		time0.textContent = remaining
	}, 1000)

	setInterval(() => {
		let token = speakeasy.totp({
			secret: secret[1],
			encoding: "base32",
		})

		let remaining = 30 - Math.floor((new Date().getTime() / 1000.0) % 30)

		name1.textContent = issuer[1]
		code1.value = token
		time1.textContent = remaining
	}, 1000)

	setInterval(() => {
		let token = speakeasy.totp({
			secret: secret[2],
			encoding: "base32",
		})

		let remaining = 30 - Math.floor((new Date().getTime() / 1000.0) % 30)

		name2.textContent = issuer[2]
		code2.value = token
		time2.textContent = remaining
	}, 1000)

	setInterval(() => {
		let token = speakeasy.totp({
			secret: secret[3],
			encoding: "base32",
		})

		let remaining = 30 - Math.floor((new Date().getTime() / 1000.0) % 30)

		name3.textContent = issuer[3]
		code3.value = token
		time3.textContent = remaining
	}, 1000)

	setInterval(() => {
		let token = speakeasy.totp({
			secret: secret[4],
			encoding: "base32",
		})

		let remaining = 30 - Math.floor((new Date().getTime() / 1000.0) % 30)

		name4.textContent = issuer[4]
		code4.value = token
		time4.textContent = remaining
	}, 1000)

	setInterval(() => {
		let token = speakeasy.totp({
			secret: secret[5],
			encoding: "base32",
		})

		let remaining = 30 - Math.floor((new Date().getTime() / 1000.0) % 30)

		name5.textContent = issuer[5]
		code5.value = token
		time5.textContent = remaining
	}, 1000)

	setInterval(() => {
		let token = speakeasy.totp({
			secret: secret[6],
			encoding: "base32",
		})

		let remaining = 30 - Math.floor((new Date().getTime() / 1000.0) % 30)

		name6.textContent = issuer[6]
		code6.value = token
		time6.textContent = remaining
	}, 1000)

	setInterval(() => {
		let token = speakeasy.totp({
			secret: secret[7],
			encoding: "base32",
		})

		let remaining = 30 - Math.floor((new Date().getTime() / 1000.0) % 30)

		name7.textContent = issuer[7]
		code7.value = token
		time7.textContent = remaining
	}, 1000)

	setInterval(() => {
		let token = speakeasy.totp({
			secret: secret[8],
			encoding: "base32",
		})

		let remaining = 30 - Math.floor((new Date().getTime() / 1000.0) % 30)

		name8.textContent = issuer[8]
		code8.value = token
		time8.textContent = remaining
	}, 1000)

	setInterval(() => {
		let token = speakeasy.totp({
			secret: secret[9],
			encoding: "base32",
		})

		let remaining = 30 - Math.floor((new Date().getTime() / 1000.0) % 30)

		name9.textContent = issuer[9]
		code9.value = token
		time9.textContent = remaining
	}, 1000)

	setInterval(() => {
		let token = speakeasy.totp({
			secret: secret[10],
			encoding: "base32",
		})

		let remaining = 30 - Math.floor((new Date().getTime() / 1000.0) % 30)

		name10.textContent = issuer[10]
		code10.value = token
		time10.textContent = remaining
	}, 1000)

	setInterval(() => {
		let token = speakeasy.totp({
			secret: secret[11],
			encoding: "base32",
		})

		let remaining = 30 - Math.floor((new Date().getTime() / 1000.0) % 30)

		name11.textContent = issuer[11]
		code11.value = token
		time11.textContent = remaining
	}, 1000)

	setInterval(() => {
		let token = speakeasy.totp({
			secret: secret[12],
			encoding: "base32",
		})

		let remaining = 30 - Math.floor((new Date().getTime() / 1000.0) % 30)

		name12.textContent = issuer[12]
		code12.value = token
		time12.textContent = remaining
	}, 1000)

	setInterval(() => {
		let token = speakeasy.totp({
			secret: secret[13],
			encoding: "base32",
		})

		let remaining = 30 - Math.floor((new Date().getTime() / 1000.0) % 30)

		name13.textContent = issuer[13]
		code13.value = token
		time13.textContent = remaining
	}, 1000)

	setInterval(() => {
		let token = speakeasy.totp({
			secret: secret[14],
			encoding: "base32",
		})

		let remaining = 30 - Math.floor((new Date().getTime() / 1000.0) % 30)

		name14.textContent = issuer[14]
		code14.value = token
		time14.textContent = remaining
	}, 1000)

	setInterval(() => {
		let token = speakeasy.totp({
			secret: secret[15],
			encoding: "base32",
		})

		let remaining = 30 - Math.floor((new Date().getTime() / 1000.0) % 30)

		name15.textContent = issuer[15]
		code15.value = token
		time15.textContent = remaining
	}, 1000)

	setInterval(() => {
		let token = speakeasy.totp({
			secret: secret[16],
			encoding: "base32",
		})

		let remaining = 30 - Math.floor((new Date().getTime() / 1000.0) % 30)

		name16.textContent = issuer[16]
		code16.value = token
		time16.textContent = remaining
	}, 1000)

	setInterval(() => {
		let token = speakeasy.totp({
			secret: secret[17],
			encoding: "base32",
		})

		let remaining = 30 - Math.floor((new Date().getTime() / 1000.0) % 30)

		name17.textContent = issuer[17]
		code17.value = token
		time17.textContent = remaining
	}, 1000)

	setInterval(() => {
		let token = speakeasy.totp({
			secret: secret[18],
			encoding: "base32",
		})

		let remaining = 30 - Math.floor((new Date().getTime() / 1000.0) % 30)

		name18.textContent = issuer[18]
		code18.value = token
		time18.textContent = remaining
	}, 1000)

	setInterval(() => {
		let token = speakeasy.totp({
			secret: secret[19],
			encoding: "base32",
		})

		let remaining = 30 - Math.floor((new Date().getTime() / 1000.0) % 30)

		name19.textContent = issuer[19]
		code19.value = token
		time19.textContent = remaining
	}, 1000)
}
