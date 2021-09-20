import type { NextApiRequest, NextApiResponse } from 'next';
import type { FormDataType } from '@/pages/mypage/personal/index';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

type RequestBodyType = {
  seller: FormDataType;
  uuid: string;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).json({
      message: 'Method Not Allowed.',
    });
  }

  const body = req.body as RequestBodyType;
  const data = { ...body.seller, uuid: body.uuid };
  const databaseDir = path.resolve('./database', 'data');

  try {
    const db = await open({
      filename: `${databaseDir}/sampledb.sqlite`,
      driver: sqlite3.Database,
    });

    const result = await db.run(
      `INSERT INTO sellers 
        (uuid, first_name, last_name, phone, zip, state, city, town, line)
      VALUES
        (:uuid, :first_name, :last_name, :phone, :zip, :state, :city, :town, :line)
      ON CONFLICT(uuid)
      DO UPDATE
      SET
        uuid=:uuid,
        first_name=:first_name,
        last_name=:last_name,
        zip=:zip,
        state=:state,
        city=:city,
        town=:town,
        line=:line`,
      {
        ':uuid': data.uuid,
        ':first_name': data.firstName,
        ':last_name': data.lastName,
        ':phone': data.phone,
        ':zip': data.zip,
        ':state': data.state,
        ':city': data.city,
        ':town': data.town,
        ':line': data.line,
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
