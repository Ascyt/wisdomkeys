import {Entry} from "./model_entry";
import {entryDBInsert} from "./model_db";

export class Collection {
  private readonly _collectionId: number;
  private _collectionName: string;
  private _avgSpeed: number | null;
  private _bestSpeed: number | null;
  private _wordamount: number;
  private readonly _userId: number;
  private _entries: Entry[];


  constructor(collectionId: number, collectionName: string, avgSpeed: number | null, bestSpeed: number | null, wordamount: number, userId: number, entries: Entry[]) {
    this._collectionId = collectionId;
    this._collectionName = collectionName;
    this._avgSpeed = avgSpeed;
    this._bestSpeed = bestSpeed;
    this._wordamount = wordamount;
    this._userId = userId;
    this._entries = entries;
  }


  get collectionId(): number {
    return this._collectionId;
  }

  get collectionName(): string {
    return this._collectionName;
  }

  get avgSpeed(): number | null {
    return this._avgSpeed;
  }

  get bestSpeed(): number | null {
    return this._bestSpeed;
  }

  get wordamount(): number {
    return this._wordamount;
  }

  get userId(): number {
    return this._userId;
  }

  get entries(): Entry[] {
    return this._entries;
  }


  set collectionName(value: string) {
    this._collectionName = value;
  }

  set avgSpeed(value: number | null) {
    this._avgSpeed = value;
  }

  set bestSpeed(value: number | null) {
    this._bestSpeed = value;
  }

  set wordamount(value: number) {
    this._wordamount = value;
  }

  set entries(value: Entry[]) {
    this._entries = value;
  }

  addEntry(entry: Entry) {
    this._entries.push(entry);
  }

  removeEntry(entry: Entry) {
    this._entries.splice(this._entries.indexOf(entry), 1);
  }
}
