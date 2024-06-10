import {Database as Driver} from "sqlite3";
import {open, Database} from "sqlite";

const dbFilename: string = 'wisdomkeys.db';

export class DB {
  public static async createDBConnection(): Promise<Database> {
    const db = await open({
      filename: `./${dbFilename}`,
      driver: Driver
    });

    await db.run('PRAGMA foreign_keys = ON');

    await DB.ensureTables(db);

    return db;
  }

  public static async beginTransaction(connection: Database): Promise<void> {
    await connection.run('begin transaction;');
  }

  public static async commitTransaction(connection: Database): Promise<void> {
    await connection.run('commit;');
  }

  public static async rollbackTransaction(connection: Database): Promise<void> {
    await connection.run('rollback;');
  }

  private static async ensureTables(connection: Database): Promise<void> {
    await connection.run(
      `CREATE TABLE IF NOT EXISTS "wk_user" (
            userid integer NOT NULL PRIMARY KEY AUTOINCREMENT,
            username text NOT NULL,
            password text NOT NULL
            ) STRICT`
    );

    await connection.run(
      `CREATE TABLE IF NOT EXISTS "wk_collection" (
            collectionid integer NOT NULL PRIMARY KEY AUTOINCREMENT,
            collectionname text NOT NULL,
            avgspeed double,
            bestspeed double,
            raceAmount integer NOT NULL,
            userid integer NOT NULL,
            CONSTRAINT fk_collection_user FOREIGN KEY (userid) REFERENCES "wk_user" (userid) ON DELETE CASCADE
            ) STRICT`
    );

    await connection.run(
      `CREATE TABLE IF NOT EXISTS "wk_entry" (
            entryid integer NOT NULL PRIMARY KEY AUTOINCREMENT,
            word text NOT NULL,
            answer text NOT NULL,
            collectionid integer NOT NULL,
            CONSTRAINT fk_entry_collection FOREIGN KEY (collectionid) REFERENCES "wk_collection" (collectionid) ON DELETE CASCADE
            ) STRICT`
    );
  }
}
