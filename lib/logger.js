const fs = require("fs")
const path = require("path")

const colors = {
	white: "\x1b[37m",
	red: "\x1b[31m",
	yellow: "\x1b[33m",
	blue: "\x1b[34m",
	green: "\x1b[32m",
}

const time = () => {
	return new Date().toLocaleString()
}

let file_name = null
let file_path = null

module.exports = logger = {
	log: (message, log) => {
		if (typeof log == "object") {
			log = JSON.stringify(log)
		} else if (typeof _log === "undefined") {
			log = undefined
		}

		if (typeof log === "undefined") {
			console.log(`${colors.green}[AUTHME LOG] ${colors.blue}{${time()}} ${colors.white}${message} ${colors.white}`)

			try {
				logger.writeFile(`[AUTHME LOG] {${time()}} ${message} \n`)
			} catch (error) {}
		} else {
			console.log(`${colors.green}[AUTHME LOG] ${colors.blue}{${time()}} ${colors.white}${message} ${colors.green}(${log}) ${colors.white}`)

			try {
				logger.writeFile(`[AUTHME LOG] {${time()}} ${message} (${log}) \n`)
			} catch (error) {}
		}
	},

	warn: (message, warn) => {
		if (typeof warn == "object") {
			warn = JSON.stringify(warn)
		} else if (typeof warn == "undefined") {
			warn = undefined
		}

		if (typeof warn === "undefined") {
			console.log(`${colors.yellow}[AUTHME WARN] ${colors.blue}{${time()}} ${colors.white}${message} ${colors.white}`)

			try {
				logger.writeFile(`[AUTHME WARN] {${time()}} ${message} \n`)
			} catch (error) {}
		} else {
			console.log(`${colors.yellow}[AUTHME WARN] ${colors.blue}{${time()}} ${colors.white}${message} ${colors.yellow}(${warn}) ${colors.white}`)

			try {
				logger.writeFile(`[AUTHME WARN] {${time()}} ${message} (${warn}) \n`)
			} catch (error) {}
		}
	},

	error: (message, error) => {
		if (typeof error == "object") {
			error = JSON.stringify(error)
		} else if (typeof _error == "undefined") {
			error = undefined
		}

		if (typeof error === "undefined") {
			console.log(`${colors.red}[AUTHME ERROR] ${colors.blue}{${time()}} ${colors.white}${message} ${colors.white}`)

			try {
				logger.writeFile(`[AUTHME ERROR] {${time()}} ${message} \n`)
			} catch (error) {}
		} else {
			console.log(`${colors.red}[AUTHME ERROR] ${colors.blue}{${time()}} ${colors.white}${message} ${colors.red}(${error}) ${colors.white}`)

			try {
				logger.writeFile(`[AUTHME ERROR] {${time()}} ${message} (${error}) \n`)
			} catch (error) {}
		}
	},

	createFile: (file, name) => {
		const time = new Date().toISOString().replace("T", "-").replaceAll(":", "-").substring(0, 19)

		if (!fs.existsSync(path.join(file, "logs"))) {
			fs.mkdirSync(path.join(file, "logs"))
		}

		fs.writeFileSync(path.join(path.join(file, "logs"), `${name}-${time}.log`), "", (err) => {
			if (err) {
				return console.log(`error creating settings.json ${err}`)
			} else {
				return console.log("settings.json created")
			}
		})

		file_name = `${name}-${time}.log`
		file_path = path.join(file, "logs")
	},

	writeFile: (message) => {
		fs.appendFileSync(path.join(file_path, file_name), message, (err) => {
			if (err) {
				return console.log(`error creating settings.json ${err}`)
			} else {
				return console.log("settings.json created")
			}
		})
	},
}
