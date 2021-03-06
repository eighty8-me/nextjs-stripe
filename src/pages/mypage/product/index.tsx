import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from '@/pages/mypage/product/Product.module.scss';
import { Side } from '@/components/layouts/side/Side';

export type FormDataType = {
  name: string;
  price: number;
};

export type ProductType = {
  id: number;
  name: string;
  price: number;
};

type ApiResponseType = {
  status: number;
  data: ProductType;
};

const defaultFormData = {
  name: '',
  price: 0,
};

type ProductComponentPropsType = {
  loading: boolean;
  error: boolean;
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

const Product: NextPage = () => {
  const router = useRouter();
  const [formData, setFormData] = React.useState<FormDataType>(defaultFormData);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    if (!sessionStorage.getItem('uuid')) {
      router.push('/');
    }
  }, [router]);

  const createProduct = async (data: FormDataType): Promise<ProductType> => {
    const res = await axios.post<ApiResponseType>('/api/product/create', {
      product: data,
      uuid: sessionStorage.getItem('uuid'),
    });

    if (res.data.status !== 200) {
      setError(true);
    }

    console.log('*** product res ***', res.data.data);

    return res.data.data;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    void (await createProduct(formData));

    setFormData({ ...defaultFormData });
    setLoading(false);
  };

  return (
    <ProductComponent
      loading={loading}
      error={error}
      formData={formData}
      setFormData={setFormData}
      handleSubmit={handleSubmit}
    />
  );
};

export default Product;

export const ProductComponent: React.FC<ProductComponentPropsType> = (
  props,
) => {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <div className={styles.main}>
          <h1>????????????</h1>

          <div className="product">
            <form onSubmit={props.handleSubmit} className="product__form">
              <div className={styles.product__form__field}>
                <label className={styles.product__form__label}>
                  <span className={styles.product__form__label_caption}>
                    ?????????
                  </span>
                  <input
                    type="text"
                    defaultValue={props.formData.name}
                    className={`${styles.product__form__input} ${styles.product__form__input_name}`}
                    onChange={(e) => {
                      props.setFormData({
                        ...props.formData,
                        name: e.target.value,
                      });
                    }}
                  />
                </label>
              </div>

              <div className={styles.product__form__field}>
                <label className={styles.product__form__label}>
                  <span className={styles.product__form__label_caption}>
                    ??????
                  </span>
                  <input
                    type="text"
                    defaultValue={props.formData.price}
                    className={`${styles.product__form__input} ${styles.product__form__input_price}`}
                    onChange={(e) => {
                      props.setFormData({
                        ...props.formData,
                        price: parseInt(e.target.value, 10),
                      });
                    }}
                  />
                  <span className={styles.product__form__input_subtext}>
                    ???
                  </span>
                </label>
              </div>

              {props.error && <p>???????????????????????????</p>}

              <div className={styles.product__form__button_field}>
                <button
                  type="submit"
                  className={`${styles.button} ${styles.button__primary}`}
                >
                  {props.loading ? 'Loading' : '????????????'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <Side />
      </div>
    </div>
  );
};
