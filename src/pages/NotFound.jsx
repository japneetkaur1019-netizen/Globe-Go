import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="container">
      <h1>404 — Page not found</h1>
      <p>This travel page does not exist.</p>
      <Link className="btn btn-primary" to="/">Back to home</Link>
    </section>
  );
}
