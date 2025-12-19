class AppFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer style="background: var(--color-surface); border-top: 1px solid var(--color-border); padding: var(--spacing-lg) 0; margin-top: auto;">
                <div class="container" style="text-align: center;">
                    <p class="text-sm" style="margin: 0;">&copy; ${new Date().getFullYear()} EUDI Wallet. All rights reserved.</p>
                </div>
            </footer>
        `;
    }
}
customElements.define('app-footer', AppFooter);
