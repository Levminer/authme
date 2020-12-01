let exp = () => {
	const Cryptr = require("cryptr")
	const cryptr = new Cryptr("secret")

	fs.readFile(path.join(file_path, "hash.authme"), "utf-8", (err, content) => {
		if (err) {
			console.log("The hash.md fle dont exist!")
		} else {
			let decrypted = cryptr.decrypt(content)

			file = decrypted

			let result = document.querySelector("#result")
			result.value = decrypted
			result.style.display = "flex"

			processdata(decrypted)
		}
	})
}
