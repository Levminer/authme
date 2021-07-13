const fs = require("fs")

const build = new Date()
	.toISOString()
	.replace("T", "X")
	.replaceAll(":", ".")
	.substring(0, 19)
	.replaceAll("-", ".")
	.slice(2)
	.replaceAll(".", "")
	.replace("X", ".")

const build_number = `release.${build}`

const file = {
	number: build_number,
}

if (!fs.existsSync("dist")) {
	fs.mkdirSync("dist")
}

fs.writeFileSync("build.json", JSON.stringify(file, null, "\t"))
fs.writeFileSync("dist/build.json", JSON.stringify(file, null, "\t"))
