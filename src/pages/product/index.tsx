import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import axios from 'axios';

import styles from '@/pages/product/Product.module.scss';

export type ProductType = {
  productId: number;
  uuid: string;
  productName: string;
  productPrice: number;
};

export type ProductInfoType = {
  productId: number;
  productName: string;
  productPrice: number;
  uuid: string;
  email: string;
  stripeConnectedAccountId: string;
  stripeCustomerId: string;
  firstName: string;
  lastName: string;
  phone: string;
  zip: string;
  state: string;
  city: string;
  town: string;
  line: string;
};

type ProductAllApiResponseType = {
  status: number;
  data?: ProductType[];
};

type ProductComponentPropsType = {
  products: ProductType[];
  error: string;
};

const Product: NextPage = () => {
  const [products, setProducts] = React.useState<ProductType[]>([]);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const allProduct = async (): Promise<void> => {
      const { data } = await axios.get<ProductAllApiResponseType>(
        '/api/product/all',
      );

      if (data.status !== 200) {
        setError('商品一覧を取得できませんでした');
        return;
      }

      setProducts(data.data || []);
    };

    allProduct();
  }, []);

  return <ProductComponent products={products} error={error} />;
};

export default Product;

export const ProductComponent: React.FC<ProductComponentPropsType> = (
  props,
) => {
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.product}>
          <h1 className={styles.product__heading}>商品一覧</h1>

          <section className={styles.error_section}>
            <p className={styles.error_section__message}>{props.error}</p>
          </section>

          {props.products.length > 0 && (
            <section className={styles.product_list_section}>
              {props.products.map((product) => (
                <div className={styles.product_item} key={product.productId}>
                  <div className={styles.product_item__body}>
                    <h2>{product.productName}</h2>
                    <p>{product.productPrice}円</p>
                    <Link href={`/product/${product.productId}`}>
                      <a
                        href={`/product/${product.productId}`}
                        className={styles.product_item__link}
                      >
                        詳細を見る
                      </a>
                    </Link>
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
