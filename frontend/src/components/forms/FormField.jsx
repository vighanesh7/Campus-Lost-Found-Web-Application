// Label + control + error message wired together for accessibility.
export default function FormField({ id, label, error, required, children }) {
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id} className="field-label">{label}{required && <span aria-hidden="true"> *</span>}</label>
      {children}
      {error && <p className="field-error" id={`${id}-error`} role="alert">{error}</p>}
    </div>
  );
}
