import { QUESTION_STATUS } from "../../../../../../src/shared/constants";
import type { QuestionStatus } from "../../../../../../src/shared/types/question.type";
import { useFaq } from "../../faq/hooks/useFaq";

type PublishFaqButtonProps = {
  questionId: string;
  status: QuestionStatus;
  hasAcceptedAnswer: boolean;
  canPublishFaq: boolean;
  onFaqCreated: (questionId: string) => void
  updateQuestionDetails: () => void
};

export function PublishFaqButton({
  questionId,
  status,
  hasAcceptedAnswer,
  canPublishFaq,
  onFaqCreated,
  updateQuestionDetails
}: PublishFaqButtonProps) {
  const useFaqRequest = useFaq();

  const publishedFaq = useFaqRequest.publishFaq.data || null;

  async function publish() {
    const result = await useFaqRequest.publishFaq.request({ questionId });
    if(result){
        onFaqCreated(questionId);
        updateQuestionDetails()
    }
  }

  if (!canPublishFaq || !hasAcceptedAnswer) return null;

  if (status === QUESTION_STATUS.faq_published && !publishedFaq) {
    return <p>This question has already been published as an FAQ.</p>;
  }

  return (
    <section>
      {publishedFaq ? (
        publishedFaq.confluencePageUrl ? (
          <a
            href={publishedFaq.confluencePageUrl}
            target="_blank"
            rel="noreferrer"
          >
            View published FAQ
          </a>
        ) : (
          <p>FAQ published. Page ID: {publishedFaq.confluencePageId}</p>
        )
      ) : (
        <button
          type="button"
          onClick={() => void publish()}
          disabled={
            useFaqRequest.publishFaq.status === "loading" ||
            status === QUESTION_STATUS.faq_published
          }
        >
          {useFaqRequest.publishFaq.status === "loading"
            ? "Publishing..."
            : "Publish as FAQ"}
        </button>
      )}

      {useFaqRequest.publishFaq?.error?.message && (
        <p role="alert">{useFaqRequest.publishFaq?.error.message}</p>
      )}
    </section>
  );
}
