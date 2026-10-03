import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Icon from '../components/common/Icon';
export default function Landing() {
  const user = useSelector((s) => s.auth.user);
  return (
    <div className="landing">
      <header className="landing-nav">
        <span className="brand-inline"><Icon name="bag" size={22} /> Campus Lost &amp; Found</span>
        <nav>{user ? <Link className="btn btn-light" to="/home">Open app</Link> : <><Link to="/login" className="landing-link">Log in</Link><Link className="btn btn-light" to="/register">Sign up</Link></>}</nav>
      </header>
      <section className="landing-hero">
        <Icon name="bag" size={96} className="hero-icon" />
        <h1>CAMPUS<br /><span>LOST &amp; FOUND</span></h1>
        <p>Find. Return. &amp; Reconnect.</p>
        <Link className="btn btn-light btn-lg" to={user ? '/home' : '/register'}>Get Started</Link>
      </section>
      <section className="landing-features">
        <div><Icon name="tag" size={28} /><h3>Report in seconds</h3><p>Post a lost or found item with a photo, place and date.</p></div>
        <div><Icon name="search" size={28} /><h3>Search &amp; match</h3><p>Filter by category, place and date. We suggest possible matches.</p></div>
        <div><Icon name="message" size={28} /><h3>Contact safely</h3><p>Talk to the reporter through in-app messages. No phone numbers shared.</p></div>
      </section>
    </div>
  );
}
