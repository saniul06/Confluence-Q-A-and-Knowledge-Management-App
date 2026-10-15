import { useState } from "react";
import type { useQuestions } from "../hooks/useQuestions";
import type { QuestionStatus } from "../../../../../../src/shared/types/question.type";
import { QUESTION_STATUS } from "../../../../../../src/shared/constants";

export function AnswerForm({
  questionId,
  request,
  questionStatus,
  answeredByUser,
}: {
  questionId: string;
  questionStatus: QuestionStatus;
  request: ReturnType<typeof useQuestions>;
  answeredByUser: boolean;
}) {
  const [body, setBody] = useState("");

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const answer = await request.createAnswer.request({
      questionId,
      body,
    });

    if (!answer) {
      return;
    }

    setBody("");

    request.get.updateState((current) => ({
      ...current,
      answers: [...current.answers, answer],
    }));
  };

  if (questionStatus === QUESTION_STATUS.faq_published) {
    return <h3>Faq Published</h3>;
  }

  if (!answeredByUser) {
    return (
      <section className="answer-form">
        <h2>Your Answer</h2>

        <form onSubmit={handleSubmit}>
          <textarea
            className="form-textarea"
            rows={5}
            value={body}
            placeholder="Write your answer..."
            onChange={(event) => setBody(event.target.value)}
          />

          {request.createAnswer.error?.message && (
            <div className="form-error">
              {request.createAnswer.error?.message}
            </div>
          )}

          <button
            type="submit"
            className="button button--primary"
            disabled={
              request.createAnswer.status === "loading" || body.trim() === ""
            }
          >
            {request.createAnswer.status === "loading"
              ? "Posting..."
              : "Post Answer"}
          </button>
        </form>
      </section>
    );
  }
}
