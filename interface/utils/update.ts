import { relaunch } from "@tauri-apps/plugin-process"
import * as dialog from "@tauri-apps/plugin-dialog"
import * as os from "@tauri-apps/plugin-os"
import { getState, setState } from "interface/stores/state"
import { dev } from "../../build.json"
import { markdownConverter } from "./convert"
import logger from "./logger"
import { open } from "./navigate"
import { check, Update } from "@tauri-apps/plugin-updater"

const state = getState()
let updateObj: Update // TODO: should be an easier way

/**
 * Check for auto update
 */
export const checkForUpdate = async () => {
	if (!dev) {
		try {
			const update = await check()

			// No update available
			if (update === null) {
				return
			}

			updateObj = update
			if (update.available) {
				logger.log(`Latest update: ${JSON.stringify(update)} ${update.body}`)

				state.updateAvailable = true
				setState(state)
			}
		} catch (error) {
			logger.error(`Failed to check for update: ${error}`)
		}
	}
}

export const installUpdate = async () => {
	const system = os.type()

	if (system !== "windows") {
		open("https://authme.levminer.com/#downloads")
	} else {
		document.querySelector(".updateText").textContent = "Downloading update... Please wait!"
		document.querySelector(".installUpdate").style.display = "none"

		await updateObj.downloadAndInstall()
		await relaunch()
	}
}

export const showReleaseNotes = async () => {
	const res = await (await fetch("https://api.levminer.com/api/v1/authme/releases")).json()
	dialog.message(markdownConverter(res.body.split("Other")[0]))
}
