# Usage:

1. Export the QR codes from "Google Authenticator" app (Top right corner).
2. Read QR codes with QR code reader (I recommend a 3rd party app).
3. Save the captured QR codes in a text file. Save each QR code on a new line (The captured QR codes look like "otpauth-migration://offline?data=...").
4. Install dependencies (See below).
5. Open aterminal navigate to te file and call this script with the file as input (Make sure you are in the correct folder).
6. Open Authme and select the exported txt file (Just select exported.txt).

-   `python extract_2fa_secret.py example.txt` (Without QR codes)
-   `python extract_2fa_secret.py -q example.txt` (With QR codes)

# Dependencies:

1. Install with pip:

-   `pip install protobuf` (Required)
-   `pip install qrcode` (Required for QR codes)

# License:

Edited by: Levminer (https://www.levminer.com)

Forked from: Scito (https://scito.ch)

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
