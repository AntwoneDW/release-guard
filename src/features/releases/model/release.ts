import { z } from 'zod'

export const releaseEnvironmentSchema = z.enum([
    'development',
    'staging',
    'production',
])

export const releaseRiskSchema = z.enum([
    'low',
    'medium',
    'high',
    'critical',
])

export const releaseStatusSchema = z.enum([
    'awaiting-review',
    'ready',
    'blocked',
    'approved',
    'deployed',
])

export const releaseCheckStatusSchema = z.enum([
    'passed',
    'failed',
    'pending',
    'waived',
])

export const releaseCheckCategorySchema = z.enum([
    'build',
    'test',
    'security',
    'operations',
    'approval',
])

export const releaseCheckSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    category: releaseCheckCategorySchema,
    status: releaseCheckStatusSchema,
    details: z.string().min(1),
})

export const releaseSchema = z.object({
    id: z.string().min(1),

    service: z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
    }),

    version: z.string().min(1),
    commitSha: z.string().regex(/^[a-f0-9]{7,40}$/),
environment: releaseEnvironmentSchema,

owner: z.object({
    name: z.string().min(1),
    email: z.string().email(),
}),

risk: releaseRiskSchema,
status: releaseStatusSchema,
scheduledAt: z.string().datetime(),
updatedAt: z.string().datetime(),
checks: z.array(releaseCheckSchema),
})

export const releasesResponseSchema = z.object({
    data: z.array(releaseSchema),
    meta: z.object({
        total: z.number().int().nonnegative(),
    }),
})

export const releaseResponseSchema = z.object({
    data: releaseSchema,
})

export type Release = z.infer<typeof releaseSchema>
export type ReleaseEnvironment = z.infer<typeof releaseEnvironmentSchema>
export type ReleaseRisk = z.infer<typeof releaseRiskSchema>
export type ReleaseStatus = z.infer<typeof releaseStatusSchema>
export type ReleasesResponse = z.infer<typeof releasesResponseSchema>

export interface ReleaseFilters {
    query?: string
environment?: ReleaseEnvironment
risk?: ReleaseRisk
status?: ReleaseStatus
}

export interface ReadinessSummary {
    total: number
    passed: number
    failed: number
    pending: number
    waived: number
    progress: number
}

export function getReadinessSummary(
    release: Release,
): ReadinessSummary {
    const summary = release.checks.reduce(
    (current, check) => {
    current[check.status] += 1
return current
},
{
passed: 0,
failed: 0,
pending: 0,
waived: 0,
},
)

const total = release.checks.length
const completed = summary.passed + summary.waived

return {
    total,
    ...summary,
    progress: total === 0 ? 0 : Math.round((completed / total) * 100),
}
}