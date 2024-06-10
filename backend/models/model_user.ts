import {Collection} from "./model_collection";

export class User {
  private readonly _userId: number;
  private _username: string;
  private _password: string;
  private _collections: Collection[];

  constructor(userId: number, username: string, password: string, collections: Collection[]) {
    this._userId = userId;
    this._username = username;
    this._password = password;
    this._collections = collections;
  }

  get userId(): number {
    return this._userId;
  }

  get username(): string {
    return this._username;
  }

  get password(): string {
    return this._password;
  }

  get collections(): Collection[] {
    return this._collections;
  }

  set username(value: string) {
    this._username = value;
  }

  set password(value: string) {
    this._password = value;
  }

  set collections(value: Collection[]) {
    this._collections = value;
  }

  addCollection(collection: Collection) {
    this._collections.push(collection);
  }

  removeCollection(collection: Collection) {
    this._collections.splice(this._collections.indexOf(collection), 1);
  }
}
