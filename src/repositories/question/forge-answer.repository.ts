import sql, { UpdateQueryResponse } from "@forge/sql";
import { CreateAnswerInput } from "../../shared/schemas/answer.schema";
import { Answer } from "../../shared/types/answer.type";
import { AnswerRepository } from "./answer.repository";
import { createPayload } from "../../utils/helpers";
import { db } from "../db";

export class ForgeAnswerRepository implements AnswerRepository {
  async findById(id: string): Promise<Answer | null> {
    const result = await db
      .prepare(`SELECT * FROM answers WHERE id=?`)
      .bindParams(id)
      .execute<Answer>();
    return result.rows[0];
  }

  async findByQuestionId(questionId: string): Promise<Answer[]> {
    const result = await db
      .prepare(`SELECT * FROM answers WHERE question_id = ?`)
      .bindParams(questionId)
      .execute<Answer>();
    return result.rows;
  }

  async create(input: Answer): Promise<Answer> {
    const { fields, placeholders, values } = createPayload(input);
    await sql
      .prepare(
        `
      INSERT INTO answers (
        ${fields}
      )
      VALUES (${placeholders})
    `,
      )
      .bindParams(...values)
      .execute();

    return input;
  }

  async unacceptAll(questionId: string): Promise<boolean> {
    const result = await sql
      .prepare<UpdateQueryResponse>(
        `
      UPDATE answers
      SET is_accepted = ${0}
      WHERE question_id = ?
    `,
      )
      .bindParams(questionId)
      .execute();
    return !!result.rows.affectedRows;
  }

  async markAccepted(answerId: string): Promise<boolean> {
    const result = await sql
      .prepare<UpdateQueryResponse>(
        `
      UPDATE answers
      SET is_accepted = ?
      WHERE id = ?
    `,
      )
      .bindParams(1, answerId)
      .execute();
    return !!result.rows.affectedRows;
  }
}
