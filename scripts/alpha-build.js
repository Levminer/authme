const fs = require("fs")

const build = new Date().toISOString().replace("T", "X").replaceAll(":", ".").substring(0, 19).replaceAll("-", ".").slice(2).replaceAll(".", "").replace("X", ".")

const date = new Date()

const year = date.getFullYear()
const month = date.toLocaleString("en-us", { timeZone: "UTC", month: "long" })
const day = date.toISOString().substring(8, 10)

const build_number = `alpha.${build}`
const release_date = `${year}. ${month} ${day}.`

const file = {
	number: build_number,
	date: release_date,
}

if (!fs.existsSync("dist")) {
	fs.mkdirSync("dist")
}

fs.writeFileSync("build.json", JSON.stringify(file, null, "\t"))
fs.writeFileSync("dist/build.json", JSON.stringify(file, null, "\t"))
