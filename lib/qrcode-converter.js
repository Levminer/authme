const protons = require("protons")
const base32 = require("./base32")

const content = `
syntax = "proto3";

package googleauth;

message MigrationPayload {
enum Algorithm {
    ALGO_INVALID = 0;
    ALGO_SHA1 = 1;
}

enum OtpType {
    OTP_INVALID = 0;
    OTP_HOTP = 1;
    OTP_TOTP = 2;
}

message OtpParameters {
    bytes secret = 1;
    string name = 2;
    string issuer = 3;
    Algorithm algorithm = 4;
    int32 digits = 5;
    OtpType type = 6;
    int64 counter = 7;
}

repeated OtpParameters otp_parameters = 1;
int32 version = 2;
int32 batch_size = 3;
int32 batch_index = 4;
int32 batch_id = 5;
}
`

module.exports = {
	convert: (text) => {
		const toBase32 = (base64String) => {
			const raw = Buffer.from(base64String, "base64")
			return base32.encode(raw)
		}

		const buffer = Buffer.from(decodeURIComponent(text), "base64")
		const proto = protons(content)
		const final = proto.MigrationPayload.decode(buffer)

		const arr = []

		for (let i = 0; i < final.otp_parameters.length; i++) {
			const secret = toBase32(final.otp_parameters[i].secret)

			const obj = {
				name: final.otp_parameters[i].name,
				secret: secret.replaceAll("=", ""),
				issuer: final.otp_parameters[i].issuer,
			}

			arr.push(obj)
		}

		return arr
	},
}
