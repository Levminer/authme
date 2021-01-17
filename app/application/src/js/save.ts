const Cryptr = require("cryptr")
const cryptr = new Cryptr("secret")

fs.readFile(path.join(file_path, "hash.authme"), "utf-8", (err, content) => {
	if (err) {
		console.warn("Authme - The hash dont exist")

		document.querySelector("#title").textContent = "Please choose your exported file, if you don't have one: Go to: Top menu > Advanced > Import"
	} else {
		prev = true

		let decrypted = cryptr.decrypt(content)

		processdata(decrypted)
	}
})

let save = () => {
	const encryptedString = cryptr.encrypt(save_text)
	fs.writeFile(path.join(file_path, "hash.authme"), encryptedString, (err) => {
		if (err) {
			console.warn("Authme - Hash not created!")
		} else {
			console.warn("Authme - Hash created")
			document.querySelector("#save").textContent = "Config saved"
			setTimeout(() => {
				document.querySelector("#save").style.display = "none"
			}, 1000)
		}
	})
}
