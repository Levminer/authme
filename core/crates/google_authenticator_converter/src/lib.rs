use base64::{engine::general_purpose, Engine as _};
use protobuf::Message;
use serde::Serialize;

mod proto;
#[derive(Debug, Serialize)]
pub struct Account {
    name: String,
    secret: String,
    issuer: String,
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

pub fn process_data(string: &str) -> Vec<Account> {
    let encoded_data = extract_data_from_uri(string).unwrap();
    let decoded_data = general_purpose::STANDARD.decode(encoded_data).unwrap();

    let migration_payload =
        proto::google_auth::MigrationPayload::parse_from_bytes(decoded_data.as_slice()).unwrap();

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

    return payloads;
}

pub fn extract_data_from_uri(raw: &str) -> Result<String, Box<dyn std::error::Error>> {
    let mut split = raw.split("data=");

    if let Some(encoded_data) = split.next() {
        let s = urlencoding::decode(encoded_data)?;
        Ok(s.to_string())
    } else {
        Err("No data found in URI".into())
    }
}
