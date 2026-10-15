import sql, { UpdateQueryResponse } from "@forge/sql";

import type { PaginatedTopics, Topic } from "../../shared/types";

import type {
  fetchTopicByCursorQuery,
  fetchTopicsQuery,
  UpdateTopicInput,
} from "../../shared/schemas/topic.schema";

import type { TopicRepository } from "./topic.repository";
import { LIMIT } from "../../shared/constants";
import { db } from "../db";

export class ForgeTopicRepository implements TopicRepository {
  async create(input: Topic): Promise<Topic> {
    const result = await sql
      .prepare<UpdateQueryResponse>(
        `
        INSERT INTO topics (
          id,
          name,
          description,
          created_at
        )
        VALUES (?, ?, ?, ?)
      `,
      )
      .bindParams(input.id, input.name, input.description, input.createdAt)
      .execute();

    return input;
  }

  async findAll(query: fetchTopicsQuery): Promise<PaginatedTopics> {
    let { lastId, direction = "next" } = query;

    const topicsQuery = lastId
      ? db
          .prepare(
            `
          SELECT
            id,
            name,
            description,
            created_at
          FROM topics
          ${direction === "next" ? "WHERE id < ? ORDER BY id DESC" : "WHERE id > ? ORDER BY id ASC"}
          LIMIT ${LIMIT}
        `,
          )
          .bindParams(lastId)
      : db.prepare(
          `
          SELECT
            id,
            name,
            description,
            created_at
          FROM topics
          ORDER BY id DESC
          LIMIT ${LIMIT}
        `,
        );

    const countQuery = db.prepare(`
      SELECT COUNT(*) AS total
      FROM topics
    `);

    const [topicsResult, countResult] = await Promise.all([
      topicsQuery.execute<Topic>(),
      countQuery.execute<{ total: number }>(),
    ]);

    const rows = topicsResult.rows;

    const total = Number(
      (countResult.rows[0] as { total: number | string }).total,
    );

    return {
      items: direction === "next" ? rows : rows.reverse(),
      total,
    };
  }

  async findByCursor(query: fetchTopicByCursorQuery): Promise<Topic[]> {
    const topicsQuery = query.lastId
      ? db
          .prepare(
            `
          SELECT
            id,
            name,
            description,
            created_at
          FROM topics
          WHERE id > ? ORDER BY id ASC
          LIMIT ${LIMIT}
        `,
          )
          .bindParams(query.lastId)
      : db.prepare(
          `
          SELECT
            id,
            name,
            description,
            created_at
          FROM topics
          ORDER BY id ASC
          LIMIT ${LIMIT}
        `,
        );

    const topicsResult = await topicsQuery.execute<Topic>();

    const rows = topicsResult.rows;

    return rows;
  }

  async findById(id: string): Promise<Topic | null> {
    const result = await sql
      .prepare(
        `SELECT 
          id,
          name,
          description,
          created_at AS createdAt
         FROM topics WHERE id = ?`,
      )
      .bindParams(id)
      .execute();

    return result.rows[0] as Topic;
  }

  async findByName(name: string): Promise<Topic | null> {
    const result = await sql
      .prepare(
        `
        SELECT
          id,
          name,
          description,
          created_at as createdAt
        FROM topics
        WHERE name = ?
      `,
      )
      .bindParams(name)
      .execute();

    return result.rows[0] as Topic;
  }

  async update(input: UpdateTopicInput): Promise<number> {
    const ret = await sql
      .prepare<UpdateQueryResponse>(
        `
        UPDATE topics
        SET
          name = ?,
          description = ?
        WHERE id = ?
      `,
      )
      .bindParams(input.name, input.description, input.id)
      .execute();

    return ret.rows.affectedRows;
  }

  async delete(id: string): Promise<number> {
    const ret = await sql
      .prepare<UpdateQueryResponse>(
        `
        DELETE FROM topics
        WHERE id = ?
      `,
      )
      .bindParams(id)
      .execute();

    return ret.rows.affectedRows;
  }

  async existsByIds(ids: string[]): Promise<boolean> {
    const placeholders = ids.map(() => "?").join(", ");

    const result = await sql
      .prepare(
        `
          SELECT COUNT(*) AS count
          FROM topics
          WHERE id IN (${placeholders})
        `,
      )
      .bindParams(...ids)
      .execute();

    const row = result.rows[0] as { count: number };

    return row.count === ids.length;
  }
}
