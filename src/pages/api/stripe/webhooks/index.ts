import type { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import { stripe } from '@/libs/stripe';
import type { StripeApiError } from '@/libs/stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('*** Request ***', req.method);

  if (req.method !== 'POST') {
    res.status(405).json({
      message: 'Method Not Allowed.',
    });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'] as
    | string
    | Buffer
    | Array<string>;

  let event;

  try {
    console.log('webhookSecret', webhookSecret);
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    console.log('stripeEvent', event);
  } catch (err: unknown) {
    const error = err as StripeApiError;
    res.status(400).send(`Webhook Error: ${error.message}`);
    return;
  }

  let paymentIntent;

  switch (event.type) {
    case 'payment_intent.payment_failed':
      paymentIntent = event.data.object;
      console.log('*** faild paymentIntent ***', paymentIntent);
      break;
    case 'payment_intent.succeeded':
      paymentIntent = event.data.object;
      console.log('*** succeeded paymentIntent ***', paymentIntent);
      break;
    default:
      console.log(`*** Unhandled event type ${event.type} ***`);
  }

  res.status(200).send('*** succeed ***');
};
