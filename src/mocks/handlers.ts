import { HttpResponse, http } from 'msw/http'
import { delay } from "msw/utils/delay";
import { releases } from './data/releases'

export const handlers = [
    http.get('/api/releases', async ({ request }) => {
        // A short delay makes loading and background-fetching behavior observable
        // without making local development unnecessarily slow.
        await delay(350)

        const url = new URL(request.url)
        const query = url.searchParams.get('q')?.trim().toLowerCase()
        const environment = url.searchParams.get('environment')
        const risk = url.searchParams.get('risk')
        const status = url.searchParams.get('status')

        const filteredReleases = releases.filter((release) => {
            const searchableText = [
                release.id,
                release.service.name,
                release.service.slug,
                release.version,
                release.owner.name,
            ]
                .join(' ')
                .toLowerCase()

            return (
                (!query || searchableText.includes(query)) &&
                (!environment || release.environment === environment) &&
                (!risk || release.risk === risk) &&
                (!status || release.status === status)
            )
        })

        return HttpResponse.json({
            data: filteredReleases,
            meta: {
                total: filteredReleases.length,
            },
        })
    }),

    http.get('/api/releases/:releaseId', async ({ params }) => {
        await delay(250)

        const release = releases.find(
            (candidate) => candidate.id === params.releaseId,
        )

        if (!release) {
            return HttpResponse.json(
                {
                    message: `Release ${String(params.releaseId)} was not found.`,
                },
                {
                    status: 404,
                },
            )
        }

        return HttpResponse.json({
            data: release,
        })
    }),
]