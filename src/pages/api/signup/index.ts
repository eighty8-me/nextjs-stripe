import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { v4 } from 'uuid';
import dayjs from 'dayjs';
import type { FormDataType } from '@/pages/signup/index';

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
  const data = { ...body.account, uuid: v4() };
  const databaseDir = path.resolve('./database', 'data');

  try {
    const db = await open({
      filename: `${databaseDir}/sampledb.sqlite`,
      driver: sqlite3.Database,
    });

    const result = await db.run(
      `INSERT INTO accounts
        (uuid, email, password, created_at)
      VALUES
        (:uuid, :email, :password, :created_at)`,
      {
        ':uuid': data.uuid,
        ':email': data.email,
        ':password': data.password,
        ':created_at': dayjs().format('YYYY-MM-DD hh:mm:ss'),
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
      data,
    });
  } catch (err) {
    console.log('*** DB Error ***', err);
  }
};
