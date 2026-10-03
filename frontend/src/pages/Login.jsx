import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthError, loginUser } from '../redux/authSlice';
import FormField from '../components/forms/FormField';
import Icon from '../components/common/Icon';
import { fieldErrors } from '../utils/errors';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, submitting, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  useEffect(() => () => { dispatch(clearAuthError()); }, [dispatch]);
  if (user) return <Navigate to="/home" replace />;

  const errs = fieldErrors(error);
  const submit = async (e) => {
    e.preventDefault();
    const res = await dispatch(loginUser(form));
    if (!res.error) navigate(location.state?.from?.pathname || '/home', { replace: true });
  };
  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit} noValidate>
        <Link to="/" className="auth-logo"><Icon name="bag" size={32} /></Link>
        <h1>Welcome back</h1>
        <p className="muted">Log in to your campus account</p>
        {error && !error.errors?.length && <p className="form-error" role="alert">{error.message}</p>}
        <FormField id="email" label="Email" error={errs.email}>
          <input id="email" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </FormField>
        <FormField id="password" label="Password" error={errs.password}>
          <input id="password" type="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </FormField>
        <button className="btn btn-primary btn-block" disabled={submitting}>{submitting ? 'Logging in...' : 'Log in'}</button>
        <p className="auth-switch">New here? <Link to="/register">Create an account</Link></p>
      </form>
    </div>
  );
}
