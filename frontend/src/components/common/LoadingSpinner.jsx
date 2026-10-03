export default function LoadingSpinner({ label = 'Loading...' }) {
  return <div className="state" role="status"><span className="spinner" /><p>{label}</p></div>;
}
