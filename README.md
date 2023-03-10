# Authme

-   Simple cross-platform two-factor (2FA) authenticator app for desktop.

[![Downloads](https://img.shields.io/github/downloads/levminer/authme/total?label=Downloads)](https://authme.levminer.com/#downloads)
[![Support](https://img.shields.io/badge/Support-PayPal-blue)](https://paypal.me/levminer)
[![License](https://img.shields.io/github/license/levminer/authme?label=License)](https://github.com/Levminer/authme/blob/main/LICENSE.md)

## Features

-   🔒 Secure by design: Your codes is secured by AES 256bit encryption with your own password.
-   🔑 Import codes: Import form any 2FA TOTP QR code or import directly from Google Authenticator.
-   ⌨️ Many shortcuts: Easily open Authme with custom shortcuts and the app will start with your system for quick and easy access.
-   📡 Completely offline: You own your data, internet is only required for updates.
-   💻 Privacy in mind: Authme is hidden from video capture and screenshots.
-   📃 Easy export and backup: You can export your 2FA codes anytime and you can create a backup of your codes very easily.

## Compatible 2FA codes

-   TOTP 2FA QR code: A TOTP QR code is that you find mostly everywhere, if you want to setup 2FA. Example: Google, Facebook, Microsoft, etc.
-   Google Authenticator QR code: A Google Authenticator QR code is what you can export, and contains all of your already imported codes. Example: Google Authenticator.

## Screenshot

<img src="https://raw.githubusercontent.com/Levminer/authme/dev/screenshots/codes.png?raw=true">

## Downloads (Release)

-   Latest release version for users that want a stable and polished experience.

[![Latest release](https://img.shields.io/github/package-json/v/levminer/authme/main?label=Release)](https://tooomm.github.io/github-release-stats/?username=Levminer&repository=authme)
[![Download](https://img.shields.io/badge/Windows,%20Linux,%20macOS-download-brightgreen)](https://authme.levminer.com/#downloads)
[![Updated](https://img.shields.io/github/last-commit/levminer/authme/main?color=yellowgreen&label=Updated)](https://github.com/Levminer/authme/releases)

-   Also available on: [Microsoft Store](https://link.levminer.com/authme-ms-store), [Snapcraft](https://snapcraft.io/authme), [winget](https://winstall.app/apps/Levminer.Authme), and [Scoop](https://scoop.sh/#/apps?s=2&d=1&o=true&q=authme).

## Downloads (Alpha)

-   Latest alpha version for users that want to try out new features early.

[![Latest alpha](https://img.shields.io/github/package-json/v/levminer/authme/dev?label=Alpha&color=blue)](https://tooomm.github.io/github-release-stats/?username=Levminer&repository=authme)
[![Download](https://img.shields.io/badge/Windows,%20Linux,%20macOS-download-brightgreen)](https://authme.levminer.com/#downloads-alpha)
[![Updated](https://img.shields.io/github/last-commit/levminer/authme/dev?color=yellowgreen&label=Updated)](https://github.com/Levminer/authme/actions/workflows/alpha-artifacts.yml)

## Migration

Tutorial on how to migrate to Authme 4 from Authme 3:

1. Inside Authme: Top menu > Tools > Export.
1. Click confirm, and export the .authme file.
1. Go to the settings: Top menu > File > Settings.
1. Inside the general options: Click Clear data and confirm.
1. Now uninstall Authme from you computer.
1. Download [Authme 4](https://authme.levminer.com/#downloads) and install it.
1. Go through the getting started wizard.
1. In the codes page select Choose file and choose the .authme file you saved.

## Contributing and development

-   Read for development and building instructions: [Contributing](https://github.com/Levminer/authme/blob/main/.github/CONTRIBUTING.md)
-   Read before contributing: [Code Of Conduct](https://github.com/Levminer/authme/blob/main/.github/CODE_OF_CONDUCT.md)

## License

-   This software is licensed under: [GPL-3.0](https://github.com/Levminer/authme/blob/main/LICENSE.md)
-   If you are planning to use this software as a business please contact me at: <authme@levminer.com>
