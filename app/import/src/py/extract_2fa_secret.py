import argparse
import base64
import fileinput
import sys
from urllib.parse import parse_qs, urlencode, urlparse, quote
from os import path, mkdir
from re import sub, compile as rcompile
import google_2fa_export

arg_parser = argparse.ArgumentParser()
arg_parser.add_argument("--verbose", "-v", help="verbose output", action="store_true")
arg_parser.add_argument(
    "--saveqr",
    "-s",
    help='save QR code(s) as images to the "qr" subfolder',
    action="store_true",
)
arg_parser.add_argument(
    "--printqr",
    "-p",
    help="print QR code(s) as text to the terminal",
    action="store_true",
)
arg_parser.add_argument(
    "infile",
    help='file or - for stdin (default: -) with "otpauth-migration://..." URLs separated by newlines, lines starting with # are ignored',
)
args = arg_parser.parse_args()

if args.saveqr or args.printqr:
    from qrcode import QRCode
verbose = args.verbose

# https://stackoverflow.com/questions/40226049/find-enums-listed-in-python-descriptor-for-protobuf
def get_enum_name_by_number(parent, field_name):
    field_value = getattr(parent, field_name)
    return (
        parent.DESCRIPTOR.fields_by_name[field_name]
        .enum_type.values_by_number.get(field_value)
        .name
    )


def convert_secret_from_bytes_to_base32_str(bytes):
    return str(base64.b32encode(otp.secret), "utf-8").replace("=", "")


def save_qr(data, name):
    qr = QRCode()
    qr.add_data(data)
    img = qr.make_image(fill_color="black", back_color="white")
    if verbose:
        print("Saving to {}".format(name))
    img.save(name)


def print_qr(data):
    qr = QRCode()
    qr.add_data(data)
    qr.print_tty()


i = j = 0

test = [0]

for x in test:
    parsed_url = urlparse(args.infile)
    params = parse_qs(parsed_url.query)
    data_encoded = params["data"][0]
    data = base64.b64decode(data_encoded)
    payload = google_2fa_export.MigrationPayload()
    payload.ParseFromString(data)
    i += 1
    if verbose:
        print("\n{}. Payload Line".format(i), payload, sep="\n")

    # pylint: disable=no-member
    for otp in payload.otp_parameters:
        j += 1
        if verbose:
            print("\n{}. Secret Key".format(j))
        else:
            print()
        print("Name:   {}".format(otp.name))
        secret = convert_secret_from_bytes_to_base32_str(otp.secret)
        print("Secret: {}".format(secret))
        if otp.issuer:
            print("Issuer: {}".format(otp.issuer))
        print("Type:   {}".format(get_enum_name_by_number(otp, "type")))
        url_params = {"secret": secret}
        if otp.type == 1:
            url_params["counter"] = otp.counter
        if otp.issuer:
            url_params["issuer"] = otp.issuer
        otp_url = "otpauth://{}/{}?".format(
            "totp" if otp.type == 2 else "hotp", quote(otp.name)
        ) + urlencode(url_params)
        if verbose:
            print(otp_url)
        if args.printqr:
            print_qr(otp_url)
        if args.saveqr:
            if not (path.exists("qr")):
                mkdir("qr")
            pattern = rcompile(r"[\W_]+")
            file_otp_name = pattern.sub("", otp.name)
            file_otp_issuer = pattern.sub("", otp.issuer)
            save_qr(
                otp_url,
                "qr/{}-{}{}.png".format(
                    j, file_otp_name, "-" + file_otp_issuer if file_otp_issuer else ""
                ),
            )
