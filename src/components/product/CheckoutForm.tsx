import React from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

type CheckoutFormPropsType = {
  clientSecret: string;
};

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

export const CheckoutForm: React.FC<CheckoutFormPropsType> = (props) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log('*** stripe ***', stripe);
    console.log('*** elements ***', elements);

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      return;
    }

    console.log('*** props.clientSecret ***', props.clientSecret);

    // FYI: https://stripe.com/docs/js/payment_methods/create_payment_method
    // In most integrations, you will not need to use this method. Instead, use methods like stripe.confirmCardPayment, which will automatically create a PaymentMethod when you confirm a PaymentIntent.
    // ほとんどの統合では、この方法を使用する必要はありません。代わりに、stripe.confirmCardPaymentなどのメソッドを使用してください。これにより、PaymentIntentを確認するとPaymentMethodが自動的に作成されます。
    const result = await stripe.confirmCardPayment(props.clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: 'Jenny Rosen',
        },
      },
    });

    if (result.error) {
      console.log(result.error.message);
      return;
    }

    if (result.paymentIntent.status === 'succeeded') {
      console.log('*** Payment Succeed ***');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Card details
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </label>

      <button type="submit" disabled={!stripe}>
        確定する
      </button>
    </form>
  );
};
