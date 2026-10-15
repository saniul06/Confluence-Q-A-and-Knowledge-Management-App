import sql, { UpdateQueryResponse } from "@forge/sql";
import {
  PaginatedQuestions,
  Question,
  QuestionCursor,
  QuestionDetails,
  QuestionExpert,
  QuestionListItem,
  QuestionStatus,
  QuestionTopic,
  QuestionTopicRow,
} from "../../shared/types/question.type";
import { QuestionRepository } from "./question.repository";
import { createPayload } from "../../utils/helpers";
import { db } from "../db";
import { ListQuestionsInput } from "../../shared/schemas/question.schemas";
import { LIMIT, QUESTION_STATUS } from "../../shared/constants";
import { QuestionForFaqPublishing } from "../../types/faq.types";

export class ForgeQuestionRepository implements QuestionRepository {
  async findById(
    id: string,
  ): Promise<Omit<QuestionDetails, "topics" | "answers"> | null> {
    const result = await db
      .prepare(
        `select q.*, e.display_name, e.account_id from questions q LEFT JOIN experts e ON e.id = q.assigned_expert_id where q.id = ?`,
      )
      .bindParams(id)
      .execute<any>();
    let question = result.rows[0];
    if (question) {
      const { displayName, accountId, ...rest } = question;
      question = {
        ...rest,
        assignedExpert: {
          displayName: displayName,
          accountId: accountId,
          id: question.assignedExpertId,
        },
      };
    }
    return question;
  }
  async create(input: Question): Promise<number> {
    const { fields, placeholders, values } = createPayload(input);
    const result = await sql
      .prepare<UpdateQueryResponse>(
        `
      INSERT INTO questions (${fields})
      VALUES (${placeholders})
    `,
      )
      .bindParams(...values)
      .execute();

    return result.rows?.affectedRows;
  }

  async listBySpace(input: {
    spaceKey: string;
    status?: QuestionStatus;
    topicId?: string;
    cursor?: QuestionCursor;
    limit: number;
  }): Promise<PaginatedQuestions> {
    const { spaceKey, status, topicId, cursor, limit } = input;

    const params: unknown[] = [spaceKey];

    let where = `
      q.space_key = ?
    `;

    if (status) {
      where += `
        AND q.status = ?
      `;

      params.push(status);
    }

    if (topicId) {
      where += `
        AND EXISTS (
          SELECT 1
          FROM question_topics qtf
          WHERE qtf.question_id = q.id
            AND qtf.topic_id = ?
        )
      `;

      params.push(topicId);
    }

    if (cursor) {
      where += `
        AND (
          q.created_at < ?
          OR (
            q.created_at = ?
            AND q.id < ?
          )
        )
      `;

      params.push(cursor.lastId);
    }

    const query = `
          SELECT
            q.id,
            q.space_key,
            q.title,
            q.body,
            q.author_account_id,
            q.author_display_name,
            q.status,
            q.assigned_expert_id,
            q.created_at,
            q.updated_at
          FROM questions q
          WHERE ${where}
          ORDER BY
            q.created_at DESC,
            q.id DESC
          LIMIT ${limit + 1}
        `;
    const rows = await sql
      .prepare(query)
      .bindParams(...params)
      .execute();

    const questionRows = rows.rows as any[];

    const hasMore = questionRows.length > limit;

    const pageRows = hasMore ? questionRows.slice(0, limit) : questionRows;

    if (pageRows.length === 0) {
      return {
        items: [],
        hasMore: !!pageRows.length,
      };
    }

    const questionIds = pageRows.map((row) => row.id);

    const topicRows = await this.findTopicsByQuestionIds(questionIds);

    const topicsByQuestionId = this.groupTopicsByQuestionId(topicRows);

    const items: QuestionListItem[] = pageRows.map((row) => ({
      id: row.id,
      spaceKey: row.space_key,
      title: row.title,
      body: row.body,
      authorAccountId: row.author_account_id,
      authorDisplayName: row.author_display_name,
      status: row.status,
      assignedExpertId: row.assigned_expert_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      topics: topicsByQuestionId.get(row.id) ?? [],
    }));

    return {
      items,
      hasMore: !!items.length,
    };
  }

  private async findTopicsByQuestionIds(
    questionIds: string[],
  ): Promise<QuestionTopicRow[]> {
    const placeholders = questionIds.map(() => "?").join(", ");

    const result = await sql
      .prepare(
        `
        SELECT
          qt.question_id,
          t.id,
          t.name
        FROM question_topics qt
        INNER JOIN topics t
          ON t.id = qt.topic_id
        WHERE qt.question_id IN (${placeholders})
        ORDER BY t.name ASC
      `,
      )
      .bindParams(...questionIds)
      .execute();

    return result.rows as QuestionTopicRow[];
  }

  private groupTopicsByQuestionId(
    rows: QuestionTopicRow[],
  ): Map<string, QuestionTopic[]> {
    const result = new Map<string, QuestionTopic[]>();

    for (const row of rows) {
      const topics = result.get(row.question_id);

      const topic = {
        id: row.id,
        name: row.name,
      };

      if (topics) {
        topics.push(topic);
      } else {
        result.set(row.question_id, [topic]);
      }
    }

    return result;
  }

  async updateStatus(id: string, status: QuestionStatus): Promise<boolean> {
    const result = await sql
      .prepare<UpdateQueryResponse>(
        `
      UPDATE questions
      SET
        status = ?,
        updated_at = ?
      WHERE id = ?
    `,
      )
      .bindParams(status, new Date().toISOString(), id)
      .execute();
    return !!result.rows.affectedRows;
  }

  async listByCursor(input: ListQuestionsInput): Promise<PaginatedQuestions> {
    const {
      spaceKey,
      cursor: { lastId, direction = "next" } = {},
      status,
      topicId,
    } = input;

    // 1. Build Dynamic WHERE Conditions
    const conditions: string[] = ["q.space_key = ?"];
    const params: any[] = [spaceKey];

    // Filter by Status
    if (status) {
      conditions.push("q.status = ?");
      params.push(status);
    }

    // Filter by Topic ID (Using EXISTS for optimal performance)
    if (topicId) {
      conditions.push(`
        EXISTS (
          SELECT 1 FROM question_topics qt 
          WHERE qt.question_id = q.id AND qt.topic_id = ?
        )
      `);
      params.push(topicId);
    }

    // Cursor Condition
    if (lastId) {
      const operator = direction === "next" ? "<" : ">";
      conditions.push(`q.id ${operator} ?`);
      params.push(lastId);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const orderDirection = direction === "next" ? "DESC" : "ASC";

    // 2. Fetch Questions Base Page
    const questionsQueryString = `
      SELECT 
        q.*,
        e.display_name
      FROM questions q
      LEFT JOIN experts e ON e.id = q.assigned_expert_id
      ${whereClause}
      ORDER BY q.id ${orderDirection}
      LIMIT ${LIMIT}
    `;

    const questionsResult = await db
      .prepare(questionsQueryString)
      .bindParams(...params)
      .execute();

    let questions = questionsResult.rows as any[];

    if (questions.length === 0) return { items: [], hasMore: false };

    // Reverse items if moving backwards ('prev') to keep newest-first UI sequence
    if (direction === "prev") {
      questions = questions.reverse();
    }

    // 3. Batch Fetch Topics for the Filtered Questions Page
    const questionIds = questions.map((q) => q.id);
    const placeholders = questionIds.map(() => "?").join(",");

    const topicsResult = await db
      .prepare(
        `
        SELECT qt.question_id, t.id, t.name
        FROM question_topics qt
        JOIN topics t ON qt.topic_id = t.id
        WHERE qt.question_id IN (${placeholders})
      `,
      )
      .bindParams(...questionIds)
      .execute();

    const topicRows = topicsResult.rows as Array<{
      questionId: string;
      id: string;
      name: string;
    }>;

    // Map topics to their question IDs
    const topicMap = new Map<string, Array<{ id: string; name: string }>>();
    for (const t of topicRows) {
      if (!topicMap.has(t.questionId)) {
        topicMap.set(t.questionId, []);
      }
      topicMap.get(t.questionId)!.push({ id: t.id, name: t.name });
    }

    // Combine questions with their associated topics
    return {
      items: questions.map((q) => ({
        ...q,
        topics: topicMap.get(q.id) || [],
      })),
      hasMore: !!questions.length,
    };
  }

  async findForFaqPublishing(
    questionId: string,
  ): Promise<QuestionForFaqPublishing | null> {
    const result = await sql
      .prepare(
        `
        SELECT
          q.id AS question_id,
          q.title,
          q.body,
          q.author_account_id,
          q.status,
          a.id AS answer_id,
          a.body AS answer_body
        FROM questions q
        LEFT JOIN answers a
          ON a.question_id = q.id
          AND a.is_accepted = ?
        WHERE q.id = ?
        LIMIT 1
      `,
      )
      .bindParams(1, questionId)
      .execute();

    const row = result.rows[0] as any;

    if (!row) return null;

    return {
      id: row.question_id,
      title: row.title,
      body: row.body,
      authorAccountId: row.author_account_id,
      status: row.status,
      acceptedAnswer:
        row.answer_id !== null
          ? {
              id: row.answer_id,
              body: row.answer_body ?? "",
            }
          : null,
    };
  }

  async markFaqPublished(questionId: string): Promise<void> {
    await sql
      .prepare(
        `
        UPDATE questions
        SET status = ?, updated_at = ?
        WHERE id = ?
      `,
      )
      .bindParams(
        QUESTION_STATUS.faq_published,
        new Date().toISOString(),
        questionId,
      )
      .execute();
  }
}
