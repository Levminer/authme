""" Usage:
1. Export the QR codes from "Google Authenticator" app.
2. Read QR codes with QR code reader.
3. Save the captured QR codes in a text file. Save each QR code on a new line. (The captured QR codes look like "otpauth-migration://offline?data=...").
4. Call this script with the file as input:
"python extract_otp_secret_keys.py -q example.txt"

Required:
1. Install with pip:
"pip install protobuf"

Created by: 
Levminer (https://www.levminer.com)

Forked from:
Author: Scito (https://scito.ch)

License:
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>. """

import argparse
import base64
import fileinput
import sys
from urllib.parse import parse_qs, urlencode, urlparse

import google_2fa_export

arg_parser = argparse.ArgumentParser()
arg_parser.add_argument("--verbose", "-v", help="verbose output", action="store_true")
arg_parser.add_argument(
    "--qr", "-q", help="print QR codes (otpauth://...)", action="store_true"
)
arg_parser.add_argument(
    "infile",
    help='file or - for stdin (default: -) with "otpauth-migration://..." URLs separated by newlines, lines starting with # are ignored',
)
args = arg_parser.parse_args()

verbose = args.verbose
if args.qr:
    from qrcode import QRCode


def get_enum_name_by_number(parent, field_name):
    field_value = getattr(parent, field_name)
    return (
        parent.DESCRIPTOR.fields_by_name[field_name]
        .enum_type.values_by_number.get(field_value)
        .name
    )


def convert_secret_from_bytes_to_base32_str(bytes):
    return str(base64.b32encode(otp.secret), "utf-8").replace("=", "")


def print_qr(data):
    qr = QRCode()
    qr.add_data(data)
    qr.print_tty()


for line in (line.strip() for line in fileinput.input(args.infile)):
    if verbose:
        print(line)
    if line.startswith("#"):
        continue
    parsed_url = urlparse(line)
    params = parse_qs(parsed_url.query)
    data_encoded = params["data"][0]
    data = base64.b64decode(data_encoded)
    payload = google_2fa_export.MigrationPayload()
    payload.ParseFromString(data)
    if verbose:
        print(payload)

    # write to file
    file = open("exported.txt", "a")

    for otp in payload.otp_parameters:
        print("\nName:   {}".format(otp.name))
        file.write("\nName:   {} \n".format(otp.name))
        secret = convert_secret_from_bytes_to_base32_str(otp.secret)
        print("Secret: {}".format(secret))
        file.write(("Secret: {} \n".format(secret)))
        if otp.issuer:
            print("Issuer: {}".format(otp.issuer))
            file.write("Issuer: {} \n".format(otp.issuer))
        print("Type:   {}".format(get_enum_name_by_number(otp, "type")))
        file.write(("Type:   {} \n".format(get_enum_name_by_number(otp, "type"))))
        url_params = {"secret": secret}
        if otp.type == 1:
            url_params["counter"] = otp.counter
        if otp.issuer:
            url_params["issuer"] = otp.issuer
        otp_url = "otpauth://{}/{}?".format(
            "totp" if otp.type == 2 else "hotp", otp.name
        ) + urlencode(url_params)

        if args.qr:
            if verbose:
                print(otp_url)
            print_qr(otp_url)