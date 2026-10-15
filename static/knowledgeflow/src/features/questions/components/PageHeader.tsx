type PageHeaderProps = {
  onAskQuestion: () => void;
};

export function PageHeader({ onAskQuestion }: PageHeaderProps) {
  return (
    <div className="question-board__header">
      <div>
        <h1>Space Q&A</h1>
        <p>Ask questions and get answers from topic experts.</p>
      </div>

      <button type="button" onClick={onAskQuestion}>
        Ask Question
      </button>
    </div>
  );
}
