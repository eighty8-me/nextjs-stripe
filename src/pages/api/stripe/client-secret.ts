import type { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '@/libs/stripe';
import type { StripeApiError } from '@/libs/stripe';

type RequestBodyType = {
  stripeConnectedAccountId: string;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  if (req.method !== 'POST') {
    res.status(405).json({
      message: 'Method Not Allowed.',
    });
  }

  const { stripeConnectedAccountId } = req.body as RequestBodyType;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      payment_method_types: ['card'],
      amount: 1000,
      currency: 'jpy',
      application_fee_amount: 123,
      transfer_data: {
        destination: stripeConnectedAccountId,
      },
    });

    console.log('*** paymentIntent ***', {
      client_secret: paymentIntent.client_secret,
    });

    res.json({
      status: 200,
      // data: paymentIntent as Stripe.PaymentIntent,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err: unknown) {
    const error = err as StripeApiError;
    console.log('*** error ***', error);

    res.json({
      status: 500,
      error: error.message,
    });
  }
};
