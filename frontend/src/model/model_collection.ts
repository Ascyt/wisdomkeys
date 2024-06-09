import {Entry} from "./model_entry";

export class Collection {
  private readonly _collectionId: number;
  private _collectionName: string;
  private _avgSpeed: number;
  private _bestSpeed: number;
  private _raceAmount: number;
  private readonly _userId: number;
  private _entries: Entry[];


  constructor(collectionId: number, collectionName: string, avgSpeed: number, bestSpeed: number, raceAmount: number, userId: number, entries: Entry[]) {
    this._collectionId = collectionId;
    this._collectionName = collectionName;
    this._avgSpeed = avgSpeed;
    this._bestSpeed = bestSpeed;
    this._raceAmount = raceAmount;
    this._userId = userId;
    this._entries = entries;
  }


  get collectionId(): number {
    return this._collectionId;
  }

  get collectionName(): string {
    return this._collectionName;
  }

  get avgSpeed(): number {
    return this._avgSpeed;
  }

  get bestSpeed(): number {
    return this._bestSpeed;
  }

  get raceAmount(): number {
    return this._raceAmount;
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

  set avgSpeed(value: number) {
    this._avgSpeed = value;
  }

  set bestSpeed(value: number) {
    this._bestSpeed = value;
  }

  set raceAmount(value: number) {
    this._raceAmount = value;
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
