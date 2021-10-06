import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from '@/pages/mypage/payment/Payment.module.scss';
import { Side } from '@/components/layouts/side/Side';

type PaymentComponentPropsType = {
  handleClickStripeConnectedAccount: () => void;
  handleClickDashboard: () => void;
};

export type SellerType = {
  id: number;
  uuid: string;
  firstName: string;
  lastName: string;
  phone: string;
  zip: string;
  state: string;
  city: string;
  town: string;
  line: string;
};

export type SellerInfoType = SellerType & {
  email: string;
};

type SellerFetchApiResponseType = {
  status: number;
  data?: SellerInfoType;
};

type CreateStripeConnectedAccountApiResponseType = {
  status: number;
  stripeConnectedAccountId?: string;
  accountSetupLinkUrl?: string;
  error?: string;
};

type CreatedStripeConnectedAccountDataType = {
  stripeConnectedAccountId: string;
  accountSetupLinkUrl: string;
};

type SaveStripeConnectedAccountIdApiResponseType = {
  status: number;
  // account?: AccountType;
  error?: string;
};

type CreateLoginLinkResponseType = {
  loginLink: {
    url: string;
  };
  error?: {
    status: number;
    message: string;
  };
};

const defaultSellerValue = {
  id: 0,
  uuid: '',
  firstName: '',
  lastName: '',
  phone: '',
  zip: '',
  state: '',
  city: '',
  town: '',
  line: '',
  email: '',
};

const Payment: NextPage = () => {
  const router = useRouter();
  const [seller, setSeller] =
    React.useState<SellerInfoType>(defaultSellerValue);

  React.useEffect(() => {
    if (!sessionStorage.getItem('uuid')) {
      router.push('/');
    }
  }, [router]);

  React.useEffect(() => {
    const fetchSeller = async (): Promise<void> => {
      const { data } = await axios.get<SellerFetchApiResponseType>(
        '/api/seller/fetch',
        {
          params: {
            uuid: sessionStorage.getItem('uuid'),
          },
        },
      );

      if (!data.data) {
        throw new Error('Seller not found.');
      }

      setSeller(data.data);
    };

    fetchSeller();
  }, []);

  /**
   * Stripe アカウント作成処理
   */
  const createStripeConnectedAccount =
    async (): Promise<CreatedStripeConnectedAccountDataType> => {
      const { data } =
        await axios.post<CreateStripeConnectedAccountApiResponseType>(
          '/api/stripe/account/create',
          {
            seller,
          },
        );

      if (data.status !== 200) {
        throw new Error('Stripe connected account create faild.');
      }

      if (!data.accountSetupLinkUrl) {
        throw new Error('Stripe connected account create faild.');
      }

      if (!data.stripeConnectedAccountId) {
        throw new Error('Stripe connected account create faild.');
      }

      return {
        stripeConnectedAccountId: data.stripeConnectedAccountId,
        accountSetupLinkUrl: data.accountSetupLinkUrl,
      };
    };

  /**
   * Stripe アカウントIDの保存
   */
  const saveStripeConnectedAccountId = async (
    stripeConnectedAccountId: string,
  ) => {
    const { data } =
      await axios.put<SaveStripeConnectedAccountIdApiResponseType>(
        '/api/account/update',
        {
          uuid: sessionStorage.getItem('uuid'),
          stripeConnectedAccountId,
        },
      );

    if (data.status !== 200) {
      throw new Error('Account update faild.');
    }
  };

  /**
   * アカウント作成ボタンクリックイベント
   */
  const handleClickStripeConnectedAccount = async () => {
    const { stripeConnectedAccountId, accountSetupLinkUrl } =
      await createStripeConnectedAccount();

    saveStripeConnectedAccountId(stripeConnectedAccountId);

    // Stripe connected account id の保存
    sessionStorage.setItem('sca_id', stripeConnectedAccountId);

    router.push(accountSetupLinkUrl);
  };

  /**
   * ダッシュボードボタンクリックイベント
   */
  const handleClickDashboard = async () => {
    const stripeConnectedAccountId = sessionStorage.getItem('sca_id');
    if (!stripeConnectedAccountId) {
      return;
    }

    const { data } = await axios.post<CreateLoginLinkResponseType>(
      '/api/stripe/dashboard',
      {
        stripeConnectedAccountId,
      },
    );

    if (data.error) {
      throw new Error('Stripe dashboard link create faild.');
    }

    console.log('*** loginLink ***', data.loginLink.url);

    router.push(data.loginLink.url);
  };

  return (
    <PaymentComponent
      handleClickStripeConnectedAccount={handleClickStripeConnectedAccount}
      handleClickDashboard={handleClickDashboard}
    />
  );
};

export default Payment;

export const PaymentComponent: React.FC<PaymentComponentPropsType> = (
  props,
) => {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <div className={styles.main}>
          <h1>支払い関係</h1>

          <div className="payment">
            <div className={styles.payment__button_field}>
              <button
                type="submit"
                className={`${styles.button} ${styles.button__primary}`}
                onClick={props.handleClickStripeConnectedAccount}
              >
                Stripeアカウントを作成する
              </button>

              <button
                type="submit"
                className={`${styles.button} ${styles.button__primary}`}
                onClick={props.handleClickDashboard}
              >
                ダッシュボード
              </button>
            </div>
          </div>
        </div>

        <Side />
      </div>
    </div>
  );
};
