export default function ErrorMessage({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="state state-error" role="alert">
      <p>{message}</p>
      {onRetry && <button type="button" className="btn btn-outline" onClick={onRetry}>Try again</button>}
    </div>
  );
}
