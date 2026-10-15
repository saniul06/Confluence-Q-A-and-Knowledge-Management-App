import { useState } from "react";
import type {
  QuestionListItem,
  QuestionTopic,
} from "../../../../../../src/shared/types/question.type";
import type { useQuestions } from "../hooks/useQuestions";
import type { Topic } from "../../../../../../src/shared/types";

type Props = {
  spaceKey: string;
  topics: Topic[];

  createQuestion: ReturnType<typeof useQuestions>["create"];

  onClose: () => void;

  onCreated: (question: QuestionListItem) => void;
};

export function QuestionForm({
  spaceKey,
  topics,
  createQuestion,
  onClose,
  onCreated,
}: Props) {
  const [title, setTitle] = useState("");

  const [body, setBody] = useState("");

  const [selectedTopics, setSelectedTopics] = useState<QuestionTopic[]>([]);

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const question = await createQuestion.request({
      spaceKey,
      title,
      body: body.trim() || undefined,
      topicIds: selectedTopics.map((i) => i.id),
    });

    if (!question) {
      return;
    }

    const questionListItem = {
      ...question,
      topics: selectedTopics,
    };

    onCreated(questionListItem);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal__header">
          <h2>Ask a Question</h2>

          <button type="button" className="modal__close" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="question-form" onSubmit={handleSubmit}>
          <label className="form-label">
            Question title
            <input
              className="form-input"
              value={title}
              maxLength={200}
              required
              onChange={(event) => setTitle(event.target.value)}
            />
            <span className="form-help">{title.length}/200</span>
          </label>

          <label className="form-label">
            Question body
            <textarea
              className="form-textarea"
              rows={6}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Provide additional context..."
            />
          </label>

          <label className="form-label">
            Topic tags
            <div className="topic-selector">
              <label className="form-label">Select Topics (Required)</label>

              {/* Scrollable Container */}
              <div className="topic-grid-container">
                {topics.map((topic) => {
                  const isSelected = selectedTopics.some(
                    (t) => t.id === topic.id,
                  );

                  return (
                    <label
                      key={topic.id}
                      className={`topic-chip ${isSelected ? "topic-chip--selected" : ""}`}
                    >
                      <input
                        type="checkbox"
                        className="topic-chip__checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTopics([
                              ...selectedTopics,
                              { id: topic.id, name: topic.name },
                            ]);
                          } else {
                            setSelectedTopics(
                              selectedTopics.filter((t) => t.id !== topic.id),
                            );
                          }
                        }}
                      />
                      <span className="topic-chip__label">{topic.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>
            {/* <select
              multiple
              className="form-select form-select--multiple"
              value={selectedTopics}
              required
              onChange={(event) => {
                const values = Array.from(event.target.selectedOptions).map(
                  (option) => option.value,
                );

                setSelectedTopics(values);
              }}
            >
              {topics.map((topic) => (
                <option
                  key={topic.id}
                  value={JSON.stringify({ id: topic.id, name: topic.name })}
                >
                  {topic.name}
                </option>
              ))}
            </select> */}
            {/* <select
              multiple
              className="form-select form-select--multiple"
              value={selectedTopics}
              required
              onChange={(event) => {
                const values = Array.from(event.target.selectedOptions).map(
                  (option) => option.value,
                );

                setSelectedTopics(values);
              }}
            >
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select> */}
            {/* <span className="form-help">
              Hold Ctrl/Cmd to select multiple topics.
            </span> */}
          </label>

          {/* <div className="question-form__space">
            <strong>Space:</strong> {spaceKey}
          </div> */}

          {createQuestion.error?.message && (
            <div
              className="form-error"
              style={{
                whiteSpace: "pre-line",
              }}
            >
              {createQuestion.error?.message}
            </div>
          )}

          <div className="modal__actions">
            <button
              type="button"
              className="button button--secondary"
              onClick={onClose}
              disabled={createQuestion.status === "loading"}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="button button--primary"
              disabled={
                createQuestion.status === "loading" ||
                title.trim() === "" ||
                selectedTopics.length === 0
              }
            >
              {createQuestion.status === "loading"
                ? "Submitting..."
                : "Submit Question"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
