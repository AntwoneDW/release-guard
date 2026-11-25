import { Navigate, createBrowserRouter } from 'react-router'
import { ReleaseDetailsPage } from './features/releases/pages/ReleaseDetailsPage'
import { ReleasesPage } from './features/releases/pages/ReleasePage'
import { NotFoundPage } from './shared/pages/NotFoundPage'
import { AppShell } from "./app/layout/AppShell"

export const router = createBrowserRouter([
    {
        path: '/',
        element: <AppShell />,
        children: [
            {
                index: true,
                element: <Navigate to="/releases" replace />,
            },
            {
                path: 'releases',
                element: <ReleasesPage />,
            },
            {
                path: 'releases/:releaseId',
                element: <ReleaseDetailsPage />,
            },
            {
                path: '*',
                element: <NotFoundPage />,
            },
        ],
    },
])