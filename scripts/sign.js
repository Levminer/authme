import { exec } from "child_process"
import { platform } from "os"

if (platform() === "win32") {
	exec("trusted-signing-cli -f ./core/target/release/Authme.exe -e https://eus.codesigning.azure.net -c mnr -n Profile1", (error, stdout) => {
		if (error) {
			return console.error(`Error: ${error}`)
		}

		console.log(`Result: ${stdout}`)
	})
}
