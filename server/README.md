# Cashex Stripe card-payment prototype

This directory contains a Node/Express API for Visa and Mastercard debit/credit card payments through Stripe. Card numbers and CVC values are collected by Stripe Elements and never sent to Cashex or stored by this server. Stripe can request 3-D Secure verification when required by the issuer.

## Run locally

```bash
cd server
cp .env.example .env
# Set STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY to Stripe test-mode keys
npm install
npm start
```

Open `payment.html` from a local web server (not `file://`) and set `API_BASE` in the page if the API is hosted elsewhere.

For signed webhooks:

```bash
stripe listen --forward-to localhost:4242/api/payments/webhook
# copy the displayed whsec_... value into STRIPE_WEBHOOK_SECRET
```

Use Stripe test cards only in test mode, for example `4242 4242 4242 4242` (successful payment). Do not use real card details during development.

## API

- `POST /api/payments/create-intent` — creates a card-only PaymentIntent and returns its client secret.
- `POST /api/payments/webhook` — verifies Stripe webhook signatures.
- `POST /api/transfers/execute` — verifies a succeeded PaymentIntent and creates a **mock pending** transfer record.
- `GET /api/transfers/:id` — retrieves a mock transfer record.

The transfer endpoint intentionally does not move money. Before production, replace the mock adapter with a licensed payout provider, add authentication/authorization, persistent transaction storage, idempotency keys, KYC/AML controls, sanctions screening, rate limits, audit logging, and reconciliation. A Stripe payment success alone is not authorization to pay out to arbitrary recipient details.
