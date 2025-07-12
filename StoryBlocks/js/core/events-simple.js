// Event Bus (Simple version - no ES modules)
class EventBus {
    constructor() {
        this.events = new Map();
        this.onceEvents = new Map();
    }
    
    on(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, new Set());
        }
        this.events.get(event).add(callback);
        
        // Return unsubscribe function
        return () => this.off(event, callback);
    }
    
    once(event, callback) {
        const wrappedCallback = (...args) => {
            callback(...args);
            this.off(event, wrappedCallback);
        };
        
        if (!this.onceEvents.has(event)) {
            this.onceEvents.set(event, new Map());
        }
        this.onceEvents.get(event).set(callback, wrappedCallback);
        
        return this.on(event, wrappedCallback);
    }
    
    off(event, callback) {
        // Remove from regular events
        if (this.events.has(event)) {
            this.events.get(event).delete(callback);
            if (this.events.get(event).size === 0) {
                this.events.delete(event);
            }
        }
        
        // Remove from once events
        if (this.onceEvents.has(event)) {
            const onceMap = this.onceEvents.get(event);
            if (onceMap.has(callback)) {
                const wrappedCallback = onceMap.get(callback);
                this.off(event, wrappedCallback);
                onceMap.delete(callback);
            }
            if (onceMap.size === 0) {
                this.onceEvents.delete(event);
            }
        }
    }
    
    emit(event, ...args) {
        if (this.events.has(event)) {
            this.events.get(event).forEach(callback => {
                try {
                    callback(...args);
                } catch (error) {
                    console.error(`Error in event handler for "${event}":`, error);
                }
            });
        }
    }
    
    emitAsync(event, ...args) {
        return Promise.all(
            Array.from(this.events.get(event) || []).map(callback => {
                return Promise.resolve().then(() => callback(...args));
            })
        );
    }
    
    clear(event) {
        if (event) {
            this.events.delete(event);
            this.onceEvents.delete(event);
        } else {
            this.events.clear();
            this.onceEvents.clear();
        }
    }
    
    hasListeners(event) {
        return this.events.has(event) && this.events.get(event).size > 0;
    }
    
    listenerCount(event) {
        return this.events.has(event) ? this.events.get(event).size : 0;
    }
}

// Common event names
const Events = {
    // Navigation
    NAVIGATE: 'navigate',
    ROUTE_CHANGED: 'route-changed',
    
    // Project
    PROJECT_CREATED: 'project-created',
    PROJECT_LOADED: 'project-loaded',
    PROJECT_SAVED: 'project-saved',
    PROJECT_CLOSED: 'project-closed',
    
    // Data changes
    DATA_CHANGED: 'data-changed',
    CHARACTER_ADDED: 'character-added',
    CHARACTER_UPDATED: 'character-updated',
    CHARACTER_DELETED: 'character-deleted',
    EVENT_ADDED: 'event-added',
    EVENT_UPDATED: 'event-updated',
    EVENT_DELETED: 'event-deleted',
    TIMELINE_UPDATED: 'timeline-updated',
    
    // UI
    MODAL_OPEN: 'modal-open',
    MODAL_CLOSE: 'modal-close',
    SIDEBAR_TOGGLE: 'sidebar-toggle',
    THEME_CHANGED: 'theme-changed',
    SEARCH_FOCUS: 'search-focus',
    
    // Actions
    SAVE_CURRENT: 'save-current',
    CREATE_NEW: 'create-new',
    DELETE_SELECTED: 'delete-selected',
    
    // Errors
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
};