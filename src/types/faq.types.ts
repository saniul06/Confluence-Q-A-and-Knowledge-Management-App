import { QuestionStatus } from "../shared/types/question.type";

export type FaqPageRecord = {
  id: string;
  questionId: string;
  answerId: string;
  confluencePageId: string;
  confluencePageUrl: string | null;
  spaceKey: string;
  title: string;
  createdAt: string;
};

export type QuestionForFaqPublishing = {
  id: string;
  title: string;
  body: string | null;
  authorAccountId: string;
  status: QuestionStatus;
  acceptedAnswer: {
    id: string;
    body: string;
  } | null;
};