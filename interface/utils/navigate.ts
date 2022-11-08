import { shell } from "@tauri-apps/api"
import { router } from "tinro"

/**
 * Go to the specified link
 * @param link
 * @example navigate("codes")
 */
export const navigate = (link: string) => {
	router.goto(link)
}

/**
 * Open a specified link in the default program
 * @param link
 * @example open("https://github.com/levminer/authme")
 */
export const open = (link: string) => {
	shell.open(link)
}
