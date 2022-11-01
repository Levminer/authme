import build from "../../build.json"
import { invoke, os } from "@tauri-apps/api"

export const optionalAnalyticsPayload = async () => {
	const osType = (await invoke<string>("system_info")).split("+")[0]
	const osArch = await os.arch()
	const osVersion = await os.version()

	return {
		version: build.version,
		build: build.number,
		os: `${osType} ${osArch.replace("x86_64", "x64")} ${osVersion}`,
		lang: navigator.language,
		date: new Date(),
	}
}
