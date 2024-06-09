import {User} from "../models/model_user";
import {Unit} from "../database/unit";
import {RepositoryBase} from "./repository_base";
import {userDB} from "../models/model_db";

class UserRepository extends RepositoryBase {
  public constructor(unit: Unit) {
    super(unit);
  }

  public async getUserById(id: number): Promise<User | null> {
    return null;
  }

  public async updateUser(user: User): Promise<boolean> {
    const stmt = await this.unit.prepare('UPDATE "wk_user" SET username = ?1, password = ?2 WHERE userid = ?3', {
      1: user.username,
      2: user.password,
      3: user.userId
    });

    return await this.executeStmt(stmt);
  }
}
