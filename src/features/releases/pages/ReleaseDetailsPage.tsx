import { Link, useParams } from 'react-router'
import { useRelease } from '../hooks/releaseQueries'
import { getReadinessSummary } from '../model/release'
import styles from './ReleaseDetailsPage.module.scss'

function formatLabel(value: string): string {
    return value
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ')
}

export function ReleaseDetailsPage() {
    const { releaseId = '' } = useParams()
    const {
        data: release,
        error,
        isError,
        isPending,
        refetch,
    } = useRelease(releaseId)

    if (isPending) {
        return (
            <section className="page" role="status">
                <p className="eyebrow">Release review</p>
                <h1>Loading release</h1>
            </section>
        )
    }

    if (isError || !release) {
        return (
            <section className="page" role="alert">
                <p className="eyebrow">Release review</p>
                <h1>Unable to load release</h1>
                <p className="pageDescription">
                    {error instanceof Error
                        ? error.message
                        : 'The requested release is unavailable.'}
                </p>

                <button
                    className={styles.actionButton}
                    type="button"
                    onClick={() => void refetch()}
                >
                    Try again
                </button>

                <Link className="textLink" to="/releases">
                    Back to releases
                </Link>
            </section>
        )
    }

    const readiness = getReadinessSummary(release)

    return (
        <section className="page" aria-labelledby="release-heading">
            <Link className="textLink" to="/releases">
                Back to releases
            </Link>

            <header className={styles.header}>
                <div>
                    <p className="eyebrow">{release.id}</p>
                    <h1 id="release-heading">
                        {release.service.name}
                    </h1>
                    <p className="pageDescription">
                        {release.version} · {release.commitSha} ·{' '}
                        {formatLabel(release.environment)}
                    </p>
                </div>

                <div className={styles.readinessScore}>
                    <span>Readiness</span>
                    <strong>{readiness.progress}%</strong>
                </div>
            </header>

            <section className={styles.metadataGrid}>
                <article>
                    <span>Status</span>
                    <strong>{formatLabel(release.status)}</strong>
                </article>

                <article>
                    <span>Risk</span>
                    <strong>{formatLabel(release.risk)}</strong>
                </article>

                <article>
                    <span>Owner</span>
                    <strong>{release.owner.name}</strong>
                </article>

                <article>
                    <span>Checks</span>
                    <strong>{release.checks.length}</strong>
                </article>
            </section>

            <section aria-labelledby="checks-heading">
                <h2 id="checks-heading">Readiness checks</h2>

                <div className={styles.checkList}>
                    {release.checks.map((check) => (
                        <article
                            className={styles.check}
                            key={check.id}
                        >
                            <div>
                <span className={styles.category}>
                  {formatLabel(check.category)}
                </span>
                                <h3>{check.name}</h3>
                                <p>{check.details}</p>
                            </div>

                            <span
                                className={`${styles.checkStatus} ${styles[check.status]}`}
                            >
                {formatLabel(check.status)}
              </span>
                        </article>
                    ))}
                </div>
            </section>
        </section>
    )
}