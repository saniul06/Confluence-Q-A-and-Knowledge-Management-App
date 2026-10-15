type ErrorMessageProps = {
  message: string;
  onRetry?: () => void;
};

export function ErrorMessage({
  message,
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className="error-message" role="alert">
      <span>{message}</span>

      {onRetry && (
        <button
          type="button"
          className="button button-small"
          onClick={onRetry}
        >
          Retry
        </button>
      )}
    </div>
  );
}