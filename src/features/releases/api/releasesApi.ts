import {
    releaseResponseSchema,
    releasesResponseSchema,
    type Release,
    type ReleaseFilters,
    type ReleasesResponse,
} from '../model/release'

export class ReleaseApiError extends Error {
    readonly status: number

    constructor(
        message: string,
        status: number,
    ) {
        super(message)
        this.name = 'ReleaseApiError'
        this.status = status
    }
}

function createQueryString(filters: ReleaseFilters): string {
    const parameters = new URLSearchParams()

    if (filters.query) {
        parameters.set('q', filters.query)
    }

    if (filters.environment) {
        parameters.set('environment', filters.environment)
    }

    if (filters.risk) {
        parameters.set('risk', filters.risk)
    }

    if (filters.status) {
        parameters.set('status', filters.status)
    }

    return parameters.toString()
}

async function getJson(response: Response): Promise<unknown> {
    if (!response.ok) {
        throw new ReleaseApiError(
            `Release API request failed with status ${response.status}.`,
            response.status,
        )
    }

    return response.json() as Promise<unknown>
}

export async function getReleases(
    filters: ReleaseFilters,
    signal?: AbortSignal,
): Promise<ReleasesResponse> {
    const queryString = createQueryString(filters)
    const endpoint = queryString
        ? `/api/releases?${queryString}`
        : '/api/releases'

    const response = await fetch(endpoint, {
        signal,
        headers: {
            Accept: 'application/json',
        },
    })

    const payload = await getJson(response)

    // TypeScript cannot prove that external JSON matches our contract.
    // Parsing here prevents invalid data from reaching React components.
    return releasesResponseSchema.parse(payload)
}

export async function getRelease(
    releaseId: string,
    signal?: AbortSignal,
): Promise<Release> {
    const response = await fetch(
        `/api/releases/${encodeURIComponent(releaseId)}`,
        {
            signal,
            headers: {
                Accept: 'application/json',
            },
        },
    )

    const payload = await getJson(response)
    return releaseResponseSchema.parse(payload).data
}