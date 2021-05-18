const crypto = require("crypto")

const shakeHash = (text) => {
	const hash = crypto.createHash("shake256", { outputLength: 48 }).update(text).digest("base64")
	return hash
}

const randomNumber = (length) => {
	const random = crypto.randomBytes(length).toString("base64")
	return random
}

const key = crypto.randomBytes(32)
const iv = crypto.randomBytes(16)

const encryptText = (text) => {
	const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv)
	let encrypted = cipher.update(text)
	encrypted = Buffer.concat([encrypted, cipher.final()])
	return `${encrypted.toString("base64")}.${iv.toString("base64")}`
}

const decryptText = (text) => {
	const arr = text.split(".")
	const iv = Buffer.from(arr[1], "base64")
	const encryptedText = Buffer.from(arr[0], "base64")
	const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv)
	let decrypted = decipher.update(encryptedText)
	decrypted = Buffer.concat([decrypted, decipher.final()])
	return decrypted.toString("base64")
}

const convertToBinary = (str) => {
	let res = ""
	res = str
		.split("")
		.map((char) => {
			return 0 + char.charCodeAt(0).toString(2)
		})
		.join("")

	return res
}

const convertToText = (str) => {
	let binstring = ""
	let string = ""

	let min = 0
	let max = 8

	for (let i = 0; i < str.length; i++) {
		if (i % 8 === 0) {
			const sliced = str.slice(min, max)

			if (i === 0) {
				string += `${sliced}`
			} else {
				string += ` ${sliced}`
			}

			min += 8
			max += 8
		}
	}

	string.split(" ").map((bin) => {
		return (binstring += String.fromCharCode(parseInt(bin, 2)))
	})
	return binstring
}
