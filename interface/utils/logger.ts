import { invoke } from "@tauri-apps/api"

const getTime = () => {
	return new Date().toLocaleString("hu")
}

export const log = (message: string) => {
	const time = getTime()

	console.log(`[AUTHME LOG] (${time}) ${`${message}`}`)

	invoke("logger", { message, time, kind: "log" })
}

export const warn = (message: string) => {
	const time = getTime()

	console.log(`[AUTHME WARN] (${time}) ${message}`)

	invoke("logger", { message, time, kind: "warn" })
}

export const error = (message: string) => {
	const time = getTime()

	console.log(`[AUTHME ERROR] (${time}) ${message}`)

	invoke("logger", { message, time, kind: "error" })
}

export default { log, warn, error }
