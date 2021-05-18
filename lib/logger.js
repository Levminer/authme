const _fs = require("fs")
const _path = require("path")

const _colors = {
	white: "\x1b[37m",
	red: "\x1b[31m",
	yellow: "\x1b[33m",
	blue: "\x1b[34m",
	green: "\x1b[32m",
}

const _time = () => {
	return new Date().toLocaleString()
}

let _file_name = null
let _file_path = null

module.exports = logger = {
	log: (_message, _log) => {
		const message = _message
		let log

		if (typeof _log == "object") {
			log = JSON.stringify(_log)
		} else if (typeof _log === "undefined") {
			log = undefined
		} else {
			log = _log
		}

		if (typeof _log === "undefined") {
			console.log(`${_colors.green}[AUTHME LOG] ${_colors.blue}{${_time()}} ${_colors.white}${message} ${_colors.white}`)

			try {
				logger.writeFile(`[AUTHME LOG] {${_time()}} ${message} \n`)
			} catch (error) {}
		} else {
			console.log(
				`${_colors.green}[AUTHME LOG] ${_colors.blue}{${_time()}} ${_colors.white}${message} ${_colors.green}(${log}) ${_colors.white}`
			)

			try {
				logger.writeFile(`[AUTHME LOG] {${_time()}} ${message} (${log}) \n`)
			} catch (error) {}
		}
	},

	warn: (_message, _warn) => {
		const message = _message
		let warn

		if (typeof _warn == "object") {
			warn = JSON.stringify(_warn)
		} else if (typeof _warn == "undefined") {
			warn = undefined
		} else {
			warn = _warn
		}

		if (typeof warn === "undefined") {
			console.log(`${_colors.yellow}[AUTHME WARN] ${_colors.blue}{${_time()}} ${_colors.white}${message} ${_colors.white}`)

			try {
				logger.writeFile(`[AUTHME WARN] {${_time()}} ${message} \n`)
			} catch (error) {}
		} else {
			console.log(
				`${_colors.yellow}[AUTHME WARN] ${_colors.blue}{${_time()}} ${_colors.white}${message} ${_colors.yellow}(${warn}) ${_colors.white}`
			)

			try {
				logger.writeFile(`[AUTHME WARN] {${_time()}} ${message} (${warn}) \n`)
			} catch (error) {}
		}
	},

	error: (_message, _error) => {
		const message = _message
		let error

		if (typeof _error == "object") {
			error = JSON.stringify(_error)
		} else if (typeof _error == "undefined") {
			error = undefined
		} else {
			error = _error
		}

		if (typeof error === "undefined") {
			console.log(`${_colors.red}[AUTHME ERROR] ${_colors.blue}{${_time()}} ${_colors.white}${message} ${_colors.white}`)

			try {
				logger.writeFile(`[AUTHME ERROR] {${_time()}} ${message} \n`)
			} catch (error) {}
		} else {
			console.log(
				`${_colors.red}[AUTHME ERROR] ${_colors.blue}{${_time()}} ${_colors.white}${message} ${_colors.red}(${error}) ${_colors.white}`
			)

			try {
				logger.writeFile(`[AUTHME ERROR] {${_time()}} ${message} (${error}) \n`)
			} catch (error) {}
		}
	},

	createFile: (file, name) => {
		const time = new Date().toISOString().replace("T", "-").replaceAll(":", "-").substring(0, 19)

		if (!_fs.existsSync(_path.join(file, "logs"))) {
			_fs.mkdirSync(_path.join(file, "logs"))
		}

		_fs.writeFileSync(_path.join(_path.join(file, "logs"), `${name}-${time}.log`), "", (err) => {
			if (err) {
				return console.log(`error creating settings.json ${err}`)
			} else {
				return console.log("settings.json created")
			}
		})

		_file_name = `${name}-${time}.log`
		_file_path = _path.join(file, "logs")
	},

	writeFile: (message) => {
		_fs.appendFileSync(_path.join(_file_path, _file_name), message, (err) => {
			if (err) {
				return console.log(`error creating settings.json ${err}`)
			} else {
				return console.log("settings.json created")
			}
		})
	},
}
