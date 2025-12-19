import Alpine from 'alpinejs';

// Global Store or Data
Alpine.store('app', {
    isLoading: false,
    version: '1.0.0',
    toggleLoading(state) {
        this.isLoading = state;
    }
});

// Initialize Alpine
window.Alpine = Alpine;
Alpine.start();

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}
