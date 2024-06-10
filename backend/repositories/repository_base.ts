import {Unit} from "../database/unit";
import {Statement} from "sqlite"

export class RepositoryBase {
  protected constructor(protected readonly unit: Unit) {

  }

  public async executeStmt(stmt: Statement): Promise<boolean> {
    const result = await stmt.run();
    return result.changes === 1;
  }

  protected static nullIfUndefined<T>(value: T | undefined): T | null {
    if(value === undefined) {
      return null;
    }

    return value;
  }

  protected static unwrapSingle<T>(obj: any | null | undefined, fieldName: string): T | null {
    obj = RepositoryBase.nullIfUndefined(obj);
    return obj === null ? null : <T>obj[fieldName];
  }

  protected static unwrapAll<T>(obj: any[], fieldName: string): T[] {
    return obj.map(o => <T>o[fieldName]);
  }
}
