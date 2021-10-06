import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '@/pages/signup/Signup.module.scss';

export type FormDataType = {
  email: string;
  password: string;
};

export type AccountType = {
  id: number;
  uuid: string;
  email: string;
  password: string;
  createdAt: string;
};

export type ApiResponseType = {
  status: number;
  data: AccountType;
};

type SignupComponentPropsType = {
  loading: boolean;
  error: boolean;
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

const defaultFormData = {
  email: '',
  password: '',
};

const Signup: NextPage = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [formData, setFormData] = React.useState<FormDataType>(defaultFormData);

  const execSignup = async (data: FormDataType): Promise<void> => {
    const res = await axios.post<ApiResponseType>('/api/signup', {
      account: data,
    });

    if (res.data.status !== 200) {
      setError(true);
      return;
    }

    sessionStorage.setItem('uuid', res.data.data.uuid);

    router.push('/mypage/');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    await execSignup(formData);
    setLoading(false);
  };

  return (
    <SignupComponent
      loading={loading}
      error={error}
      formData={formData}
      setFormData={setFormData}
      handleSubmit={handleSubmit}
    />
  );
};

export default Signup;

export const SignupComponent: React.FC<SignupComponentPropsType> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.signup}>
          <h1 className={styles.signup__heading}>会員登録</h1>

          <form onSubmit={props.handleSubmit} className="signup__form">
            <div className={styles.signup__form__field}>
              <label className={styles.signup__form__label}>
                <span className={styles.signup__form__label_caption}>
                  メールアドレス
                </span>
                <input
                  type="text"
                  defaultValue={props.formData.email}
                  onChange={(e) => {
                    props.setFormData({
                      ...props.formData,
                      email: e.target.value,
                    });
                  }}
                  className={`${styles.signup__form__input} ${styles.signup__form__input_email}`}
                />
              </label>
            </div>

            <div className={styles.signup__form__field}>
              <label className={styles.signup__form__label}>
                <span className={styles.signup__form__label_caption}>
                  パスワード
                </span>
                <input
                  type="password"
                  defaultValue={props.formData.password}
                  onChange={(e) => {
                    props.setFormData({
                      ...props.formData,
                      password: e.target.value,
                    });
                  }}
                  className={`${styles.signup__form__input} ${styles.signup__form__input_password}`}
                />
              </label>
            </div>

            {props.error && <p>登録できませんでした</p>}

            <div className={styles.signup__form__button_field}>
              <button
                type="submit"
                className={`${styles.button} ${styles.button__primary}`}
              >
                {props.loading ? 'loading...' : '登録する'}
              </button>
            </div>

            <nav className={styles.nav}>
              <Link href="/login">
                <a href="/login" className={styles.nav__login}>
                  すでに会員の方はこちら
                </a>
              </Link>
            </nav>
          </form>
        </div>
      </div>
    </div>
  );
};
