# Usage:

1. Export the QR codes from "Google Authenticator" app.
2. Read QR codes with QR code reader.
3. Save the captured QR codes in a text file. Save each QR code on a new line. (The captured QR codes look like "otpauth-migration://offline?data=...").
4. Call this script with the file as input:

-   `python extract_2fa_secret.py example.txt` (Without QR codes)
-   `python extract_2fa_secret.py -q example.txt` (With QR codes)

# Dependencies:

1. Install with pip:

-   `pip install protobuf` (Required)
-   `pip install qrcode` (Required for QR codes)

Edited by:
Levminer (https://www.levminer.com)

Forked from:
Scito (https://scito.ch)

# License:

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
