// StoryBlocks Multi-Script Application
console.log('[StoryBlocks] Multi-script app starting...');

class StoryBlocks {
    constructor() {
        console.log('[StoryBlocks] Constructor called');
        this.currentStep = 0;
        this.initSteps = [
            'Checking browser compatibility',
            'Creating core services',
            'Loading existing data',
            'Creating user interface',
            'Setting up navigation',
            'Initializing views',
            'Application ready'
        ];
        
        // Initialize core services
        this.state = new MultiStoryStateManager();
        this.events = new EventBus();
        this.router = new SimpleRouter(this);
        this.persistence = new PersistenceManager(this.state);
        
        // Initialize components
        this.productionSelector = new ProductionSelector(this);
        this.characterEditor = new MultiStoryCharacterEditor(this);
        
        // Initialize views
        this.charactersView = new CharactersView(this);
        this.characterDetailView = new CharacterDetailView(this);
        this.locationsView = new LocationsView(this);
        this.locationDetailView = new LocationDetailView(this);
        this.plotDetailView = new PlotDetailView(this);
        this.arcDetailView = new ArcDetailView(this);
        this.timelineView = new TimelineView(this);
        this.plotsView = new PlotsView(this);
        this.arcsView = new ArcsView(this);
        this.themesView = new ThemesView(this);
        this.loreView = new LoreView(this);
        this.scriptsView = new ScriptsView(this);
        this.scriptEditorView = new ScriptEditorView(this);
        this.brainstormingView = new BrainstormingView(this);
        this.settingsView = new SettingsView(this);
        this.themeDetailView = new ThemeDetailView(this);
        
        // Initialize utilities
        this.workspaceLoader = new WorkspaceLoader(this);
        
        this.init();
    }
    
    updateLoadingProgress(step, message = null) {
        this.currentStep = step;
        const progress = Math.round((step / this.initSteps.length) * 100);
        const stepMessage = message || this.initSteps[step - 1];
        
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            const progressBar = loadingScreen.querySelector('.progress-bar');
            const progressText = loadingScreen.querySelector('.progress-text');
            const stepText = loadingScreen.querySelector('.step-text');
            
            if (progressBar) progressBar.style.width = `${progress}%`;
            if (progressText) progressText.textContent = `${progress}%`;
            if (stepText) stepText.textContent = stepMessage;
        }
        
        console.log(`[StoryBlocks] Step ${step}/${this.initSteps.length}: ${stepMessage}`);
    }
    
    async init() {
        try {
            this.updateLoadingProgress(1);
            
            // Check browser compatibility
            if (!this.checkCompatibility()) {
                this.showCompatibilityError();
                return;
            }
            
            this.updateLoadingProgress(2);
            
            // Create core services
            this.setupEventListeners();
            
            this.updateLoadingProgress(3);
            
            // Load existing data
            await this.loadData();
            
            this.updateLoadingProgress(4);
            
            // Create basic UI
            this.render();
            
            this.updateLoadingProgress(5);
            
            // Setup navigation
            this.setupNavigation();
            
            this.updateLoadingProgress(6);
            
            // Initialize router
            this.router.init();
            
            // Apply saved settings
            if (this.settingsView) {
                this.settingsView.applySettings();
            }
            
            this.updateLoadingProgress(7, 'Application ready!');
            
            // Hide loading screen
            setTimeout(() => {
                this.hideLoadingScreen();
            }, 500);
            
        } catch (error) {
            console.error('Failed to initialize app:', error);
            console.error('Stack trace:', error.stack);
            
            // Force hide loading screen
            this.hideLoadingScreen();
            
            // Show error in the app container
            const app = document.getElementById('app');
            if (app) {
                app.innerHTML = `
                    <div style="padding: 2rem; max-width: 800px; margin: 0 auto; text-align: center;">
                        <h1 style="color: #dc2626;">⚠️ Loading Error</h1>
                        <p style="margin-bottom: 1rem;">StoryBlocks encountered an error during startup:</p>
                        <div style="background: #fee; padding: 1rem; border-radius: 0.5rem; text-align: left; margin-bottom: 1rem;">
                            <code>${error.message}</code>
                        </div>
                        <button onclick="location.reload()" style="padding: 0.5rem 1rem; background: #2563eb; color: white; border: none; border-radius: 0.25rem; cursor: pointer;">
                            Reload Page
                        </button>
                    </div>
                `;
            }
        }
    }
    
    checkCompatibility() {
        const hasLocalStorage = typeof Storage !== 'undefined';
        const hasCustomElements = 'customElements' in window;
        const hasFileAPI = 'File' in window;
        const hasProxy = typeof Proxy !== 'undefined';
        
        console.log('[StoryBlocks] Compatibility check:', {
            localStorage: hasLocalStorage,
            customElements: hasCustomElements,
            fileAPI: hasFileAPI,
            proxy: hasProxy
        });
        
        return hasLocalStorage && hasCustomElements && hasFileAPI && hasProxy;
    }
    
    setupEventListeners() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Cmd/Ctrl + S to save
            if ((e.metaKey || e.ctrlKey) && e.key === 's') {
                e.preventDefault();
                this.events.emit('save-current');
            }
            
            // Cmd/Ctrl + N for new
            if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
                e.preventDefault();
                this.events.emit('create-new');
            }
        });
        
        // Listen for navigation events
        this.events.on('navigate', (path) => {
            this.router.navigate(path);
        });
    }
    
    async loadData() {
        // Always start fresh - no auto-loading
        // Users must explicitly load or create a project
        console.log('[StoryBlocks] Starting fresh - no data loaded');
        
        // Clear any existing localStorage to ensure clean start
        localStorage.removeItem('storyblocks_state');
        localStorage.removeItem('storyblocks_data');
        
        // Initialize with empty state
        this.state.state.world = {
            title: '',
            description: '',
            themes: []
        };
        
        // Ensure all collections are initialized
        if (!this.state.state.productions) this.state.state.productions = new Map();
        if (!this.state.state.characters) this.state.state.characters = new Map();
        if (!this.state.state.locations) this.state.state.locations = new Map();
        if (!this.state.state.plots) this.state.state.plots = new Map();
        if (!this.state.state.themes) this.state.state.themes = new Map();
        if (!this.state.state.events) this.state.state.events = new Map();
        if (!this.state.state.scripts) this.state.state.scripts = new Map();
        if (!this.state.state.arcs) this.state.state.arcs = new Map();
        if (!this.state.state.lore) this.state.state.lore = new Map();
    }
    
    async loadSampleData() {
        // Create a sample world
        this.state.state.world.title = 'My Story World';
        this.state.state.world.description = 'A rich world full of possibilities';
        
        // Create sample productions
        const mainProduction = this.state.createProduction({
            title: 'The Dragon\'s Quest',
            type: 'movie',
            logline: 'When an ancient dragon awakens, a group of unlikely heroes must find legendary artifacts to save their world.',
            description: 'An epic fantasy adventure following young heroes on a quest to save their kingdom.',
            premise: 'Three unlikely companions discover they are the prophesied heroes who must unite the scattered dragon stones before the awakened dragon destroys their world.',
            genre: ['fantasy', 'adventure'],
            targetAudience: 'PG-13'
        });
        
        const tvSeries = this.state.createProduction({
            title: 'Chronicles of the Kingdom',
            type: 'tv_series',
            logline: 'The royal court navigates dangerous political waters while dark forces gather in the shadows.',
            description: 'A political drama set in the same world, focusing on court intrigue and power struggles.',
            premise: 'In the capital city, nobles vie for the throne while a secret society works to awaken ancient evils.',
            genre: ['fantasy', 'drama', 'political thriller'],
            targetAudience: 'TV-MA'
        });
        
        // Load some sample characters to demonstrate the interface
        const char1 = this.state.addCharacter({
            name: 'Aya Stone',
            description: 'A determined young woman with a mysterious past and untapped magical abilities.',
            personality: 'Brave, impulsive, fiercely loyal to friends',
            appearance: 'Tall, athletic build, dark hair with silver streaks, piercing green eyes',
            background: 'Orphaned at a young age, raised by the temple guardians',
            tags: ['main', 'protagonist', 'magical']
        });
        
        const char2 = this.state.addCharacter({
            name: 'Vera Chen',
            description: 'A skilled diplomat and Aya\'s childhood friend.',
            personality: 'Intelligent, cautious, diplomatic',
            appearance: 'Medium height, elegant bearing, long black hair, warm brown eyes',
            background: 'Daughter of the royal advisor, trained in politics from birth',
            tags: ['supporting', 'friend', 'noble']
        });
        
        const char3 = this.state.addCharacter({
            name: 'Marcus Drake',
            description: 'A powerful merchant prince with connections across the realm.',
            personality: 'Ambitious, charismatic, ruthlessly pragmatic',
            appearance: 'Tall, well-dressed, silver hair, calculating grey eyes',
            background: 'Built a trading empire from nothing, rumored to have dark dealings',
            tags: ['antagonist', 'merchant', 'powerful']
        });
        
        // Add characters to productions with different roles
        this.state.addCharacterToProduction(char1.id, mainProduction.id, {
            role: 'protagonist',
            importance: 5,
            arc: 'Discovers her magical heritage and learns to control her powers',
            motivation: 'Save her homeland and discover the truth about her parents'
        });
        
        this.state.addCharacterToProduction(char2.id, mainProduction.id, {
            role: 'deuteragonist',
            importance: 4,
            arc: 'Learns that diplomacy has limits and sometimes action is needed',
            motivation: 'Protect the kingdom through negotiation and alliances'
        });
        
        this.state.addCharacterToProduction(char3.id, mainProduction.id, {
            role: 'antagonist',
            importance: 4,
            arc: 'His past catches up with him as his empire crumbles',
            motivation: 'Gain ultimate power through control of ancient artifacts'
        });
        
        // Different roles in TV series
        this.state.addCharacterToProduction(char2.id, tvSeries.id, {
            role: 'protagonist',
            importance: 5,
            arc: 'Rises from advisor to power player in court politics',
            motivation: 'Reform the kingdom from within'
        });
        
        this.state.addCharacterToProduction(char3.id, tvSeries.id, {
            role: 'supporting',
            importance: 3,
            arc: 'Manipulates events from the shadows',
            motivation: 'Expand his influence into the royal court'
        });
        
        // Create sample locations
        const royalCourt = this.state.createLocation({
            name: 'Royal Court of Astoria',
            type: 'castle',
            description: 'The magnificent seat of power where political intrigue and courtly drama unfold.',
            geography: 'Located on a hill overlooking the capital city, surrounded by thick walls and gardens.',
            appearance: 'Grand stone architecture with soaring towers, stained glass windows, and marble halls.',
            atmosphere: 'Formal and tense, where every word carries weight and alliances shift like shadows.',
            significance: 'The center of political power and the primary setting for court intrigue.',
            history: 'Built 300 years ago by King Aldric the Great, expanded by successive rulers.',
            tags: ['castle', 'political', 'formal', 'ancient']
        });
        
        const shadowlands = this.state.createLocation({
            name: 'The Shadowlands',
            type: 'outdoor',
            description: 'Dark, mysterious lands where ancient magic still flows and dangerous creatures roam.',
            geography: 'Misty forests and rocky crags beyond the kingdom\'s borders.',
            appearance: 'Twisted trees, perpetual twilight, and an otherworldly quality to the light.',
            atmosphere: 'Ominous and magical, where reality seems fluid and danger lurks behind every tree.',
            significance: 'Source of dark magic and home to the artifacts that Malachar seeks.',
            history: 'Once a thriving magical realm, corrupted centuries ago by a catastrophic magical event.',
            tags: ['magical', 'dangerous', 'mysterious', 'ancient']
        });
        
        // Create sample plots
        const courtIntrigue = this.state.createPlot({
            title: 'Court Intrigue and Political Maneuvering',
            type: 'main',
            description: 'A complex web of political alliances, betrayals, and power struggles within the royal court.',
            hook: 'A mysterious threat forces unlikely allies to work together.',
            incitingIncident: 'Ancient artifacts begin manifesting dangerous power.',
            risingAction: ['Secret alliances form', 'Betrayals are revealed', 'Political tensions escalate'],
            climax: 'The true scope of Malachar\'s plan is revealed in a dramatic confrontation.',
            fallingAction: ['Heroes must overcome their differences', 'Final preparations for the ultimate battle'],
            resolution: 'The realm is saved, but at great cost, and new alliances are forged.',
            tags: ['political', 'intrigue', 'betrayal']
        });
        
        const magicalCorruption = this.state.createPlot({
            title: 'The Corruption of Ancient Magic',
            type: 'subplot',
            description: 'The discovery and consequences of ancient magical artifacts that threaten the realm.',
            hook: 'Magical disturbances begin affecting the kingdom.',
            incitingIncident: 'An artifact is discovered with immense but dangerous power.',
            climax: 'The artifacts must be contained or destroyed to prevent catastrophe.',
            resolution: 'The magical threat is neutralized, but at great personal cost.',
            tags: ['magical', 'ancient', 'corruption']
        });
        
        // Create sample arcs
        const heroicArc = this.state.createArc({
            title: 'Classic Hero\'s Journey',
            type: 'character',
            description: 'A character\'s transformation from ordinary person to hero through trials and growth.',
            stages: [
                { name: 'Call to Adventure', description: 'The hero is called to face a challenge' },
                { name: 'Refusal of the Call', description: 'Initial hesitation or fear of the unknown' },
                { name: 'Meeting the Mentor', description: 'Guidance is provided by a wise figure' },
                { name: 'Crossing the Threshold', description: 'Commitment to the journey begins' },
                { name: 'Tests and Trials', description: 'The hero faces challenges and learns' },
                { name: 'Revelation', description: 'A major truth or realization is discovered' },
                { name: 'Transformation', description: 'The hero emerges changed and empowered' },
                { name: 'Return', description: 'The hero returns with wisdom to help others' }
            ],
            tags: ['classic', 'hero', 'growth']
        });
        
        const redemptionArc = this.state.createArc({
            title: 'Redemption Arc',
            type: 'character',
            description: 'A character\'s journey from darkness to light, making amends for past wrongs.',
            stages: [
                { name: 'The Fall', description: 'Character makes choices that lead to downfall' },
                { name: 'Rock Bottom', description: 'Character faces the consequences of their actions' },
                { name: 'Recognition', description: 'Character acknowledges their wrongdoing' },
                { name: 'Desire to Change', description: 'Character genuinely wants to make amends' },
                { name: 'Action', description: 'Character takes concrete steps toward redemption' },
                { name: 'Sacrifice', description: 'Character proves their change through sacrifice' },
                { name: 'Acceptance', description: 'Character and others accept the redemption' }
            ],
            tags: ['redemption', 'transformation', 'sacrifice']
        });

        // Set the main production as active
        this.state.setActiveProduction(mainProduction.id);
    }
    
    showCompatibilityError() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="compatibility-error" style="padding: 2rem; text-align: center;">
                <h1>Browser Not Supported</h1>
                <p>StoryBlocks requires a modern browser with:</p>
                <ul style="text-align: left; display: inline-block;">
                    <li>Local Storage</li>
                    <li>Web Components</li>
                    <li>File API</li>
                    <li>Proxy Support</li>
                </ul>
                <p>Please use Chrome 60+, Firefox 63+, or Safari 11+ for the best experience.</p>
            </div>
        `;
    }
    
    render() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <header class="app-header" style="height: 60px; background: var(--surface); border-bottom: 1px solid var(--border); display: flex; align-items: center; padding: 0 1rem;">
                <h1 style="margin: 0; font-size: 1.5rem; color: var(--primary);">StoryBlocks</h1>
                ${this.productionSelector.render()}
                <span style="margin-left: auto; color: var(--text-secondary); font-size: 0.875rem;">World Building Platform</span>
            </header>
            <div class="main-layout" style="display: flex; flex: 1; overflow: hidden;">
                <nav class="sidebar" style="width: 260px; background: var(--surface); border-right: 1px solid var(--border); padding: 1rem;">
                    <div class="nav-section">
                        <h3 style="font-size: 0.875rem; color: var(--text-tertiary); margin-bottom: 0.5rem;">OVERVIEW</h3>
                        <button class="nav-item" data-view="welcome" onclick="window.app.router.navigate('welcome')" style="display: block; width: 100%; padding: 0.5rem; margin-bottom: 0.25rem; background: none; color: var(--text-secondary); border: none; border-radius: 0.375rem; text-align: left; cursor: pointer;">
                            🏠 Home
                        </button>
                    </div>
                    
                    <div class="nav-section" style="margin-top: 1.5rem;">
                        <h3 style="font-size: 0.875rem; color: var(--text-tertiary); margin-bottom: 0.5rem;">WORLD BUILDING</h3>
                        <button class="nav-item" data-view="characters" onclick="window.app.router.navigate('characters')" style="display: block; width: 100%; padding: 0.5rem; margin-bottom: 0.25rem; background: none; color: var(--text-secondary); border: none; border-radius: 0.375rem; text-align: left; cursor: pointer;">
                            🎭 Characters
                        </button>
                        <button class="nav-item" data-view="locations" onclick="window.app.router.navigate('locations')" style="display: block; width: 100%; padding: 0.5rem; margin-bottom: 0.25rem; background: none; color: var(--text-secondary); border: none; border-radius: 0.375rem; text-align: left; cursor: pointer;">
                            🗺️ Locations
                        </button>
                        <button class="nav-item" data-view="timeline" onclick="window.app.router.navigate('timeline')" style="display: block; width: 100%; padding: 0.5rem; margin-bottom: 0.25rem; background: none; color: var(--text-secondary); border: none; border-radius: 0.375rem; text-align: left; cursor: pointer;">
                            ⏰ World Timeline
                        </button>
                        <button class="nav-item" data-view="themes" onclick="window.app.router.navigate('themes')" style="display: block; width: 100%; padding: 0.5rem; margin-bottom: 0.25rem; background: none; color: var(--text-secondary); border: none; border-radius: 0.375rem; text-align: left; cursor: pointer;">
                            💡 Themes
                        </button>
                        <button class="nav-item" data-view="plots" onclick="window.app.router.navigate('plots')" style="display: block; width: 100%; padding: 0.5rem; margin-bottom: 0.25rem; background: none; color: var(--text-secondary); border: none; border-radius: 0.375rem; text-align: left; cursor: pointer;">
                            📖 Plot Templates
                        </button>
                        <button class="nav-item" data-view="arcs" onclick="window.app.router.navigate('arcs')" style="display: block; width: 100%; padding: 0.5rem; margin-bottom: 0.25rem; background: none; color: var(--text-secondary); border: none; border-radius: 0.375rem; text-align: left; cursor: pointer;">
                            📈 Arc Templates
                        </button>
                        <button class="nav-item" data-view="lore" onclick="window.app.router.navigate('lore')" style="display: block; width: 100%; padding: 0.5rem; margin-bottom: 0.25rem; background: none; color: var(--text-secondary); border: none; border-radius: 0.375rem; text-align: left; cursor: pointer;">
                            📚 Lore & Rules
                        </button>
                    </div>
                    
                    <div class="nav-section" style="margin-top: 1.5rem;">
                        <h3 style="font-size: 0.875rem; color: var(--text-tertiary); margin-bottom: 0.5rem;">STORIES</h3>
                        <button class="nav-item" data-view="productions" onclick="window.app.router.navigate('productions')" style="display: block; width: 100%; padding: 0.5rem; margin-bottom: 0.25rem; background: none; color: var(--text-secondary); border: none; border-radius: 0.375rem; text-align: left; cursor: pointer;">
                            🎬 Stories
                        </button>
                        ${this.state.activeProductionId ? `
                            <div style="margin-left: 1rem; border-left: 2px solid var(--border); padding-left: 0.5rem;">
                                <button class="nav-item" data-view="scripts" onclick="window.app.router.navigate('scripts')" style="display: block; width: calc(100% - 0.5rem); padding: 0.5rem; margin-bottom: 0.25rem; background: none; color: var(--text-secondary); border: none; border-radius: 0.375rem; text-align: left; cursor: pointer; font-size: 0.875rem;">
                                    📝 Scripts
                                </button>
                                <button class="nav-item" data-view="cast" onclick="window.app.router.navigate('cast')" style="display: block; width: calc(100% - 0.5rem); padding: 0.5rem; margin-bottom: 0.25rem; background: none; color: var(--text-secondary); border: none; border-radius: 0.375rem; text-align: left; cursor: pointer; font-size: 0.875rem;">
                                    🎭 Cast
                                </button>
                                <button class="nav-item" data-view="settings" onclick="window.app.router.navigate('settings')" style="display: block; width: calc(100% - 0.5rem); padding: 0.5rem; margin-bottom: 0.25rem; background: none; color: var(--text-secondary); border: none; border-radius: 0.375rem; text-align: left; cursor: pointer; font-size: 0.875rem;">
                                    🏙️ Settings
                                </button>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="nav-section" style="margin-top: 1.5rem;">
                        <h3 style="font-size: 0.875rem; color: var(--text-tertiary); margin-bottom: 0.5rem;">TOOLS</h3>
                        <button class="nav-item" data-view="brainstorming" onclick="window.app.router.navigate('brainstorming')" style="display: block; width: 100%; padding: 0.5rem; margin-bottom: 0.25rem; background: none; color: var(--text-secondary); border: none; border-radius: 0.375rem; text-align: left; cursor: pointer;">
                            🧠 Brainstorming
                        </button>
                        <button class="nav-item" data-view="settings" onclick="window.app.router.navigate('settings')" style="display: block; width: 100%; padding: 0.5rem; margin-bottom: 0.25rem; background: none; color: var(--text-secondary); border: none; border-radius: 0.375rem; text-align: left; cursor: pointer;">
                            ⚙️ Settings
                        </button>
                    </div>
                </nav>
                <main class="content-area" id="content" style="flex: 1; overflow: auto; padding: 2rem;">
                    <!-- Content will be rendered here -->
                </main>
            </div>
        `;
    }
    
    setupNavigation() {
        // Navigation is now handled by the router and onclick handlers
        console.log('[StoryBlocks] Navigation setup complete');
    }
    
    showView(viewName) {
        const content = document.getElementById('content');
        
        switch(viewName) {
            case 'welcome':
                content.innerHTML = this.renderWelcomeView();
                break;
                
            case 'timeline':
                content.innerHTML = this.timelineView.render();
                // Initialize timeline after DOM is ready
                setTimeout(() => {
                    this.timelineView.init();
                }, 100);
                break;
                
            case 'characters':
                content.innerHTML = this.charactersView.render();
                break;
                
            case 'character':
                // Extract character ID from URL parameter
                const characterId = viewName.split('/')[1];
                content.innerHTML = this.characterDetailView.render(characterId);
                break;
                
            case 'locations':
                content.innerHTML = this.renderLocationsView();
                break;
                
            case 'events':
                content.innerHTML = this.renderEventsView();
                break;
                
            case 'plots':
                content.innerHTML = this.renderPlotsView();
                break;
                
            case 'themes':
                content.innerHTML = this.renderThemesView();
                break;
                
            case 'brainstorming':
                content.innerHTML = this.renderBrainstormingView();
                break;
                
            case 'arcs':
                content.innerHTML = this.renderArcsView();
                break;
                
            case 'lore':
                content.innerHTML = this.renderLoreView();
                break;
                
            case 'productions':
                content.innerHTML = this.renderProductionsView();
                break;
                
            case 'scripts':
                content.innerHTML = this.scriptsView.render();
                break;
                
            case 'screenplay':
                content.innerHTML = this.renderScreenplayView();
                break;
                
            case 'cast':
                content.innerHTML = this.renderCastView();
                break;
                
            case 'settings':
                content.innerHTML = this.settingsView.render();
                // Initialize settings after DOM is ready
                setTimeout(() => {
                    this.settingsView.applySettings();
                }, 100);
                break;
                
            default:
                // Check if it's a detail route
                if (viewName.startsWith('character/')) {
                    const characterId = viewName.split('/')[1];
                    content.innerHTML = this.characterDetailView.render(characterId);
                } else if (viewName.startsWith('location/')) {
                    const locationId = viewName.split('/')[1];
                    content.innerHTML = this.locationDetailView.render(locationId);
                } else if (viewName.startsWith('plot/')) {
                    const plotId = viewName.split('/')[1];
                    content.innerHTML = this.plotDetailView.render(plotId);
                } else if (viewName.startsWith('arc/')) {
                    const arcId = viewName.split('/')[1];
                    content.innerHTML = this.arcDetailView.render(arcId);
                } else if (viewName.startsWith('scripts/')) {
                    const scriptId = viewName.split('/')[1];
                    content.innerHTML = this.scriptEditorView.render(scriptId);
                    // Initialize script editor after DOM is ready
                    setTimeout(() => {
                        this.scriptEditorView.onMount();
                    }, 100);
                } else if (viewName.startsWith('theme/')) {
                    const themeId = viewName.split('/')[1];
                    content.innerHTML = this.themeDetailView.render(themeId);
                } else {
                    content.innerHTML = this.renderNotFoundView(viewName);
                }
        }
    }
    
    renderWelcomeView() {
        const hasData = this.state.state.characters.size > 0 || this.state.state.productions.size > 0;
        
        if (!hasData) {
            // Show landing page for new users
            return `
                <div class="welcome-view" style="max-width: 800px; margin: 0 auto; padding: 3rem 2rem; text-align: center;">
                    <h1 style="font-size: 3rem; margin-bottom: 1rem;">📚 StoryBlocks</h1>
                    <p style="font-size: 1.25rem; color: var(--text-secondary); margin-bottom: 3rem;">
                        A comprehensive world-building and storytelling platform for writers
                    </p>
                    
                    <div style="background: var(--surface); padding: 2rem; border-radius: 0.5rem; margin-bottom: 3rem; text-align: left;">
                        <h2 style="margin-bottom: 1rem;">What is StoryBlocks?</h2>
                        <p style="margin-bottom: 1rem;">
                            StoryBlocks is a powerful tool designed to help writers organize and develop their creative projects. 
                            Whether you're writing a novel, screenplay, or building an entire fictional universe, StoryBlocks provides:
                        </p>
                        <ul style="list-style: none; padding: 0;">
                            <li style="padding: 0.5rem 0;">🎭 <strong>Character Development</strong> - Create detailed character profiles with backstories, relationships, and arcs</li>
                            <li style="padding: 0.5rem 0;">🗺️ <strong>World Building</strong> - Design locations, cultures, and settings for your stories</li>
                            <li style="padding: 0.5rem 0;">📊 <strong>Plot Management</strong> - Organize storylines, plot points, and narrative arcs</li>
                            <li style="padding: 0.5rem 0;">🎬 <strong>Screenplay Editor</strong> - Write scripts with professional Fountain formatting</li>
                            <li style="padding: 0.5rem 0;">💡 <strong>Brainstorming Tools</strong> - Capture ideas, use writing prompts, and organize thoughts</li>
                            <li style="padding: 0.5rem 0;">⏰ <strong>Timeline Visualization</strong> - Map out events and story progression</li>
                            <li style="padding: 0.5rem 0;">🌍 <strong>Multi-Story Support</strong> - Manage multiple productions within the same world</li>
                        </ul>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; max-width: 600px; margin: 0 auto;">
                        <div style="background: var(--surface); padding: 2rem; border-radius: 0.5rem; cursor: pointer; transition: transform 0.2s;"
                             onmouseover="this.style.transform='translateY(-4px)'"
                             onmouseout="this.style.transform='translateY(0)'"
                             onclick="window.app.loadExistingProject()">
                            <div style="font-size: 3rem; margin-bottom: 1rem;">📂</div>
                            <h3>Load Existing Project</h3>
                            <p style="color: var(--text-secondary); margin-top: 0.5rem;">
                                Open a workspace folder containing your story data
                            </p>
                        </div>
                        
                        <div style="background: var(--primary); color: white; padding: 2rem; border-radius: 0.5rem; cursor: pointer; transition: transform 0.2s;"
                             onmouseover="this.style.transform='translateY(-4px)'"
                             onmouseout="this.style.transform='translateY(0)'"
                             onclick="window.app.createNewProject()">
                            <div style="font-size: 3rem; margin-bottom: 1rem;">✨</div>
                            <h3>Create New Project</h3>
                            <p style="opacity: 0.9; margin-top: 0.5rem;">
                                Start fresh with a new world and story
                            </p>
                        </div>
                    </div>
                    
                    <p style="color: var(--text-secondary); margin-top: 3rem; font-size: 0.875rem;">
                        All your data is stored locally and auto-saved as you work
                    </p>
                    
                    ${(!('showDirectoryPicker' in window) || window.location.hostname.includes('github.io') || window.location.pathname.includes('/storyblocks')) ? `
                        <div style="background: var(--warning); color: white; padding: 1rem; border-radius: 0.5rem; margin-top: 2rem;">
                            <strong>⚠️ ${(window.location.hostname.includes('github.io') || window.location.pathname.includes('/storyblocks')) ? 'GitHub Pages Limitations' : 'Limited Browser Support'}</strong><br>
                            ${(window.location.hostname.includes('github.io') || window.location.pathname.includes('/storyblocks')) 
                                ? 'GitHub Pages doesn\'t support direct folder access for security reasons.'
                                : 'Your browser doesn\'t support direct folder access.'} 
                            You can still use StoryBlocks, but:
                            <ul style="margin: 0.5rem 0 0 1rem; padding-left: 1rem;">
                                <li>Files will download individually when creating projects</li>
                                <li>You'll need to manually create subfolders</li>
                                <li>Use folder selection to load projects</li>
                                ${!(window.location.hostname.includes('github.io') || window.location.pathname.includes('/storyblocks')) ? '<li>For the best experience, use Chrome, Edge, or Brave browser</li>' : ''}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            `;
        }
        
        // Show regular welcome view if there's already data
        const characterCount = this.state.state.characters.size;
        const productionCount = this.state.state.productions.size;
        const activeProduction = this.state.getActiveProduction();
        return `
            <div class="welcome-view">
                <h1>Welcome to StoryBlocks</h1>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">Your creative storytelling workspace</p>
                
                <div style="background: var(--surface); padding: 2rem; border-radius: 0.5rem; margin-bottom: 2rem;">
                    <h2>🌍 Your World</h2>
                    <p>You have <strong>${characterCount}</strong> characters and <strong>${productionCount}</strong> productions in your world.</p>
                    ${activeProduction ? `
                        <p style="margin-top: 1rem;">Currently viewing: <strong>${activeProduction.title}</strong> (${this.productionSelector.getProductionTypeLabel(activeProduction.type)})</p>
                    ` : `
                        <p style="margin-top: 1rem;">Currently viewing: <strong>World Overview</strong></p>
                    `}
                    <button class="btn btn-primary" onclick="window.app.productionSelector.showCreateProductionDialog()" style="margin-top: 1rem;">
                        ➕ Create New Story
                    </button>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
                    <div style="background: var(--surface); padding: 1.5rem; border-radius: 0.5rem; text-align: center; cursor: pointer;" onclick="window.app.router.navigate('characters')">
                        <div style="font-size: 2rem; margin-bottom: 0.5rem;">🎭</div>
                        <h3>Character Development</h3>
                        <p style="color: var(--text-secondary);">Create rich, detailed character profiles</p>
                    </div>
                    <div style="background: var(--surface); padding: 1.5rem; border-radius: 0.5rem; text-align: center; cursor: pointer;" onclick="window.app.router.navigate('timeline')">
                        <div style="font-size: 2rem; margin-bottom: 0.5rem;">⏰</div>
                        <h3>Timeline Management</h3>
                        <p style="color: var(--text-secondary);">Visualize your story's progression</p>
                    </div>
                    <div style="background: var(--surface); padding: 1.5rem; border-radius: 0.5rem; text-align: center; cursor: pointer;" onclick="window.app.router.navigate('locations')">
                        <div style="font-size: 2rem; margin-bottom: 0.5rem;">🗺️</div>
                        <h3>World Building</h3>
                        <p style="color: var(--text-secondary);">Design locations and settings</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderTimelineView() {
        return `
            <div class="timeline-view">
                <h1>Timeline</h1>
                <p style="color: var(--text-secondary);">Visualize your story's progression</p>
                <div class="empty-state" style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">⏰</div>
                    <h3>Timeline features coming soon</h3>
                    <p>This is a placeholder for the timeline interface</p>
                </div>
            </div>
        `;
    }
    
    renderLocationsView() {
        return this.locationsView.render();
    }
    
    renderEventsView() {
        return `
            <div class="events-view">
                <h1>Events</h1>
                <p style="color: var(--text-secondary);">Manage story events and plot points</p>
                <div class="empty-state" style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📅</div>
                    <h3>Event management coming soon</h3>
                    <p>This is a placeholder for the events interface</p>
                </div>
            </div>
        `;
    }
    
    renderPlotsView() {
        return this.plotsView.render();
    }
    
    renderThemesView() {
        return this.themesView.render();
    }
    
    renderBrainstormingView() {
        return this.brainstormingView.render();
    }
    
    renderArcsView() {
        return this.arcsView.render();
    }
    
    renderLoreView() {
        return this.loreView.render();
    }
    
    renderProductionsView() {
        const productions = Array.from(this.state.state.productions.values());
        
        return `
            <div class="productions-view">
                <div class="productions-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <div>
                        <h1>Stories</h1>
                        <p style="color: var(--text-secondary); margin: 0;">Manage your movies, series, and other stories</p>
                    </div>
                    <button class="btn btn-primary" onclick="window.app.productionSelector.showCreateProductionDialog()">
                        ➕ New Story
                    </button>
                </div>
                
                ${productions.length > 0 ? `
                    <div class="productions-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;">
                        ${productions.map(prod => `
                            <div class="production-card" style="background: var(--surface); border: 1px solid var(--border); border-radius: 0.5rem; padding: 1.5rem; cursor: pointer;"
                                 onclick="window.app.selectProduction('${prod.id}')">
                                <div style="display: flex; align-items: start; gap: 1rem; margin-bottom: 1rem;">
                                    <span style="font-size: 2rem;">${this.productionSelector.getProductionTypeIcon(prod.type)}</span>
                                    <div style="flex: 1;">
                                        <h3 style="margin: 0 0 0.25rem 0;">${prod.title}</h3>
                                        <p style="color: var(--text-secondary); font-size: 0.875rem; margin: 0;">
                                            ${this.productionSelector.getProductionTypeLabel(prod.type)}
                                        </p>
                                    </div>
                                </div>
                                
                                ${prod.logline ? `
                                    <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 1rem;">
                                        ${prod.logline}
                                    </p>
                                ` : ''}
                                
                                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.875rem; color: var(--text-secondary);">
                                    <span>Status: ${prod.status}</span>
                                    <span>${prod.castIds ? prod.castIds.length : 0} characters</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div class="empty-state" style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                        <div style="font-size: 4rem; margin-bottom: 1rem;">🎬</div>
                        <h3>No stories yet</h3>
                        <p>Create your first story to start writing screenplays</p>
                        <button class="btn btn-primary" onclick="window.app.productionSelector.showCreateProductionDialog()" style="margin-top: 1rem;">
                            Create First Story
                        </button>
                    </div>
                `}
            </div>
        `;
    }
    
    renderScreenplayView() {
        const activeProduction = this.state.getActiveProduction();
        if (!activeProduction) {
            return `
                <div class="screenplay-view">
                    <div class="empty-state" style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">📝</div>
                        <h3>No Story Selected</h3>
                        <p>Select a story from the dropdown above to view its screenplay</p>
                    </div>
                </div>
            `;
        }
        
        return `
            <div class="screenplay-view">
                <h1>${activeProduction.title} - Screenplay</h1>
                <p style="color: var(--text-secondary);">Writing screenplay for ${this.productionSelector.getProductionTypeLabel(activeProduction.type)}</p>
                <div class="empty-state" style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📝</div>
                    <h3>Screenplay editor coming soon</h3>
                    <p>This is where you'll write your screenplay with proper formatting</p>
                </div>
            </div>
        `;
    }
    
    renderCastView() {
        const activeProduction = this.state.getActiveProduction();
        if (!activeProduction) {
            return `
                <div class="cast-view">
                    <div class="empty-state" style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">🎭</div>
                        <h3>No Story Selected</h3>
                        <p>Select a story to manage its cast</p>
                    </div>
                </div>
            `;
        }
        
        const cast = this.state.getCharactersInProduction(activeProduction.id);
        
        return `
            <div class="cast-view">
                <div class="cast-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <div>
                        <h1>${activeProduction.title} - Cast</h1>
                        <p style="color: var(--text-secondary); margin: 0;">Characters in this production</p>
                    </div>
                    <button class="btn btn-primary" onclick="window.app.showAddCastDialog()">
                        ➕ Add Character
                    </button>
                </div>
                
                ${cast.length > 0 ? `
                    <div class="cast-list">
                        ${cast.map(char => `
                            <div style="padding: 1rem; border: 1px solid var(--border); border-radius: 0.5rem; margin-bottom: 0.5rem;">
                                <h4 style="margin: 0;">${char.name}</h4>
                                <p style="color: var(--text-secondary); margin: 0.25rem 0;">
                                    ${char.productionData ? char.productionData.role : 'No role'}
                                </p>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div class="empty-state" style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                        <p>No cast assigned yet</p>
                    </div>
                `}
            </div>
        `;
    }
    
    
    // Helper method to select a production
    selectProduction(productionId) {
        this.state.setActiveProduction(productionId);
        this.productionSelector.updateSelector();
        this.render();
        this.router.navigate('scripts');
    }
    
    renderNotFoundView(viewName) {
        return `
            <div class="error-view" style="text-align: center; padding: 2rem;">
                <h1>Page Not Found</h1>
                <p>The requested view "${viewName}" does not exist.</p>
                <button onclick="window.app.router.navigate('welcome')" class="btn btn-primary" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #2563eb; color: white; border: none; border-radius: 0.375rem; cursor: pointer;">
                    Go Home
                </button>
            </div>
        `;
    }
    
    showError(message) {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.innerHTML = `
            <div class="loading-content">
                <h2>Error</h2>
                <p>${message}</p>
                <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #2563eb; color: white; border: none; border-radius: 0.375rem; cursor: pointer;">Reload</button>
            </div>
        `;
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
            setTimeout(() => {
                loadingScreen.remove();
            }, 300);
        }
    }

    // Character editor methods
    showCharacterEditor(character = null) {
        const editorHtml = this.characterEditor.render(character);
        document.body.insertAdjacentHTML('beforeend', editorHtml);
        
        // Initialize editor after DOM is ready
        setTimeout(() => {
            this.characterEditor.init();
        }, 50);
    }

    // Workspace loading methods
    loadExistingProject() {
        alert('To load an existing project:\n\n1. Click "Choose Files" button\n2. At the bottom of the dialog, click the dropdown arrow\n3. Select "Choose Folder"\n4. Navigate to and select your project folder\n5. Click "Choose"\n\nStoryBlocks will import ALL files including character notes!');
        
        const input = document.createElement('input');
        input.type = 'file';
        input.webkitdirectory = true;
        input.multiple = true;
        
        input.onchange = async (e) => {
            const files = Array.from(e.target.files);
            const jsonFiles = files.filter(f => f.name.endsWith('.json'));
            
            const hasWorkspaceJson = jsonFiles.some(f => f.name === 'workspace.json');
            if (!hasWorkspaceJson) {
                alert('Invalid folder. Please select a folder containing workspace.json');
                return;
            }
            
            const loadingOverlay = document.createElement('div');
            loadingOverlay.className = 'loading-overlay';
            loadingOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
            `;
            loadingOverlay.innerHTML = `
                <div style="text-align: center; color: white;">
                    <div class="loading-spinner" style="margin-bottom: 1rem;"></div>
                    <h2>Loading Complete Workspace...</h2>
                    <p>Reading all files including character notes...</p>
                </div>
            `;
            document.body.appendChild(loadingOverlay);
            
            try {
                // Load the workspace with ALL files (including character notes)
                await this.workspaceLoader.loadCompleteWorkspace({ files: files });
                this.router.navigate('characters');
                loadingOverlay.remove();
            } catch (error) {
                console.error('Error loading project:', error);
                alert('Error loading project: ' + error.message);
                loadingOverlay.remove();
            }
        };
        
        input.click();
    }
    
    createNewProject() {
        // Show project setup dialog
        this.showProjectSetupDialog();
    }
    
    showProjectSetupDialog() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
        `;
        
        modal.innerHTML = `
            <div class="modal-content" style="background: var(--background); border-radius: 0.5rem; padding: 2rem; width: 90%; max-width: 600px;">
                <h2 style="margin: 0 0 1.5rem 0; color: var(--primary);">✨ Create New Project</h2>
                
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Project Title</label>
                    <input type="text" id="project-title" placeholder="My Story World" style="
                        width: 100%;
                        padding: 0.75rem;
                        border: 1px solid var(--border);
                        border-radius: 0.375rem;
                        background: var(--surface);
                        margin-bottom: 1rem;
                    ">
                    
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Description</label>
                    <textarea id="project-description" placeholder="A brief description of your story world..." style="
                        width: 100%;
                        padding: 0.75rem;
                        border: 1px solid var(--border);
                        border-radius: 0.375rem;
                        background: var(--surface);
                        min-height: 80px;
                        margin-bottom: 1rem;
                        resize: vertical;
                    "></textarea>
                    
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Main Story Type</label>
                    <select id="story-type" style="
                        width: 100%;
                        padding: 0.75rem;
                        border: 1px solid var(--border);
                        border-radius: 0.375rem;
                        background: var(--surface);
                    ">
                        <option value="novel">Novel</option>
                        <option value="series">Book Series</option>
                        <option value="screenplay">Screenplay</option>
                        <option value="tv_series">TV Series</option>
                        <option value="short_story">Short Story</option>
                        <option value="game">Game</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                
                <div style="background: var(--surface); padding: 1.5rem; border-radius: 0.375rem; margin-bottom: 1.5rem;">
                    <h3 style="margin: 0 0 1rem 0; color: var(--primary);">📁 Workspace Setup</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 1rem;">
                        StoryBlocks will create a complete workspace structure with all necessary files. 
                        You'll download these files to save in a folder of your choice.
                    </p>
                    <div style="font-size: 0.875rem; color: var(--text-secondary);">
                        Files created: workspace.json, characters.json, locations.json, plots.json, 
                        themes.json, timeline.json, scripts.json, and README.md
                    </div>
                </div>
                
                <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                    <button onclick="this.closest('.modal-overlay').remove()" class="btn btn-secondary">
                        Cancel
                    </button>
                    <button onclick="window.app.generateWorkspace().then(() => this.closest('.modal-overlay').remove()).catch((err) => { console.error('Button catch error:', err); });" class="btn btn-primary">
                        Create Workspace
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.getElementById('project-title').focus();
    }
    
    async generateWorkspace() {
        try {
            // Immediately delegate to the appropriate method
            if (!window.showDirectoryPicker || window.location.hostname.includes('github.io')) {
                return this.generateWorkspaceForGitHubPages();
            }
            return this.generateWorkspaceWithFileSystem();
        } catch (error) {
            console.error('Error in generateWorkspace:', error);
            return this.generateWorkspaceForGitHubPages();
        }
    }
    
    async generateWorkspaceForGitHubPages() {
        console.log('Using GitHub Pages compatible method');
        const title = document.getElementById('project-title').value || 'My Story World';
        const description = document.getElementById('project-description').value || 'A new fictional world waiting to be explored';
        const storyType = document.getElementById('story-type').value;
        
        const message = 'GitHub Pages doesn\'t support direct folder access. Files will be downloaded individually.\n\n1. Create a new folder on your computer\n2. Save all downloaded files to that folder\n3. Create subfolders: character_notes, theme_notes, location_notes, plot_notes, arc_notes, scripts\n4. Use "Load Existing Project" to open your workspace';
        alert(message);
        this.generateWorkspaceFiles(title, description, storyType);
    }
    
    async generateWorkspaceWithFileSystem() {
        try {
            console.log('generateWorkspaceWithFileSystem called');
            
            const title = document.getElementById('project-title').value || 'My Story World';
            const description = document.getElementById('project-description').value || 'A new fictional world waiting to be explored';
            const storyType = document.getElementById('story-type').value;
        
            // Use File System Access API to get folder permission
            const directoryHandle = await window.showDirectoryPicker({
                mode: 'readwrite',
                startIn: 'documents'
            });
            
            // Store the directory handle for future use
            this.workspaceDirectoryHandle = directoryHandle;
            
            // Create workspace structure
            const workspaceId = title.toLowerCase().replace(/[^a-z0-9]/g, '_');
            
            const workspace = {
                id: workspaceId,
                title: title,
                description: description,
                world: {
                    title: title,
                    description: description,
                    themes: []
                },
                created: new Date().toISOString(),
                lastModified: new Date().toISOString()
            };
            
            const productions = {
                main_story: {
                    id: 'main_story',
                    title: title,
                    type: storyType,
                    description: description,
                    created: new Date().toISOString(),
                    lastModified: new Date().toISOString()
                }
            };
            
            const characters = {};
            const locations = {};
            const plots = {};
            const themes = {};
            const timeline = {
                main_timeline: {
                    id: 'main_timeline',
                    title: `${title} Timeline`,
                    description: 'Main story timeline',
                    events: []
                }
            };
            const scripts = {};
            
            // Create README content
            const readme = `# ${title}

## Overview

${description}

## Story Structure

### Main Production
- **Title**: ${title}
- **Type**: ${storyType.charAt(0).toUpperCase() + storyType.slice(1).replace('_', ' ')}
- **Description**: ${description}

## File Structure

\`\`\`
${workspaceId}/
├── workspace.json          # Main workspace configuration
├── productions.json        # Production details
├── characters.json         # Character profiles and relationships
├── locations.json          # Setting details and significance
├── plots.json             # Story arcs and plot points
├── themes.json            # Thematic exploration
├── timeline.json          # Chronological event structure
├── scripts.json           # Screenplay content and outlines
├── character_notes/        # Detailed character documents (create manually)
└── README.md              # This overview document
\`\`\`

## Getting Started

1. Save all the downloaded files to a folder named "${workspaceId}"
2. Create a "character_notes" subfolder for detailed character documents
3. In StoryBlocks, use "Load Existing Project" to open this workspace
4. Start building your world!

## Development Status

- **Phase**: Initial Setup
- **Created**: ${new Date().toLocaleDateString()}
- **Next Steps**: Begin character and world development

---

*This workspace was created with StoryBlocks - A comprehensive world-building and storytelling platform*
`;

        // Write files directly to the selected folder
        await this.writeFileToDirectory(directoryHandle, 'workspace.json', JSON.stringify(workspace, null, 2));
        await this.writeFileToDirectory(directoryHandle, 'productions.json', JSON.stringify(productions, null, 2));
        await this.writeFileToDirectory(directoryHandle, 'characters.json', JSON.stringify(characters, null, 2));
        await this.writeFileToDirectory(directoryHandle, 'locations.json', JSON.stringify(locations, null, 2));
        await this.writeFileToDirectory(directoryHandle, 'plots.json', JSON.stringify(plots, null, 2));
        await this.writeFileToDirectory(directoryHandle, 'themes.json', JSON.stringify(themes, null, 2));
        await this.writeFileToDirectory(directoryHandle, 'timeline.json', JSON.stringify(timeline, null, 2));
        await this.writeFileToDirectory(directoryHandle, 'scripts.json', JSON.stringify(scripts, null, 2));
        await this.writeFileToDirectory(directoryHandle, 'README.md', readme);
        
        // Create folders for entity notes
        await directoryHandle.getDirectoryHandle('character_notes', { create: true });
        await directoryHandle.getDirectoryHandle('theme_notes', { create: true });
        await directoryHandle.getDirectoryHandle('location_notes', { create: true });
        await directoryHandle.getDirectoryHandle('plot_notes', { create: true });
        await directoryHandle.getDirectoryHandle('arc_notes', { create: true });
        await directoryHandle.getDirectoryHandle('scripts', { create: true });
        
        // Clear existing data and load new project
        this.state.state.characters.clear();
        this.state.state.productions.clear();
        this.state.state.locations.clear();
        this.state.state.plots.clear();
        this.state.state.themes.clear();
        this.state.state.events.clear();
        this.state.state.scripts.clear();
        this.state.state.arcs = new Map();
        this.state.state.lore = new Map();
        this.state.state.timelines = new Map();
        
        // Load the new workspace data
        this.state.state.world = workspace.world;
        this.state.state.productions.set('main_story', productions.main_story);
        this.state.setActiveProduction('main_story');
        
        // Save and emit changes
        this.persistence.saveToLocalStorage();
        this.events.emit('dataChanged');
        
        // Show success message
        alert(`✅ Workspace created successfully!\n\nAll files have been created in the selected folder.\nYou can now start building your world!`);
        
        // Navigate to characters view
        this.router.navigate('characters');
        
        } catch (error) {
            if (error.name === 'AbortError') {
                // User cancelled the directory picker
                return;
            }
            console.error('Error creating workspace:', error);
            
            // If showDirectoryPicker failed, fall back to file download
            if (error.message && (error.message.includes('showDirectoryPicker') || error.message.includes('not available'))) {
                console.log('Falling back to file download method');
                const message = 'Your browser doesn\'t support direct folder access. Files will be downloaded individually.\n\n1. Create a new folder on your computer\n2. Save all downloaded files to that folder\n3. Create subfolders: character_notes, theme_notes, location_notes, plot_notes, arc_notes, scripts\n4. Use "Load Existing Project" to open your workspace';
                alert(message);
                this.generateWorkspaceFiles(title, description, storyType);
                return;
            }
            
            alert('Error creating workspace: ' + error.message);
        }
    }
    
    async writeFileToDirectory(directoryHandle, filename, content) {
        const fileHandle = await directoryHandle.getFileHandle(filename, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(content);
        await writable.close();
    }
    
    generateWorkspaceFiles(title, description, storyType) {
        // Create workspace structure
        const workspaceId = title.toLowerCase().replace(/[^a-z0-9]/g, '_');
        
        const workspace = {
            id: workspaceId,
            title: title,
            description: description,
            world: {
                title: title,
                description: description,
                themes: []
            },
            created: new Date().toISOString(),
            lastModified: new Date().toISOString()
        };
        
        const productions = {
            main_story: {
                id: 'main_story',
                title: title,
                type: storyType,
                description: description,
                created: new Date().toISOString(),
                lastModified: new Date().toISOString()
            }
        };
        
        const characters = {};
        const locations = {};
        const plots = {};
        const themes = {};
        const timeline = {
            main_timeline: {
                id: 'main_timeline',
                title: `${title} Timeline`,
                description: 'Main story timeline',
                events: []
            }
        };
        const scripts = {};
        
        // Create README content
        const readme = `# ${title}

## Overview

${description}

## Project Type

${storyType}

## Workspace Structure

\`\`\`
${workspaceId}/
├── workspace.json          # Main workspace configuration
├── productions.json        # Story/production metadata
├── characters.json         # Character profiles and relationships
├── locations.json          # Setting details and significance
├── plots.json             # Story arcs and plot points
├── themes.json            # Thematic exploration
├── timeline.json          # Chronological event structure
├── scripts.json           # Screenplay content and outlines
├── character_notes/        # Detailed character documents
├── theme_notes/           # Theme exploration notes
├── location_notes/        # Location research and details
├── plot_notes/            # Plot development notes
├── arc_notes/             # Character and story arc notes
├── scripts/               # Fountain screenplay files
└── README.md              # This overview document
\`\`\`

## Getting Started

1. Save all downloaded files to a single folder
2. Create the subfolders listed above
3. In StoryBlocks, use "Load Existing Project" to open this workspace
4. Start building your world!

## Development Status

- **Phase**: Initial Setup
- **Created**: ${new Date().toLocaleDateString()}
- **Next Steps**: Begin character and world development

---

*This workspace was created with StoryBlocks - A comprehensive world-building and storytelling platform*
`;
        
        // Download all files
        this.downloadFile('workspace.json', JSON.stringify(workspace, null, 2));
        this.downloadFile('productions.json', JSON.stringify(productions, null, 2));
        this.downloadFile('characters.json', JSON.stringify(characters, null, 2));
        this.downloadFile('locations.json', JSON.stringify(locations, null, 2));
        this.downloadFile('plots.json', JSON.stringify(plots, null, 2));
        this.downloadFile('themes.json', JSON.stringify(themes, null, 2));
        this.downloadFile('timeline.json', JSON.stringify(timeline, null, 2));
        this.downloadFile('scripts.json', JSON.stringify(scripts, null, 2));
        this.downloadFile('README.md', readme);
        
        // Clear existing data and load new project
        this.state.state.characters.clear();
        this.state.state.productions.clear();
        this.state.state.locations.clear();
        this.state.state.plots.clear();
        this.state.state.themes.clear();
        this.state.state.events.clear();
        this.state.state.scripts.clear();
        this.state.state.arcs = new Map();
        this.state.state.lore = new Map();
        this.state.state.timelines = new Map();
        
        // Load the new workspace data
        this.state.state.world = workspace.world;
        this.state.state.productions.set('main_story', productions.main_story);
        this.state.setActiveProduction('main_story');
        
        // Save and emit changes
        this.persistence.saveToLocalStorage();
        this.events.emit('dataChanged');
        
        // Navigate to characters view
        this.router.navigate('characters');
    }
    
    downloadFile(filename, content) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    async loadProject521() {
        alert('To load Project 521 workspace:\n\n1. Click "Choose Files" button\n2. At the bottom of the dialog, you\'ll see "Choose Files" button\n3. Click the small arrow next to it and select "Choose Folder"\n4. Navigate to and select the project_521 folder\n5. Click "Choose"');
        
        // Create file input for folder selection
        const input = document.createElement('input');
        input.type = 'file';
        input.webkitdirectory = true;
        input.multiple = true;
        
        input.onchange = async (e) => {
            const files = Array.from(e.target.files);
            
            // Filter for JSON files only
            const jsonFiles = files.filter(f => f.name.endsWith('.json'));
            
            // Check if this is a valid workspace folder
            const hasWorkspaceJson = jsonFiles.some(f => f.name === 'workspace.json');
            if (!hasWorkspaceJson) {
                alert('Invalid folder. Please select a folder containing workspace.json');
                return;
            }
            
            // Show loading
            const loadingOverlay = document.createElement('div');
            loadingOverlay.className = 'loading-overlay';
            loadingOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
            `;
            loadingOverlay.innerHTML = `
                <div style="text-align: center; color: white;">
                    <div class="loading-spinner" style="margin-bottom: 1rem;"></div>
                    <h2>Loading Project 521...</h2>
                    <p>Reading workspace files...</p>
                </div>
            `;
            document.body.appendChild(loadingOverlay);
            
            try {
                // Process ALL files (including character notes)
                await this.workspaceLoader.loadCompleteWorkspace({ files: files });
                
                // Navigate to characters view
                this.router.navigate('characters');
                
                // Remove loading overlay
                loadingOverlay.remove();
                
            } catch (error) {
                console.error('Error loading Project 521:', error);
                alert('Error loading Project 521: ' + error.message);
                loadingOverlay.remove();
            }
        };
        
        // Trigger file selection
        input.click();
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('[StoryBlocks] DOM ready, creating multi-script app instance...');
        window.app = new StoryBlocks();
    });
} else {
    console.log('[StoryBlocks] DOM already ready, creating multi-script app instance...');
    window.app = new StoryBlocks();
}