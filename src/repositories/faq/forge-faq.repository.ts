import sql, { UpdateQueryResponse } from "@forge/sql";
import { FaqPageRecord } from "../../types/faq.types";
import { FaqPageRepository } from "./faq.repository";
import { db } from "../db";

export class ForgeFaqPageRepository implements FaqPageRepository {
  async findByQuestionAndSpace(
    questionId: string,
    spaceKey: string,
  ): Promise<FaqPageRecord | null> {
    const result = await db
      .prepare(
        `
        SELECT
          id, question_id, answer_id, confluence_page_id,
          confluence_page_url, space_key, title, created_at
        FROM faq_pages
        WHERE question_id = ? AND space_key = ?
        LIMIT 1
      `,
      )
      .bindParams(questionId, spaceKey)
      .execute<FaqPageRecord>();

    const row = result.rows[0];
    return row;
  }

  async create(input: {
    id: string;
    questionId: string;
    answerId: string;
    confluencePageId: string;
    confluencePageUrl: string | null;
    spaceKey: string;
    title: string;
  }): Promise<number> {
    const result = await sql
      .prepare<UpdateQueryResponse>(
        `
        INSERT INTO faq_pages (
          id, question_id, answer_id, confluence_page_id,
          confluence_page_url, space_key, title, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      )
      .bindParams(
        input.id,
        input.questionId,
        input.answerId,
        input.confluencePageId,
        input.confluencePageUrl,
        input.spaceKey,
        input.title,
        new Date().toISOString(),
      )
      .execute();
      return result.rows?.affectedRows
  }
}
