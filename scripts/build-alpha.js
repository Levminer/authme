const fs = require("fs")
const os = require("os")

const build = new Date()
	.toISOString()
	.replace("T", "X")
	.replaceAll(":", ".")
	.substring(0, 19)
	.replaceAll("-", ".")
	.slice(2)
	.replaceAll(".", "")
	.replace("X", ".")

let file = JSON.parse(fs.readFileSync("package.json", "utf-8"))

file.number = `alpha-${build}`
file += os.EOL

fs.writeFileSync("package.json", JSON.stringify(file, null, "\t"))
