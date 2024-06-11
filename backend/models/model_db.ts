export interface userDB {
  userid: number,
  username: string,
  password: string
}

export interface collectionDB {
  collectionid: number,
  collectionname: string,
  avgspeed: number | null,
  bestspeed: number | null,
  raceamount: number,
  userid: number
}

export interface entryDB {
  entryid: number,
  word: string,
  answer: string,
  collectionid: number
}


export interface userDBInsert {
  username: string,
  password: string
}

export interface collectionDBInsert {
  collectionname: string,
  avgspeed: number | null,
  bestspeed: number | null,
  raceamount: number,
  userid: number
}

export interface entryDBInsert {
  word: string,
  answer: string,
  collectionid: number
}
