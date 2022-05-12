const { _electron: electron } = require("playwright")
const { test, expect } = require("@playwright/test")

let /** @type{import('playwright').ElectronApplication} */ electronApp
let /** @type{import('playwright').Page} */ landing
let /** @type{import('playwright').Page} */ settings

const setup = async () => {
	electronApp = await electron.launch({ args: ["."] })

	const windows = electronApp.windows()

	for (let i = 0; i < windows.length; i++) {
		if (windows[i].url().includes("landing")) {
			landing = windows[i]
			console.log("Landing window found")
		}

		if (windows[i].url().includes("settings")) {
			settings = windows[i]
			console.log("Settings window found")
		}
	}
}

test.describe("Tests", async () => {
	test.beforeAll(async () => {
		console.log("Start")
		await setup()
	})

	test("Test import", async () => {
		console.log("Import")

		// Click requirePassword button
		await landing.locator(".requirePassword").click()

		// Fill passwords inputs
		await landing.locator("#password_input1").fill("123")
		await landing.locator("#password_input2").fill("123")

		// Click and compare
		await landing.locator(".comparePasswords").click()
		await expect(landing.locator("#text")).toHaveText("Minimum password length is 8 characters!")
		await landing.screenshot({ path: "tests/landing0.png" })

		// Fill passwords inputs
		await landing.locator("#password_input1").fill("12345678")
		await landing.locator("#password_input2").fill("12345678")

		// Click and compare
		await landing.locator(".comparePasswords").click()
		await expect(landing.locator("#text")).toHaveText("This password is on the list of the top 1000 most common passwords. Please choose a more secure password!")
		await landing.screenshot({ path: "tests/landing1.png" })

		// Fill passwords inputs
		await landing.locator("#password_input1").fill("012345678")
		await landing.locator("#password_input2").fill("012345678")

		// Click and compare
		/* await landing.locator(".comparePasswords").click()
		await expect(landing.locator("#text")).toHaveText("Passwords match! Please wait!")
		await landing.screenshot({ path: "tests/landing2.png" }) */
	})
})
