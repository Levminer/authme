import build from "../../../build.json"
import { path, app, webviewWindow } from "@tauri-apps/api"
import { invoke } from "@tauri-apps/api/core"
import { navigate, open } from "../../utils/navigate"
import { deleteEncryptionKey } from "interface/utils/encryption"
import { getSettings, setSettings } from "interface/stores/settings"
import * as os from "@tauri-apps/plugin-os"
import * as dialog from "@tauri-apps/plugin-dialog"
import * as process from "@tauri-apps/plugin-process"
import * as clipboard from "@tauri-apps/plugin-clipboard-manager"
import { revealItemInDir } from "@tauri-apps/plugin-opener"

const settings = getSettings()

export interface SystemInfo {
	osName: string
	osArch: string
	cpuName: string
	totalMem: number
}

export const about = async () => {
	const tauriVersion = await app.getTauriVersion()
	const osVersion = os.version()

	// Browser version
	interface userAgentData {
		fullVersionList?: { version: string }[]
	}

	let runtimeVersion = navigator.userAgent

	try {
		// @ts-ignore
		const ua: userAgentData = await navigator.userAgentData.getHighEntropyValues(["architecture", "model", "platform", "platformVersion", "fullVersionList"])

		if (ua.fullVersionList !== undefined && ua.fullVersionList.length > 0) {
			// @ts-ignore
			runtimeVersion = ua.fullVersionList.filter((item) => item.brand === "Chromium")[0]?.version || "N/A"
		}
	} catch (error) {
		console.log(error)
	}

	// System info
	const systemInfo: SystemInfo = await invoke("system_info")

	const cpu = systemInfo.cpuName
		.split("@")[0]
		.replaceAll("(R)", "")
		.replaceAll("(TM)", "")
		.replace(/ +(?= )/g, "")
	const memory = `${Math.round(systemInfo.totalMem / 1024 / 1024 / 1024)} GB`
	const osName = systemInfo.osName
	const osArch = systemInfo.osArch

	const info = `Authme: ${build.version} \n\nTauri: ${tauriVersion}\nRuntime: ${runtimeVersion}\n\nOS version: ${osName} ${osArch} ${osVersion}\nHardware info: ${cpu} ${memory} RAM\n\nRelease date: ${build.date}\nBuild number: ${build.number}\n\nCreated by: Lőrik Levente`

	const res = await dialog.confirm(info, { cancelLabel: "Close", okLabel: "Copy" })

	if (res) {
		clipboard.writeText(info)
	}
}

/**
 * Delete selected data
 */
export const clearData = async (clearCodesOption: boolean, clearSettingsOption: boolean) => {
	const dialogClearData: LibDialogElement = document.querySelector(".dialogClearData")

	// clear codes
	if (clearCodesOption && !clearSettingsOption) {
		const confirm0 = await dialog.ask("Are you sure you want to clear 2FA codes? \n\nThis cannot be undone!", { kind: "warning" })

		if (confirm0 === false) {
			return
		}

		settings.vault.codes = null
		setSettings(settings)

		dialogClearData.close()
		navigate("codes")
	}

	// clear settings
	if (!clearCodesOption && clearSettingsOption) {
		const confirm0 = await dialog.ask("Are you sure you want to clear all settings? \n\nThis cannot be undone!", { kind: "warning" })

		if (confirm0 === false) {
			return
		}

		settings.settings.language = 0
		settings.settings.launchOnStartup = true
		settings.settings.minimizeToTray = true
		settings.settings.optionalAnalytics = true
		settings.settings.codesDescription = false
		settings.settings.blurCodes = false
		settings.settings.sortCodes = 0
		settings.settings.codesLayout = 0
		setSettings(settings)

		dialogClearData.close()
		navigate("settings")
	}

	// clear everything
	if (clearCodesOption && clearSettingsOption) {
		const confirm0 = await dialog.ask("Are you sure you want to clear all data? \n\nThis cannot be undone!", { kind: "warning" })

		if (confirm0 === false) {
			return
		}

		const confirm1 = await dialog.ask("Are you absolutely sure? \n\nThere is no way back!", { kind: "warning" })

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
}

/**
 * Show Clear data dialog
 */
export const showClearDataDialog = () => {
	const dialogClearData: LibDialogElement = document.querySelector(".dialogClearData")
	const closeDialog = document.querySelector(".dialogClearDataClose")

	closeDialog.addEventListener("click", () => {
		dialogClearData.close()
	})

	dialogClearData.showModal()
}

export const showLogs = async () => {
	const folderPath = await path.join(await path.cacheDir(), "com.levminer.authme", "logs")
	revealItemInDir(folderPath)
}

export const launchOnStartup = () => {
	if (settings.settings.launchOnStartup === true) {
		invoke("disable_auto_launch")
	} else {
		invoke("enable_auto_launch")
	}
}

export const toggleWindowCapture = (windowCapture: boolean) => {
	const appWindow = webviewWindow.getCurrentWebviewWindow()

	appWindow.setContentProtected(windowCapture)
}
