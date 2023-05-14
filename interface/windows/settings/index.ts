import build from "../../../build.json"
import { path, invoke, os, dialog, app, process, clipboard } from "@tauri-apps/api"
import { UAParser } from "ua-parser-js"
import { navigate, open } from "../../utils/navigate"
import { deleteEncryptionKey } from "interface/utils/encryption"
import { getSettings } from "interface/stores/settings"

const settings = getSettings()

export const about = async () => {
	const tauriVersion = await app.getTauriVersion()
	const osVersion = await os.version()
	const browser = new UAParser().getBrowser()
	const osArch = (await os.arch()).replace("x86_64", "x64").replace("aarch64", "arm64")

	// Browser version
	const browserName = browser.name.replace("Edge", "Chromium").replace("Safari", "WebKit")
	const browserVersion = browser.version

	// System info
	const systemInfo: string = await invoke("system_info")
	const hardware = systemInfo.split("+")
	const cpu = hardware[1]
		.split("@")[0]
		.replaceAll("(R)", "")
		.replaceAll("(TM)", "")
		.replace(/ +(?= )/g, "")
	const memory = `${Math.round(parseInt(hardware[2]) / 1024 / 1024 / 1024)} GB`
	const osName = hardware[0]

	const info = `Authme: ${build.version} \n\nTauri: ${tauriVersion}\n${browserName}: ${browserVersion}\n\nOS version: ${osName} ${osArch} ${osVersion}\nHardware info: ${cpu} ${memory} RAM\n\nRelease date: ${build.date}\nBuild number: ${build.number}\n\nCreated by: Lőrik Levente`

	const res = await dialog.confirm(info, { cancelLabel: "Close", okLabel: "Copy" })

	if (res) {
		clipboard.writeText(info)
	}
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

		if (build.dev === false) {
			await invoke("disable_auto_launch")
			process.exit()
		} else {
			navigate("/")
			location.reload()
		}
	}
}

export const showLogs = async () => {
	const folderPath = await path.join(await path.cacheDir(), "com.levminer.authme", "logs")
	open(folderPath)
}

export const launchOnStartup = () => {
	if (settings.settings.launchOnStartup === true) {
		invoke("disable_auto_launch")
	} else {
		invoke("enable_auto_launch")
	}
}
