import { Link } from 'react-router-dom';
export default function NotFound() {
  return <div className="state page-center"><h1>404</h1><p>We could not find that page.</p><Link className="btn btn-primary" to="/home">Go home</Link></div>;
}
