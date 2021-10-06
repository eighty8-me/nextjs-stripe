import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from '@/pages/mypage/personal/Personal.module.scss';
import { Side } from '@/components/layouts/side/Side';

export type FormDataType = {
  lastName: string;
  firstName: string;
  phone: string;
  zip: string;
  state: string;
  city: string;
  town: string;
  line: string;
};

export type SellerType = {
  id: number;
  lastName: string;
  firstName: string;
  phone: string;
  zip: string;
  state: string;
  city: string;
  town: string;
  line: string;
};

type ApiResponseType = {
  status: number;
  data: SellerType;
};

const defaultFormData = {
  lastName: '',
  firstName: '',
  phone: '',
  zip: '',
  state: '',
  city: '',
  town: '',
  line: '',
};

type PersonalComponentPropsType = {
  loading: boolean;
  error: boolean;
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

const Personal: NextPage = () => {
  const router = useRouter();
  const [formData, setFormData] = React.useState<FormDataType>(defaultFormData);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    if (!sessionStorage.getItem('uuid')) {
      router.push('/');
    }
  }, [router]);

  const createPersonal = async (data: FormDataType): Promise<SellerType> => {
    const res = await axios.post<ApiResponseType>('/api/seller/create', {
      seller: data,
      uuid: sessionStorage.getItem('uuid'),
    });

    if (res.data.status !== 200) {
      setError(true);
    }

    return res.data.data;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const res = await createPersonal(formData);
    setFormData({ ...res });
    setLoading(false);
  };

  return (
    <PersonalComponent
      loading={loading}
      error={error}
      formData={formData}
      setFormData={setFormData}
      handleSubmit={handleSubmit}
    />
  );
};

export default Personal;

export const PersonalComponent: React.FC<PersonalComponentPropsType> = (
  props,
) => {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <div className={styles.main}>
          <h1>基本情報</h1>

          <div className="personal">
            <form onSubmit={props.handleSubmit} className="personal__form">
              <div className={styles.personal__form__field}>
                <label className={styles.personal__form__label}>
                  <span className={styles.personal__form__label_caption}>
                    姓
                  </span>
                  <input
                    type="text"
                    defaultValue={props.formData.lastName}
                    className={`${styles.personal__form__input} ${styles.personal__form__input_name}`}
                    onChange={(e) => {
                      props.setFormData({
                        ...props.formData,
                        lastName: e.target.value,
                      });
                    }}
                  />
                </label>
                <label className={styles.personal__form__label}>
                  <span className={styles.personal__form__label_caption}>
                    名
                  </span>
                  <input
                    type="text"
                    defaultValue={props.formData.firstName}
                    className={styles.personal__form__input}
                    onChange={(e) => {
                      props.setFormData({
                        ...props.formData,
                        firstName: e.target.value,
                      });
                    }}
                  />
                </label>
              </div>

              <div className={styles.personal__form__field}>
                <label className={styles.personal__form__label}>
                  <span className={styles.personal__form__label_caption}>
                    電話番号
                  </span>
                  <input
                    type="text"
                    defaultValue={props.formData.phone}
                    className={`${styles.personal__form__input} ${styles.personal__form__input_phone}`}
                    onChange={(e) => {
                      props.setFormData({
                        ...props.formData,
                        phone: e.target.value,
                      });
                    }}
                  />
                </label>
              </div>

              <div className={styles.personal__form__field}>
                <label className={styles.personal__form__label}>
                  <span className={styles.personal__form__label_caption}>
                    郵便番号
                  </span>
                  <input
                    type="text"
                    defaultValue={props.formData.zip}
                    className={`${styles.personal__form__input} ${styles.personal__form__input_zip}`}
                    onChange={(e) => {
                      props.setFormData({
                        ...props.formData,
                        zip: e.target.value,
                      });
                    }}
                  />
                </label>
              </div>

              <div className={styles.personal__form__field}>
                <label className={styles.personal__form__label}>
                  <span className={styles.personal__form__label_caption}>
                    都道府県
                  </span>
                  <input
                    type="text"
                    defaultValue={props.formData.state}
                    className={`${styles.personal__form__input} ${styles.personal__form__input_state}`}
                    onChange={(e) => {
                      props.setFormData({
                        ...props.formData,
                        state: e.target.value,
                      });
                    }}
                  />
                </label>
              </div>

              <div className={styles.personal__form__field}>
                <label className={styles.personal__form__label}>
                  <span className={styles.personal__form__label_caption}>
                    市町村区
                  </span>
                  <input
                    type="text"
                    defaultValue={props.formData.city}
                    className={`${styles.personal__form__input} ${styles.personal__form__input_city}`}
                    onChange={(e) => {
                      props.setFormData({
                        ...props.formData,
                        city: e.target.value,
                      });
                    }}
                  />
                </label>

                <label className={styles.personal__form__label}>
                  <span className={styles.personal__form__label_caption}>
                    住所
                  </span>
                  <input
                    type="text"
                    defaultValue={props.formData.town}
                    className={`${styles.personal__form__input} ${styles.personal__form__input_town}`}
                    onChange={(e) => {
                      props.setFormData({
                        ...props.formData,
                        town: e.target.value,
                      });
                    }}
                  />
                </label>
              </div>

              <div className={styles.personal__form__field}>
                <label className={styles.personal__form__label}>
                  <span className={styles.personal__form__label_caption}>
                    マンション・ビル名等
                  </span>
                  <input
                    type="text"
                    defaultValue={props.formData.line}
                    className={`${styles.personal__form__input} ${styles.personal__form__input_line}`}
                    onChange={(e) => {
                      props.setFormData({
                        ...props.formData,
                        line: e.target.value,
                      });
                    }}
                  />
                </label>
              </div>

              {props.error && <p>設定に失敗しました</p>}

              <div className={styles.personal__form__button_field}>
                <button
                  type="submit"
                  className={`${styles.button} ${styles.button__primary}`}
                >
                  {props.loading ? 'Loading' : '設定する'}
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
