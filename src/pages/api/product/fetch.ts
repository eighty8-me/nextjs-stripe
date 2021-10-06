import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import type { ProductInfoType } from '@/pages/product/index';

type RequestQueryType = {
  productId: string;
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

  const { productId } = req.query as RequestQueryType;
  const databaseDir = path.resolve('./database', 'data');

  try {
    const db = await open({
      filename: `${databaseDir}/sampledb.sqlite`,
      driver: sqlite3.Database,
    });

    const result = await db.get<ProductInfoType>(
      `SELECT
        products.id as productId,
        products.name as productName,
        products.price as productPrice,
        accounts.uuid,
        accounts.email,
        accounts.stripe_connected_account_id as stripeConnectedAccountId,
        accounts.stripe_customer_id as stripeCustomerId,
        users.first_name as firstName,
        users.last_name as lastName,
        users.phone,
        users.zip,
        users.state,
        users.city,
        users.town,
        users.line
      FROM
        products
      LEFT JOIN
        accounts
      ON
        products.uuid = accounts.uuid
      LEFT JOIN
        users
      ON
        users.uuid = accounts.uuid
      WHERE
        products.id = :productId`,
      {
        ':productId': parseInt(productId, 10),
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
