import express, { Request, Response } from 'express';
import User from '../models/User';
import { ENDPOINT_FRONTEND } from '../constants/connection';
import Stripe from 'stripe';

const stripeKey = process.env.STRIPE_KEY as string;
const stripe = new Stripe(stripeKey, { apiVersion: '2020-08-27' });

const paymentRouter = express.Router();

const planMap = process.env.NODE_ENV === 'development'
  ? new Map([
    ['price_1JRQCpKIkS09GbFgm2al6rDa', 'free'],
    ['price_1JSvVpKIkS09GbFgWIWOIUGc', 'starter'],
    ['price_1JSvWLKIkS09GbFggJOtRqVi', 'unlimited']
  ])
// Production prices
  : new Map([
    ['price_1JRQHaKIkS09GbFgGeMrYoBm', 'free'],
    ['price_1JSvUGKIkS09GbFgSXvPta73', 'starter'],
    ['price_1JSvT1KIkS09GbFg1FcVFRu4', 'unlimited']
  ]);

paymentRouter.post('/create-checkout-session/:priceId/:email', async (req: Request, res: Response) => {
  const { priceId, email } = req.params;
  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    payment_method_types: [
      'card',
    ],
    mode: 'subscription',
    allow_promotion_codes: true,
    // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
    // the actual Session ID is returned in the query parameter when your customer
    // is redirected to the success page.
    success_url: `${ENDPOINT_FRONTEND}/app?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${ENDPOINT_FRONTEND}/app`,
    metadata: {
      plan: planMap.get(priceId) as string,
      email,
    }
  });
  if (session.url == null) return res.status(401).send({ error: 'Unable to create checkout session' });
  res.redirect(303, session.url)
});

const webhookSecret = process.env.STRIPE_WEBHOOK;

paymentRouter.post('/webhook', async (req: Request, res: Response) => {
  let data;
  let eventType;
  // Check if webhook signing is configured.
  if (webhookSecret) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    const signature = req.headers['stripe-signature'] as string;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.log('⚠️  Webhook signature verification failed.');
      return res.sendStatus(400);
    }
    // Extract the object from the event.
    data = event.data;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // retrieve the event data directly from the request body.
    data = req.body.data;
    eventType = req.body.type;
  }
  const { object } = data
  const { email, plan } = data.object.metadata;
  let subscription;
  switch (eventType) {
  case 'checkout.session.completed':
    subscription = await stripe.subscriptions.retrieve(
      object.subscription
    );
    if (subscription.status == 'active') {
      // Payment is successful and the subscription is created.
      // You should provision the subscription and save the customer ID to your database.
      await User.findOneAndUpdate(
        { email },
        {
          stripeCustomerId: object.customer,
          plan: {
            name: plan,
            lastBilled: new Date()
          }
        }
      )
    }
    break;
  case 'invoice.paid':
    // Continue to provision the subscription as payments continue to be made.
    // Store the status in your database and check when a user accesses your service.
    // This approach helps you avoid hitting rate limits.

    await User.findOneAndUpdate(
      { email },
      {
        'plan.lastBilled': new Date()
      }
    )
    break;
  case 'invoice.payment_failed':
    // The payment failed or the customer does not have a valid payment method.
    // The subscription becomes past_due. Notify your customer and send them to the
    // customer portal to update their payment information.
    break;
  case 'customer.subscription.updated':
    if (object.status == 'canceled') {
      await User.findOneAndUpdate(
        { stripeCustomerId: object.customer },
        {
          'plan.name': 'free'
        }
      )
    } else if (object.status == 'active') { //switched plans
      await User.findOneAndUpdate(
        { stripeCustomerId: object.customer },
        {
          'plan.name': planMap.get(object.items.data[0].price.id)
        }
      )
    }
    break;
  default:
      // Unhandled event type
  }

  res.sendStatus(200);
});

paymentRouter.post('/create-customer-portal-session/:stripeCustomerId', async (req, res) => {
  const { stripeCustomerId } = req.params
  // Authenticate your user.
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${ENDPOINT_FRONTEND}/app`
  })

  // Redirect to the URL for the session
  res.redirect(303, session.url);
});

export default paymentRouter;
