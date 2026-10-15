import { useState } from "react";
import type { Answer } from "../../../../../../src/shared/types/answer.type";
import type { QuestionDetails } from "../../../../../../src/shared/types/question.type";
import { formatDate } from "../../../utils/helpers";
import type { useQuestions } from "../hooks/useQuestions";
import { useCurrentUser } from "../../confluence/context/CurrentUserContext";
import { QUESTION_STATUS } from "../../../../../../src/shared/constants";

export function AnswerCard({
  answer,
  question,
  request,
  onAcceptAnswer,
}: {
  answer: Answer;
  question: QuestionDetails;
  request: ReturnType<typeof useQuestions>;
  onAcceptAnswer: (q: QuestionDetails) => void;
}) {
  const { currentUser } = useCurrentUser();

  const [buttonState, setButtonState] = useState(false);

  const handleAccept = async () => {
    try {
      setButtonState(true);
      const result = await request.acceptAnswer.request({
        questionId: question.id,
        answerId: answer.id,
      });

      if (!result) {
        return;
      }
    } catch (err) {
    } finally {
      setButtonState(false);
    }

    request.get.updateState((current) => ({
      ...current,
      status: QUESTION_STATUS.answered,
      answers: current.answers.map((item) => ({
        ...item,
        isAccepted: item.id === answer.id ? 1 : 0,
      })),
    }));

    onAcceptAnswer(question);
  };

  return (
    <article
      className={`answer-card ${
        answer.isAccepted ? "answer-card--accepted" : ""
      }`}
    >
      <div className="answer-card__header">
        <strong>{answer.authorDisplayName}</strong>

        <span>{formatDate(answer.createdAt)}</span>
      </div>

      <div className="answer-card__body">{answer.body}</div>

      {!!answer.isAccepted && (
        <span className="accepted-badge">✓ Accepted answer</span>
      )}

      {!answer.isAccepted &&
        question.authorAccountId === currentUser?.accountId && (
          <button
            type="button"
            className="button button--secondary"
            onClick={handleAccept}
            disabled={request.acceptAnswer.status === "loading"}
          >
            {request.acceptAnswer.status === "loading" && buttonState
              ? "Accepting..."
              : "Accept Answer"}
          </button>
        )}
    </article>
  );
}
