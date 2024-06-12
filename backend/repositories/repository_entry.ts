import {Entry} from "../models/model_entry";
import {Unit} from "../database/unit";
import {RepositoryBase} from "./repository_base";
import {entryDB, entryDBInsert} from "../models/model_db";

export class EntryRepository extends RepositoryBase {
  public constructor(unit: Unit) {
    super(unit);
  }

  public async updateEntry(entry: Entry): Promise<boolean> {
    const stmt = await this.unit.prepare('UPDATE wk_entry SET word = ?1, answer = ?2 WHERE entryid = ?3', {
      1: entry.word,
      2: entry.answer,
      3: entry.entryId
    });

    return await this.executeStmt(stmt);
  }

  public async insertEntry(entry: entryDBInsert): Promise<boolean> {
    const stmt = await this.unit.prepare('INSERT INTO wk_entry (word, answer, collectionid) VALUES (?1, ?2, ?3)', {
      1: entry.word,
      2: entry.answer,
      3: entry.collectionid
    });

    return await this.executeStmt(stmt);
  }

  public async deleteEntries(collId: number): Promise<boolean> {
    const stmt = await this.unit.prepare('DELETE FROM wk_entry WHERE collectionid = ?1', collId);

    return await this.executeStmt(stmt);
  }

  public async getEntryById(entryId: number): Promise<Entry | null> {
    const stmt = await this.unit.prepare('SELECT entryid, word, answer, collectionid FROM wk_entry WHERE entryid = ?1', entryId);

    const entry: entryDB | null = RepositoryBase.nullIfUndefined(await stmt.get<entryDB>());

    if(entry === null) {
      return null;
    }

    return new Entry(entry.entryid, entry.word, entry.answer, entry.collectionid);
  }

  public async getEntriesByCollectionId(collectionId: number): Promise<Entry[] | null> {
    const stmt = await this.unit.prepare('SELECT entryid, word, answer, collectionid FROM wk_entry WHERE collectionid = ?1', collectionId);

    const entriesTemp: entryDB[] | null = RepositoryBase.nullIfUndefined(await stmt.all<entryDB[]>());

    if(entriesTemp === null) {
      return null;
    }

    let entries: Entry[] = [];

    for(let i = 0; i < entriesTemp.length; i++) {
      entries.push(new Entry(
        entriesTemp[i].entryid,
        entriesTemp[i].word,
        entriesTemp[i].answer,
        entriesTemp[i].collectionid
      ));
    }

    return entries;
  }

}
