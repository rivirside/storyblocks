// State Management for Multi-Story World Building
class MultiStoryStateManager {
    constructor() {
        // World-level state structure
        this.state = {
            // World metadata
            world: {
                id: null,
                title: 'My Story World',
                description: '',
                created: new Date().toISOString(),
                lastModified: new Date().toISOString(),
                settings: {
                    defaultStoryType: 'novel',
                    autoSave: true,
                    autoSaveInterval: 30
                }
            },
            
            // World-building elements (shared across all productions)
            characters: new Map(),
            locations: new Map(),
            themes: new Map(),
            plots: new Map(),        // Reusable plot templates
            arcs: new Map(),         // Character/story arc templates
            lore: new Map(),         // World rules/history/magic systems
            
            // Production elements (individual stories/movies/series)
            productions: new Map(),  // Was 'stories'
            activeProductionId: null,
            
            // Production-specific elements
            scripts: new Map(),          // Scripts/screenplays for each production
            screenplays: new Map(),      // Screenplay for each production
            timelines: new Map(),        // Timeline for each production
            events: new Map(),           // Production-specific events
            
            // Character production data (per character, per production)
            characterProductionData: new Map(), // Map<characterId, Map<productionId, CharacterProductionData>>
            
            // Location production data (per location, per production)
            locationProductionData: new Map(),  // Map<locationId, Map<productionId, LocationProductionData>>
            
            // UI state
            ui: {
                currentView: 'world-overview',
                selectedProductionId: null,
                navigationMode: 'world', // 'world' or 'production',
                selectedItems: new Set(),
                filters: {
                    stories: { type: 'all', status: 'all' },
                    characters: { hasRole: 'all', tags: [] },
                    events: { story: 'current', type: 'all' },
                    timeline: { story: 'current', scale: 'story' }
                },
                preferences: {
                    theme: 'light',
                    sidebarCollapsed: false,
                    showWorldElements: true,
                    storyViewMode: 'tabs' // 'tabs' or 'dropdown'
                }
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
                self.emit('state-changed', { 
                    property: prop, 
                    value, 
                    oldValue,
                    context: self.activeProductionId ? 'production' : 'world'
                });
                
                return true;
            },
            
            get(obj, prop) {
                if (typeof obj[prop] === 'object' && obj[prop] !== null && 
                    !(obj[prop] instanceof Map) && !(obj[prop] instanceof Set)) {
                    return self.createProxy(obj[prop]);
                }
                return obj[prop];
            }
        });
    }

    // Event system
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

    // Production Management Methods
    createProduction(productionData) {
        const production = {
            id: `prod-${Date.now()}`,
            title: productionData.title || 'Untitled Production',
            type: productionData.type || 'movie', // movie, tv_series, short_series, web_series, play
            status: 'concept', // concept, pre-production, production, post-production, complete
            description: productionData.description || '',
            premise: productionData.premise || '',
            logline: productionData.logline || '',
            
            // Production metadata
            created: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            
            // Production structure
            format: productionData.format || {
                type: productionData.type,
                episodes: null,
                seasons: null,
                runtime: null,
                pages: null
            },
            
            // Production elements
            screenplayId: null,      // Main screenplay
            episodeIds: [],          // For series - multiple screenplays
            timelineId: null,
            castIds: [],             // Character IDs in this production
            locationIds: [],         // Location IDs used
            plotIds: [],             // Plot templates used
            arcIds: [],              // Arc templates used
            themeIds: [],            // Themes explored
            
            // Production settings
            settings: {
                genre: productionData.genre || [],
                targetAudience: productionData.targetAudience || '',
                rating: productionData.rating || '',
                budget: productionData.budget || '',
                distributionPlatform: productionData.platform || ''
            },
            
            // Production statistics
            statistics: {
                pageCount: 0,
                sceneCount: 0,
                characterCount: 0,
                locationCount: 0,
                estimatedRuntime: 0
            }
        };
        
        this.state.productions.set(production.id, production);
        
        // Create a timeline for this production
        const timeline = this.createTimeline({
            productionId: production.id,
            title: `${production.title} Timeline`
        });
        production.timelineId = timeline.id;
        
        // Create a screenplay for this production
        const screenplay = this.createScreenplay({
            productionId: production.id,
            title: production.title,
            type: production.type
        });
        production.screenplayId = screenplay.id;
        
        this.emit('production-created', production);
        this.emit('data-changed', { type: 'production', action: 'create', data: production });
        
        return production;
    }

    setActiveProduction(productionId) {
        if (productionId && !this.state.productions.has(productionId)) {
            throw new Error(`Production ${productionId} not found`);
        }
        
        const oldProductionId = this.state.activeProductionId;
        this.state.activeProductionId = productionId;
        this.state.ui.selectedProductionId = productionId;
        
        this.emit('active-production-changed', { 
            newProductionId: productionId, 
            oldProductionId,
            production: productionId ? this.state.productions.get(productionId) : null
        });
    }

    getActiveProduction() {
        return this.state.activeProductionId ? 
            this.state.productions.get(this.state.activeProductionId) : null;
    }
    
    // Alias for backward compatibility
    getActiveStory() {
        return this.getActiveProduction();
    }

    updateProduction(productionId, updates) {
        const production = this.state.productions.get(productionId);
        if (!production) throw new Error(`Production ${productionId} not found`);
        
        Object.assign(production, updates);
        production.lastModified = new Date().toISOString();
        
        this.emit('production-updated', production);
        this.emit('data-changed', { type: 'production', action: 'update', data: production });
    }

    deleteProduction(productionId) {
        const production = this.state.productions.get(productionId);
        if (!production) return;
        
        // Delete associated timeline
        if (production.timelineId) {
            this.state.timelines.delete(production.timelineId);
        }
        
        // Delete associated screenplay
        if (production.screenplayId) {
            this.state.screenplays.delete(production.screenplayId);
        }
        
        // Delete production-specific events
        const productionEvents = Array.from(this.state.events.values())
            .filter(event => event.productionId === productionId);
        productionEvents.forEach(event => this.state.events.delete(event.id));
        
        // Remove production
        this.state.productions.delete(productionId);
        
        // Clear active production if it was deleted
        if (this.state.activeProductionId === productionId) {
            this.setActiveProduction(null);
        }
        
        this.emit('production-deleted', production);
        this.emit('data-changed', { type: 'production', action: 'delete', data: production });
    }

    // Character Methods (Multi-Story Support)
    addCharacter(character) {
        // Core character data (shared across all stories)
        const char = {
            id: character.id || `char-${Date.now()}`,
            name: character.name,
            
            // World-level character info
            description: character.description,
            appearance: character.appearance,
            personality: character.personality,
            background: character.background,
            
            // World-level metadata
            created: character.created || new Date().toISOString(),
            lastModified: new Date().toISOString(),
            tags: character.tags || [],
            notes: character.notes || '',
            
            // Production participation
            productionIds: [], // Which productions this character appears in
            
            // Character files (documents, notes, references)
            files: [] // Array of file objects
        };
        
        this.state.characters.set(char.id, char);
        this.emit('character-added', char);
        this.emit('data-changed', { type: 'character', action: 'add', data: char });
        
        return char;
    }

    // Add character to a specific production
    addCharacterToProduction(characterId, productionId, productionData = {}) {
        const character = this.state.characters.get(characterId);
        const production = this.state.productions.get(productionId);
        
        if (!character) throw new Error(`Character ${characterId} not found`);
        if (!production) throw new Error(`Production ${productionId} not found`);
        
        // Initialize character production data map if needed
        if (!this.state.characterProductionData.has(characterId)) {
            this.state.characterProductionData.set(characterId, new Map());
        }
        
        const characterProductionMap = this.state.characterProductionData.get(characterId);
        
        // Create production-specific character data
        const charProductionData = {
            characterId,
            productionId,
            
            // Production-specific character info
            role: productionData.role || 'supporting', // protagonist, antagonist, supporting, minor
            importance: productionData.importance || 3,
            status: productionData.status || 'active',
            
            // Production-specific development
            arc: productionData.arc || '',
            motivation: productionData.motivation || '',
            conflict: productionData.conflict || '',
            resolution: productionData.resolution || '',
            
            // Production-specific relationships
            relationships: productionData.relationships || new Map(),
            
            // Entry/exit points in production
            firstAppearance: productionData.firstAppearance || null,
            lastAppearance: productionData.lastAppearance || null,
            
            // Production-specific notes
            productionNotes: productionData.productionNotes || ''
        };
        
        characterProductionMap.set(productionId, charProductionData);
        
        // Update character's production list
        if (!character.productionIds.includes(productionId)) {
            character.productionIds.push(productionId);
        }
        
        // Update production's cast list
        if (!production.castIds.includes(characterId)) {
            production.castIds.push(characterId);
        }
        
        this.emit('character-added-to-production', { characterId, productionId, data: charProductionData });
        this.emit('data-changed', { 
            type: 'character-production', 
            action: 'add', 
            data: charProductionData 
        });
        
        return charProductionData;
    }
    
    // Alias for backward compatibility
    addCharacterToStory(characterId, storyId, storyData = {}) {
        return this.addCharacterToProduction(characterId, storyId, storyData);
    }

    updateCharacterInProduction(characterId, productionId, updates) {
        const charProductionMap = this.state.characterProductionData.get(characterId);
        if (!charProductionMap) throw new Error(`Character ${characterId} has no production data`);
        
        const charProductionData = charProductionMap.get(productionId);
        if (!charProductionData) throw new Error(`Character ${characterId} not in production ${productionId}`);
        
        Object.assign(charProductionData, updates);
        
        this.emit('character-production-updated', { characterId, productionId, data: charProductionData });
        this.emit('data-changed', { 
            type: 'character-production', 
            action: 'update', 
            data: charProductionData 
        });
    }
    
    // Alias for backward compatibility
    updateCharacterInStory(characterId, storyId, updates) {
        return this.updateCharacterInProduction(characterId, storyId, updates);
    }

    getCharacterProductionData(characterId, productionId) {
        const charProductionMap = this.state.characterProductionData.get(characterId);
        return charProductionMap ? charProductionMap.get(productionId) : null;
    }
    
    // Alias for backward compatibility
    getCharacterStoryData(characterId, storyId) {
        return this.getCharacterProductionData(characterId, storyId);
    }

    getCharactersInProduction(productionId) {
        const production = this.state.productions.get(productionId);
        if (!production) return [];
        
        return production.castIds.map(id => {
            const character = this.state.characters.get(id);
            const productionData = this.getCharacterProductionData(id, productionId);
            return {
                ...character,
                productionData
            };
        });
    }

    // Screenplay Methods
    createScreenplay(data) {
        const screenplay = {
            id: `screenplay-${Date.now()}`,
            productionId: data.productionId,
            title: data.title || 'Untitled Screenplay',
            type: data.type || 'movie',
            content: data.content || '',
            scenes: [],
            format: {
                pageCount: 0,
                estimatedRuntime: 0,
                sceneCount: 0
            },
            created: new Date().toISOString(),
            lastModified: new Date().toISOString()
        };
        
        this.state.screenplays.set(screenplay.id, screenplay);
        this.emit('screenplay-created', screenplay);
        
        return screenplay;
    }
    
    // Timeline Methods (Per Production)
    createTimeline(data) {
        const timeline = {
            id: `timeline-${Date.now()}`,
            productionId: data.productionId,
            title: data.title || 'Timeline',
            scale: data.scale || 'production',
            events: [], // Event IDs
            created: new Date().toISOString(),
            lastModified: new Date().toISOString()
        };
        
        this.state.timelines.set(timeline.id, timeline);
        this.emit('timeline-created', timeline);
        
        return timeline;
    }

    // Event Methods (Production-Specific)
    addEvent(event) {
        const evt = {
            id: event.id || `event-${Date.now()}`,
            productionId: event.productionId || this.state.activeProductionId,
            
            // Event data
            title: event.title,
            description: event.description,
            type: event.type, // character, plot, world, milestone
            
            // Timing
            storyTime: event.storyTime,
            realTime: event.realTime,
            chapter: event.chapter,
            scene: event.scene,
            duration: event.duration,
            
            // Participants
            characterIds: event.characterIds || [],
            locationId: event.locationId,
            
            // Metadata
            importance: event.importance || 3,
            tags: event.tags || [],
            created: event.created || new Date().toISOString(),
            lastModified: new Date().toISOString()
        };
        
        this.state.events.set(evt.id, evt);
        
        // Add to production's timeline
        if (evt.productionId) {
            const production = this.state.productions.get(evt.productionId);
            if (production && production.timelineId) {
                const timeline = this.state.timelines.get(production.timelineId);
                if (timeline && !timeline.events.includes(evt.id)) {
                    timeline.events.push(evt.id);
                }
            }
        }
        
        this.emit('event-added', evt);
        this.emit('data-changed', { type: 'event', action: 'add', data: evt });
        
        return evt;
    }

    getEventsForProduction(productionId) {
        return Array.from(this.state.events.values())
            .filter(event => event.productionId === productionId);
    }

    // Location Methods (World-Building)
    createLocation(locationData) {
        const location = {
            id: `loc-${Date.now()}`,
            name: locationData.name || 'Unnamed Location',
            type: locationData.type || 'generic', // city, building, room, outdoor, landmark
            description: locationData.description || '',
            
            // Physical details
            geography: locationData.geography || '',
            appearance: locationData.appearance || '',
            atmosphere: locationData.atmosphere || '',
            
            // World context
            history: locationData.history || '',
            significance: locationData.significance || '',
            
            // Production usage
            productionIds: [],
            
            // Metadata
            tags: locationData.tags || [],
            created: new Date().toISOString(),
            lastModified: new Date().toISOString()
        };
        
        this.state.locations.set(location.id, location);
        this.emit('location-created', location);
        
        return location;
    }
    
    // Theme Methods (World-Building)
    createTheme(themeData) {
        const theme = {
            id: `theme-${Date.now()}`,
            title: themeData.title || 'Untitled Theme',
            description: themeData.description || '',
            category: themeData.category || 'universal', // universal, moral, social, personal
            
            // Theme exploration
            statement: themeData.statement || '',
            questions: themeData.questions || [],
            symbols: themeData.symbols || [],
            
            // Files and notes
            files: themeData.files || [],
            
            // Production usage
            productionIds: [],
            
            // Metadata
            tags: themeData.tags || [],
            created: new Date().toISOString(),
            lastModified: new Date().toISOString()
        };
        
        this.state.themes.set(theme.id, theme);
        this.emit('theme-created', theme);
        
        return theme;
    }
    
    // Plot Methods (Reusable Templates)
    createPlot(plotData) {
        const plot = {
            id: `plot-${Date.now()}`,
            title: plotData.title || 'Untitled Plot',
            description: plotData.description || '',
            type: plotData.type || 'main', // main, subplot, parallel
            
            // Plot structure
            structure: {
                hook: plotData.hook || '',
                incitingIncident: plotData.incitingIncident || '',
                risingAction: plotData.risingAction || [],
                climax: plotData.climax || '',
                fallingAction: plotData.fallingAction || [],
                resolution: plotData.resolution || ''
            },
            
            // Reusable template
            isTemplate: plotData.isTemplate || true,
            productionIds: [],
            
            // Files and notes
            files: plotData.files || [],
            
            // Metadata
            tags: plotData.tags || [],
            created: new Date().toISOString(),
            lastModified: new Date().toISOString()
        };
        
        this.state.plots.set(plot.id, plot);
        this.emit('plot-created', plot);
        
        return plot;
    }
    
    // Arc Methods (Character/Story Arc Templates)
    createArc(arcData) {
        const arc = {
            id: `arc-${Date.now()}`,
            title: arcData.title || 'Untitled Arc',
            description: arcData.description || '',
            type: arcData.type || 'character', // character, story, relationship
            
            // Arc structure
            stages: arcData.stages || [
                { name: 'Setup', description: '' },
                { name: 'Catalyst', description: '' },
                { name: 'Development', description: '' },
                { name: 'Crisis', description: '' },
                { name: 'Resolution', description: '' }
            ],
            
            // Reusable template
            isTemplate: arcData.isTemplate || true,
            productionIds: [],
            
            // Files and notes
            files: arcData.files || [],
            
            // Metadata
            tags: arcData.tags || [],
            created: new Date().toISOString(),
            lastModified: new Date().toISOString()
        };
        
        this.state.arcs.set(arc.id, arc);
        this.emit('arc-created', arc);
        
        return arc;
    }

    // Export state for persistence
    exportState() {
        return {
            world: this.state.world,
            productions: Object.fromEntries(this.state.productions || new Map()),
            activeProductionId: this.state.activeProductionId,
            scripts: Object.fromEntries(this.state.scripts || new Map()),
            screenplays: Object.fromEntries(this.state.screenplays || new Map()),
            characters: Object.fromEntries(this.state.characters || new Map()),
            locations: Object.fromEntries(this.state.locations || new Map()),
            themes: Object.fromEntries(this.state.themes || new Map()),
            plots: Object.fromEntries(this.state.plots || new Map()),
            arcs: Object.fromEntries(this.state.arcs || new Map()),
            lore: Object.fromEntries(this.state.lore || new Map()),
            timelines: Object.fromEntries(this.state.timelines || new Map()),
            events: Object.fromEntries(this.state.events || new Map()),
            characterProductionData: Object.fromEntries(
                Array.from((this.state.characterProductionData || new Map()).entries()).map(([charId, prodMap]) => [
                    charId,
                    Object.fromEntries(prodMap || new Map())
                ])
            ),
            locationProductionData: Object.fromEntries(
                Array.from((this.state.locationProductionData || new Map()).entries()).map(([locId, prodMap]) => [
                    locId,
                    Object.fromEntries(prodMap || new Map())
                ])
            ),
            ui: this.state.ui || {}
        };
    }

    // Import state from persistence
    importState(data) {
        this.state.world = data.world || this.state.world;
        this.state.productions = new Map(Object.entries(data.productions || {}));
        this.state.activeProductionId = data.activeProductionId;
        this.state.scripts = new Map(Object.entries(data.scripts || {}));
        this.state.screenplays = new Map(Object.entries(data.screenplays || {}));
        this.state.characters = new Map(Object.entries(data.characters || {}));
        this.state.locations = new Map(Object.entries(data.locations || {}));
        this.state.themes = new Map(Object.entries(data.themes || {}));
        this.state.plots = new Map(Object.entries(data.plots || {}));
        this.state.arcs = new Map(Object.entries(data.arcs || {}));
        this.state.lore = new Map(Object.entries(data.lore || {}));
        this.state.timelines = new Map(Object.entries(data.timelines || {}));
        this.state.events = new Map(Object.entries(data.events || {}));
        
        // Import character production data
        this.state.characterProductionData = new Map();
        if (data.characterProductionData) {
            Object.entries(data.characterProductionData).forEach(([charId, prodData]) => {
                this.state.characterProductionData.set(charId, new Map(Object.entries(prodData)));
            });
        }
        
        // Import location production data
        this.state.locationProductionData = new Map();
        if (data.locationProductionData) {
            Object.entries(data.locationProductionData).forEach(([locId, prodData]) => {
                this.state.locationProductionData.set(locId, new Map(Object.entries(prodData)));
            });
        }
        
        this.state.ui = data.ui || this.state.ui;
        
        this.emit('state-imported', data);
    }
}