export type Answer = {
  id: string;

  questionId: string;

  body: string;

  authorAccountId: string;

  authorDisplayName: string;

  isAccepted: 0 | 1;

  createdAt: string;
};
