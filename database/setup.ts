// command: node --loader ts-node/esm database/setup.ts

import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

const setup = async () => {
  try {
    const db = await open({
      filename: './database/data/sampledb.sqlite',
      driver: sqlite3.Database,
    });

    await db.migrate({
      migrationsPath: './database/migrations',
      force: true,
    });
  } catch (err) {
    console.log('*** error ***', err);
  }
};

setup();
