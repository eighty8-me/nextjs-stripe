import { loadStripe } from '@stripe/stripe-js';
import Stripe from 'stripe';

export type StripeApiError = Stripe.StripeAPIError;

export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_API_KEY as string,
);

const stripeApiKey = process.env.STRIPE_SECRET_KEY as string;
export const stripe = new Stripe(stripeApiKey, {
  apiVersion: '2020-08-27',
});
