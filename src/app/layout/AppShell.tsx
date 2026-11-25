import { NavLink, Outlet } from 'react-router'
import styles from './AppShell.module.scss'

export function AppShell() {
    return (
        <div className={styles.application}>
            <a className={styles.skipLink} href="#main-content">
                Skip to main content
            </a>

            <header className={styles.header}>
                <div className={styles.brand}>
          <span className={styles.brandMark} aria-hidden="true">
            RG
          </span>

                    <div>
                        <span className={styles.brandName}>ReleaseGuard</span>
                        <span className={styles.brandDescription}>
              Deployment readiness console
            </span>
                    </div>
                </div>

                <nav aria-label="Primary navigation">
                    <NavLink
                        className={({ isActive }) =>
                            `${styles.navLink} ${isActive ? styles.activeNavLink : ''}`
                        }
                        to="/releases"
                    >
                        Releases
                    </NavLink>
                </nav>

                <div className={styles.apiStatus}>
                    <span className={styles.statusIndicator} aria-hidden="true" />
                    Mock API
                </div>
            </header>

            <main className={styles.main} id="main-content" tabIndex={-1}>
                <Outlet />
            </main>

            <footer className={styles.footer}>
                ReleaseGuard engineering portfolio project
            </footer>
        </div>
    )
}