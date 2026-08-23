# Webhook Delivery
Webhooks are sent with a 5-second timeout. If a delivery fails, the system uses exponential backoff for up to 3 retries.

## Security Signatures
Each webhook payload includes an HMAC-SHA256 signature in the 'X-Mnemora-Signature' header to verify authenticity.

