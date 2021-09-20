import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import styles from '@/pages/mypage/Mypage.module.scss';
import { Side } from '@/components/layouts/side/Side';

const Mypage: NextPage = () => {
  const router = useRouter();

  React.useEffect(() => {
    if (!sessionStorage.getItem('uuid')) {
      router.push('/');
    }
  }, []);

  return <MypageComponent />;
};

export default Mypage;

export const MypageComponent: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <div className={styles.main}>
          <h1>マイページ</h1>

          <div className="mypage"></div>
        </div>

        <Side />
      </div>
    </div>
  );
};
