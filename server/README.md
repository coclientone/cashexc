# Real Wise payout setup

The server now implements the Wise Platform sequence:

1. Stripe PaymentIntent is confirmed by Stripe.js, including issuer 3-D Secure when required.
2. `POST /api/transfers/execute` retrieves the PaymentIntent and refuses to pay out unless its status is `succeeded`.
3. The server creates a Wise quote (`/v2/quotes`).
4. It creates a Wise recipient account (`/v1/accounts`).
5. It creates a Wise transfer (`/v1/transfers`).
6. It funds the transfer from the configured Wise balance (`/v3/profiles/{profile}/transfers/{id}/payments`).

## Required configuration

Set these in `server/.env` or your hosting provider’s secret store:

```dotenv
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
WISE_API_KEY=...
WISE_PROFILE_ID=...
WISE_API_BASE=https://api.wise.com
```

The Wise profile must be onboarded and permitted to use the relevant currencies and recipient corridors. The Wise account must also have a balance or approved funding source: a successful Stripe card payment does not automatically fund a Wise transfer.

## Test

```bash
cd server
npm install
npm start
stripe listen --forward-to localhost:4242/api/payments/webhook
```

Use Stripe test cards only in test mode. Do not use live card or Wise credentials during development.

## Production requirements

This code must not be exposed as an unauthenticated public money-movement endpoint. Add authenticated users, recipient ownership checks, idempotency backed by a database, KYC/AML and sanctions screening, limits, audit logging, provider webhooks/status polling, and reconciliation before enabling live payouts. Validate recipient details against Wise-supported account types for each destination; the example uses IBAN recipients.
