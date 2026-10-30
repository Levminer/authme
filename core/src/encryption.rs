use argon2::{
    password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};
use base64::{engine::general_purpose::STANDARD, Engine as _};
use magic_crypt::{new_magic_crypt, MagicCryptTrait};
use once_cell::sync::Lazy;
use rand_core::RngCore;
use std::sync::Mutex;
extern crate keyring;

static ENCRYPTION_KEY: Lazy<Mutex<String>> = Lazy::new(|| Mutex::new("".to_owned()));

#[tauri::command]
pub fn encrypt_password(password: String) -> String {
    let salt = SaltString::generate(&mut OsRng);

    // Argon2 with default params (Argon2id v19)
    let argon2 = Argon2::default();

    // Hash password to PHC string ($argon2id$v=19$...)
    let password_hash = argon2
        .hash_password(password.as_bytes(), &salt)
        .unwrap()
        .to_string();

    password_hash.into()
}

#[tauri::command]
pub fn verify_password(password: String, hash: String) -> bool {
    let parsed_hash = PasswordHash::new(&hash).unwrap();

    let result = Argon2::default()
        .verify_password(password.as_bytes(), &parsed_hash)
        .is_ok();

    result.into()
}

/// Name of the keychain entry that holds the vault key in no authentication mode
const KEY_NAME: &str = "encryptionKey";

/// Keys produced by the broken key generation between 4.1.0 and 7.1.1
/// "" was stored on success, "error" was used when the keychain access failed
const LEGACY_KEYS: [&str; 2] = ["", "error"];

fn is_legacy_key(key: &str) -> bool {
    LEGACY_KEYS.contains(&key)
}

fn generate_key() -> String {
    let mut bytes = [0u8; 32];
    OsRng.fill_bytes(&mut bytes);

    STANDARD.encode(bytes)
}

fn encrypt_with(key: &str, data: &str) -> String {
    let mc = new_magic_crypt!(key, 256);

    mc.encrypt_str_to_base64(data)
}

fn decrypt_with(key: &str, data: &str) -> Result<String, String> {
    let mc = new_magic_crypt!(key, 256);

    mc.decrypt_base64_to_string(data)
        .map_err(|error| error.to_string())
}

fn current_key() -> Result<String, String> {
    let key = ENCRYPTION_KEY.lock().unwrap().to_string();

    if key.is_empty() {
        return Err("Encryption key is not set".into());
    }

    Ok(key)
}

/// The saved codes are either empty or in the Name/Secret/Issuer/Type text format
fn looks_like_codes(text: &str) -> bool {
    text.trim().is_empty() || text.contains("Name:")
}

#[tauri::command]
pub fn encrypt_data(data: String) -> Result<String, String> {
    let key = current_key()?;

    Ok(encrypt_with(&key, &data))
}

#[tauri::command]
pub fn decrypt_data(data: String) -> Result<String, String> {
    let key = current_key()?;

    decrypt_with(&key, &data)
}

/// Returns None if the entry does not exist, Err if the keychain can't be accessed
fn get_entry(name: &str, service: &str) -> Result<Option<String>, String> {
    let entry = keyring::Entry::new(service, name).map_err(|error| error.to_string())?;

    match entry.get_password() {
        Ok(data) => Ok(Some(data)),
        Err(keyring::Error::NoEntry) => Ok(None),
        Err(error) => Err(error.to_string()),
    }
}

fn set_entry(name: &str, data: &str, service: &str) -> Result<(), String> {
    keyring::Entry::new(service, name)
        .and_then(|entry| entry.set_password(data))
        .map_err(|error| error.to_string())
}

#[tauri::command]
pub fn delete_entry(name: String, service: String) {
    if let Ok(entry) = keyring::Entry::new(&service, &name) {
        let _ = entry.delete_credential();
    }
}

#[tauri::command]
pub fn receive_encryption_key(key: String) {
    *ENCRYPTION_KEY.lock().unwrap() = key
}

/// Result of resolving the vault key in no authentication mode
#[derive(Debug, PartialEq)]
struct ResolvedKey {
    key: String,
    /// The key is new and has to be saved to the keychain
    is_new: bool,
    /// Codes re-encrypted with the key, if they were encrypted with a legacy key
    codes: Option<String>,
}

/// Picks the vault key and migrates codes encrypted with a legacy key
/// Never returns a legacy key and fails if the codes can't be decrypted
fn resolve_key(
    stored: Option<String>,
    codes: Option<&str>,
    new_key: impl FnOnce() -> String,
) -> Result<ResolvedKey, String> {
    let (key, is_new) = match stored {
        Some(key) if !is_legacy_key(&key) => (key, false),
        _ => (new_key(), true),
    };

    let codes = match codes {
        None => None,
        Some(codes) if !is_new && decrypt_with(&key, codes).is_ok() => None,
        Some(codes) => {
            let plain_text = LEGACY_KEYS
                .iter()
                .find_map(|legacy| {
                    decrypt_with(legacy, codes)
                        .ok()
                        .filter(|text| looks_like_codes(text))
                })
                .ok_or("Failed to decrypt the saved codes")?;

            Some(encrypt_with(&key, &plain_text))
        }
    };

    Ok(ResolvedKey { key, is_new, codes })
}

/// Creates the vault key for no authentication mode, an existing valid key is reused
#[tauri::command]
pub fn create_encryption_key(service: String) -> Result<(), String> {
    load_encryption_key(service, None).map(|_| ())
}

/// Loads the vault key for no authentication mode
/// Returns the re-encrypted codes if they had to be migrated from a legacy key
#[tauri::command]
pub fn load_encryption_key(
    service: String,
    codes: Option<String>,
) -> Result<Option<String>, String> {
    let stored = get_entry(KEY_NAME, &service)?;
    let resolved = resolve_key(stored, codes.as_deref(), generate_key)?;

    if resolved.is_new {
        set_entry(KEY_NAME, &resolved.key, &service)?;

        if get_entry(KEY_NAME, &service)?.as_deref() != Some(resolved.key.as_str()) {
            return Err("Failed to verify the encryption key on the keychain".into());
        }
    }

    *ENCRYPTION_KEY.lock().unwrap() = resolved.key;

    Ok(resolved.codes)
}

#[cfg(test)]
mod tests {
    use super::*;

    const CODES: &str =
        "\nName:   GitHub \nSecret: JBSWY3DPEHPK3PXP \nIssuer: GitHub \nType:   OTP_TOTP\n";

    fn new_key() -> String {
        "new-key".into()
    }

    #[test]
    fn generated_key_is_random_32_bytes() {
        let key = generate_key();

        assert_eq!(STANDARD.decode(&key).unwrap().len(), 32);
        assert_ne!(key, generate_key());
        assert!(!is_legacy_key(&key));
    }

    #[test]
    fn round_trip() {
        let encrypted = encrypt_with("key", CODES);

        assert_eq!(decrypt_with("key", &encrypted).unwrap(), CODES);
        assert!(decrypt_with("other", &encrypted).is_err());
    }

    #[test]
    fn valid_stored_key_is_used() {
        let codes = encrypt_with("stored", CODES);
        let res = resolve_key(Some("stored".into()), Some(&codes), new_key).unwrap();

        assert_eq!(
            res,
            ResolvedKey {
                key: "stored".into(),
                is_new: false,
                codes: None
            }
        );
    }

    #[test]
    fn missing_key_without_codes_creates_key() {
        let res = resolve_key(None, None, new_key).unwrap();

        assert_eq!(
            res,
            ResolvedKey {
                key: "new-key".into(),
                is_new: true,
                codes: None
            }
        );
    }

    #[test]
    fn legacy_keys_are_migrated() {
        for (stored, legacy) in [
            (Some(""), ""),
            (Some("error"), "error"),
            (None, "error"),
            (None, ""),
        ] {
            let codes = encrypt_with(legacy, CODES);
            let res = resolve_key(stored.map(String::from), Some(&codes), new_key).unwrap();

            assert_eq!(res.key, "new-key");
            assert!(res.is_new);
            assert_eq!(decrypt_with("new-key", &res.codes.unwrap()).unwrap(), CODES);
        }
    }

    #[test]
    fn interrupted_migration_is_completed() {
        // The new key was saved but the re-encrypted codes were not
        let codes = encrypt_with("", CODES);
        let res = resolve_key(Some("stored".into()), Some(&codes), new_key).unwrap();

        assert_eq!(res.key, "stored");
        assert!(!res.is_new);
        assert_eq!(decrypt_with("stored", &res.codes.unwrap()).unwrap(), CODES);
    }

    #[test]
    fn undecryptable_codes_fail() {
        let codes = encrypt_with("lost-key", CODES);

        assert!(resolve_key(None, Some(&codes), new_key).is_err());
        assert!(resolve_key(Some("".into()), Some(&codes), new_key).is_err());
        assert!(resolve_key(Some("stored".into()), Some(&codes), new_key).is_err());
    }
}
