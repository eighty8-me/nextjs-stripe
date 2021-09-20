import type { NextApiRequest, NextApiResponse } from 'next';
import type { FormDataType } from '@/pages/mypage/product/index';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

type RequestBodyType = {
  product: FormDataType;
  uuid: string;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).json({
      message: 'Method Not Allowed.',
    });
  }

  const body = req.body as RequestBodyType;
  const data = { ...body.product, uuid: body.uuid };
  const databaseDir = path.resolve('./database', 'data');

  try {
    const db = await open({
      filename: `${databaseDir}/sampledb.sqlite`,
      driver: sqlite3.Database,
    });

    const result = await db.run(
      `INSERT INTO products 
        (uuid, name, price)
      VALUES
        (:uuid, :name, :price)`,
      {
        ':uuid': data.uuid,
        ':name': data.name,
        ':price': data.price,
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
