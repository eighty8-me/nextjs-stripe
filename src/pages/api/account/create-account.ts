import type { NextApiRequest, NextApiResponse } from 'next';
import type { FormDataType } from '@/pages/mypage/personal/index';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

type RequestBodyType = {
  seller: FormDataType;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).json({
      message: 'Method Not Allowed.',
    });
  }

  const body = req.body as RequestBodyType;
  const data = body.seller;
  const databaseDir = path.resolve('./database', 'data');

  try {
    const db = await open({
      filename: `${databaseDir}/sampledb.sqlite`,
      driver: sqlite3.Database,
    });

    const result = await db.run(
      `INSERT INTO sellers 
        (first_name, last_name, email, phone, zip, state, city, town, line)
      VALUES
        (:first_name, :last_name, :email, :phone, :zip, :state, :city, :town, :line)
      ON CONFLICT(email)
      DO UPDATE
      SET
        first_name=:first_name,
        last_name=:last_name,
        email=:email,
        zip=:zip,
        state=:state,
        city=:city,
        town=:town,
        line=:line`,
      {
        ':first_name': data.firstName,
        ':last_name': data.lastName,
        ':email': data.email,
        ':phone': data.phone,
        ':zip': data.zip,
        ':state': data.state,
        ':city': data.city,
        ':town': data.town,
        ':line': data.line,
      },
    );

    res.status(200).json(result);
  } catch (err) {
    console.log('*** DB Error ***', err);
  }
};
