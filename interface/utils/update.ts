import { updater, dialog } from "@tauri-apps/api"
import { relaunch } from "@tauri-apps/api/process"
import { getState, setState } from "interface/stores/state"
import { dev } from "../../build.json"
import logger from "./logger"

const state = getState()
let releaseNotes: string

/**
 * Check for auto update
 */
export const checkForUpdate = async () => {
	if (dev === false) {
		try {
			const { shouldUpdate, manifest } = await updater.checkUpdate()
			if (shouldUpdate) {
				releaseNotes = manifest.body

				logger.log(`Latest update: ${JSON.stringify(manifest)}`)

				state.updateAvailable = true
				setState(state)
			}
		} catch (error) {
			logger.error(`Failed to check for update: ${error}`)
		}
	}
}

export const installUpdate = async () => {
	document.querySelector(".updateText").textContent = "Downloading update... Please wait!"

	await updater.installUpdate()
	await relaunch()
}

export const showReleaseNotes = () => {
	dialog.message(releaseNotes)
}
