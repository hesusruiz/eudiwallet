import { defineCustomElements } from '@ionic/core/loader';
/* Core CSS required for Ionic components to work properly */
import '@ionic/core/css/core.css';
/* Basic CSS for apps built with Ionic */
import '@ionic/core/css/normalize.css';
import '@ionic/core/css/structure.css';
import '@ionic/core/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/core/css/padding.css';
import '@ionic/core/css/float-elements.css';
import '@ionic/core/css/text-alignment.css';
import '@ionic/core/css/text-transformation.css';
import '@ionic/core/css/flex-utils.css';
import '@ionic/core/css/display.css';

/* Theme variables */
import './styles/variables.css';
import './styles/main.css';

import Alpine from 'alpinejs';

// Initialize Ionic
defineCustomElements(window);

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
