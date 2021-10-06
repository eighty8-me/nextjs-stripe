import React from 'react';
import { NextPage } from 'next';

const AccountReAuth: NextPage = () => {
  return <AccountReAuthComponent />;
};

export default AccountReAuth;

export const AccountReAuthComponent: React.FC = () => {
  return (
    <div>
      <h1>タイムアウトしました</h1>
      <p>Stripeアカウントの作成をもう一度やり直してください。</p>
    </div>
  );
};
