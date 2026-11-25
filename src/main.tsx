import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './shared/styles/global.scss'

async function enableApiMocking() {
    if (!import.meta.env.DEV) {
        return
    }

    // Dynamic import prevents the development mocking implementation from
    // becoming part of the production application's initial dependency graph.
    const { worker } = await import('./mocks/browser')

    // Waiting prevents the application from issuing API requests before the
    // Service Worker is ready to intercept them.
    await worker.start()
}

async function bootstrap() {
    await enableApiMocking()

    const rootElement = document.getElementById('root')

    if (!rootElement) {
        throw new Error('Unable to locate the React root element.')
    }

    createRoot(rootElement).render(
        <StrictMode>
            <App />
        </StrictMode>,
    )
}

void bootstrap().catch((error: unknown) => {
    console.error('ReleaseGuard failed to start.', error)
})