import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '@/pages/login/Login.module.scss';

export type FormDataType = {
  email: string;
  password: string;
};

export type AccountType = {
  id: number;
  uuid: string;
  email: string;
  stripeConnectedAccountId: string;
  stripeCustomerId: string | null;
  createdAt: string;
};

export type ApiResponseType = {
  status: number;
  data: AccountType;
};

type LoginComponentPropsType = {
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

const Login: NextPage = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [formData, setFormData] = React.useState<FormDataType>(defaultFormData);

  const execLogin = async (data: FormDataType): Promise<void> => {
    const res = await axios.post<ApiResponseType>('/api/login', {
      account: data,
    });

    if (res.data.status !== 200) {
      setError(true);
      return;
    }

    sessionStorage.setItem('uuid', res.data.data.uuid);
    sessionStorage.setItem('sca_id', res.data.data.stripeConnectedAccountId);

    router.push('/mypage/');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    await execLogin(formData);
    setLoading(false);
  };

  return (
    <LoginComponent
      loading={loading}
      error={error}
      formData={formData}
      setFormData={setFormData}
      handleSubmit={handleSubmit}
    />
  );
};

export default Login;

export const LoginComponent: React.FC<LoginComponentPropsType> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.login}>
          <h1 className={styles.login__heading}>ログイン</h1>

          <form onSubmit={props.handleSubmit} className="login__form">
            <div className={styles.login__form__field}>
              <label className={styles.login__form__label}>
                <span className={styles.login__form__label_caption}>
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
                  className={`${styles.login__form__input} ${styles.login__form__input_email}`}
                />
              </label>
            </div>

            <div className={styles.login__form__field}>
              <label className={styles.login__form__label}>
                <span className={styles.login__form__label_caption}>
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
                  className={`${styles.login__form__input} ${styles.login__form__input_password}`}
                />
              </label>
            </div>

            {props.error && <p>ログインできませんでした</p>}

            <div className={styles.login__form__button_field}>
              <button
                type="submit"
                className={`${styles.button} ${styles.button__primary}`}
              >
                {props.loading ? 'loading...' : 'ログイン'}
              </button>
            </div>

            <nav className={styles.nav}>
              <Link href="/signup">
                <a href="/signup" className={styles.nav__signup}>
                  会員登録はこちら
                </a>
              </Link>
            </nav>
          </form>
        </div>
      </div>
    </div>
  );
};
