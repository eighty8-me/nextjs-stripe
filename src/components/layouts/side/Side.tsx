import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '@/components/layouts/side/Side.module.scss';

export const Side: React.FC = () => {
  const router = useRouter();

  const handleClickLogout = () => {
    console.log('*** session clear ***');

    sessionStorage.removeItem('uuid');
    sessionStorage.removeItem('sca_id');
    router.push('/');
  };

  return (
    <div className={styles.side}>
      <ul className={styles.side__menu}>
        <li>
          <Link href="/mypage/personal">
            <a href="/mypage/personal" className={styles.side__menu__item}>
              基本情報
            </a>
          </Link>
        </li>
        <li>
          <Link href="/mypage/product">
            <a href="/mypage/product" className={styles.side__menu__item}>
              商品登録
            </a>
          </Link>
        </li>
        <li>
          <Link href="/mypage/payment/">
            <a href="/mypage/payment/" className={styles.side__menu__item}>
              支払い関係
            </a>
          </Link>
        </li>
      </ul>

      <nav className={styles.side__nav}>
        <button
          type="button"
          onClick={handleClickLogout}
          className={styles.side__nav__button}
        >
          ログアウト
        </button>
      </nav>
    </div>
  );
};
