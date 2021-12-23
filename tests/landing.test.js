const { _electron: electron } = require("playwright")
const { test, expect } = require("@playwright/test")

test("Test landing window", async () => {
	const electronApp = await electron.launch({ args: ["."] })

	const state = await electronApp.evaluate(async ({ BrowserWindow }) => {
		const mainWindow = BrowserWindow.getAllWindows()[0]

		return {
			isDestroyed: mainWindow.isDestroyed(),
			isCrashed: mainWindow.webContents.isCrashed(),
		}
	})

	expect(state.isDestroyed).toBeFalsy()
	expect(state.isCrashed).toBeFalsy()
})
