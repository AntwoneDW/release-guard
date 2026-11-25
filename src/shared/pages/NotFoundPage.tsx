import { Link } from 'react-router'

export function NotFoundPage() {
    return (
        <section className="page" aria-labelledby="not-found-heading">
            <p className="eyebrow">404</p>
            <h1 id="not-found-heading">Page not found</h1>
            <p className="pageDescription">
                The requested ReleaseGuard page does not exist.
            </p>

            <Link className="textLink" to="/releases">
                Return to releases
            </Link>
        </section>
    )
}