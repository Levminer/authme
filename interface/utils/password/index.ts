import { passwords } from "./passwords.json"

/**
 * Match the input with the top 1000 password
 */
export const search = (input: string): boolean => {
	let match = false

	for (let i = 0; i < passwords.length; i++) {
		if (passwords[i] === input) {
			return (match = true)
		}
	}

	return match
}
