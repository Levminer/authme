import { mkdirSync, existsSync, copyFileSync } from "fs"
import { platform } from "os"
import json from "../package.json" assert { type: "json" }

const os = platform()
const version = json.version

if (!existsSync("./core/target/release/upload")) {
	mkdirSync("./core/target/release/upload")
}

if (os === "win32") {
	try {
		copyFileSync(`./core/target/release/bundle/msi/Authme_${version}_x64_en-US.msi`, `./core/target/release/upload/authme-${version}-windows-x64.msi`)
		copyFileSync(`./core/target/release/bundle/msi/Authme_${version}_x64_en-US.msi.zip`, `./core/target/release/upload/authme-${version}-windows-x64.zip`)
		copyFileSync(`./core/target/release/bundle/msi/Authme_${version}_x64_en-US.msi.zip.sig`, `./core/target/release/upload/authme-${version}-windows-x64.sig`)
	} catch (err) {
		console.log("File not found")
	}
} else if (os === "darwin") {
	try {
		copyFileSync(`./core/target/release/bundle/dmg/Authme_${version}_x64.dmg`, `./core/target/release/upload/authme-${version}-macos-x64.dmg`)
		copyFileSync("./core/target/release/bundle/macos/Authme.app.tar.gz", `./core/target/release/upload/authme-${version}-macos-x64.tar.gz`)
		copyFileSync("./core/target/release/bundle/macos/Authme.app.tar.gz.sig", `./core/target/release/upload/authme-${version}-macos-x64.sig`)
	} catch (err) {
		console.log("File not found")
	}
} else {
	try {
		copyFileSync(`./core/target/release/bundle/appimage/authme_${version}_amd64.AppImage`, `./core/target/release/upload/authme-${version}-linux-x64.appimage`)
		copyFileSync(`./core/target/release/bundle/appimage/authme_${version}_amd64.AppImage.tar.gz`, `./core/target/release/upload/authme-${version}-linux-x64.tar.gz`)
		copyFileSync(`./core/target/release/bundle/appimage/authme_${version}_amd64.AppImage.tar.gz.sig`, `./core/target/release/upload/authme-${version}-linux-x64.sig`)
		copyFileSync(`./core/target/release/bundle/deb/authme_${version}_amd64.deb`, `./core/target/release/upload/authme-${version}-linux-x64.deb`)
	} catch (err) {
		console.log("File not found")
	}
}
