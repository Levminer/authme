import { invoke } from "@tauri-apps/api/core"
import { dev } from "../../build.json"

let fileName: string

const getTime = () => {
	return new Date().toLocaleString("hu")
}

export const log = (message: string) => {
	const time = getTime()

	console.log(`[AUTHME LOG] (${time}) ${`${message}`}`)
	invoke("logger", { message, time, kind: "log" })
	writeToFile(`[AUTHME LOG] (${time}) ${`${message}`}`)
}

export const warn = (message: string) => {
	const time = getTime()

	console.log(`[AUTHME WARN] (${time}) ${message}`)
	invoke("logger", { message, time, kind: "warn" })
	writeToFile(`[AUTHME WARN] (${time}) ${message}`)
}

export const error = (message: string) => {
	const time = getTime()

	console.log(`[AUTHME ERROR] (${time}) ${message}`)
	invoke("logger", { message, time, kind: "error" })
	writeToFile(`[AUTHME ERROR] (${time}) ${message}`)
}

const writeToFile = async (message: string) => {
	if (dev === true) {
		return
	}

	const time = new Date().toISOString().replace("T", "-").replaceAll(":", "-").substring(0, 19)
	await invoke("create_logs_dir")

	if (fileName === undefined) {
		fileName = `authme-${time}.log`
	}

	invoke("write_logs", { name: fileName, message: `${message}\n` })
}

export default { log, warn, error }
