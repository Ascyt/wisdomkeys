export class Entry {
  private readonly _entryId: number;
  private _word: string;
  private _answer: string;
  private readonly _collectionId: number;

  constructor(id: number, word: string, answer: string, collectionId: number) {
    this._entryId = id;
    this._word = word;
    this._answer = answer;
    this._collectionId = collectionId;
  }


  get entryId(): number {
    return this._entryId;
  }

  get word(): string {
    return this._word;
  }

  get answer(): string {
    return this._answer;
  }

  get collectionId(): number {
    return this._collectionId;
  }

  set word(value: string) {
    this._word = value;
  }

  set answer(value: string) {
    this._answer = value;
  }
}
