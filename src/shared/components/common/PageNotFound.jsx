import { Link } from 'react-router-dom';

function PageNotFound() {
  return (
    <section>
      <h1 className="page-title">Page Not Found</h1>
      <Link to="/">Go to Dashboard</Link>
    </section>
  );
}

export default PageNotFound;
