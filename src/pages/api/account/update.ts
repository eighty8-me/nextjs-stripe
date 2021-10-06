import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import dayjs from 'dayjs';

type RequestBodyType = {
  uuid: string;
  stripeConnectedAccountId: string;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  if (req.method !== 'PUT') {
    res.status(405).json({
      message: 'Method Not Allowed.',
    });
  }

  const body = req.body as RequestBodyType;
  const databaseDir = path.resolve('./database', 'data');

  try {
    const db = await open({
      filename: `${databaseDir}/sampledb.sqlite`,
      driver: sqlite3.Database,
    });

    const result = await db.run(
      `UPDATE
        accounts 
      SET
        stripe_connected_account_id = :stripe_connected_account_id,
        updated_at = :updated_at
      WHERE
        uuid = :uuid`,
      {
        ':stripe_connected_account_id': body.stripeConnectedAccountId,
        ':updated_at': dayjs().format('YYYY-MM-DD hh:mm:ss'),
        ':uuid': body.uuid,
      },
    );

    console.log('*** DB result ***', result);

    if (result.lastID === 0 && result.changes === 0) {
      res.json({
        status: 500,
        data: result,
      });

      return;
    }

    res.json({
      status: 200,
    });
  } catch (err) {
    console.log('*** DB Error ***', err);
  }
};
