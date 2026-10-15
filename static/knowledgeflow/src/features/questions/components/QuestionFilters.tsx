import type {
  QuestionStatus,
  QuestionTopic,
} from "../../../../../../src/shared/types/question.type";

type Props = {
  status: "all" | QuestionStatus;

  topicId: string | null;

  topics: QuestionTopic[];

  onStatusChange: (status: "all" | QuestionStatus) => void;

  onTopicChange: (topicId: string | null) => void;
};

export function QuestionFilters({
  status,
  topicId,
  topics,
  onStatusChange,
  onTopicChange,
}: Props) {
  return (
    <div className="question-filters">
      <label className="form-label">
        Status
        <select
          className="form-select"
          value={status}
          onChange={(event) =>
            onStatusChange(event.target.value as "all" | QuestionStatus)
          }
        >
          <option value="all">All</option>

          <option value="open">Open</option>

          <option value="answered">Answered</option>

          <option value="faq_published">FAQ Published</option>
        </select>
      </label>

      <label className="form-label">
        Topic
        <select
          className="form-select"
          value={topicId ?? ""}
          onChange={(event) => onTopicChange(event.target.value || null)}
        >
          <option value="">All topics</option>

          {topics.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
