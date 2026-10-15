import { useState } from "react";
import type {
  CreateTopicInput,
  UpdateTopicInput,
} from "../../../../../../src/shared/schemas/topic.schema";
import type { Topic } from "../../../../../../src/shared/types";

type TopicFormProps =
  | {
      mode: "create";
      topic?: never;
      submitting: boolean;
      error?: string;
      onSubmit: (input: CreateTopicInput) => Promise<void>;
      onCancel: () => void;
    }
  | {
      mode: "edit";
      topic: Topic;
      submitting: boolean;
      error?: string;
      onSubmit: (input: UpdateTopicInput) => Promise<void>;
      onCancel: () => void;
    };

export function TopicForm(props: TopicFormProps) {
  const { mode, submitting, error, onCancel } = props;
  
  const [formData, setFormData] = useState({
    name: mode === "edit" ? props.topic.name : "",
    description: mode === "edit" ? (props.topic.description ?? "") : "",
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = formData.name.trim();
    const trimmedDescription = formData.description.trim();

    if (!trimmedName) {
      setValidationError("Topic name is required.");
      return;
    }

    if (trimmedName.length > 200) {
      setValidationError("Topic name must be 200 characters or less.");
      return;
    }

    if (trimmedDescription.length > 1000) {
      setValidationError("Description must be 1000 characters or less.");
      return;
    }

    setValidationError(null);

    if (mode === "create") {
      await props.onSubmit({
        name: trimmedName,
        description: trimmedDescription || undefined,
      });

      return;
    }

    await props.onSubmit({
      id: props.topic.id,
      name: trimmedName,
      description: trimmedDescription || undefined,
    });
  }

  return (
    <div className="modal-backdrop">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="topic-form-title"
      >
        <div className="modal-header">
          <h2 id="topic-form-title">
            {mode === "create" ? "Create topic" : "Edit topic"}
          </h2>

          <button
            type="button"
            className="modal-close"
            onClick={onCancel}
            disabled={submitting}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="topic-name">Name</label>

            <input
              id="topic-name"
              value={formData.name}
              name="name"
              onChange={(event) =>
                setFormData((formData) => ({
                  ...formData,
                  [event.target.name]: event.target.value,
                }))
              }
              maxLength={200}
              disabled={submitting}
              placeholder="e.g. React"
              autoFocus
            />

            <span className="field-hint">{formData.name.length}/200</span>
          </div>

          <div className="form-field">
            <label htmlFor="topic-description">Description</label>

            <textarea
              id="topic-description"
              value={formData.description}
              name="description"
              onChange={(event) =>
                setFormData((formData) => ({
                  ...formData,
                  [event.target.name]: event.target.value,
                }))
              }
              maxLength={1000}
              rows={4}
              disabled={submitting}
              placeholder="What type of questions belong to this topic?"
            />

            <span className="field-hint">
              {formData.description.length}/1000
            </span>
          </div>

          {(validationError || error) && (
            <div className="form-error" role="alert">
              {validationError || error}
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="button"
              onClick={onCancel}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="button button-primary"
              disabled={submitting}
            >
              {submitting
                ? "Saving..."
                : mode === "create"
                  ? "Create topic"
                  : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
