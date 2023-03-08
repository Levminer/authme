//! # Google Authenticator Converter
//!
//! -   Extract name, secret and issuer from a Google Authenticator migration QR code
//!
//! ### Example
//!
//! ```rust
//! use google_authenticator_converter::{extract_data_from_uri, process_data, Account};
//!
//! let qr_code = "otpauth-migration://offline?data=CjMKCkhlbGxvId6tvu8SGFRlc3QxOnRlc3QxQGV4YW1wbGUxLmNvbRoFVGVzdDEgASgBMAIKMwoKSGVsbG8h3q2%2B8BIYVGVzdDI6dGVzdDJAZXhhbXBsZTIuY29tGgVUZXN0MiABKAEwAgozCgpIZWxsbyHerb7xEhhUZXN0Mzp0ZXN0M0BleGFtcGxlMy5jb20aBVRlc3QzIAEoATACEAEYASAAKI3orYEE";
//!
//! let accounts = process_data(&qr_code);
//!
//! for account in accounts.unwrap() {
//!     println!("{0} {1} {2}", account.name, account.secret, account.issuer);
//! }
//!

use base64::{engine::general_purpose, Engine as _};
use protobuf::Message;
use serde::Serialize;

mod proto;
#[derive(Debug, Serialize)]
pub struct Account {
    pub name: String,
    pub secret: String,
    pub issuer: String,
}

impl Account {
    pub fn new(name: String, secret: String, mut issuer: String) -> Account {
        // If the issuer is empty, use the name as the issuer.
        if issuer.is_empty() {
            issuer = name.clone()
        }

        Account {
            name,
            secret,
            issuer,
        }
    }
}

/// Convert a Google Authenticator migration QR code string to a list of accounts
pub fn process_data(string: &str) -> Result<Vec<Account>, Box<dyn std::error::Error>> {
    let encoded_data = extract_data_from_uri(string)?;
    let decoded_data = general_purpose::STANDARD.decode(encoded_data)?;

    let migration_payload =
        proto::google_auth::MigrationPayload::parse_from_bytes(decoded_data.as_slice())?;

    let otp_parameters = migration_payload.otp_parameters.into_vec();

    let alphabet = base32::Alphabet::RFC4648 { padding: false };

    let payloads: Vec<Account> = otp_parameters
        .into_iter()
        .map(|a| {
            Account::new(
                a.name,
                base32::encode(alphabet, a.secret.as_slice()),
                a.issuer,
            )
        })
        .collect();

    return Ok(payloads);
}

pub fn extract_data_from_uri(raw: &str) -> Result<String, Box<dyn std::error::Error>> {
    let mut split = raw.split("data=");
    split.next();

    if let Some(encoded_data) = split.next() {
        let s = urlencoding::decode(encoded_data)?;
        Ok(s.to_string())
    } else {
        Err("No data found in URI".into())
    }
}
