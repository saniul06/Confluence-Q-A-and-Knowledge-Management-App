import sql, { UpdateQueryResponse } from "@forge/sql";

import { Expert } from "../../shared/types";
import { ExpertRepository } from "./expert.repository";
import { db } from "../db";

export class ForgeExpertRepository implements ExpertRepository {
  async findByTopicId(topicId: string): Promise<Expert[]> {
    const result = await sql
      .prepare(
        `
        SELECT
          id,
          topic_id AS topicId,
          account_id AS accountId,
          display_name AS displayName,
          created_at AS createdAt
        FROM experts
        WHERE topic_id = ?
        ORDER BY display_name ASC
      `,
      )
      .bindParams(topicId)
      .execute();

    return result.rows as Expert[];
  }

  async findByTopicIds(topicIds: string[]): Promise<Expert[]> {
    const placeholders = topicIds.map((i) => "?").join(",");
    const result = await db
      .prepare(
        `
        SELECT
          id,
          topic_id,
          account_id,
          display_name,
          created_at
        FROM experts
        WHERE topic_id IN (${placeholders})
        
              `,
      )
      .bindParams(...topicIds)
      .execute<Expert>();

    return result.rows;
  }

  async findById(id: string): Promise<Expert | null> {
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

    return result.rows[0] as Expert;
  }

  async findByTopicAndAccount(
    topicId: string,
    accountId: string,
  ): Promise<Expert | null> {
    const result = await sql
      .prepare(
        `
        SELECT
          id,
          topic_id AS topicId,
          account_id AS accountId,
          display_name AS displayName,
          created_at AS createdAt
        FROM experts
        WHERE topic_id = ?
          AND account_id = ?
      `,
      )
      .bindParams(topicId, accountId)
      .execute();

    return (result.rows[0] as Expert | undefined) ?? null;
  }

  async create(input: Expert): Promise<Expert> {
    const result = await sql
      .prepare(
        `
        INSERT INTO experts (
          id,
          topic_id,
          account_id,
          display_name
        )
        VALUES (?, ?, ?, ?)
      `,
      )
      .bindParams(input.id, input.topicId, input.accountId, input.displayName)
      .execute();

    return input;
  }

  async delete(id: string): Promise<number> {
    const ret = await sql
      .prepare<UpdateQueryResponse>(
        `
        DELETE FROM experts
        WHERE id = ?
      `,
      )
      .bindParams(id)
      .execute();

    return ret.rows.affectedRows;
  }

  async deleteByTopic(topicId: string): Promise<number> {
    const ret = await sql
      .prepare<UpdateQueryResponse>(
        `
        DELETE FROM experts
        WHERE topic_id = ?
      `,
      )
      .bindParams(topicId)
      .execute();

    return ret.rows.affectedRows;
  }
}
