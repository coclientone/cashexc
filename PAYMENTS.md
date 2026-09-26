# Payments integration notes

The safe card-payment page is `stripe-card-payment.html`. Use it instead of the raw card form currently present in `dashboard-payments.html`.

## Important security change

Do not collect card number, expiry, or CVC in ordinary HTML inputs. Stripe Elements in `stripe-card-payment.html` sends those values directly to Stripe and returns a PaymentMethod without exposing the sensitive values to Cashex.

To use the page:

1. Run the API from `server/` and configure `STRIPE_SECRET_KEY`.
2. Configure the browser with a Stripe **publishable** test key by setting `window.CASHEXC_STRIPE_PUBLISHABLE_KEY` before the page script runs. Never put `STRIPE_SECRET_KEY` in HTML.
3. Use `stripe listen --forward-to localhost:4242/api/payments/webhook` and copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`.
4. Test with Stripe test cards only, such as `4242 4242 4242 4242`.

The current transfer endpoint is a mock adapter. It verifies that Stripe reports a successful payment and creates a pending record; it does not send funds. Before enabling real transfers, connect a licensed payout provider and implement authentication, KYC/AML, sanctions screening, persistent transaction storage, idempotency, audit logs, limits, and reconciliation.
