const express = require('express');
const Stripe = require('stripe');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const port = Number(process.env.PORT || 4242);
const stripe = process.env.STRIPE_SECRET_KEY ? Stripe(process.env.STRIPE_SECRET_KEY) : null;
const transfers = new Map();

app.use((req, res, next) => {
  const allowedOrigin = process.env.FRONTEND_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Stripe-Signature');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Stripe signature verification requires the unparsed request body.
app.post(['/webhook', '/api/payments/webhook'], express.raw({ type: 'application/json' }), (req, res) => {
  if (!stripe) return res.status(503).json({ error: 'Stripe is not configured.' });

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  const paymentIntent = event.data.object;
  if (event.type === 'payment_intent.succeeded') {
    console.log(`Payment succeeded: ${paymentIntent.id}`);
  } else if (event.type === 'payment_intent.payment_failed') {
    console.warn(`Payment failed: ${paymentIntent.id}`);
  }

  return res.json({ received: true });
});

app.use(express.json({ limit: '100kb' }));

function requireStripe(res) {
  if (!stripe) {
    res.status(503).json({ error: 'Stripe is not configured. Add STRIPE_SECRET_KEY to the server environment.' });
    return false;
  }
  return true;
}

function validateAmount(amount) {
  const value = Number(amount);
  return Number.isFinite(value) && value > 0 && value <= 1000000;
}

app.get('/health', (_req, res) => res.json({ ok: true, service: 'cashexc-payment-server' }));

app.post(['/create-payment-intent', '/api/payments/create-intent'], async (req, res) => {
  if (!requireStripe(res)) return;
  const { amount, currency = 'usd', recipientName = '', recipientAccount = '' } = req.body || {};
  if (!validateAmount(amount)) return res.status(400).json({ error: 'Amount must be greater than zero and no more than 1,000,000.' });

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount) * 100),
      currency: String(currency).toLowerCase(),
      payment_method_types: ['card'],
      // Stripe.js/Elements collects card data and handles 3DS authentication.
      confirmation_method: 'automatic',
      metadata: {
        source: 'cashexc-dashboard',
        recipient_name: String(recipientName).slice(0, 200),
        recipient_account: String(recipientAccount).slice(0, 200),
      },
    });
    return res.json({ clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id });
  } catch (error) {
    console.error('create-payment-intent error:', error.message);
    return res.status(400).json({ error: error.message || 'Unable to create payment intent.' });
  }
});

// Prototype transfer adapter. Replace this with a licensed payout provider after payment settlement.
app.post(['/transfers/execute', '/api/transfers/execute'], async (req, res) => {
  const { paymentIntentId, recipientName, recipientAccount, currency = 'usd' } = req.body || {};
  if (!paymentIntentId || !recipientName || !recipientAccount) {
    return res.status(400).json({ error: 'paymentIntentId, recipientName, and recipientAccount are required.' });
  }
  if (!requireStripe(res)) return;

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== 'succeeded') {
      return res.status(409).json({ error: 'Transfer can only be started after the card payment succeeds.' });
    }

    const existing = [...transfers.values()].find((item) => item.paymentIntentId === paymentIntentId);
    if (existing) return res.json({ ok: true, transfer: existing, duplicate: true });

    const transfer = {
      id: `demo_${crypto.randomUUID()}`,
      paymentIntentId,
      recipientName: String(recipientName).slice(0, 200),
      recipientAccount: String(recipientAccount).slice(0, 200),
      currency: String(currency).toLowerCase(),
      amount: paymentIntent.amount,
      provider: 'mock',
      status: 'pending_provider_configuration',
      createdAt: new Date().toISOString(),
    };
    transfers.set(transfer.id, transfer);
    return res.status(202).json({ ok: true, transfer, message: 'Payment received. Connect a licensed payout provider to send funds.' });
  } catch (error) {
    console.error('execute-transfer error:', error.message);
    return res.status(400).json({ error: error.message || 'Unable to create transfer.' });
  }
});

app.get(['/transfers/:id', '/api/transfers/:id'], (req, res) => {
  const transfer = transfers.get(req.params.id);
  return transfer ? res.json({ transfer }) : res.status(404).json({ error: 'Transfer not found.' });
});

app.listen(port, () => console.log(`Cashex payment server listening on http://localhost:${port}`));
