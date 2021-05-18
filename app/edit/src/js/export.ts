let loadCodes = () => {
	const Cryptr = require("cryptr")
	const cryptr = new Cryptr("secret")

	fs.readFile(path.join(file_path, "hash.authme"), "utf-8", (err, content) => {
		if (err) {
			console.warn("Authme - The hash.md fle dont exist")
		} else {
			let decrypted = cryptr.decrypt(content)

			processdata(decrypted)
		}
	})

	loadError()
}
