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
  try {
    const origin =
      process.env.NODE_ENV === 'development'
        ? `http://${req.headers.host as string}`
        : `https://${req.headers.host as string}`;

    const body = req.body as RequestBodyType;
    const loginLink = await stripe.accounts.createLoginLink(
      body.stripeConnectedAccountId,
      {
        redirect_url: origin,
      },
    );

    res.json({
      status: 200,
      loginLink,
    });
  } catch (err: unknown) {
    const error = err as StripeApiError;

    res.json({
      status: error.statusCode as number,
      error: error.message,
    });
  }
};
