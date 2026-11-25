import { Link } from 'react-router'
import {
    getReadinessSummary,
    type Release,
} from '../model/release'
import styles from './ReleaseCard.module.scss'

interface ReleaseCardProps {
    release: Release
}

function formatLabel(value: string): string {
    return value
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ')
}

function formatSchedule(value: string): string {
    return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value))
}

export function ReleaseCard({
                                release,
                            }: ReleaseCardProps) {
    const readiness = getReadinessSummary(release)

    return (
        <article className={styles.card}>
            {/*
        The card establishes the containing block. The badge is absolutely
        positioned against this card instead of against the page.
      */}
            <span
                className={`${styles.riskBadge} ${styles[release.risk]}`}
            >
        {formatLabel(release.risk)} risk
      </span>

            <header className={styles.header}>
                <p className={styles.releaseId}>{release.id}</p>
                <h2>{release.service.name}</h2>
                <p className={styles.version}>
                    {release.version} · {release.commitSha}
                </p>
            </header>

            <dl className={styles.metadata}>
                <div>
                    <dt>Environment</dt>
                    <dd>{formatLabel(release.environment)}</dd>
                </div>

                <div>
                    <dt>Status</dt>
                    <dd>{formatLabel(release.status)}</dd>
                </div>

                <div>
                    <dt>Owner</dt>
                    <dd>{release.owner.name}</dd>
                </div>

                <div>
                    <dt>Scheduled</dt>
                    <dd>{formatSchedule(release.scheduledAt)}</dd>
                </div>
            </dl>

            <section
                className={styles.readiness}
                aria-label={`${release.service.name} readiness`}
            >
                <div className={styles.readinessHeader}>
                    <span>Readiness</span>
                    <strong>{readiness.progress}%</strong>
                </div>

                <progress
                    className={styles.progress}
                    max={100}
                    value={readiness.progress}
                    aria-label={`${readiness.progress}% of readiness checks complete`}
                />

                <p>
                    {readiness.passed} passed · {readiness.failed} failed ·{' '}
                    {readiness.pending} pending
                </p>
            </section>

            <Link
                className={styles.reviewLink}
                to={`/releases/${encodeURIComponent(release.id)}`}
            >
                Review release
                <span className="srOnly">
          {' '}
                    {release.id} for {release.service.name}
        </span>
            </Link>
        </article>
    )
}