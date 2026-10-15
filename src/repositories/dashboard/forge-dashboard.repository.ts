import { sql } from "@forge/sql";

import type {
  DashboardData,
  DashboardStats,
  RecentQuestion,
  TopExpert,
} from "../../shared/types/dashboard.type";
import { DashboardRepository } from "./dashboard.repository";
import { QuestionStatus } from "../../shared/types/question.type";


type StatsRow = {
  total_questions: number | string;
  open_questions: number | string;
  answered_questions: number | string;
};

type RecentQuestionRow = {
  id: string;
  title: string;
  space_key: string;
  status: QuestionStatus;
  author_display_name: string;
  created_at: string;
};

type TopExpertRow = {
  account_id: string;
  display_name: string;
  answer_count: number | string;
};

export class ForgeDashboardRepository implements DashboardRepository {
  async getDashboardData(): Promise<DashboardData> {
    const [stats, recentQuestions, topExperts] = await Promise.all([
      this.getStats(),
      this.getRecentQuestions(),
      this.getTopExperts(),
    ]);

    return {
      stats,
      recentQuestions,
      topExperts,
    };
  }

  private async getStats(): Promise<DashboardStats> {
    const result = await sql
      .prepare(`
        SELECT
          COUNT(*) AS total_questions,
          COALESCE(
            SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END),
            0
          ) AS open_questions,
          COALESCE(
            SUM(CASE WHEN status = 'answered' THEN 1 ELSE 0 END),
            0
          ) AS answered_questions
        FROM questions
      `)
      .execute();

    const row = result.rows[0] as StatsRow;

    return {
      totalQuestions: Number(row.total_questions),
      openQuestions: Number(row.open_questions),
      answeredQuestions: Number(row.answered_questions),
    };
  }

  private async getRecentQuestions(): Promise<RecentQuestion[]> {
    const result = await sql
      .prepare(`
        SELECT
          id,
          title,
          space_key,
          status,
          author_display_name,
          created_at
        FROM questions
        ORDER BY id DESC
        LIMIT 10
      `)
      .execute();

    const rows = result.rows as RecentQuestionRow[];

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      spaceKey: row.space_key,
      status: row.status,
      authorDisplayName: row.author_display_name,
      createdAt: row.created_at,
    }));
  }

  private async getTopExperts(): Promise<TopExpert[]> {
    const result = await sql
      .prepare(`
        SELECT
          expert_accounts.account_id,
          expert_accounts.display_name,
          COUNT(a.id) AS answer_count
        FROM (
          SELECT
            account_id,
            MAX(display_name) AS display_name
          FROM experts
          GROUP BY account_id
        ) AS expert_accounts
        INNER JOIN answers a
          ON a.author_account_id = expert_accounts.account_id
        GROUP BY
          expert_accounts.account_id,
          expert_accounts.display_name
        ORDER BY
          answer_count DESC,
          expert_accounts.account_id ASC
        LIMIT 5
      `)
      .execute();

    const rows = result.rows as TopExpertRow[];

    return rows.map((row) => ({
      accountId: row.account_id,
      displayName: row.display_name,
      answerCount: Number(row.answer_count),
    }));
  }
}