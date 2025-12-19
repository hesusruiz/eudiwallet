# Objectives
I have developed a web app (it is a Wallet for Verifiable Credentials aligned with the EUDI Wallet specifications for credential issuance and presentation), which I want to modernize and restructure for easier future maintenance and feature additions.
The requirements for the application are the following:

Right now it is developed as a Javascript-first application, and I want to change it to an HTML-first application.
Currently, it has one HTML initial page which loads and starts an "app" js module which bootstraps the whole application, in particular starting the first page. Pages are implemented as JS modules which are lazily loaded and using a service worker to load and cache all the modules impacting the less possible to the time-to-first-presentation of the home page of the app. The HTML pages of the application are generated via javascript (using the uhtml package). The routing is done with a nano-router I developed, invoking expressly the target page from the origin page.

I want to change it to have the pages defined in HTML/CSS and the interactivity logic of the page as javascript, subscribing to events of the elements in the page for that. I have a lot of javascript for the logic of the EUDI protocols which I will reuse without problems, as it is pure javascript.

I do not want any heavy framework like React or Angular, but I could use light libraries for some functionality if needed.

For routing, a service worker must be a central piece, intercepting and responding to requests for html pages.

The webapp must be able to be served from a CDN (so it does not require a server in runtime). The only communication with external machines is for credential issuance an presentation. You should not worry about those, I am asking only about the application architecture.

I am extremely minimalist ,and I am an expert on Go language. The only build tool I use is a tool I developed embedding the "esbuild" tool as a library. This is the tool I use form many frontends in my Go application, which in testing it can even build the frontend web app on the fly.
It is not a hard requirement to use this tool, and I could use something like Vite (which also uses esbuild), but it would be ideal if no javascript build tool is required.

The question is: what would we the possible application structures, tools, libraries to implement such an application?

# Response

This is a fascinating architectural challenge. You are essentially asking to build a **"Serverless" Multi-Page Application (MPA)** where the Service Worker acts as the server, and the browser's native features replace the heavy frameworks.

Given your minimalist Go background and the requirement for "HTML-first" with "reused JS logic," the following architecture fits your constraints perfectly.

### The Architecture: "Service Worker-Enhanced MPA"

Instead of a Single Page Application (SPA) that hijacks routing via JavaScript, we will return to the browser's native navigation model (MPA), but we will upgrade it to feel like an SPA using modern APIs.

* **Routing:** Handled natively by the browser (User clicks `<a href="/scan">`, browser requests `/scan`).
* **The "Server":** The Service Worker intercepts these navigation requests. It serves the HTML files immediately from the Cache (or Network), ensuring the app works offline and loads instantly.
* **Interactivity:** **Alpine.js**. This is the closest equivalent to "Go-like minimalism" in the JS world. It allows you to bind your existing JS logic to HTML completely declaratively, without a build step or Virtual DOM.
* **Transitions:** **View Transitions API**. This makes your page loads look like smooth app transitions, even though they are technically loading new HTML pages.

---

### 1. Directory Structure

Shift from a "JS module tree" to a "File system" structure. This makes the project self-documenting.

```text
/src
  /components       # Shared UI (Header, Footer) as Web Components
  /lib              # Your existing EUDI logic (pure JS modules)
  /pages            # Physical HTML files
    index.html
    credentials.html
    scan.html
    presentation.html
  app.js            # Main entry point (imports Alpine, registers SW)
  sw.js             # The Service Worker (The "Router")

```

### 2. The HTML-First Strategy (Logic Binding)

Since you want the pages defined in HTML but logic in JS, **Alpine.js** is the tool of choice here. It is extremely lightweight (script tag), requires no build, and lets you "sprinkle" behavior onto static HTML.

**Example: `credentials.html**`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <script type="module" src="/app.js"></script>
    <meta name="view-transition" content="same-origin" />
</head>
<body>
    <app-header></app-header>

    <main x-data="credentialList()">
        <h1>Your Credentials</h1>
        
        <div x-show="isLoading">Loading secure storage...</div>

        <template x-for="cred in credentials" :key="cred.id">
            <div class="card" @click="present(cred.id)">
                <span x-text="cred.issuerName"></span>
                <span class="status" x-text="cred.status"></span>
            </div>
        </template>
    </main>
    
    <app-footer></app-footer>
</body>
</html>

```

**The Logic (`app.js`):**
You simply wrap your existing pure-JS logic in a factory function.

```javascript
import Alpine from 'alpinejs';
import { WalletStorage } from './lib/eudi-wallet-storage.js';

// Bridge your existing logic to the UI
Alpine.data('credentialList', () => ({
    credentials: [],
    isLoading: true,

    async init() {
        // Reuse your existing logic
        this.credentials = await WalletStorage.getAll();
        this.isLoading = false;
    },

    present(id) {
        // Navigate naturally - SW will handle the request
        window.location.href = `/presentation?id=${id}`;
    }
}));

Alpine.start();

```

### 3. The Service Worker as the "Central Router"

Since you want the SW to be central and the app to be served from a CDN, the SW must act as a **local reverse proxy**. It intercepts navigation requests and serves the HTML.

This allows you to implement **"Offline-First"** routing.

**`sw.js` (The Router)**

```javascript
const CACHE_NAME = 'eudi-wallet-v1';
const HTML_ROUTES = [
    '/',
    '/index.html',
    '/credentials.html',
    '/scan.html'
];

self.addEventListener('install', (event) => {
    // Pre-cache all HTML pages so they are available offline immediately
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(HTML_ROUTES))
    );
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // ROUTING LOGIC: Intercept Navigation requests (HTML)
    if (event.request.mode === 'navigate') {
        event.respondWith(
            (async () => {
                try {
                    // 1. Try Network First (to get fresh HTML)
                    const networkResponse = await fetch(event.request);
                    const cache = await caches.open(CACHE_NAME);
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                } catch (error) {
                    // 2. Fallback to Cache (Offline mode)
                    const cachedResponse = await caches.match(event.request);
                    if (cachedResponse) return cachedResponse;
                    
                    // 3. Fallback to a generic offline page if absolutely needed
                    return caches.match('/offline.html');
                }
            })()
        );
    }

    // Handle Assets (JS/CSS) - Cache First strategies usually better here
    // ...
});

```

### 4. Modernizing the "Look & Feel" (View Transitions)

You mentioned you want to modernize. The biggest drawback of MPAs is the "flash" between pages. The **View Transitions API** fixes this natively.

You don't need a library. Just adding this CSS to your base styles enables SPA-like sliding/fading between your static HTML pages:

```css
@view-transition {
  navigation: auto; /* Chrome 111+ */
}

/* Custom animations for specific elements */
.card {
    view-transition-name: credential-card;
}

```

When you click a credential, the browser will automatically morph the card from the list page into the detail page, provided they share the same `view-transition-name`.

### 5. Shared Layouts (The "Include" Problem)

In an HTML-first app without a server-side template engine (since you are on a CDN), you don't want to copy-paste the Navbar into 20 files.

Use **standard Web Components** for layout. This is pure JS, no framework.

```javascript
// components/NavBar.js
class NavBar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <nav>
                <a href="/">Home</a>
                <a href="/credentials.html">Credentials</a>
            </nav>
        `;
    }
}
customElements.define('app-nav', NavBar);

```

Usage in every HTML file: `<app-nav></app-nav>`.

### Summary of the Stack

| Component | Choice | Why? |
| --- | --- | --- |
| **Architecture** | **Offline-First MPA** | Simplest model. HTML files exist physically. |
| **Routing** | **Service Worker** | Intercepts `Maps` events. Handles offline serving. |
| **Logic/State** | **Alpine.js** | Minimalist (like Go for frontend). Binds JS vars to HTML attributes. |
| **Templating** | **Native HTML** | No runtime generation. |
| **Layouts** | **Web Components** | Standard way to share headers/footers without frameworks. |
| **Transitions** | **View Transitions API** | Makes the MPA feel like a slick native app. |
| **Build Tool** | **Your Go/esbuild tool** | Perfect. Just bundle `app.js` and `sw.js`. HTML files are static assets. |

