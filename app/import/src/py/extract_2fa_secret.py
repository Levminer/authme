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


def get_enum_name_by_number(parent, field_name):
    field_value = getattr(parent, field_name)
    return (
        parent.DESCRIPTOR.fields_by_name[field_name]
        .enum_type.values_by_number.get(field_value)
        .name
    )


def convert_secret_from_bytes_to_base32_str(bytes):
    return str(base64.b32encode(otp.secret), "utf-8").replace("=", "")


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
