# Cashex secure payment and payout flow

This directory contains the live payment API for card collection via Stripe and bank payout dispatch via Wise. The payment flow is designed to keep card numbers and expiry/CVC values out of the Cashex application and let Stripe handle 3-D Secure verification for Visa and Mastercard.

## Run locally

```bash
cd server
cp .env.example .env
# Fill in test-mode Stripe keys and Wise credentials.
npm install
npm start
```

For Stripe webhooks:

```bash
stripe listen --forward-to localhost:4242/api/payments/webhook
# copy the displayed whsec_... value into STRIPE_WEBHOOK_SECRET
```

Use Stripe test cards only, for example `4242 4242 4242 4242`.

## API

- `POST /api/payments/create-intent` — creates a PaymentIntent and returns `clientSecret`.
- `POST /api/payments/webhook` — verifies Stripe signature and records webhook events.
- `POST /api/transfers/execute` — verifies a successful Stripe payment and creates a Wise transfer request.
- `GET /api/payments` — list stored payment records (requires `x-admin-key` when `ADMIN_API_KEY` is configured).
- `GET /api/transfers` — list stored transfer records (requires `x-admin-key` when `ADMIN_API_KEY` is configured).

## Production notes

- Keep all secret keys in environment variables only.
- Use HTTPS for webhooks and frontend hosting.
- Add recipient KYC/AML and sanctions checks before payout release.
- Replace the mock/pending logic with real recipient validation and reconciliation once your provider credentials and onboarding are ready.
