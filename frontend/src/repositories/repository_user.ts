import {User} from "../models/model_user";
import {Unit} from "../database/unit";
import {RepositoryBase} from "./repository_base";
import {userDB} from "../models/model_db";
import {Collection} from "../models/model_collection";
import {CollectionRepository} from "./repository_collection";

export class UserRepository extends RepositoryBase {
  public constructor(unit: Unit) {
    super(unit);
  }

  public async updateUser(user: User): Promise<boolean> {
    const stmt = await this.unit.prepare('UPDATE wk_user SET username = ?1, password = ?2 WHERE userid = ?3', {
      1: user.username,
      2: user.password,
      3: user.userId
    });

    return await this.executeStmt(stmt);
  }

  public async insertUser(user: User): Promise<boolean> {
    const stmt = await this.unit.prepare('INSERT INTO wk_user (username, password) VALUES (?1, ?2)', {
      1: user.username,
      2: user.password
    });

    return await this.executeStmt(stmt);
  }

  public async deleteUser(user: User): Promise<boolean> {
    const stmt = await this.unit.prepare('DELETE FROM wk_user WHERE userid = ?1', user.userId);

    return await this.executeStmt(stmt);
  }

  public async getUserById(userId: number): Promise<User | null> {
    const collectionRepository = new CollectionRepository(this.unit);
    const stmt = await this.unit.prepare('SELECT userid, username, password FROM wk_user WHERE userid = ?1', userId);

    const user: userDB | null = RepositoryBase.nullIfUndefined(await stmt.get<userDB>());

    if(user === null) {
      return null;
    }

    let collections: Collection[] | null = await collectionRepository.getCollectionsByUserId(userId);
    if(collections === null) {
      collections = [];
    }

    return new User(user.userid, user.username, user.password, collections);
  }

  public async getAllUsers(): Promise<User[] | null> {
    const collectionRepository = new CollectionRepository(this.unit);
    const stmt = await this.unit.prepare('SELECT userid, username, password FROM wk_user');

    const usersTemp: userDB[] | null = RepositoryBase.nullIfUndefined(await stmt.all<userDB[]>());

    if(usersTemp === null || usersTemp.length === 0) {
      return null;
    }

    let users: User[] = [];

    for(let i = 0; i < usersTemp.length; i++) {
      let colls: Collection[] | null = RepositoryBase.nullIfUndefined(await collectionRepository.getCollectionsByUserId(usersTemp[i].userid));
      if(colls === null) {
        colls = [];
      }

      users.push(new User(
        usersTemp[i].userid,
        usersTemp[i].username,
        usersTemp[i].password,
        colls
      ));
    }

    return users;
  }

}
