// Workspace Loader - Imports complete workspace data into StoryBlocks
class WorkspaceLoader {
    constructor(app) {
        this.app = app;
        this.state = app.state;
        this.events = app.events;
    }

    async loadWorkspace(workspacePath) {
        try {
            console.log('[WorkspaceLoader] Loading workspace from:', workspacePath);
            
            // Load workspace configuration
            const workspaceConfig = await this.loadJsonFile(`${workspacePath}/workspace.json`);
            if (!workspaceConfig) {
                throw new Error('Invalid workspace: missing workspace.json');
            }

            // Clear existing data (optional - could prompt user)
            if (!confirm('Loading a workspace will replace current data. Continue?')) {
                return false;
            }

            // Start loading process
            this.app.updateLoadingProgress(1, 'Loading workspace configuration...');
            
            // Load world configuration
            this.state.state.world = workspaceConfig.world || {
                title: workspaceConfig.title,
                description: workspaceConfig.description
            };

            // Load productions
            this.app.updateLoadingProgress(2, 'Loading productions...');
            await this.loadProductions(`${workspacePath}/productions.json`);

            // Load characters
            this.app.updateLoadingProgress(3, 'Loading characters...');
            await this.loadCharacters(`${workspacePath}/characters.json`);

            // Load locations
            this.app.updateLoadingProgress(4, 'Loading locations...');
            await this.loadLocations(`${workspacePath}/locations.json`);

            // Load plots
            this.app.updateLoadingProgress(5, 'Loading plots and arcs...');
            await this.loadPlots(`${workspacePath}/plots.json`);

            // Load themes
            this.app.updateLoadingProgress(6, 'Loading themes...');
            await this.loadThemes(`${workspacePath}/themes.json`);

            // Load timeline
            this.app.updateLoadingProgress(7, 'Loading timeline...');
            await this.loadTimeline(`${workspacePath}/timeline.json`);

            // Load scripts
            this.app.updateLoadingProgress(8, 'Loading scripts...');
            await this.loadScripts(`${workspacePath}/scripts.json`);

            // Emit events
            this.events.emit('workspaceLoaded', workspaceConfig);
            this.events.emit('dataChanged');
            
            console.log('[WorkspaceLoader] Workspace loaded successfully');
            return true;

        } catch (error) {
            console.error('[WorkspaceLoader] Error loading workspace:', error);
            alert(`Error loading workspace: ${error.message}`);
            return false;
        }
    }

    async loadJsonFile(filePath) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`Failed to load ${filePath}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error loading ${filePath}:`, error);
            return null;
        }
    }

    async loadProductions(filePath) {
        const data = await this.loadJsonFile(filePath);
        if (!data) return;

        this.state.state.productions.clear();
        
        for (const [id, production] of Object.entries(data)) {
            this.state.state.productions.set(id, {
                ...production,
                created: production.created || new Date().toISOString(),
                lastModified: production.lastModified || new Date().toISOString()
            });
        }

        // Set first production as active
        const firstProduction = this.state.state.productions.values().next().value;
        if (firstProduction) {
            this.state.setActiveProduction(firstProduction.id);
        }
    }

    async loadCharacters(filePath) {
        const data = await this.loadJsonFile(filePath);
        if (!data) return;

        this.state.state.characters.clear();
        
        for (const [id, character] of Object.entries(data)) {
            this.state.state.characters.set(id, {
                ...character,
                productionIds: character.productionIds || ['main_story'],
                created: character.created || new Date().toISOString(),
                lastModified: character.lastModified || new Date().toISOString()
            });
        }
    }

    async loadLocations(filePath) {
        const data = await this.loadJsonFile(filePath);
        if (!data) return;

        this.state.state.locations.clear();
        
        for (const [id, location] of Object.entries(data)) {
            this.state.state.locations.set(id, {
                ...location,
                productionIds: location.productionIds || ['main_story'],
                created: location.created || new Date().toISOString(),
                lastModified: location.lastModified || new Date().toISOString()
            });
        }
    }

    async loadPlots(filePath) {
        const data = await this.loadJsonFile(filePath);
        if (!data) return;

        this.state.state.plots.clear();
        
        for (const [id, plot] of Object.entries(data)) {
            this.state.state.plots.set(id, {
                ...plot,
                productionIds: plot.productionIds || ['main_story'],
                created: plot.created || new Date().toISOString(),
                lastModified: plot.lastModified || new Date().toISOString()
            });
        }
    }

    async loadThemes(filePath) {
        const data = await this.loadJsonFile(filePath);
        if (!data) return;

        this.state.state.themes.clear();
        
        for (const [id, theme] of Object.entries(data)) {
            this.state.state.themes.set(id, {
                ...theme,
                productionIds: theme.productionIds || ['main_story'],
                created: theme.created || new Date().toISOString(),
                lastModified: theme.lastModified || new Date().toISOString()
            });
        }
    }

    async loadTimeline(filePath) {
        const data = await this.loadJsonFile(filePath);
        if (!data) return;

        // For now, store timeline data in a custom structure
        // This will need to be integrated with the timeline visualization
        this.state.state.timelines = this.state.state.timelines || new Map();
        
        for (const [id, timeline] of Object.entries(data)) {
            this.state.state.timelines.set(id, timeline);
        }

        // Also add events to the events Map if it exists
        if (data.main_timeline && data.main_timeline.events) {
            this.state.state.events.clear();
            
            data.main_timeline.events.forEach(event => {
                this.state.state.events.set(event.id, {
                    ...event,
                    productionIds: ['main_story']
                });
            });
        }
    }

    async loadScripts(filePath) {
        const data = await this.loadJsonFile(filePath);
        if (!data) return;

        this.state.state.scripts.clear();
        
        for (const [id, script] of Object.entries(data)) {
            this.state.state.scripts.set(id, {
                ...script,
                productionId: script.productionId || 'main_story',
                created: script.created || new Date().toISOString(),
                lastModified: script.lastModified || new Date().toISOString()
            });
        }
    }

    // Method to load complete workspace including character notes
    async loadCompleteWorkspace(fileInput) {
        const files = fileInput.files;
        if (!files || files.length === 0) return;

        // Separate files by type
        const jsonFiles = [];
        const characterNoteFiles = [];
        const themeNoteFiles = [];
        const locationNoteFiles = [];
        const plotNoteFiles = [];
        const arcNoteFiles = [];
        const scriptFiles = [];
        const otherFiles = [];

        for (const file of files) {
            if (file.name.endsWith('.json')) {
                jsonFiles.push(file);
            } else if (file.webkitRelativePath) {
                if (file.webkitRelativePath.includes('character_notes/')) {
                    characterNoteFiles.push(file);
                } else if (file.webkitRelativePath.includes('theme_notes/')) {
                    themeNoteFiles.push(file);
                } else if (file.webkitRelativePath.includes('location_notes/')) {
                    locationNoteFiles.push(file);
                } else if (file.webkitRelativePath.includes('plot_notes/')) {
                    plotNoteFiles.push(file);
                } else if (file.webkitRelativePath.includes('arc_notes/')) {
                    arcNoteFiles.push(file);
                } else if (file.webkitRelativePath.includes('scripts/') && file.name.endsWith('.fountain')) {
                    scriptFiles.push(file);
                } else {
                    otherFiles.push(file);
                }
            } else {
                otherFiles.push(file);
            }
        }

        // Load JSON files first (workspace structure)
        await this.loadFromFileInputInternal(jsonFiles);

        // Load all entity notes
        if (characterNoteFiles.length > 0) {
            await this.loadEntityNotesFromFiles(characterNoteFiles, 'characters', 'character_notes');
        }
        if (themeNoteFiles.length > 0) {
            await this.loadEntityNotesFromFiles(themeNoteFiles, 'themes', 'theme_notes');
        }
        if (locationNoteFiles.length > 0) {
            await this.loadEntityNotesFromFiles(locationNoteFiles, 'locations', 'location_notes');
        }
        if (plotNoteFiles.length > 0) {
            await this.loadEntityNotesFromFiles(plotNoteFiles, 'plots', 'plot_notes');
        }
        if (arcNoteFiles.length > 0) {
            await this.loadEntityNotesFromFiles(arcNoteFiles, 'arcs', 'arc_notes');
        }
        if (scriptFiles.length > 0) {
            await this.loadScriptFiles(scriptFiles);
        }

        console.log(`[WorkspaceLoader] Loaded complete workspace: ${jsonFiles.length} JSON files, ${characterNoteFiles.length + themeNoteFiles.length + locationNoteFiles.length + plotNoteFiles.length + arcNoteFiles.length} entity notes, ${scriptFiles.length} scripts, ${otherFiles.length} other files`);
    }

    // Generic method to load entity notes from files
    async loadEntityNotesFromFiles(noteFiles, entityType, folderName) {
        const entityNotesMap = new Map();

        // Group files by entity
        for (const file of noteFiles) {
            const relativePath = file.webkitRelativePath;
            const pathParts = relativePath.split('/');
            
            // Expected path: workspace_name/entity_notes/entity_name/file.md
            if (pathParts.length >= 3 && pathParts[pathParts.length - 3] === folderName) {
                const entityName = pathParts[pathParts.length - 2];
                
                if (!entityNotesMap.has(entityName)) {
                    entityNotesMap.set(entityName, []);
                }
                entityNotesMap.get(entityName).push(file);
            }
        }

        // Load files for each entity
        for (const [entityFolderName, files] of entityNotesMap) {
            // Find the entity by matching folder name to entity ID or name
            let entity = null;
            
            // Try to find by ID first
            entity = this.state.state[entityType].get(entityFolderName);
            
            // If not found by ID, try to find by name or similar
            if (!entity) {
                for (const [id, ent] of this.state.state[entityType]) {
                    const nameMatch = ent.name ? ent.name.toLowerCase().replace(/[^a-z0-9]/g, '_') : 
                                     ent.title ? ent.title.toLowerCase().replace(/[^a-z0-9]/g, '_') : '';
                    if (nameMatch === entityFolderName || 
                        (ent.name && ent.name.toLowerCase().includes(entityFolderName.toLowerCase())) ||
                        (ent.title && ent.title.toLowerCase().includes(entityFolderName.toLowerCase())) ||
                        entityFolderName.toLowerCase().includes((ent.name || ent.title || '').toLowerCase().split(' ')[0].toLowerCase())) {
                        entity = ent;
                        break;
                    }
                }
            }

            if (entity) {
                // Initialize entity files if they don't exist
                if (!entity.files) {
                    entity.files = [];
                }

                // Load each file
                for (const file of files) {
                    try {
                        const content = await this.readFile(file);
                        const fileType = file.name.endsWith('.md') ? 'markdown' : 'text';
                        
                        const entityFile = {
                            id: Date.now() + Math.random().toString(36).substr(2, 9),
                            name: file.name,
                            type: fileType,
                            content: content,
                            created: new Date().toISOString(),
                            lastModified: new Date().toISOString(),
                            imported: true,
                            originalPath: file.webkitRelativePath
                        };
                        
                        entity.files.push(entityFile);
                    } catch (error) {
                        console.error(`Error loading ${entityType} note file ${file.name}:`, error);
                    }
                }

                console.log(`[WorkspaceLoader] Loaded ${files.length} notes for ${entityType}: ${entity.name || entity.title}`);
            } else {
                console.warn(`[WorkspaceLoader] Could not find ${entityType} for folder: ${entityFolderName}`);
            }
        }
    }

    // Helper method to load character notes from files (backward compatibility)
    async loadCharacterNotesFromFiles(characterNoteFiles) {
        return this.loadEntityNotesFromFiles(characterNoteFiles, 'characters', 'character_notes');
    }

    // Original character notes loader (keeping for reference)
    async loadCharacterNotesFromFilesOld(characterNoteFiles) {
        const characterNotesMap = new Map();

        // Group files by character
        for (const file of characterNoteFiles) {
            const relativePath = file.webkitRelativePath;
            const pathParts = relativePath.split('/');
            
            // Expected path: workspace_name/character_notes/character_name/file.md
            if (pathParts.length >= 3 && pathParts[pathParts.length - 3] === 'character_notes') {
                const characterName = pathParts[pathParts.length - 2];
                
                if (!characterNotesMap.has(characterName)) {
                    characterNotesMap.set(characterName, []);
                }
                characterNotesMap.get(characterName).push(file);
            }
        }

        // Load files for each character
        for (const [characterFolderName, files] of characterNotesMap) {
            // Find the character by matching folder name to character ID or name
            let character = null;
            
            // Try to find by ID first
            character = this.state.state.characters.get(characterFolderName);
            
            // If not found by ID, try to find by name or similar
            if (!character) {
                for (const [id, char] of this.state.state.characters) {
                    const nameMatch = char.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
                    if (nameMatch === characterFolderName || 
                        char.name.toLowerCase().includes(characterFolderName.toLowerCase()) ||
                        characterFolderName.toLowerCase().includes(char.name.toLowerCase().split(' ')[0].toLowerCase())) {
                        character = char;
                        break;
                    }
                }
            }

            if (character) {
                // Initialize character files if they don't exist
                if (!character.files) {
                    character.files = [];
                }

                // Load each file
                for (const file of files) {
                    try {
                        const content = await this.readFile(file);
                        const fileType = file.name.endsWith('.md') ? 'markdown' : 'text';
                        
                        const characterFile = {
                            id: Date.now() + Math.random().toString(36).substr(2, 9),
                            name: file.name,
                            type: fileType,
                            content: content,
                            created: new Date().toISOString(),
                            lastModified: new Date().toISOString(),
                            imported: true,
                            originalPath: file.webkitRelativePath
                        };
                        
                        character.files.push(characterFile);
                    } catch (error) {
                        console.error(`Error loading character note file ${file.name}:`, error);
                    }
                }

                console.log(`[WorkspaceLoader] Loaded ${files.length} notes for character: ${character.name}`);
            } else {
                console.warn(`[WorkspaceLoader] Could not find character for folder: ${characterFolderName}`);
            }
        }
    }

    // Helper method to load from file input (internal)
    async loadFromFileInputInternal(jsonFiles) {
        if (!jsonFiles || jsonFiles.length === 0) return;

        const workspaceFiles = {};
        
        // Read all selected JSON files
        for (const file of jsonFiles) {
            const content = await this.readFile(file);
            workspaceFiles[file.name] = content;
        }

        // Validate workspace structure
        if (!workspaceFiles['workspace.json']) {
            alert('Invalid workspace: missing workspace.json');
            return;
        }

        // Load each component
        try {
            const workspace = JSON.parse(workspaceFiles['workspace.json']);
            this.state.state.world = workspace.world;

            if (workspaceFiles['productions.json']) {
                const productions = JSON.parse(workspaceFiles['productions.json']);
                await this.loadProductionsData(productions);
            }

            if (workspaceFiles['characters.json']) {
                const characters = JSON.parse(workspaceFiles['characters.json']);
                await this.loadCharactersData(characters);
            }

            if (workspaceFiles['locations.json']) {
                const locations = JSON.parse(workspaceFiles['locations.json']);
                await this.loadLocationsData(locations);
            }

            if (workspaceFiles['plots.json']) {
                const plots = JSON.parse(workspaceFiles['plots.json']);
                await this.loadPlotsData(plots);
            }

            if (workspaceFiles['themes.json']) {
                const themes = JSON.parse(workspaceFiles['themes.json']);
                await this.loadThemesData(themes);
            }

            if (workspaceFiles['timeline.json']) {
                const timeline = JSON.parse(workspaceFiles['timeline.json']);
                await this.loadTimelineData(timeline);
            }

            if (workspaceFiles['scripts.json']) {
                const scripts = JSON.parse(workspaceFiles['scripts.json']);
                await this.loadScriptsData(scripts);
            }

            this.events.emit('workspaceLoaded', workspace);
            this.events.emit('dataChanged');
            
            alert('Workspace loaded successfully!');
            
        } catch (error) {
            console.error('Error loading workspace:', error);
            alert('Error loading workspace: ' + error.message);
        }
    }

    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    // Load script files from the scripts folder
    async loadScriptFiles(scriptFiles) {
        for (const file of scriptFiles) {
            try {
                const content = await this.readFile(file);
                const name = file.name.replace('.fountain', '');
                
                // Extract metadata from fountain file (if present)
                const titleMatch = content.match(/^Title:\s*(.+)$/m);
                const creditMatch = content.match(/^Credit:\s*(.+)$/m);
                const authorMatch = content.match(/^Author:\s*(.+)$/m);
                const draftMatch = content.match(/^Draft date:\s*(.+)$/m);
                
                const script = {
                    id: `script-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    title: titleMatch ? titleMatch[1] : name,
                    type: 'screenplay',
                    content: content,
                    format: 'fountain',
                    productionId: 'main_story', // Default to main story
                    
                    // Metadata from fountain
                    credit: creditMatch ? creditMatch[1] : 'Written by',
                    author: authorMatch ? authorMatch[1] : '',
                    draftDate: draftMatch ? draftMatch[1] : new Date().toISOString(),
                    
                    // File info
                    fileName: file.name,
                    filePath: file.webkitRelativePath,
                    
                    // Standard metadata
                    created: new Date().toISOString(),
                    lastModified: new Date().toISOString()
                };
                
                this.state.state.scripts.set(script.id, script);
                console.log(`[WorkspaceLoader] Loaded script: ${script.title}`);
                
            } catch (error) {
                console.error(`Error loading script file ${file.name}:`, error);
            }
        }
    }

    // Direct data loading methods (for file input)
    async loadProductionsData(data) {
        this.state.state.productions.clear();
        for (const [id, production] of Object.entries(data)) {
            this.state.state.productions.set(id, production);
        }
    }

    async loadCharactersData(data) {
        this.state.state.characters.clear();
        for (const [id, character] of Object.entries(data)) {
            this.state.state.characters.set(id, character);
        }
    }

    async loadLocationsData(data) {
        this.state.state.locations.clear();
        for (const [id, location] of Object.entries(data)) {
            this.state.state.locations.set(id, location);
        }
    }

    async loadPlotsData(data) {
        this.state.state.plots.clear();
        for (const [id, plot] of Object.entries(data)) {
            this.state.state.plots.set(id, plot);
        }
    }

    async loadThemesData(data) {
        this.state.state.themes.clear();
        for (const [id, theme] of Object.entries(data)) {
            this.state.state.themes.set(id, theme);
        }
    }

    async loadTimelineData(data) {
        this.state.state.timelines = this.state.state.timelines || new Map();
        for (const [id, timeline] of Object.entries(data)) {
            this.state.state.timelines.set(id, timeline);
        }
    }

    async loadScriptsData(data) {
        this.state.state.scripts.clear();
        for (const [id, script] of Object.entries(data)) {
            this.state.state.scripts.set(id, script);
        }
    }

    // Helper method to load from file input (backwards compatibility)
    async loadFromFileInput(fileInput) {
        const files = Array.from(fileInput.files);
        const jsonFiles = files.filter(f => f.name.endsWith('.json'));
        await this.loadFromFileInputInternal(jsonFiles);
    }
}