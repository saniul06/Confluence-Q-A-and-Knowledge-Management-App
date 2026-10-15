import { sql, UpdateQueryResponse } from "@forge/sql";
import { ConfigRepository } from "./config.repository";
import { ConfigEntry } from "../../types/config.types";
import { db } from "../db";

export class ForgeConfigRepository implements ConfigRepository {
  async get(key: string): Promise<ConfigEntry | null> {
    const result = await db
      .prepare(
        `
        SELECT config_key, value, updated_at
        FROM config
        WHERE config_key = ?
      `,
      )
      .bindParams(key)
      .execute<ConfigEntry>();

    const row = result.rows[0];
    return row;
  }

  async set(key: string, value: string): Promise<number> {
    const now = new Date().toISOString();

    const result = await sql
      .prepare<UpdateQueryResponse>(
        `
      INSERT INTO config (config_key, value, updated_at)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        value = VALUES(value),
        updated_at = VALUES(updated_at)
    `,
      )
      .bindParams(key, value, now)
      .execute();

    return result.rows.affectedRows;
  }
}
