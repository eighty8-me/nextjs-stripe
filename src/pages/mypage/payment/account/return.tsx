import React from 'react';
import { NextPage } from 'next';

const AccountReturn: NextPage = () => {
  return <AccountReturnComponent />;
};

export default AccountReturn;

export const AccountReturnComponent: React.FC = () => {
  return (
    <div>
      <h1>Stripeアカウントが正常に作成されました</h1>
      <p>口座情報、アカウント情報はダッシュボードで確認できます。</p>
    </div>
  );
};
