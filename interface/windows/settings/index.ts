import build from "../../../build.json"
import { path, invoke, os, dialog, app, process, clipboard, window } from "@tauri-apps/api"
import { UAParser } from "ua-parser-js"
import { navigate, open } from "../../utils/navigate"
import { deleteEncryptionKey } from "interface/utils/encryption"
import { getSettings, setSettings } from "interface/stores/settings"

const settings = getSettings()

export interface SystemInfo {
	osName: string
	osArch: string
	cpuName: string
	totalMem: number
}

export const about = async () => {
	const tauriVersion = await app.getTauriVersion()
	const osVersion = await os.version()
	const browser = new UAParser().getBrowser()

	// Browser version
	const browserName = browser.name.replace("Edge", "Chromium").replace("Safari", "WebKit")
	const browserVersion = browser.version

	// System info
	const systemInfo: SystemInfo = await invoke("system_info")

	const cpu = systemInfo.cpuName
		.split("@")[0]
		.replaceAll("(R)", "")
		.replaceAll("(TM)", "")
		.replace(/ +(?= )/g, "")
	const memory = `${Math.round(systemInfo.totalMem / 1024 / 1024 / 1024)} GB`
	const osName = systemInfo.osName
	const osArch = systemInfo.osArch.replace("x86_64", "x64").replace("aarch64", "arm64")

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

/**
 * Delete all imported codes
 */
export const deleteCodes = async () => {
	settings.vault.codes = null
	setSettings(settings)

	navigate("codes")
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

export const toggleWindowCapture = (windowCapture: boolean) => {
	window.appWindow.setContentProtected(windowCapture)
}
