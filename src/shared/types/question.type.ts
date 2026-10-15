import type { Answer } from "./answer.type";

export type QuestionStatus = "open" | "answered" | "faq_published";

export type Question = {
  id: string;
  spaceKey: string;
  title: string;
  body: string | null;

  authorAccountId: string;
  authorDisplayName: string;

  status: QuestionStatus;

  assignedExpertId: string | null;

  createdAt: string;
  updatedAt: string;
};

export type QuestionTopic = {
  id: string;
  name: string;
};

export type QuestionListItem = Question & {
  topics: QuestionTopic[];
};

export type QuestionExpert = {
  id: string;
  accountId: string;
  displayName: string;
};

export type QuestionDetails = Question & {
  topics: QuestionTopic[];
  answers: Answer[];
  assignedExpert: QuestionExpert | null;
};

export type QuestionCursor = { lastId: string, direction: 'next' | 'prev' };

export type PaginatedQuestions = {
  items: QuestionListItem[];
  hasMore: boolean;
};

export type QuestionTopicRow = {
  question_id: string;
  id: string;
  name: string;
};