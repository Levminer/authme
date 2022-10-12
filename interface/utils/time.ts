/**
 * Returns the current timestamp
 * @return {string} Timestamp
 */
export const generateTimestamp = (): string => {
	return new Date().toISOString().replace("T", "-").replaceAll(":", "-").substring(0, 19)
}
