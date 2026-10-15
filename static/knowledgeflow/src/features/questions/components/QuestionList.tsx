import type {
  QuestionCursor,
  QuestionListItem,
} from "../../../../../../src/shared/types/question.type";
import type { useQuestions } from "../hooks/useQuestions";
import { QuestionCard } from "./QuestionCard";

type Props = {
  request: ReturnType<typeof useQuestions>["fetch"];

  onSelect: (questionId: string) => void;

  handleLoadMore: (args?: QuestionCursor) => void;

  questions: QuestionListItem[];
};

export function QuestionList({
  request,
  onSelect,
  handleLoadMore,
  questions,
}: Props) {
  if (request.status === "loading" && questions.length === 0) {
    return <div className="question-list__state">Loading questions...</div>;
  }

  if (request.status === "error") {
    return (
      <div className="question-board__error">{request.error?.message}</div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="question-list__empty">
        <h3>No questions yet</h3>

        <p>Be the first to ask a question in this space.</p>
      </div>
    );
  }

  function getCursor(): QuestionCursor | undefined {
    if (questions.length) {
      return { lastId: questions[questions.length - 1].id, direction: "next" };
    }
  }

  return (
    <div className="question-list">
      {questions.map((question: QuestionListItem) => (
        <QuestionCard
          key={question.id}
          question={question}
          onClick={() => onSelect(question.id)}
        />
      ))}
      {request.data?.hasMore && (
        <button
          disabled={request.status === "loading"}
          onClick={() => handleLoadMore(getCursor())}
        >
          Load more
        </button>
      )}
      {!request.data?.hasMore && questions.length && (
        <strong>No more data</strong>
      )}
    </div>
  );
}
