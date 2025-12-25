class AppHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <ion-header>
                <ion-toolbar color="light">
                    <ion-title>EUDI Wallet</ion-title>
                    <ion-buttons slot="end">
                        <ion-button href="/">Home</ion-button>
                        <ion-button href="/pages/credentials/index.html">Credentials</ion-button>
                        <ion-button href="/pages/scan.html">Scan</ion-button>
                    </ion-buttons>
                </ion-toolbar>
            </ion-header>
        `;
    }
}
customElements.define('app-header', AppHeader);
