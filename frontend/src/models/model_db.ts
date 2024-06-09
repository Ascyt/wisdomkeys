export interface userDB {
  userId: number,
  username: string,
  password: string
}

export interface collectionDB {
  collectionId: number,
  collectionName: string,
  avgSpeed: number,
  bestSpeed: number,
  raceAmount: number,
  userId: number
}

export interface entryDB {
  entryId: number,
  word: string,
  answer: string,
  collectionId: number
}


export interface userDBInsert {
  username: string,
  password: string
}

export interface collectionDBInsert {
  collectionName: string,
  avgSpeed: number,
  bestSpeed: number,
  raceAmount: number,
  userId: number
}

export interface entryDBInsert {
  word: string,
  answer: string,
  collectionId: number
}
