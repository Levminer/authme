import build from "../../build.json"
import { os } from "@tauri-apps/api"

export const optionalAnalyticsPayload = async () => {
	const osType = await os.type()
	const osArch = await os.arch()
	const osVersion = await os.version()

	return {
		version: build.version,
		build: build.number,
		os: `${osType} ${osArch.replace("x86_64", "x64")} ${osVersion}`,
		lang: navigator.language.slice(0, 2),
		date: new Date(),
	}
}
