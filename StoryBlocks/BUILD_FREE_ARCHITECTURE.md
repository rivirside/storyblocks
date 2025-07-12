# Build-Free Architecture for StoryBlocks

## Overview

StoryBlocks will be implemented as a pure client-side application using modern web standards that run directly in the browser without any build process.

## Technology Stack (Revised)

```yaml
Framework: Vanilla JavaScript with ES Modules
UI Library: Web Components + Lit (via CDN)
State Management: Vanilla JS with Proxy objects
Routing: Native History API
Editor: Monaco Editor (via CDN)
Markdown: Marked.js (via CDN)
Search: FlexSearch (via CDN)
Visualization: D3.js (via CDN)
Screenplay: Custom ES Module
PDF Generation: jsPDF (via CDN)
File System: File System Access API
Storage: IndexedDB with idb (via CDN)
CSS: Native CSS with CSS Variables
Icons: Iconify (via CDN)
```

## Project Structure

```
StoryBlocks/
├── index.html
├── app.js (ES Module entry point)
├── css/
│   ├── main.css
│   ├── components.css
│   ├── themes.css
│   └── utilities.css
├── js/
│   ├── core/
│   │   ├── state.js
│   │   ├── router.js
│   │   ├── events.js
│   │   └── storage.js
│   ├── services/
│   │   ├── file-system.js
│   │   ├── data-service.js
│   │   ├── search-service.js
│   │   └── validation-service.js
│   ├── components/
│   │   ├── app-header.js
│   │   ├── sidebar-nav.js
│   │   ├── character-card.js
│   │   ├── timeline-view.js
│   │   └── editor-panel.js
│   ├── views/
│   │   ├── welcome.js
│   │   ├── characters.js
│   │   ├── timeline.js
│   │   ├── screenplay.js
│   │   └── settings.js
│   └── utils/
│       ├── helpers.js
│       ├── constants.js
│       └── validators.js
├── data/
│   └── (user data files)
└── assets/
    ├── images/
    └── fonts/

```

## Implementation Approach

### 1. Main HTML File

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StoryBlocks</title>
    
    <!-- CSS -->
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/components.css">
    <link rel="stylesheet" href="css/themes.css">
    
    <!-- External Libraries via CDN -->
    <script type="module" src="https://cdn.jsdelivr.net/npm/lit@2/index.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
    <script src="https://cdn.jsdelivr.net/npm/flexsearch@0.7.31/dist/flexsearch.bundle.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/idb@7/build/umd.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jspdf@2/dist/jspdf.umd.min.js"></script>
    
    <!-- Monaco Editor -->
    <link rel="stylesheet" data-name="vs/editor/editor.main" 
          href="https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs/editor/editor.main.css">
    <script>
        var require = { paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs' }};
    </script>
    <script src="https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs/loader.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs/editor/editor.main.nls.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs/editor/editor.main.js"></script>
</head>
<body>
    <div id="app"></div>
    <script type="module" src="app.js"></script>
</body>
</html>
```

### 2. Main App Entry (app.js)

```javascript
// ES Module imports
import { StateManager } from './js/core/state.js';
import { Router } from './js/core/router.js';
import { FileSystemService } from './js/services/file-system.js';
import { AppHeader } from './js/components/app-header.js';
import { SidebarNav } from './js/components/sidebar-nav.js';

// Initialize app
class StoryBlocks {
    constructor() {
        this.state = new StateManager();
        this.router = new Router();
        this.fileSystem = new FileSystemService();
        this.init();
    }

    async init() {
        // Check browser compatibility
        if (!this.checkCompatibility()) {
            this.showCompatibilityError();
            return;
        }

        // Initialize services
        await this.initializeServices();
        
        // Render UI
        this.render();
        
        // Setup routing
        this.router.init();
    }

    checkCompatibility() {
        return 'showDirectoryPicker' in window && 
               'modules' in HTMLScriptElement.prototype;
    }

    async initializeServices() {
        // Initialize IndexedDB
        this.db = await idb.openDB('StoryBlocks', 1, {
            upgrade(db) {
                db.createObjectStore('preferences');
                db.createObjectStore('cache');
                db.createObjectStore('fileHandles');
            }
        });

        // Restore previous session
        await this.restoreSession();
    }

    render() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <app-header></app-header>
            <div class="main-layout">
                <sidebar-nav></sidebar-nav>
                <main id="content"></main>
            </div>
        `;
    }
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new StoryBlocks());
} else {
    new StoryBlocks();
}
```

### 3. Web Components Example

```javascript
// js/components/character-card.js
export class CharacterCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return ['name', 'role', 'status'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    render() {
        const name = this.getAttribute('name') || 'Unknown';
        const role = this.getAttribute('role') || '';
        const status = this.getAttribute('status') || 'draft';

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: 8px;
                    padding: 1rem;
                    cursor: pointer;
                    transition: transform 0.2s;
                }
                :host(:hover) {
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-lg);
                }
                .name {
                    font-size: 1.125rem;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                }
                .role {
                    color: var(--text-secondary);
                    font-size: 0.875rem;
                }
                .status {
                    display: inline-block;
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    background: var(--status-${status});
                    color: white;
                    margin-top: 0.5rem;
                }
            </style>
            <div class="name">${name}</div>
            <div class="role">${role}</div>
            <span class="status">${status}</span>
        `;
    }
}

customElements.define('character-card', CharacterCard);
```

### 4. State Management

```javascript
// js/core/state.js
export class StateManager {
    constructor() {
        this.state = new Proxy({
            project: null,
            characters: new Map(),
            events: new Map(),
            timelines: new Map(),
            ui: {
                currentView: 'welcome',
                theme: 'light',
                sidebarOpen: true
            }
        }, {
            set: (target, property, value) => {
                target[property] = value;
                this.notify(property, value);
                return true;
            }
        });
        
        this.listeners = new Map();
    }

    subscribe(property, callback) {
        if (!this.listeners.has(property)) {
            this.listeners.set(property, new Set());
        }
        this.listeners.get(property).add(callback);
        
        // Return unsubscribe function
        return () => {
            this.listeners.get(property).delete(callback);
        };
    }

    notify(property, value) {
        if (this.listeners.has(property)) {
            this.listeners.get(property).forEach(callback => {
                callback(value);
            });
        }
    }

    getState() {
        return this.state;
    }

    updateState(updates) {
        Object.assign(this.state, updates);
    }
}
```

### 5. File System Service

```javascript
// js/services/file-system.js
export class FileSystemService {
    constructor() {
        this.directoryHandle = null;
        this.fileCache = new Map();
    }

    async selectDirectory() {
        try {
            this.directoryHandle = await window.showDirectoryPicker({
                mode: 'readwrite'
            });
            await this.saveHandle();
            return true;
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Failed to select directory:', err);
            }
            return false;
        }
    }

    async saveHandle() {
        // Save to IndexedDB for persistence
        const db = await idb.openDB('StoryBlocks', 1);
        await db.put('fileHandles', this.directoryHandle, 'dataDirectory');
    }

    async restoreHandle() {
        const db = await idb.openDB('StoryBlocks', 1);
        const handle = await db.get('fileHandles', 'dataDirectory');
        
        if (handle) {
            const permission = await handle.queryPermission({ mode: 'readwrite' });
            if (permission === 'granted') {
                this.directoryHandle = handle;
                return true;
            }
        }
        return false;
    }

    async readFile(path) {
        const parts = path.split('/');
        let current = this.directoryHandle;
        
        // Navigate to directory
        for (let i = 0; i < parts.length - 1; i++) {
            current = await current.getDirectoryHandle(parts[i]);
        }
        
        // Get file
        const fileHandle = await current.getFileHandle(parts[parts.length - 1]);
        const file = await fileHandle.getFile();
        return await file.text();
    }

    async writeFile(path, content) {
        const parts = path.split('/');
        let current = this.directoryHandle;
        
        // Create directories if needed
        for (let i = 0; i < parts.length - 1; i++) {
            current = await current.getDirectoryHandle(parts[i], { create: true });
        }
        
        // Write file
        const fileHandle = await current.getFileHandle(parts[parts.length - 1], { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(content);
        await writable.close();
    }

    async listDirectory(path = '') {
        let current = this.directoryHandle;
        
        if (path) {
            const parts = path.split('/');
            for (const part of parts) {
                current = await current.getDirectoryHandle(part);
            }
        }
        
        const entries = [];
        for await (const entry of current.values()) {
            entries.push({
                name: entry.name,
                kind: entry.kind
            });
        }
        
        return entries;
    }
}
```

### 6. Router Implementation

```javascript
// js/core/router.js
export class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
    }

    init() {
        // Register routes
        this.register('/', () => import('../views/welcome.js'));
        this.register('/characters', () => import('../views/characters.js'));
        this.register('/timeline', () => import('../views/timeline.js'));
        this.register('/screenplay', () => import('../views/screenplay.js'));
        this.register('/settings', () => import('../views/settings.js'));
        
        // Handle browser navigation
        window.addEventListener('popstate', () => this.handleRoute());
        
        // Handle initial route
        this.handleRoute();
    }

    register(path, loader) {
        this.routes.set(path, loader);
    }

    async navigate(path) {
        window.history.pushState({}, '', path);
        await this.handleRoute();
    }

    async handleRoute() {
        const path = window.location.pathname;
        const loader = this.routes.get(path) || this.routes.get('/');
        
        try {
            const module = await loader();
            const View = module.default;
            const view = new View();
            
            const content = document.getElementById('content');
            content.innerHTML = '';
            content.appendChild(view.render());
            
            this.currentRoute = path;
        } catch (err) {
            console.error('Failed to load route:', err);
        }
    }
}
```

### 7. CSS Architecture

```css
/* css/main.css */
:root {
    /* Colors */
    --primary: #2563eb;
    --primary-dark: #1d4ed8;
    --secondary: #64748b;
    --success: #22c55e;
    --warning: #f59e0b;
    --danger: #ef4444;
    
    /* Surfaces */
    --background: #ffffff;
    --surface: #f8fafc;
    --border: #e2e8f0;
    
    /* Text */
    --text-primary: #0f172a;
    --text-secondary: #64748b;
    
    /* Shadows */
    --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    
    /* Layout */
    --header-height: 60px;
    --sidebar-width: 250px;
}

/* Dark theme */
[data-theme="dark"] {
    --background: #0f172a;
    --surface: #1e293b;
    --border: #334155;
    --text-primary: #f1f5f9;
    --text-secondary: #94a3b8;
}

/* CSS Reset */
*, *::before, *::after {
    box-sizing: border-box;
}

body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: var(--background);
    color: var(--text-primary);
    line-height: 1.6;
}

/* Layout */
#app {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.main-layout {
    display: flex;
    flex: 1;
    overflow: hidden;
}

/* Responsive */
@media (max-width: 768px) {
    :root {
        --sidebar-width: 60px;
    }
}
```

## Key Advantages of Build-Free Approach

1. **Zero Setup**: Just open index.html in a browser
2. **Instant Updates**: Save file, refresh browser
3. **Easy Debugging**: Use browser DevTools directly
4. **No Dependencies**: No node_modules, no package.json
5. **Version Control Friendly**: All code is readable
6. **Easy Deployment**: Just static files
7. **CDN Benefits**: Libraries cached across sites
8. **Modern Features**: ES modules, Web Components, CSS variables

## Progressive Enhancement Strategy

Start with core functionality and progressively add features:

1. **Phase 1**: Basic file operations and character list
2. **Phase 2**: Timeline visualization
3. **Phase 3**: Screenplay editor
4. **Phase 4**: Relationship graphs
5. **Phase 5**: Advanced features

## Browser Requirements

- Chrome 89+ or Edge 89+ (File System Access API)
- ES Module support
- Web Components support
- CSS Variables support

## Development Workflow

1. Edit files in any text editor
2. Save changes
3. Refresh browser
4. Use browser DevTools for debugging
5. No build step required!

This approach maintains all the functionality while eliminating the build complexity entirely.