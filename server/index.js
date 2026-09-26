const express = require('express');
const axios = require('axios');
const Stripe = require('stripe');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const port = Number(process.env.PORT || 4242);
const stripe = process.env.STRIPE_SECRET_KEY ? Stripe(process.env.STRIPE_SECRET_KEY) : null;
const wiseBase = (process.env.WISE_API_BASE || 'https://api.wise.com').replace(/\/$/, '');
const wise = axios.create({
  baseURL: wiseBase,
  timeout: 15000,
  headers: { Authorization: `Bearer ${process.env.WISE_API_KEY || ''}`, 'Content-Type': 'application/json' },
});
const transfers = new Map();

app.use((req, res, next) => {
  const origin = process.env.FRONTEND_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Stripe-Signature');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// This route must run before express.json(): Stripe signs the raw payload.
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) return res.status(503).json({ error: 'Stripe webhook is not configured.' });
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
  if (event.type === 'payment_intent.succeeded') console.log('Stripe payment succeeded:', event.data.object.id);
  if (event.type === 'payment_intent.payment_failed') console.warn('Stripe payment failed:', event.data.object.id);
  return res.json({ received: true });
});

app.use(express.json({ limit: '100kb' }));

function requireStripe(res) {
  if (!stripe) { res.status(503).json({ error: 'STRIPE_SECRET_KEY is not configured.' }); return false; }
  return true;
}
function requireWise(res) {
  if (!process.env.WISE_API_KEY || !process.env.WISE_PROFILE_ID) {
    res.status(503).json({ error: 'WISE_API_KEY and WISE_PROFILE_ID are required for real payouts.' }); return false;
  }
  return true;
}
function validAmount(value) {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0 && amount <= 1000000;
}
function requiredText(value) { return typeof value === 'string' && value.trim().length > 0; }
function wiseError(error) { return error.response?.data?.message || error.response?.data?.errors?.[0]?.message || error.message; }

app.get('/health', (_req, res) => res.json({ ok: true, service: 'cashexc-payment-server', wiseConfigured: Boolean(process.env.WISE_API_KEY && process.env.WISE_PROFILE_ID) }));

app.post('/api/payments/create-intent', async (req, res) => {
  if (!requireStripe(res)) return;
  const { amount, currency = 'USD', recipientName = '', recipientAccount = '' } = req.body || {};
  if (!validAmount(amount)) return res.status(400).json({ error: 'Amount must be greater than zero and no more than 1,000,000.' });
  try {
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount) * 100),
      currency: String(currency).toLowerCase(),
      payment_method_types: ['card'],
      confirmation_method: 'automatic',
      metadata: { source: 'cashexc', recipient_name: String(recipientName).slice(0, 200), recipient_account: String(recipientAccount).slice(0, 200) },
    });
    return res.json({ clientSecret: intent.client_secret, paymentIntentId: intent.id });
  } catch (error) { return res.status(400).json({ error: error.message }); }
});

// Real Wise Platform flow: quote -> recipient account -> transfer -> fund from Wise balance.
// Stripe card settlement and Wise funding are separate rails; a Wise balance/payment source is required.
app.post('/api/transfers/execute', async (req, res) => {
  if (!requireStripe(res) || !requireWise(res)) return;
  const { paymentIntentId, recipientName, iban, recipientAccount, bankCountry = 'US', targetCurrency = 'EUR', reference = 'Cashex transfer' } = req.body || {};
  const accountDetails = iban || recipientAccount;
  if (!requiredText(paymentIntentId) || !requiredText(recipientName) || !requiredText(accountDetails)) return res.status(400).json({ error: 'paymentIntentId, recipientName, and IBAN/recipientAccount are required.' });
  if (!/^[A-Za-z]{2}$/.test(String(bankCountry)) || !/^[A-Za-z]{3}$/.test(String(targetCurrency))) return res.status(400).json({ error: 'bankCountry must be a 2-letter country code and targetCurrency a 3-letter code.' });

  try {
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (intent.status !== 'succeeded') return res.status(409).json({ error: 'Payout is allowed only after Stripe reports payment_intent.succeeded.' });
    if (transfers.has(paymentIntentId)) return res.json({ ok: true, transfer: transfers.get(paymentIntentId), duplicate: true });

    const sourceCurrency = String(intent.currency).toUpperCase();
    const target = String(targetCurrency).toUpperCase();
    const quote = await wise.post('/v2/quotes', {
      profile: Number(process.env.WISE_PROFILE_ID), sourceCurrency, targetCurrency: target,
      sourceAmount: intent.amount / 100, payOut: 'BANK_TRANSFER',
    });
    const recipient = await wise.post('/v1/accounts', {
      profile: Number(process.env.WISE_PROFILE_ID), accountHolderName: String(recipientName).slice(0, 200), currency: target,
      type: 'iban', details: { iban: String(accountDetails).replace(/\s/g, '').toUpperCase() },
    });
    const customerTransactionId = `cashexc_${crypto.randomUUID()}`;
    const created = await wise.post('/v1/transfers', {
      targetAccount: recipient.data.id, quoteUuid: quote.data.id, customerTransactionId,
      details: { reference: String(reference).slice(0, 140) },
    });
    const funded = await wise.post(`/v3/profiles/${encodeURIComponent(process.env.WISE_PROFILE_ID)}/transfers/${created.data.id}/payments`, { type: 'BALANCE' });

    const transfer = { id: String(created.data.id), paymentIntentId, provider: 'wise', status: funded.data.status || created.data.status || 'processing', quoteId: quote.data.id, recipientId: recipient.data.id, providerResponse: funded.data };
    transfers.set(paymentIntentId, transfer);
    return res.status(202).json({ ok: true, provider: 'wise', transfer, message: 'Stripe payment succeeded and the Wise transfer was funded from the configured Wise balance.' });
  } catch (error) {
    console.error('Wise payout failed:', wiseError(error));
    return res.status(502).json({ error: `Wise payout failed: ${wiseError(error)}` });
  }
});

app.get('/api/transfers/:paymentIntentId', (req, res) => {
  const transfer = transfers.get(req.params.paymentIntentId);
  return transfer ? res.json({ transfer }) : res.status(404).json({ error: 'Transfer not found.' });
});

app.listen(port, () => console.log(`Cashex payment server listening on http://localhost:${port}`));
