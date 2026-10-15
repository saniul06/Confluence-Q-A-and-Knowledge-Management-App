import sql from "@forge/sql";
import { DeepCamelCase, DeepSnakeCase, toCamelCase } from "../utils/mapper";

interface StronglyTypedStatement {
  bindParams(...params: any[]): StronglyTypedStatement;
  execute<T>(): Promise<{
    rows: DeepCamelCase<DeepSnakeCase<T>>[];
    metadata?: any;
  }>;
}

// run main sql function 
export const db = {
  prepare(query: string): StronglyTypedStatement {
    const stmt = sql.prepare(query);

    const wrapper = {
      bindParams(...params: any[]) {
        stmt.bindParams(...params);
        return wrapper; // চেইনিং বজায় রাখার জন্য
      },
      async execute<T>() {
        const result = await stmt.execute();
        return {
          ...result,
          rows: toCamelCase(result.rows) as unknown as DeepCamelCase<T>[],
        };
      },
    };

    return wrapper;
  },
};