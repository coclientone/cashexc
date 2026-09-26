const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const Stripe = require('stripe');
require('dotenv').config();

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || '');
const port = process.env.PORT || 4242;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'cashexc-payment-server' });
});

app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'USD', paymentMethodType = 'card' } = req.body || {};

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than zero.' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount) * 100),
      currency,
      payment_method_types: [paymentMethodType],
      automatic_payment_methods: paymentMethodType === 'card' ? { enabled: true } : undefined,
      metadata: {
        source: 'cashexc-dashboard',
      },
    });

    return res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('create-payment-intent error:', error);
    return res.status(500).json({ error: error.message || 'Unable to create payment intent.' });
  }
});

app.post('/confirm-payment', async (req, res) => {
  try {
    const { paymentIntentId, paymentMethodId } = req.body || {};

    if (!paymentIntentId || !paymentMethodId) {
      return res.status(400).json({ error: 'paymentIntentId and paymentMethodId are required.' });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'requires_confirmation') {
      const confirmed = await stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodId,
      });
      return res.json({ ok: true, paymentIntent: confirmed });
    }

    return res.json({ ok: true, paymentIntent });
  } catch (error) {
    console.error('confirm-payment error:', error);
    return res.status(500).json({ error: error.message || 'Unable to confirm payment.' });
  }
});

app.post('/create-bank-transfer', async (req, res) => {
  try {
    const { amount, currency = 'USD', recipientName, iban, bankCountry } = req.body || {};

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Transfer amount must be greater than zero.' });
    }

    if (!recipientName || !iban) {
      return res.status(400).json({ error: 'recipientName and iban are required.' });
    }

    if (!process.env.WISE_API_KEY) {
      return res.status(400).json({
        error: 'WISE_API_KEY not configured. Add your Wise API key in .env to enable bank transfer creation.',
      });
    }

    const wisePayload = {
      profile: process.env.WISE_PROFILE_ID,
      transferIntent: 'SOURCE_ACCOUNT',
      targetAccount: {
        type: 'IBAN',
        iban,
        currency,
        ownerName: recipientName,
        country: bankCountry || 'US',
      },
      quote: {
        sourceAmount: Number(amount),
        sourceCurrency: currency,
        targetCurrency: currency,
      },
      customerTransactionId: `cashexc_${Date.now()}`,
    };

    const response = await axios.post('https://api.transferwise.com/v1/transfers', wisePayload, {
      headers: {
        Authorization: `Bearer ${process.env.WISE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    return res.json({ ok: true, provider: 'wise', transfer: response.data });
  } catch (error) {
    console.error('create-bank-transfer error:', error.response?.data || error.message);
    return res.status(500).json({
      error: error.response?.data?.message || error.message || 'Unable to create bank transfer via provider.',
    });
  }
});

app.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
    } else {
      event = req.body;
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    console.log('Payment succeeded:', paymentIntent.id);
  }

  if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object;
    console.log('Payment failed:', paymentIntent.id);
  }

  res.json({ received: true });
});

app.listen(port, () => {
  console.log(`Cashex payment server listening on http://localhost:${port}`);
});
