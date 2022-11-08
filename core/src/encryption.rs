use argon2::{
    password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};
use magic_crypt::{new_magic_crypt, MagicCryptTrait};
use once_cell::sync::Lazy;
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

#[tauri::command]
pub fn encrypt_data(data: String) -> String {
    let key = ENCRYPTION_KEY.lock().unwrap().to_string();
    let mc = new_magic_crypt!(key, 256);

    let encrypted_string = mc.encrypt_str_to_base64(data);

    encrypted_string.into()
}

#[tauri::command]
pub fn decrypt_data(data: String) -> String {
    let key = ENCRYPTION_KEY.lock().unwrap().to_string();
    let mc = new_magic_crypt!(key, 256);

    let decrypted_string = mc
        .decrypt_base64_to_string(data)
        .unwrap_or_else(|error| "error".into());

    decrypted_string.into()
}

#[tauri::command]
pub fn set_entry(name: String, data: String, service: String) -> String {
    let entry = keyring::Entry::new(&service, &name);

    let res = entry.set_password(data.as_str());

    match res {
        Ok(_) => "ok".into(),
        Err(_) => "error".into(),
    }
}

#[tauri::command]
pub fn get_entry(name: String, service: String) -> String {
    let entry = keyring::Entry::new(&service, &name);

    let item = entry.get_password().unwrap_or_else(|error| "error".into());

    item.into()
}

#[tauri::command]
pub fn delete_entry(name: String, service: String) {
    let entry = keyring::Entry::new(&service, &name);

    let item = entry.delete_password();
}

#[tauri::command]
pub fn receive_encryption_key(key: String) {
    *ENCRYPTION_KEY.lock().unwrap() = key
}

#[tauri::command]
pub fn set_encryption_key(service: String) {
    *ENCRYPTION_KEY.lock().unwrap() = get_entry("encryptionKey".to_string(), service)
}
