// Character Editor Component (Multi-Story Support)
class MultiStoryCharacterEditor {
    constructor(app) {
        this.app = app;
        this.state = app.state;
        this.events = app.events;
        this.character = null;
        this.isEditing = false;
        this.editMode = 'world'; // 'world' or 'story'
    }

    render(character = null) {
        this.character = character;
        this.isEditing = !!character;
        const activeProduction = this.state.getActiveProduction();

        return `
            <div class="character-editor-overlay" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
                <div class="character-editor-modal" style="background: var(--background); border-radius: 0.5rem; width: 90%; max-width: 900px; max-height: 90vh; overflow-y: auto; box-shadow: var(--shadow-xl);">
                    <div class="editor-header" style="padding: 1.5rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h2 style="margin: 0;">${this.isEditing ? 'Edit Character' : 'Create New Character'}</h2>
                            ${activeProduction ? `
                                <p style="margin: 0.5rem 0 0 0; color: var(--text-secondary); font-size: 0.875rem;">
                                    In story: <strong>${activeProduction.title}</strong>
                                </p>
                            ` : ''}
                        </div>
                        <button onclick="window.app.characterEditor.close()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-secondary);">×</button>
                    </div>
                    
                    ${this.isEditing && activeProduction ? `
                        <div class="editor-tabs" style="display: flex; border-bottom: 1px solid var(--border); background: var(--surface);">
                            <button class="tab ${this.editMode === 'world' ? 'active' : ''}" 
                                    onclick="window.app.characterEditor.switchMode('world')"
                                    style="padding: 0.75rem 1.5rem; border: none; background: none; cursor: pointer; border-bottom: 3px solid ${this.editMode === 'world' ? 'var(--primary)' : 'transparent'};">
                                🌍 World Character
                            </button>
                            <button class="tab ${this.editMode === 'story' ? 'active' : ''}" 
                                    onclick="window.app.characterEditor.switchMode('story')"
                                    style="padding: 0.75rem 1.5rem; border: none; background: none; cursor: pointer; border-bottom: 3px solid ${this.editMode === 'story' ? 'var(--primary)' : 'transparent'};">
                                📖 Story-Specific
                            </button>
                        </div>
                    ` : ''}
                    
                    <form id="character-form" style="padding: 1.5rem;">
                        ${this.editMode === 'world' ? this.renderWorldForm() : this.renderStoryForm()}
                    </form>
                    
                    <div class="editor-footer" style="padding: 1.5rem; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
                        <div class="footer-left">
                            ${this.isEditing && this.editMode === 'world' ? `
                                <button type="button" class="btn btn-danger" onclick="window.app.characterEditor.deleteCharacter()">
                                    🗑️ Delete Character
                                </button>
                            ` : ''}
                        </div>
                        <div class="footer-right" style="display: flex; gap: 0.5rem;">
                            <button type="button" class="btn btn-secondary" onclick="window.app.characterEditor.close()">
                                Cancel
                            </button>
                            <button type="submit" class="btn btn-primary" form="character-form">
                                ${this.isEditing ? 'Save Changes' : 'Create Character'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderWorldForm() {
        const char = this.character || {};
        
        return `
            <div class="form-info" style="background: var(--surface); padding: 1rem; border-radius: 0.375rem; margin-bottom: 1.5rem;">
                <p style="margin: 0; font-size: 0.875rem; color: var(--text-secondary);">
                    <strong>🌍 World Character:</strong> These details define the character across all stories in your world.
                </p>
            </div>
            
            <div class="form-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                <!-- Left Column -->
                <div class="form-column">
                    <div class="form-section" style="margin-bottom: 2rem;">
                        <h3 style="margin-bottom: 1rem; color: var(--primary);">Core Identity</h3>
                        
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="char-name" class="form-label">Character Name *</label>
                            <input type="text" id="char-name" class="form-input" value="${char.name || ''}" required 
                                   style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="char-description" class="form-label">Core Description</label>
                            <textarea id="char-description" class="form-textarea" rows="4"
                                      style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; resize: vertical;"
                                      placeholder="The essence of who this character is across all stories...">${char.description || ''}</textarea>
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="char-personality" class="form-label">Core Personality</label>
                            <textarea id="char-personality" class="form-textarea" rows="3"
                                      style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; resize: vertical;"
                                      placeholder="Fundamental personality traits that remain consistent...">${char.personality || ''}</textarea>
                        </div>
                    </div>
                </div>
                
                <!-- Right Column -->
                <div class="form-column">
                    <div class="form-section" style="margin-bottom: 2rem;">
                        <h3 style="margin-bottom: 1rem; color: var(--primary);">World Background</h3>
                        
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="char-appearance" class="form-label">Physical Appearance</label>
                            <textarea id="char-appearance" class="form-textarea" rows="3"
                                      style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; resize: vertical;"
                                      placeholder="How they look (may vary slightly between stories)...">${char.appearance || ''}</textarea>
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="char-background" class="form-label">World History</label>
                            <textarea id="char-background" class="form-textarea" rows="4"
                                      style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; resize: vertical;"
                                      placeholder="Their history in this world (before any specific story)...">${char.background || ''}</textarea>
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="char-tags" class="form-label">World Tags</label>
                            <input type="text" id="char-tags" class="form-input" value="${(char.tags || []).join(', ')}"
                                   style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;"
                                   placeholder="warrior, magical, noble, etc. (comma-separated)">
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="char-notes" class="form-label">World Notes</label>
                            <textarea id="char-notes" class="form-textarea" rows="3"
                                      style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; resize: vertical;"
                                      placeholder="Additional notes about this character in the world...">${char.notes || ''}</textarea>
                        </div>
                    </div>
                </div>
            </div>
            
            ${this.character && this.character.productionIds && this.character.productionIds.length > 0 ? `
                <div class="story-participation" style="margin-top: 2rem; padding: 1rem; background: var(--surface); border-radius: 0.375rem;">
                    <h4 style="margin-bottom: 1rem;">Appears in Stories:</h4>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                        ${this.character.productionIds.map(productionId => {
                            const production = this.state.state.productions.get(productionId);
                            return production ? `
                                <span style="background: var(--primary); color: white; padding: 0.25rem 0.75rem; border-radius: 0.25rem; font-size: 0.875rem;">
                                    ${production.title}
                                </span>
                            ` : '';
                        }).join('')}
                    </div>
                </div>
            ` : ''}
        `;
    }

    renderStoryForm() {
        const activeProduction = this.state.getActiveProduction();
        if (!activeProduction) {
            return '<p>Please select a story first.</p>';
        }

        const charProductionData = this.character ? 
            this.state.getCharacterProductionData(this.character.id, activeProduction.id) : null;
        const data = charProductionData || {};

        return `
            <div class="form-info" style="background: var(--surface); padding: 1rem; border-radius: 0.375rem; margin-bottom: 1.5rem;">
                <p style="margin: 0; font-size: 0.875rem; color: var(--text-secondary);">
                    <strong>📖 Story-Specific:</strong> These details are specific to "${activeProduction.title}" and don't affect other stories.
                </p>
            </div>
            
            <div class="form-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                <!-- Left Column -->
                <div class="form-column">
                    <div class="form-section" style="margin-bottom: 2rem;">
                        <h3 style="margin-bottom: 1rem; color: var(--primary);">Role in ${activeProduction.title}</h3>
                        
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="story-role" class="form-label">Story Role *</label>
                            <select id="story-role" class="form-select" required
                                    style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                                <option value="">Select role...</option>
                                <option value="protagonist" ${data.role === 'protagonist' ? 'selected' : ''}>Protagonist</option>
                                <option value="antagonist" ${data.role === 'antagonist' ? 'selected' : ''}>Antagonist</option>
                                <option value="deuteragonist" ${data.role === 'deuteragonist' ? 'selected' : ''}>Deuteragonist</option>
                                <option value="supporting" ${data.role === 'supporting' ? 'selected' : ''}>Supporting Character</option>
                                <option value="minor" ${data.role === 'minor' ? 'selected' : ''}>Minor Character</option>
                                <option value="mentor" ${data.role === 'mentor' ? 'selected' : ''}>Mentor</option>
                                <option value="love_interest" ${data.role === 'love_interest' ? 'selected' : ''}>Love Interest</option>
                                <option value="comic_relief" ${data.role === 'comic_relief' ? 'selected' : ''}>Comic Relief</option>
                            </select>
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="story-importance" class="form-label">Importance in This Story</label>
                            <div style="display: flex; align-items: center; gap: 1rem;">
                                <input type="range" id="story-importance" min="1" max="5" value="${data.importance || 3}"
                                       style="flex: 1;" oninput="window.app.characterEditor.updateImportanceDisplay(event)">
                                <span id="importance-display" style="min-width: 100px; font-weight: 600;">
                                    ${'★'.repeat(data.importance || 3)}${'☆'.repeat(5 - (data.importance || 3))}
                                </span>
                            </div>
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="story-status" class="form-label">Status in Story</label>
                            <select id="story-status" class="form-select"
                                    style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                                <option value="active" ${data.status === 'active' ? 'selected' : ''}>Active</option>
                                <option value="inactive" ${data.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                                <option value="deceased" ${data.status === 'deceased' ? 'selected' : ''}>Deceased</option>
                                <option value="missing" ${data.status === 'missing' ? 'selected' : ''}>Missing</option>
                                <option value="mentioned" ${data.status === 'mentioned' ? 'selected' : ''}>Mentioned Only</option>
                            </select>
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="story-motivation" class="form-label">Goals & Motivation (This Story)</label>
                            <textarea id="story-motivation" class="form-textarea" rows="3"
                                      style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; resize: vertical;"
                                      placeholder="What drives them in this specific story?">${data.motivation || ''}</textarea>
                        </div>
                    </div>
                </div>
                
                <!-- Right Column -->
                <div class="form-column">
                    <div class="form-section" style="margin-bottom: 2rem;">
                        <h3 style="margin-bottom: 1rem; color: var(--primary);">Story Arc</h3>
                        
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="story-arc" class="form-label">Character Arc</label>
                            <textarea id="story-arc" class="form-textarea" rows="4"
                                      style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; resize: vertical;"
                                      placeholder="How do they change throughout this story?">${data.arc || ''}</textarea>
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="story-conflict" class="form-label">Internal Conflict</label>
                            <textarea id="story-conflict" class="form-textarea" rows="3"
                                      style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; resize: vertical;"
                                      placeholder="Their internal struggles in this story...">${data.conflict || ''}</textarea>
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="story-resolution" class="form-label">Arc Resolution</label>
                            <textarea id="story-resolution" class="form-textarea" rows="3"
                                      style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; resize: vertical;"
                                      placeholder="How their arc resolves by story's end...">${data.resolution || ''}</textarea>
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="story-relationships" class="form-label">Key Relationships (This Story)</label>
                            <textarea id="story-relationships" class="form-textarea" rows="3"
                                      style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; resize: vertical;"
                                      placeholder="Important relationships in this story...">${data.relationships || ''}</textarea>
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="story-notes" class="form-label">Story-Specific Notes</label>
                            <textarea id="story-notes" class="form-textarea" rows="3"
                                      style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; resize: vertical;"
                                      placeholder="Notes specific to this story...">${data.storyNotes || ''}</textarea>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    switchMode(mode) {
        this.editMode = mode;
        const form = document.getElementById('character-form');
        if (form) {
            form.innerHTML = mode === 'world' ? this.renderWorldForm() : this.renderStoryForm();
        }
        
        // Update tab styles
        document.querySelectorAll('.editor-tabs .tab').forEach(tab => {
            const tabMode = tab.textContent.includes('World') ? 'world' : 'story';
            tab.style.borderBottom = tabMode === mode ? '3px solid var(--primary)' : '3px solid transparent';
            tab.classList.toggle('active', tabMode === mode);
        });
    }

    init() {
        const form = document.getElementById('character-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveCharacter();
            });
        }
    }

    updateImportanceDisplay(event) {
        const value = parseInt(event.target.value);
        const display = document.getElementById('importance-display');
        if (display) {
            display.textContent = '★'.repeat(value) + '☆'.repeat(5 - value);
        }
    }

    saveCharacter() {
        try {
            if (this.editMode === 'world') {
                this.saveWorldCharacter();
            } else {
                this.saveStoryCharacter();
            }
        } catch (error) {
            console.error('Error saving character:', error);
            this.showNotification('Error saving character. Please try again.', 'error');
        }
    }

    saveWorldCharacter() {
        console.log('[CharacterEditor] Starting save process...');
        const formData = this.collectWorldFormData();
        console.log('[CharacterEditor] Form data:', formData);
        
        if (!this.validateWorldForm(formData)) {
            console.log('[CharacterEditor] Validation failed');
            return;
        }

        if (this.isEditing) {
            console.log('[CharacterEditor] Updating existing character');
            // Update existing character
            Object.assign(this.character, formData);
            this.character.lastModified = new Date().toISOString();
            this.state.emit('character-updated', this.character);
        } else {
            console.log('[CharacterEditor] Creating new character');
            // Create new character
            const newCharacter = this.state.addCharacter(formData);
            console.log('[CharacterEditor] New character created:', newCharacter);
            
            // If we have an active production, add character to it
            const activeProduction = this.state.getActiveProduction();
            console.log('[CharacterEditor] Active production:', activeProduction);
            if (activeProduction) {
                this.state.addCharacterToProduction(newCharacter.id, activeProduction.id, {
                    role: 'supporting',
                    importance: 3
                });
                console.log('[CharacterEditor] Added character to production');
            }
        }

        console.log('[CharacterEditor] Characters in state:', this.state.state.characters.size);
        this.showNotification('Character saved successfully!', 'success');
        this.refreshViews();
        this.close();
    }

    saveStoryCharacter() {
        const activeProduction = this.state.getActiveProduction();
        if (!activeProduction) return;

        const formData = this.collectStoryFormData();
        
        if (!this.character || !this.state.getCharacterProductionData(this.character.id, activeProduction.id)) {
            // Add character to production
            this.state.addCharacterToProduction(this.character.id, activeProduction.id, formData);
        } else {
            // Update character in production
            this.state.updateCharacterInProduction(this.character.id, activeProduction.id, formData);
        }

        this.showNotification('Story-specific data saved successfully!', 'success');
        this.refreshViews();
    }

    collectWorldFormData() {
        const tags = document.getElementById('char-tags').value
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);

        return {
            name: document.getElementById('char-name').value.trim(),
            description: document.getElementById('char-description').value.trim(),
            personality: document.getElementById('char-personality').value.trim(),
            appearance: document.getElementById('char-appearance').value.trim(),
            background: document.getElementById('char-background').value.trim(),
            notes: document.getElementById('char-notes').value.trim(),
            tags: tags
        };
    }

    collectStoryFormData() {
        return {
            role: document.getElementById('story-role').value,
            importance: parseInt(document.getElementById('story-importance').value),
            status: document.getElementById('story-status').value,
            motivation: document.getElementById('story-motivation').value.trim(),
            arc: document.getElementById('story-arc').value.trim(),
            conflict: document.getElementById('story-conflict').value.trim(),
            resolution: document.getElementById('story-resolution').value.trim(),
            relationships: document.getElementById('story-relationships').value.trim(),
            storyNotes: document.getElementById('story-notes').value.trim()
        };
    }

    validateWorldForm(formData) {
        const nameInput = document.getElementById('char-name');
        return this.validateField(nameInput, formData.name.length > 0, 'Name is required');
    }

    validateField(element, isValid, errorMessage) {
        const existingError = element.parentNode.querySelector('.field-error');
        
        if (existingError) {
            existingError.remove();
        }

        if (!isValid) {
            element.style.borderColor = 'var(--danger)';
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.style.cssText = 'color: var(--danger); font-size: 0.75rem; margin-top: 0.25rem;';
            errorDiv.textContent = errorMessage;
            element.parentNode.appendChild(errorDiv);
        } else {
            element.style.borderColor = 'var(--border)';
        }

        return isValid;
    }

    deleteCharacter() {
        if (!this.character) return;

        const confirmMessage = `Are you sure you want to delete "${this.character.name}" from the entire world? This will remove them from all stories.`;
        
        if (confirm(confirmMessage)) {
            // TODO: Implement character deletion with story cleanup
            this.showNotification('Character deletion not yet implemented', 'warning');
        }
    }

    refreshViews() {
        console.log('[CharacterEditor] Refreshing views...');
        if (this.app.router) {
            const currentRoute = this.app.router.getCurrentRoute();
            console.log('[CharacterEditor] Current route:', currentRoute);
            if (currentRoute === 'characters') {
                console.log('[CharacterEditor] Refreshing characters view');
                this.app.charactersView.refreshContent();
            }
        } else {
            console.log('[CharacterEditor] No router available');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? 'var(--danger)' : type === 'success' ? 'var(--success)' : type === 'warning' ? 'var(--warning)' : 'var(--info)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: var(--shadow-lg);
            z-index: 2000;
            font-weight: 500;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    close() {
        const overlay = document.querySelector('.character-editor-overlay');
        if (overlay) {
            overlay.remove();
        }
    }
}