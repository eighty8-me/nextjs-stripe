import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import type { ProductType } from '@/pages/product/index';

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  if (req.method !== 'GET') {
    res.status(405).json({
      message: 'Method Not Allowed.',
    });
  }

  const databaseDir = path.resolve('./database', 'data');

  try {
    const db = await open({
      filename: `${databaseDir}/sampledb.sqlite`,
      driver: sqlite3.Database,
    });

    const results = await db.all<ProductType[]>(
      `SELECT
        id as productId,
        uuid,
        name as productName,
        price as productPrice
      FROM
        products`,
    );

    console.log('*** DB results ***', results);

    if (!results) {
      res.json({
        status: 401,
        data: results,
      });

      return;
    }

    res.json({
      status: 200,
      data: results,
    });
  } catch (err) {
    console.log('*** DB Error ***', err);
  }
};
