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
	number: `alpha.${build}`,
}

if (!fs.existsSync("dist")) {
	fs.mkdirSync("dist")
}

if (fs.existsSync("build")) {
	fs.rmdirSync("build", { recursive: true })
} else {
	fs.mkdirSync("build")
}

fs.writeFileSync("build.json", JSON.stringify(file, null, "\t"))
fs.writeFileSync(`dist/${file.number}.json`, JSON.stringify(file, null, "\t"))
fs.writeFileSync(`build/${file.number}.json`, JSON.stringify(file, null, "\t"))
