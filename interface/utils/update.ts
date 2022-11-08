import { updater, dialog, os } from "@tauri-apps/api"
import { relaunch } from "@tauri-apps/api/process"
import { getState, setState } from "interface/stores/state"
import { dev } from "../../build.json"
import { markdownConverter } from "./convert"
import logger from "./logger"
import { open } from "./navigate"

const state = getState()

/**
 * Check for auto update
 */
export const checkForUpdate = async () => {
	if (dev === false) {
		try {
			const { shouldUpdate, manifest } = await updater.checkUpdate()
			if (shouldUpdate) {
				logger.log(`Latest update: ${JSON.stringify(manifest)} ${manifest.body}`)

				state.updateAvailable = true
				setState(state)
			}
		} catch (error) {
			logger.error(`Failed to check for update: ${error}`)
		}
	}
}

export const installUpdate = async () => {
	const system = await os.type()

	if (system !== "Windows_NT") {
		open("https://authme.levminer.com/#downloads")
	} else {
		document.querySelector(".updateText").textContent = "Downloading update... Please wait!"
		document.querySelector(".installUpdate").style.display = "none"

		await updater.installUpdate()
		await relaunch()
	}
}

export const showReleaseNotes = async () => {
	const res = await (await fetch("https://api.levminer.com/api/v1/authme/releases")).json()
	dialog.message(markdownConverter(res.body.split("Other")[0]))
}
