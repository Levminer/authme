import build from "../../../build.json"
import { path, invoke, os, dialog, app } from "@tauri-apps/api"
import { UAParser } from "ua-parser-js"
import { navigate, open } from "../../utils/navigate"
import { deleteEncryptionKey } from "interface/utils/encryption"

export const about = async () => {
	const appVersion = await app.getVersion()
	const tauriVersion = await app.getTauriVersion()
	const osType = await os.type()
	const osArch = await os.arch()
	const osVersion = await os.version()
	const browser = new UAParser().getBrowser()

	const browserName = browser.name.replace("Edge", "Chromium").replace("Safari", "WebKit")
	const browserVersion = browser.version

	const systemInfo: string = await invoke("system_info")
	const hardware = systemInfo.split("+")

	const cpu = hardware[0]
		.split("@")[0]
		.replaceAll("(R)", "")
		.replaceAll("(TM)", "")
		.replace(/ +(?= )/g, "")

	const memory = `${Math.round(parseInt(hardware[1]) / 1024 / 1024)}GB`

	dialog.message(`Authme: ${appVersion} \n\nTauri: ${tauriVersion}\n${browserName}: ${browserVersion}\n\nOS version: ${osType} ${osArch.replace("x86_64", "x64")} ${osVersion}\nHardware info: ${cpu}${memory} RAM\n\nRelease date: ${build.date}\nBuild number: ${build.number}\n\nCreated by: Lőrik Levente`)
}

export const clearData = async () => {
	const confirm0 = await dialog.ask("Are you sure you want to clear all data? \n\nThis cannot be undone!", { type: "warning" })

	if (confirm0 === false) {
		return
	}

	const confirm1 = await dialog.ask("Are you absolutely sure? \n\nThere is no way back!", { type: "warning" })

	if (confirm1 === true) {
		localStorage.clear()
		sessionStorage.clear()

		await deleteEncryptionKey("encryptionKey")

		navigate("/")
		location.reload()
	}
}

export const showLogs = async () => {
	const folderPath = await path.join(await path.cacheDir(), "com.levminer.authme", "logs")
	open(folderPath)
}

export const launchOnStartup = () => {
	invoke("auto_launch")
}
