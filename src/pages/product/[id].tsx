import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/libs/stripe';

import styles from '@/pages/product/ProductDetail.module.scss';
import type { ProductInfoType } from '@/pages/product/index';
import { CheckoutForm } from '@/components/product/CheckoutForm';

type ProductApiResponseType = {
  status: number;
  data?: ProductInfoType;
};

type ClientSecretResponseType = {
  status: number;
  clientSecret?: string;
};

type ProductDetailComponentPropsType = {
  productInfo: ProductInfoType;
  error: string;
  clientSecret: string;
  handleClickCheckout: (stripeConnectedAccountId: string) => void;
};

const ProductDetail: NextPage = () => {
  const router = useRouter();
  const [productInfo, setProductInfo] = React.useState<ProductInfoType>(
    {} as ProductInfoType,
  );
  const [error, setError] = React.useState('');
  const [clientSecret, setClientSecret] = React.useState('');

  React.useEffect(() => {
    if (!router.query.id) {
      return;
    }

    const allProduct = async (): Promise<void> => {
      console.log('*** Query Id ***', router.query.id);

      const { data } = await axios.get<ProductApiResponseType>(
        '/api/product/fetch',
        {
          params: {
            productId: router.query.id,
          },
        },
      );

      if (data.status !== 200) {
        setError('商品詳細を取得できませんでした');
        return;
      }

      setProductInfo(data.data || ({} as ProductInfoType));
    };

    allProduct();
  }, [router.query.id]);

  const handleClickCheckout = async (stripeConnectedAccountId: string) => {
    const { data } = await axios.post<ClientSecretResponseType>(
      '/api/stripe/client-secret',
      {
        stripeConnectedAccountId,
      }
    );

    setClientSecret(data.clientSecret || '');
  };

  return (
    <ProductDetailComponent
      productInfo={productInfo}
      error={error}
      clientSecret={clientSecret}
      handleClickCheckout={handleClickCheckout}
    />
  );
};

export default ProductDetail;

export const ProductDetailComponent: React.FC<ProductDetailComponentPropsType> =
  (props) => {
    return (
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.product_detail}>
            {props.error ? (
              <section className={styles.error_section}>
                <p className={styles.error_section__message}>{props.error}</p>
              </section>
            ) : (
              <>
                <section className={styles.product_info_section}>
                  <h1 className={styles.product_info__heading}>
                    {props.productInfo.productName}
                  </h1>

                  <p className={styles.product_info__amount}>
                    価格: {props.productInfo.productPrice}円
                  </p>
                </section>

                <hr className={styles.divider} />

                <section className={styles.seller_info_section}>
                  <h3 className={styles.seller_info__heading}>出品者情報</h3>
                  <table className={styles.seller_info__table}>
                    <tbody>
                      <tr>
                        <th>出品者</th>
                        <td>
                          {props.productInfo.lastName}{' '}
                          {props.productInfo.firstName}
                        </td>
                      </tr>
                      <tr>
                        <th>メールアドレス</th>
                        <td>{props.productInfo.email}</td>
                      </tr>
                      <tr>
                        <th>郵便番号</th>
                        <td>{props.productInfo.zip}</td>
                      </tr>
                      <tr>
                        <th>住所</th>
                        <td>{`${props.productInfo.state}${props.productInfo.city}${props.productInfo.town}`}</td>
                      </tr>
                      <tr>
                        <th>建物名</th>
                        <td>{props.productInfo.line}</td>
                      </tr>
                    </tbody>
                  </table>
                </section>

                {props.clientSecret && (
                  <section className={styles.checkout_section}>
                    <p>4242 4242 4242 4242</p>
                    <Elements stripe={stripePromise}>
                      <CheckoutForm clientSecret={props.clientSecret} />
                    </Elements>
                  </section>
                )}

                <nav className={styles.nav}>
                  <Link href="/product">
                    <a
                      href="/product"
                      className={`${styles.nav__button} ${styles.nav__button___outline}`}
                    >
                      商品一覧に戻る
                    </a>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      props.handleClickCheckout(
                        props.productInfo.stripeConnectedAccountId,
                      );
                    }}
                    className={styles.nav__button}
                  >
                    購入する
                  </button>
                </nav>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };
