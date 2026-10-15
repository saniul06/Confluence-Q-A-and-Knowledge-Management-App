import { FaqPageRecord } from "../../types/faq.types";

export interface FaqPageRepository {
  findByQuestionAndSpace(
    questionId: string,
    spaceKey: string,
  ): Promise<FaqPageRecord | null>;

  create(input: {
    id: string;
    questionId: string;
    answerId: string;
    confluencePageId: string;
    confluencePageUrl: string | null;
    spaceKey: string;
    title: string;
  }): Promise<number>;
}
