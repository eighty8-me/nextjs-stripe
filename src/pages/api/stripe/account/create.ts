import type { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '@/libs/stripe';
import type { StripeApiError } from '@/libs/stripe';
import type { SellerInfoType } from '@/pages/mypage/payment/index';

type RequestBodyType = {
  seller: SellerInfoType;
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

  const { seller } = req.body as RequestBodyType;

  try {
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'JP',
      email: seller.email,
      capabilities: {
        transfers: { requested: true },
      },
      business_type: 'individual',
      individual: {
        address_kanji: {
          state: seller.state,
          city: seller.city,
          town: seller.town,
          line1: seller.line,
          postal_code: seller.zip,
        },
        email: seller.email,
        first_name: seller.firstName,
        first_name_kanji: seller.firstName,
        last_name: seller.lastName,
        last_name_kanji: seller.lastName,
        phone: seller.phone.replace(/^0?/, '+81'),
      },
    });

    console.log('*** account ***', account);

    const origin =
      process.env.NODE_ENV === 'development'
        ? `http://${req.headers.host as string}`
        : `https://${req.headers.host as string}`;

    const loginLink = await stripe.accountLinks.create({
      type: 'account_onboarding',
      account: account.id,
      refresh_url: `${origin}/mypage/payment/account/reauth`,
      return_url: `${origin}/mypage/payment/account/return`,
    });

    res.json({
      status: 200,
      stripeConnectedAccountId: account.id,
      accountSetupLinkUrl: loginLink.url,
    });
  } catch (err: unknown) {
    const error = err as StripeApiError;
    // console.log('*** error ***', error);

    res.json({
      status: 500,
      error: error.message,
    });
  }
};
