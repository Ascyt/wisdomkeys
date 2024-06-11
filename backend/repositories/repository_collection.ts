import {Collection} from "../models/model_collection";
import {Unit} from "../database/unit";
import {RepositoryBase} from "./repository_base";
import {collectionDB, collectionDBInsert} from "../models/model_db";
import {Entry} from "../models/model_entry";
import {EntryRepository} from "./repository_entry";

export class CollectionRepository extends RepositoryBase {
  public constructor(unit: Unit) {
    super(unit);
  }

  public async updateCollection(coll: Collection): Promise<boolean> {
    const stmt = await this.unit.prepare('UPDATE wk_collection SET collectionname = ?1, avgspeed = ?2, bestspeed = ?3, raceamount = ?4, userid = ?5 WHERE collectionid = ?6', {
      1: coll.collectionName,
      2: coll.avgSpeed,
      3: coll.bestSpeed,
      4: coll.raceAmount,
      5: coll.userId,
      6: coll.collectionId
    });

    return await this.executeStmt(stmt);
  }

  public async insertCollection(coll: collectionDBInsert): Promise<boolean> {
    const stmt = await this.unit.prepare('INSERT INTO wk_collection (collectionname, avgspeed, bestspeed, raceamount, userid) VALUES (?1, ?2, ?3, ?4, ?5)', {
      1: coll.collectionname,
      2: coll.avgspeed,
      3: coll.bestspeed,
      4: coll.raceamount,
      5: coll.userid
    });

    return await this.executeStmt(stmt);
  }

  public async deleteCollection(collId: number): Promise<boolean> {
    const stmt = await this.unit.prepare('DELETE FROM wk_collection WHERE collectionid = ?1', collId);

    return await this.executeStmt(stmt);
  }

  public async getCollectionById(collId: number): Promise<Collection | null> {
    const entryRepository = new EntryRepository(this.unit);
    const stmt = await this.unit.prepare('SELECT collectionid, collectionname, avgspeed, bestspeed, raceamount, userid FROM wk_collection WHERE collectionid = ?1', collId);

    const collection: collectionDB | null = RepositoryBase.nullIfUndefined(await stmt.get<collectionDB>());

    if(collection === null) {
      return null;
    }

    let entries: Entry[] | null = await entryRepository.getEntriesByCollectionId(collId);
    if(entries === null) {
      entries = [];
    }

    return new Collection(collection.collectionid, collection.collectionname, collection.avgspeed, collection.bestspeed, collection.raceamount, collection.userid, entries);
  }

  public async getCollectionsByUserId(userId: number): Promise<Collection[] | null> {
    const stmt = await this.unit.prepare('SELECT collectionid, collectionname, avgspeed, bestspeed, raceamount, userid FROM wk_collection WHERE userid = ?1', userId);

    const collsTemp: collectionDB[] | null = RepositoryBase.nullIfUndefined(await stmt.all<collectionDB[]>());

    if(collsTemp === null || collsTemp.length === 0) {
      return null;
    }

    let colls: Collection[] = [];

    for(let i = 0; i < collsTemp.length; i++) {
      const entryRepository = new EntryRepository(this.unit);
      let entries: Entry[] | null = RepositoryBase.nullIfUndefined(await entryRepository.getEntriesByCollectionId(collsTemp[i].collectionid))
      if(entries === null) {
        entries = [];
      }

      colls.push(new Collection(
        collsTemp[i].collectionid,
        collsTemp[i].collectionname,
        collsTemp[i].avgspeed,
        collsTemp[i].bestspeed,
        collsTemp[i].raceamount,
        collsTemp[i].userid,
        entries
      ));
    }

    return colls;
  }

}
