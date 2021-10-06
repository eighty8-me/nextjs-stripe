import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import type { SellerInfoType } from '@/pages/mypage/payment/index';

type RequestQueryType = {
  uuid: string;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  if (req.method !== 'GET') {
    res.status(405).json({
      message: 'Method Not Allowed.',
    });
  }

  const { uuid } = req.query as RequestQueryType;
  const databaseDir = path.resolve('./database', 'data');

  try {
    const db = await open({
      filename: `${databaseDir}/sampledb.sqlite`,
      driver: sqlite3.Database,
    });

    const result = await db.get<SellerInfoType>(
      `SELECT
        users.id,
        users.uuid,
        users.first_name as firstName,
        users.last_name as lastName,
        users.phone,
        users.zip,
        users.state,
        users.city,
        users.town,
        users.line,
        accounts.email
      FROM
        users
      INNER JOIN
        accounts
      ON
        users.uuid = accounts.uuid
      WHERE
        users.uuid = :uuid`,
      {
        ':uuid': uuid,
      },
    );

    console.log('*** DB result ***', result);

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
