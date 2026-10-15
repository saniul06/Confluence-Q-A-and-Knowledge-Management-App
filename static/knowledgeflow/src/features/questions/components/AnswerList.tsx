import type { QuestionDetails } from "../../../../../../src/shared/types/question.type";
import type { useQuestions } from "../hooks/useQuestions";
import { AnswerCard } from "./AnswerCard";

type AnswerListProps = {
  question: QuestionDetails;
  onAcceptAnswer: (q: QuestionDetails) => void;
  request: ReturnType<typeof useQuestions>;
};

export function AnswerList({
  question,
  onAcceptAnswer,
  request,
}: AnswerListProps) {
  if (question.answers.length === 0) {
    return (
      <section className="answers">
        <h2>Answers</h2>

        <div className="answers__empty">No answers yet.</div>
      </section>
    );
  }

  return (
    <section className="answers">
      <h2>Answers ({question.answers.length})</h2>

      <div className="answer-list">
        {question.answers.map((answer) => (
          <AnswerCard
            key={answer.id}
            answer={answer}
            question={question}
            request={request}
            onAcceptAnswer={onAcceptAnswer}
          />
        ))}
      </div>
    </section>
  );
}
