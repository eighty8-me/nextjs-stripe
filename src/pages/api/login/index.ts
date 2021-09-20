import type { NextApiRequest, NextApiResponse } from 'next';
import type { FormDataType, AccountType } from '@/pages/login/index';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

type RequestBodyType = {
  account: FormDataType;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
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
        *
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
