import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthError, registerUser } from '../redux/authSlice';
import FormField from '../components/forms/FormField';
import Icon from '../components/common/Icon';
import { fieldErrors } from '../utils/errors';

const EMPTY = { name: '', email: '', studentId: '', department: '', year: '1', phone: '', password: '', confirmPassword: '' };
// Front-end validation for fast feedback. The backend validates again (never trust the client).
function validate(f) {
  const e = {};
  if (f.name.trim().length < 2) e.name = 'Enter your full name';
  if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Enter a valid email';
  if (!f.studentId.trim()) e.studentId = 'Student ID is required';
  if (!f.department.trim()) e.department = 'Department is required';
  if (!/^[0-9+\-\s]{7,15}$/.test(f.phone)) e.phone = 'Enter a valid phone number';
  if (f.password.length < 8) e.password = 'At least 8 characters';
  if (f.confirmPassword !== f.password) e.confirmPassword = 'Passwords do not match';
  return e;
}
export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, submitting, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState(EMPTY);
  const [clientErrors, setClientErrors] = useState({});
  useEffect(() => () => { dispatch(clearAuthError()); }, [dispatch]);
  if (user) return <Navigate to="/home" replace />;

  const errs = { ...fieldErrors(error), ...clientErrors };
  const set = (name) => (e) => setForm({ ...form, [name]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    const v = validate(form);
    setClientErrors(v);
    if (Object.keys(v).length) return;
    const res = await dispatch(registerUser({ ...form, year: Number(form.year) }));
    if (!res.error) navigate('/home', { replace: true });
  };
  const input = (id, label, type = 'text', extra = {}) => (
    <FormField id={id} label={label} error={errs[id]} required>
      <input id={id} type={type} value={form[id]} onChange={set(id)} aria-invalid={!!errs[id]} {...extra} />
    </FormField>
  );
  return (
    <div className="auth-page">
      <form className="auth-card auth-wide" onSubmit={submit} noValidate>
        <Link to="/" className="auth-logo"><Icon name="bag" size={32} /></Link>
        <h1>Create your account</h1>
        {error && !error.errors?.length && <p className="form-error" role="alert">{error.message}</p>}
        <div className="form-grid">
          {input('name', 'Full name', 'text', { autoComplete: 'name' })}
          {input('email', 'Email', 'email', { autoComplete: 'email' })}
          {input('studentId', 'Student ID / Roll number')}
          {input('department', 'Department')}
          <FormField id="year" label="Year" error={errs.year} required>
            <select id="year" value={form.year} onChange={set('year')}>{[1, 2, 3, 4, 5, 6].map((y) => <option key={y} value={y}>Year {y}</option>)}</select>
          </FormField>
          {input('phone', 'Phone number', 'tel', { autoComplete: 'tel' })}
          {input('password', 'Password', 'password', { autoComplete: 'new-password' })}
          {input('confirmPassword', 'Confirm password', 'password', { autoComplete: 'new-password' })}
        </div>
        <button className="btn btn-primary btn-block" disabled={submitting}>{submitting ? 'Creating account...' : 'Register'}</button>
        <p className="auth-switch">Already registered? <Link to="/login">Log in</Link></p>
      </form>
    </div>
  );
}
