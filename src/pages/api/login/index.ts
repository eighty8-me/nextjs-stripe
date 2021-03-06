import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import type { FormDataType, AccountType } from '@/pages/login/index';

type RequestBodyType = {
  account: FormDataType;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  if (req.method !== 'POST') {
    res.status(405).json({
      message: 'Method Not Allowed.',
    });
  }

  const body = req.body as RequestBodyType;
  const data = body.account;
  const databaseDir = path.resolve('./database', 'data');

  try {
    const db = await open({
      filename: `${databaseDir}/sampledb.sqlite`,
      driver: sqlite3.Database,
    });

    const result = await db.get<AccountType>(
      `SELECT
        id,
        uuid,
        email,
        stripe_connected_account_id as stripeConnectedAccountId,
        stripe_customer_id as stripeCustomerId
      FROM
        accounts
      WHERE
        email = :email
      AND
        password = :password`,
      {
        ':email': data.email,
        ':password': data.password,
      },
    );

    console.log('*** Login DB result ***', result);

    if (!result) {
      res.json({
        status: 401,
        data: result,
      });

      return;
    }

    res.json({
      status: 200,
      data: result,
    });
  } catch (err) {
    console.log('*** DB Error ***', err);
  }
};
