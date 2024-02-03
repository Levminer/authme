import { SystemInfo } from "interface/windows/settings"
import build from "../../build.json"
import { invoke, os } from "@tauri-apps/api"

export const optionalAnalyticsPayload = async () => {
	const osName = (await invoke<SystemInfo>("system_info")).osName
	const osArch = await os.arch()
	const osVersion = await os.version()

	return {
		version: build.version,
		build: build.number,
		os: `${osName} ${osArch.replace("x86_64", "x64").replace("aarch64", "arm64")} ${osVersion}`,
		lang: navigator.language,
		date: new Date(),
	}
}
