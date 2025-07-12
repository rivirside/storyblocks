// State Management (Simple version - no ES modules)
class StateManager {
    constructor() {
        // Initial state structure
        this.state = {
            project: null,
            characters: new Map(),
            locations: new Map(),
            events: new Map(),
            timelines: new Map(),
            themes: new Map(),
            plots: new Map(),
            scripts: new Map(),
            relationships: new Map(),
            ui: {
                currentView: 'welcome',
                selectedItems: new Set(),
                filters: {
                    characters: { status: 'all', tags: [] },
                    events: { scale: 'all', tags: [] },
                    timeline: { scale: 'story', range: null }
                },
                preferences: {
                    theme: 'light',
                    sidebarCollapsed: false,
                    autoSave: true,
                    notifications: true
                }
            },
            metadata: {
                lastSaved: null,
                version: '1.0.0',
                dataStructure: 'v1'
            }
        };

        // Create reactive proxy
        this.proxy = this.createProxy(this.state);
        this.listeners = new Map();
    }

    createProxy(target) {
        const self = this;
        return new Proxy(target, {
            set(obj, prop, value) {
                const oldValue = obj[prop];
                obj[prop] = value;
                
                // Emit change event
                self.emit('state-changed', { property: prop, value, oldValue });
                
                return true;
            },
            
            get(obj, prop) {
                if (typeof obj[prop] === 'object' && obj[prop] !== null && !(obj[prop] instanceof Map) && !(obj[prop] instanceof Set)) {
                    return self.createProxy(obj[prop]);
                }
                return obj[prop];
            }
        });
    }

    // Event system for state changes
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(callback);
    }

    off(event, callback) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).delete(callback);
        }
    }

    emit(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in state listener for "${event}":`, error);
                }
            });
        }
    }

    // State getters
    getState() {
        return this.proxy;
    }

    exportState() {
        return JSON.parse(JSON.stringify(this.state, (key, value) => {
            if (value instanceof Map) {
                return Object.fromEntries(value);
            }
            if (value instanceof Set) {
                return Array.from(value);
            }
            return value;
        }));
    }

    // Project methods
    setProject(project) {
        this.state.project = project;
        this.emit('project-changed', project);
    }

    // Character methods
    addCharacter(character) {
        this.state.characters.set(character.id, character);
        this.emit('character-added', character);
        this.emit('data-changed', { type: 'character', action: 'add', data: character });
    }

    updateCharacter(id, updates) {
        const character = this.state.characters.get(id);
        if (character) {
            Object.assign(character, updates);
            character.lastModified = new Date().toISOString();
            this.emit('character-updated', character);
            this.emit('data-changed', { type: 'character', action: 'update', data: character });
        }
    }

    deleteCharacter(id) {
        const character = this.state.characters.get(id);
        if (character) {
            this.state.characters.delete(id);
            this.emit('character-deleted', character);
            this.emit('data-changed', { type: 'character', action: 'delete', data: character });
        }
    }

    getCharacter(id) {
        return this.state.characters.get(id);
    }

    // Event methods
    addEvent(event) {
        this.state.events.set(event.id, event);
        this.emit('event-added', event);
        this.emit('data-changed', { type: 'event', action: 'add', data: event });
    }

    updateEvent(id, updates) {
        const event = this.state.events.get(id);
        if (event) {
            Object.assign(event, updates);
            event.lastModified = new Date().toISOString();
            this.emit('event-updated', event);
            this.emit('data-changed', { type: 'event', action: 'update', data: event });
        }
    }

    deleteEvent(id) {
        const event = this.state.events.get(id);
        if (event) {
            this.state.events.delete(id);
            this.emit('event-deleted', event);
            this.emit('data-changed', { type: 'event', action: 'delete', data: event });
        }
    }

    // Location methods
    addLocation(location) {
        this.state.locations.set(location.id, location);
        this.emit('location-added', location);
        this.emit('data-changed', { type: 'location', action: 'add', data: location });
    }

    updateLocation(id, updates) {
        const location = this.state.locations.get(id);
        if (location) {
            Object.assign(location, updates);
            location.lastModified = new Date().toISOString();
            this.emit('location-updated', location);
            this.emit('data-changed', { type: 'location', action: 'update', data: location });
        }
    }

    deleteLocation(id) {
        const location = this.state.locations.get(id);
        if (location) {
            this.state.locations.delete(id);
            this.emit('location-deleted', location);
            this.emit('data-changed', { type: 'location', action: 'delete', data: location });
        }
    }

    // Timeline methods
    addTimeline(timeline) {
        this.state.timelines.set(timeline.id, timeline);
        this.emit('timeline-added', timeline);
        this.emit('data-changed', { type: 'timeline', action: 'add', data: timeline });
    }

    // UI state methods
    setCurrentView(view) {
        this.state.ui.currentView = view;
        this.emit('view-changed', view);
    }

    setFilter(type, filter) {
        this.state.ui.filters[type] = { ...this.state.ui.filters[type], ...filter };
        this.emit('filter-changed', { type, filter: this.state.ui.filters[type] });
    }

    setPreference(key, value) {
        this.state.ui.preferences[key] = value;
        this.emit('preference-changed', { key, value });
    }
}