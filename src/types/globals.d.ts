/**
 * Global Type Definitions
 * This file helps the editor understand types that aren't native or imported from node_modules.
 */

// Define Alpine.js module for the editor since we might use a CDN or custom build
declare module 'alpinejs' {
    const Alpine: any;
    export default Alpine;
}

// Ensure Service Worker types are recognized
interface ServiceWorkerGlobalScope {
    // Add any custom SW globals here if needed
}

// Extend the global Window interface
interface Window {
    Alpine: any;
}
