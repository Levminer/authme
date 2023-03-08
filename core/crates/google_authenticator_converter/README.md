# google_authenticator_converter

-   Extract name, secret and issuer from a Google Authenticator migration QR code

### Example

```rs
    use google_authenticator_converter::{extract_data_from_uri, process_data, Account};

    let qr_code = "otpauth-migration://offline?data=CjMKCkhlbGxvId6tvu8SGFRlc3QxOnRlc3QxQGV4YW1wbGUxLmNvbRoFVGVzdDEgASgBMAIKMwoKSGVsbG8h3q2%2B8BIYVGVzdDI6dGVzdDJAZXhhbXBsZTIuY29tGgVUZXN0MiABKAEwAgozCgpIZWxsbyHerb7xEhhUZXN0Mzp0ZXN0M0BleGFtcGxlMy5jb20aBVRlc3QzIAEoATACEAEYASAAKI3orYEE";

    let accounts = process_data(&qr_code);

    for account in accounts.unwrap() {
        println!("{0} {1} {2}", account.name, account.secret, account.issuer);
    }
```

### Based on

[google-authenticator-extractor](https://github.com/zhangyuan/google-authenticator-extractor)
