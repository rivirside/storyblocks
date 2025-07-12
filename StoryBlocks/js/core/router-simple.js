// Simple Router (no ES modules)
class SimpleRouter {
    constructor(app) {
        this.app = app;
        this.routes = new Map();
        this.currentRoute = null;
        this.currentView = null;
        
        // Bind methods
        this.handleHashChange = this.handleHashChange.bind(this);
    }
    
    init() {
        // Register routes
        this.addRoute('', () => this.app.showView('welcome'));
        this.addRoute('welcome', () => this.app.showView('welcome'));
        this.addRoute('timeline', () => this.app.showView('timeline'));
        this.addRoute('characters', () => this.app.showView('characters'));
        this.addRoute('locations', () => this.app.showView('locations'));
        this.addRoute('events', () => this.app.showView('events'));
        this.addRoute('plots', () => this.app.showView('plots'));
        this.addRoute('themes', () => this.app.showView('themes'));
        this.addRoute('brainstorming', () => this.app.showView('brainstorming'));
        this.addRoute('arcs', () => this.app.showView('arcs'));
        this.addRoute('lore', () => this.app.showView('lore'));
        this.addRoute('productions', () => this.app.showView('productions'));
        this.addRoute('scripts', () => this.app.showView('scripts'));
        this.addRoute('screenplay', () => this.app.showView('screenplay'));
        this.addRoute('cast', () => this.app.showView('cast'));
        this.addRoute('export', () => this.app.showView('export'));
        this.addRoute('brainstorming', () => this.app.showView('brainstorming'));
        this.addRoute('settings', () => this.app.showView('settings'));
        
        // Handle browser navigation
        window.addEventListener('hashchange', this.handleHashChange);
        
        // Handle initial route
        this.handleRoute();
    }
    
    addRoute(path, handler) {
        this.routes.set(path, handler);
    }
    
    navigate(path) {
        // Update URL hash
        window.location.hash = path;
    }
    
    handleHashChange() {
        this.handleRoute();
    }
    
    handleRoute() {
        // Get current path from hash
        const hash = window.location.hash.replace('#', '');
        const path = hash || 'welcome';
        
        // Check for character detail routes (character/ID)
        if (path.startsWith('character/')) {
            try {
                this.currentRoute = path;
                this.app.showView(path);
                
                // Update navigation state for characters
                this.updateNavigation('characters');
                
                // Emit route changed event
                if (this.app.events) {
                    this.app.events.emit('route-changed', { path });
                }
                return;
            } catch (error) {
                console.error(`Failed to load character route "${path}":`, error);
                this.showError('Failed to load character page. Please try again.');
                return;
            }
        }
        
        // Check for script editor routes (scripts/ID)
        if (path.startsWith('scripts/')) {
            try {
                this.currentRoute = path;
                this.app.showView(path);
                
                // Update navigation state for scripts
                this.updateNavigation('scripts');
                
                // Emit route changed event
                if (this.app.events) {
                    this.app.events.emit('route-changed', { path });
                }
                return;
            } catch (error) {
                console.error(`Failed to load script route "${path}":`, error);
                this.showError('Failed to load script editor. Please try again.');
                return;
            }
        }
        
        // Check for theme detail routes (theme/ID)
        if (path.startsWith('theme/')) {
            try {
                this.currentRoute = path;
                this.app.showView(path);
                
                // Update navigation state for themes
                this.updateNavigation('themes');
                
                // Emit route changed event
                if (this.app.events) {
                    this.app.events.emit('route-changed', { path });
                }
                return;
            } catch (error) {
                console.error(`Failed to load theme route "${path}":`, error);
                this.showError('Failed to load theme page. Please try again.');
                return;
            }
        }
        
        // Find matching route
        const handler = this.routes.get(path);
        
        if (handler) {
            try {
                this.currentRoute = path;
                handler();
                
                // Update navigation state
                this.updateNavigation(path);
                
                // Emit route changed event
                if (this.app.events) {
                    this.app.events.emit('route-changed', { path });
                }
                
            } catch (error) {
                console.error(`Failed to load route "${path}":`, error);
                this.showError('Failed to load page. Please try again.');
            }
        } else {
            console.error(`No route found for path: ${path}`);
            this.navigate('welcome');
        }
    }
    
    updateNavigation(currentPath) {
        // Update active nav item
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            const view = item.dataset.view;
            if (view === currentPath) {
                item.classList.add('active');
                item.style.background = 'var(--primary)';
                item.style.color = 'white';
            } else {
                item.classList.remove('active');
                item.style.background = 'none';
                item.style.color = 'var(--text-secondary)';
            }
        });
    }
    
    getCurrentRoute() {
        return this.currentRoute;
    }
    
    showError(message) {
        const content = document.getElementById('content');
        if (content) {
            content.innerHTML = `
                <div class="error-view" style="text-align: center; padding: 2rem;">
                    <h2>Navigation Error</h2>
                    <p>${message}</p>
                    <button onclick="window.app.router.navigate('welcome')" class="btn btn-primary" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #2563eb; color: white; border: none; border-radius: 0.375rem; cursor: pointer;">
                        Go Home
                    </button>
                </div>
            `;
        }
    }
}