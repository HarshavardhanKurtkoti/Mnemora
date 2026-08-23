# Authentication Overview
The Mnemora system uses OAuth 2.0 for all authentication processes. To authenticate, you must obtain a JWT from the authorization server.

## Rate Limiting
Authentication endpoints are strictly rate limited to 10 requests per minute per IP to prevent brute force attacks.

