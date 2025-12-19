class AppHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <header style="background: var(--color-surface); border-bottom: 1px solid var(--color-border); padding: var(--spacing-md) 0;">
                <div class="container" style="display: flex; justify-content: space-between; align-items: center;">
                    <a href="/" style="font-weight: 700; font-size: 1.25rem; color: var(--color-text-main); text-decoration: none;">
                        EUDI Wallet
                    </a>
                    <nav style="display: flex; gap: var(--spacing-md);">
                        <a href="/" style="color: var(--color-text-muted); font-weight: 500;">Home</a>
                        <a href="/credentials/" style="color: var(--color-text-muted); font-weight: 500;">Credentials</a>
                        <a href="/scan.html" style="color: var(--color-text-muted); font-weight: 500;">Scan</a>
                    </nav>
                </div>
            </header>
        `;
    }
}
customElements.define('app-header', AppHeader);
