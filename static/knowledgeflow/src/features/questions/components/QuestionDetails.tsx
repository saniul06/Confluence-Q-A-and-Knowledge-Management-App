import { useEffect } from "react";
import { useQuestions } from "../hooks/useQuestions";
import { AnswerList } from "./AnswerList";
import { QuestionStatusBadge } from "./QuestionStatusBadge";
import type {
  QuestionDetails,
  QuestionTopic,
} from "../../../../../../src/shared/types/question.type";
import { AnswerForm } from "./AnswerForm";
import { PublishFaqButton } from "./PublishFaqButton";
import { useCurrentUser } from "../../confluence/context/CurrentUserContext";
import { QUESTION_STATUS } from "../../../../../../src/shared/constants";

type Props = {
  questionId: string;
  onAcceptAnswer: (q: QuestionDetails) => void;
  onBack: () => void;
  onFaqCreated: (questionId: string) => void;
};

export function QuestionDetails({
  questionId,
  onAcceptAnswer,
  onBack,
  onFaqCreated,
}: Props) {
  const request = useQuestions();
  const { currentUser } = useCurrentUser();

  useEffect(() => {
    void request.get.request({
      id: questionId,
    });
  }, [questionId]);

  if (request.get.status === "loading") {
    return <div className="question-details__state">Loading question...</div>;
  }

  if (request.get.status === "error") {
    return (
      <div className="question-board__error">{request.get.error?.message}</div>
    );
  }

  const question = request.get.data;

  if (!question) {
    return null;
  }

  const answeredByUser = question.answers.some(
    (answer) => answer.authorAccountId === currentUser?.accountId,
  );

  function updateQuestionDetails() {
    request.get.updateState((state) => ({ ...state, status: QUESTION_STATUS.faq_published }));
  }

  return (
    <section className="question-details">
      <button
        type="button"
        className="button button--secondary"
        onClick={onBack}
      >
        ← Back to questions
      </button>

      <div className="question-details__header">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <QuestionStatusBadge status={question.status} />
          {question.authorAccountId === currentUser?.accountId ||
          currentUser?.isAdmin ? (
            <PublishFaqButton
              questionId={question.id}
              status={question.status}
              hasAcceptedAnswer={question.answers.some((i) => i.isAccepted)}
              canPublishFaq={question.status === QUESTION_STATUS.answered}
              onFaqCreated={onFaqCreated}
              updateQuestionDetails={updateQuestionDetails}
            />
          ) : (
            <></>
          )}
        </div>

        <h1>{question.title}</h1>

        <div className="question-card__meta">
          <span>Asked by {question.authorDisplayName}</span>

          <span>{question.createdAt}</span>
        </div>
      </div>

      <div className="question-details__topics">
        {question.topics.map((topic: QuestionTopic) => (
          <span key={topic.id} className="topic-tag">
            {topic.name}
          </span>
        ))}
      </div>

      {question.body && (
        <div className="question-details__body">{question.body}</div>
      )}

      <div className="question-details__assignment">
        <strong>Responsible expert:</strong>{" "}
        {question.assignedExpert?.displayName
          ? question.assignedExpert.displayName
          : "Unassigned"}
      </div>

      <AnswerList
        question={question}
        request={request}
        onAcceptAnswer={onAcceptAnswer}
      />

      <AnswerForm
      answeredByUser={answeredByUser}
        questionId={question.id}
        questionStatus={question.status}
        request={request}
      />
    </section>
  );
}
