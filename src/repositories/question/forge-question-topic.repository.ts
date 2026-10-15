import sql from "@forge/sql";
import {
  QuestionTopic,
  QuestionTopicRow,
} from "../../shared/types/question.type";
import { QuestionTopicRepository } from "./question-topic.repository";
import { db } from "../db";

export class ForgeQuestionTopicRepository implements QuestionTopicRepository {
  async createMany(questionId: string, topicIds: string[]): Promise<void> {
    const uniqueTopicIds = [...new Set(topicIds)];

    const values = uniqueTopicIds.map(() => "(?, ?)").join(", ");

    const params = uniqueTopicIds.flatMap((topicId) => [questionId, topicId]);

    await sql
      .prepare(
        `
          INSERT INTO question_topics (
            question_id,
            topic_id
          )
          VALUES ${values}
        `,
      )
      .bindParams(...params)
      .execute();
  }

  async findTopics(questionId: string): Promise<QuestionTopic[]> {
    const result = await db
      .prepare(
        `
          SELECT
            t.id,
            t.name
          FROM question_topics qt
          INNER JOIN topics t
            ON t.id = qt.topic_id
          WHERE qt.question_id = ?
          ORDER BY t.name ASC
        `,
      )
      .bindParams(questionId)
      .execute<QuestionTopicRow>();

    const rows = result.rows;

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
    }));
  }

  async findAll() {
    const result = await sql.prepare("select * from question_topics").execute();
  }

  async isTopicUsed(topicId: string): Promise<boolean> {
    const result = await sql
      .prepare(
        "SELECT topic_id from question_topics WHERE topic_id = ? LIMIT 1",
      )
      .bindParams(topicId)
      .execute();

    return !!result.rows[0]
  }
}
