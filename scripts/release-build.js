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

const file = {
	number: `release.${build}`,
}

fs.writeFileSync("build.json", JSON.stringify(file, null, "\t"))
