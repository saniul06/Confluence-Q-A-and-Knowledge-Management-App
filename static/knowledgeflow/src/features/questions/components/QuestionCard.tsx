import type { QuestionListItem } from "../../../../../../src/shared/types/question.type";
import { QuestionStatusBadge } from "./QuestionStatusBadge";

type Props = {
  question: QuestionListItem;
  onClick: () => void;
};

export function QuestionCard({ question, onClick }: Props) {
  return (
    <button type="button" className="question-card" onClick={onClick}>
      <div className="question-card__main">
        <h3>{question.title}</h3>

        <div className="question-card__meta">
          <span>Asked by {question.authorDisplayName}</span>

          <span>{question.createdAt}</span>
        </div>

        <div className="question-card__topics">
          {question.topics.map((topic) => (
            <span key={topic.id} className="topic-tag">
              {topic.name}
            </span>
          ))}
        </div>
      </div>

      <QuestionStatusBadge status={question.status} />
    </button>
  );
}
