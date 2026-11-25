import { useSearchParams } from 'react-router'
import { ReleaseCard } from '../components/ReleaseCard'
import { useReleases } from '../hooks/releaseQueries'
import {
    releaseEnvironmentSchema,
    releaseRiskSchema,
    releaseStatusSchema,
    type ReleaseFilters,
} from '../model/release'
import styles from './ReleasesPage.module.scss'

function parseFilters(
    searchParameters: URLSearchParams,
): ReleaseFilters {
    const environment = releaseEnvironmentSchema.safeParse(
        searchParameters.get('environment'),
    )

    const risk = releaseRiskSchema.safeParse(
        searchParameters.get('risk'),
    )

    const status = releaseStatusSchema.safeParse(
        searchParameters.get('status'),
    )

    return {
        query: searchParameters.get('q')?.trim() || undefined,
        environment: environment.success
            ? environment.data
            : undefined,
        risk: risk.success ? risk.data : undefined,
        status: status.success ? status.data : undefined,
    }
}

export function ReleasesPage() {
    const [searchParameters, setSearchParameters] =
        useSearchParams()

    const filters = parseFilters(searchParameters)

    const {
        data,
        error,
        isError,
        isFetching,
        isPending,
        refetch,
    } = useReleases(filters)

    const releases = data?.data ?? []

    const readyCount = releases.filter(
        (release) =>
            release.status === 'ready' ||
            release.status === 'approved',
    ).length

    const blockedCount = releases.filter(
        (release) => release.status === 'blocked',
    ).length

    const elevatedRiskCount = releases.filter(
        (release) =>
            release.risk === 'high' ||
            release.risk === 'critical',
    ).length

    function updateFilter(
        name: string,
        value: string,
    ) {
        const nextParameters = new URLSearchParams(
            searchParameters,
        )

        if (value) {
            nextParameters.set(name, value)
        } else {
            nextParameters.delete(name)
        }

        // Replacing avoids creating a browser-history entry for every keystroke.
        setSearchParameters(nextParameters, {
            replace: true,
        })
    }

    function clearFilters() {
        setSearchParameters({}, { replace: true })
    }

    return (
        <section className="page" aria-labelledby="releases-heading">
            <header className={styles.pageHeader}>
                <div>
                    <p className="eyebrow">Release operations</p>
                    <h1 id="releases-heading">Candidate releases</h1>
                    <p className="pageDescription">
                        Review deployment readiness, unresolved risks and
                        release decisions across environments.
                    </p>
                </div>

                {isFetching && !isPending && (
                    <span className={styles.fetchingStatus} role="status">
            Updating releases…
          </span>
                )}
            </header>

            <section
                className={styles.summaryGrid}
                aria-label="Release summary"
            >
                <article>
                    <span>Matching releases</span>
                    <strong>{releases.length}</strong>
                </article>

                <article>
                    <span>Ready</span>
                    <strong>{readyCount}</strong>
                </article>

                <article>
                    <span>Blocked</span>
                    <strong>{blockedCount}</strong>
                </article>

                <article>
                    <span>High or critical risk</span>
                    <strong>{elevatedRiskCount}</strong>
                </article>
            </section>

            <form
                className={styles.filters}
                onSubmit={(event) => event.preventDefault()}
            >
                <label className={styles.searchField}>
                    <span>Search releases</span>
                    <input
                        type="search"
                        value={filters.query ?? ''}
                        placeholder="Service, version, owner or release ID"
                        onChange={(event) =>
                            updateFilter('q', event.target.value)
                        }
                    />
                </label>

                <label>
                    <span>Environment</span>
                    <select
                        value={filters.environment ?? ''}
                        onChange={(event) =>
                            updateFilter(
                                'environment',
                                event.target.value,
                            )
                        }
                    >
                        <option value="">All environments</option>
                        <option value="development">Development</option>
                        <option value="staging">Staging</option>
                        <option value="production">Production</option>
                    </select>
                </label>

                <label>
                    <span>Risk</span>
                    <select
                        value={filters.risk ?? ''}
                        onChange={(event) =>
                            updateFilter('risk', event.target.value)
                        }
                    >
                        <option value="">All risk levels</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                    </select>
                </label>

                <label>
                    <span>Status</span>
                    <select
                        value={filters.status ?? ''}
                        onChange={(event) =>
                            updateFilter('status', event.target.value)
                        }
                    >
                        <option value="">All statuses</option>
                        <option value="awaiting-review">
                            Awaiting review
                        </option>
                        <option value="ready">Ready</option>
                        <option value="blocked">Blocked</option>
                        <option value="approved">Approved</option>
                        <option value="deployed">Deployed</option>
                    </select>
                </label>

                <button
                    className={styles.clearButton}
                    type="button"
                    onClick={clearFilters}
                >
                    Clear filters
                </button>
            </form>

            {isPending && (
                <div className={styles.statePanel} role="status">
                    <strong>Loading releases</strong>
                    <p>Retrieving deployment-readiness information.</p>
                </div>
            )}

            {isError && (
                <div className={styles.errorPanel} role="alert">
                    <strong>Unable to load releases</strong>
                    <p>
                        {error instanceof Error
                            ? error.message
                            : 'An unexpected release API error occurred.'}
                    </p>

                    <button
                        type="button"
                        onClick={() => void refetch()}
                    >
                        Try again
                    </button>
                </div>
            )}

            {!isPending && !isError && releases.length === 0 && (
                <div className={styles.statePanel}>
                    <strong>No releases matched</strong>
                    <p>Change or clear the current filters.</p>
                    <button type="button" onClick={clearFilters}>
                        Clear filters
                    </button>
                </div>
            )}

            {!isPending && !isError && releases.length > 0 && (
                <div className={styles.releaseGrid}>
                    {releases.map((release) => (
                        <ReleaseCard
                            key={release.id}
                            release={release}
                        />
                    ))}
                </div>
            )}
        </section>
    )
}