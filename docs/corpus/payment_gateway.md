# Payment Processing
We integrate with Stripe for processing payments. All transactions are securely transmitted using TLS 1.3.

## Refunds
Refunds must be requested within 30 days of the transaction. The Stripe webhook handles the asynchronous refund fulfillment.

