import {
    keepPreviousData,
    useQuery,
} from '@tanstack/react-query'
import {
    getRelease,
    getReleases,
} from '../api/releasesApi'
import type { ReleaseFilters } from '../model/release'

export const releaseKeys = {
    all: ['releases'] as const,

    lists: () => [...releaseKeys.all, 'list'] as const,

    list: (filters: ReleaseFilters) =>
        [...releaseKeys.lists(), filters] as const,

    details: () => [...releaseKeys.all, 'detail'] as const,

    detail: (releaseId: string) =>
        [...releaseKeys.details(), releaseId] as const,
}

export function useReleases(filters: ReleaseFilters) {
    return useQuery({
        queryKey: releaseKeys.list(filters),

        queryFn: ({ signal }) =>
            getReleases(filters, signal),

        // Keeping the previous result prevents the list from disappearing while a
        // new filter request is in flight.
        placeholderData: keepPreviousData,
    })
}

export function useRelease(releaseId: string) {
    return useQuery({
        queryKey: releaseKeys.detail(releaseId),

        queryFn: ({ signal }) =>
            getRelease(releaseId, signal),

        enabled: releaseId.length > 0,
    })
}