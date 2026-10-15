import type { QuestionStatus } from "./question.type";

export type DashboardStats = {
  totalQuestions: number;
  openQuestions: number;
  answeredQuestions: number;
};

export type RecentQuestion = {
  id: string;
  title: string;
  spaceKey: string;
  status: QuestionStatus;
  authorDisplayName: string;
  createdAt: string;
};

export type TopExpert = {
  accountId: string;
  displayName: string;
  answerCount: number;
};

export type DashboardData = {
  stats: DashboardStats;
  recentQuestions: RecentQuestion[];
  topExperts: TopExpert[];
};
