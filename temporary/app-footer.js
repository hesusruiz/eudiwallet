import { homeOutline, walletOutline, qrCodeOutline, settingsOutline } from 'ionicons/icons';

class AppFooter extends HTMLElement {
    connectedCallback() {
        const path = window.location.pathname;
        
        // Helper to determine active color
        const isActive = (routePattern) => {
            if (routePattern === '/' && (path === '/' || path === '/index.html')) return true;
            return path.includes(routePattern);
        };

        const getColor = (routePattern) => isActive(routePattern) ? 'primary' : 'medium';

        this.innerHTML = `
            <style>
                ion-footer {
                    padding-bottom: env(safe-area-inset-bottom);
                    background: var(--ion-background-color); 
                }
                .footer-nav {
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    width: 100%;
                    padding: 8px 0;
                }
            </style>
            <ion-footer>
                <ion-toolbar>
                    <div class="footer-nav">
                        <ion-button fill="clear" href="/" color="${getColor('/')}">
                            <ion-icon slot="icon-only" name="home-outline" size="large"></ion-icon>
                        </ion-button>

                        <ion-button fill="clear" href="/pages/credentials/index.html" color="${getColor('credentials')}">
                            <ion-icon slot="icon-only" name="wallet-outline" size="large"></ion-icon>
                        </ion-button>

                        <ion-button fill="clear" href="/pages/scan.html" color="${getColor('scan')}">
                            <ion-icon slot="icon-only" name="qr-code-outline" size="large"></ion-icon>
                        </ion-button>
                        
                        <ion-button fill="clear" href="/pages/settings.html" color="${getColor('settings')}">
                            <ion-icon slot="icon-only" name="settings-outline" size="large"></ion-icon>
                        </ion-button>
                    </div>
                </ion-toolbar>
            </ion-footer>
        `;
    }
}
customElements.define('app-footer', AppFooter);
