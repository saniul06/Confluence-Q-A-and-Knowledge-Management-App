import type { QuestionStatus } from "../../../../../../src/shared/types/question.type";

export function QuestionStatusBadge({
  status,
}: {
  status: QuestionStatus;
}) {
  const labels: Record<
    QuestionStatus,
    string
  > = {
    open: "Open",
    answered: "Answered",
    faq_published: "FAQ Published",
  };

  return (
    <span
      className={`status-badge status-badge--${status}`}
    >
      {labels[status]}
    </span>
  );
}