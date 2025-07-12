// Character Editor Component
class CharacterEditor {
    constructor(app) {
        this.app = app;
        this.state = app.state;
        this.events = app.events;
        this.character = null;
        this.isEditing = false;
    }

    render(character = null) {
        this.character = character;
        this.isEditing = !!character;

        return `
            <div class="character-editor-overlay" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
                <div class="character-editor-modal" style="background: var(--background); border-radius: 0.5rem; width: 90%; max-width: 800px; max-height: 90vh; overflow-y: auto; box-shadow: var(--shadow-xl);">
                    <div class="editor-header" style="padding: 1.5rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
                        <h2 style="margin: 0;">${this.isEditing ? 'Edit Character' : 'Create New Character'}</h2>
                        <button onclick="window.app.characterEditor.close()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-secondary);">×</button>
                    </div>
                    
                    <form id="character-form" style="padding: 1.5rem;">
                        ${this.renderForm()}
                    </form>
                    
                    <div class="editor-footer" style="padding: 1.5rem; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
                        <div class="footer-left">
                            ${this.isEditing ? `
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

    renderForm() {
        const char = this.character || {};
        
        return `
            <div class="form-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                <!-- Left Column -->
                <div class="form-column">
                    <div class="form-section" style="margin-bottom: 2rem;">
                        <h3 style="margin-bottom: 1rem; color: var(--primary);">Basic Information</h3>
                        
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="char-name" class="form-label">Character Name *</label>
                            <input type="text" id="char-name" class="form-input" value="${char.name || ''}" required 
                                   style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                            <div class="form-helper" style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem;">
                                The character's full name
                            </div>
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="char-subtitle" class="form-label">Subtitle/Nickname</label>
                            <input type="text" id="char-subtitle" class="form-input" value="${char.subtitle || ''}"
                                   style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="char-role" class="form-label">Role *</label>
                            <select id="char-role" class="form-select" required
                                    style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                                <option value="">Select role...</option>
                                <option value="protagonist" ${char.role === 'protagonist' ? 'selected' : ''}>Protagonist</option>
                                <option value="antagonist" ${char.role === 'antagonist' ? 'selected' : ''}>Antagonist</option>
                                <option value="supporting" ${char.role === 'supporting' ? 'selected' : ''}>Supporting Character</option>
                                <option value="minor" ${char.role === 'minor' ? 'selected' : ''}>Minor Character</option>
                                <option value="deuteragonist" ${char.role === 'deuteragonist' ? 'selected' : ''}>Deuteragonist</option>
                                <option value="love_interest" ${char.role === 'love_interest' ? 'selected' : ''}>Love Interest</option>
                                <option value="mentor" ${char.role === 'mentor' ? 'selected' : ''}>Mentor</option>
                                <option value="comic_relief" ${char.role === 'comic_relief' ? 'selected' : ''}>Comic Relief</option>
                            </select>
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="char-importance" class="form-label">Importance Level</label>
                            <div style="display: flex; align-items: center; gap: 1rem;">
                                <input type="range" id="char-importance" min="1" max="5" value="${char.importance || 3}"
                                       style="flex: 1;" oninput="window.app.characterEditor.updateImportanceDisplay(event)">
                                <span id="importance-display" style="min-width: 100px; font-weight: 600;">
                                    ${'★'.repeat(char.importance || 3)}${'☆'.repeat(5 - (char.importance || 3))}
                                </span>
                            </div>
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="char-status" class="form-label">Status</label>
                            <select id="char-status" class="form-select"
                                    style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                                <option value="active" ${char.status === 'active' ? 'selected' : ''}>Active</option>
                                <option value="inactive" ${char.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                                <option value="deceased" ${char.status === 'deceased' ? 'selected' : ''}>Deceased</option>
                                <option value="missing" ${char.status === 'missing' ? 'selected' : ''}>Missing</option>
                                <option value="concept" ${char.status === 'concept' ? 'selected' : ''}>Concept Only</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-section" style="margin-bottom: 2rem;">
                        <h3 style="margin-bottom: 1rem; color: var(--primary);">Physical Description</h3>
                        
                        <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                            <div class="form-group">
                                <label for="char-age" class="form-label">Age</label>
                                <input type="number" id="char-age" class="form-input" value="${char.age || ''}" min="0" max="200"
                                       style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                            </div>
                            <div class="form-group">
                                <label for="char-gender" class="form-label">Gender</label>
                                <input type="text" id="char-gender" class="form-input" value="${char.gender || ''}"
                                       style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                            </div>
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="char-appearance" class="form-label">Physical Appearance</label>
                            <textarea id="char-appearance" class="form-textarea" rows="3" value="${char.appearance || ''}"
                                      style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; resize: vertical;"
                                      placeholder="Height, build, hair color, eye color, distinctive features...">${char.appearance || ''}</textarea>
                        </div>
                    </div>
                </div>
                
                <!-- Right Column -->
                <div class="form-column">
                    <div class="form-section" style="margin-bottom: 2rem;">
                        <h3 style="margin-bottom: 1rem; color: var(--primary);">Character Development</h3>
                        
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="char-description" class="form-label">Description/Summary</label>
                            <textarea id="char-description" class="form-textarea" rows="4"
                                      style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; resize: vertical;"
                                      placeholder="Brief overview of the character's role and personality...">${char.description || ''}</textarea>
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="char-personality" class="form-label">Personality Traits</label>
                            <textarea id="char-personality" class="form-textarea" rows="3"
                                      style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; resize: vertical;"
                                      placeholder="Key personality traits, quirks, mannerisms...">${char.personality || ''}</textarea>
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="char-background" class="form-label">Background/History</label>
                            <textarea id="char-background" class="form-textarea" rows="4"
                                      style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; resize: vertical;"
                                      placeholder="Character's backstory, upbringing, formative experiences...">${char.background || ''}</textarea>
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="char-motivation" class="form-label">Goals & Motivation</label>
                            <textarea id="char-motivation" class="form-textarea" rows="3"
                                      style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; resize: vertical;"
                                      placeholder="What drives this character? What do they want?">${char.motivation || ''}</textarea>
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="char-conflict" class="form-label">Internal Conflict/Flaws</label>
                            <textarea id="char-conflict" class="form-textarea" rows="3"
                                      style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; resize: vertical;"
                                      placeholder="Character flaws, internal struggles, contradictions...">${char.conflict || ''}</textarea>
                        </div>
                    </div>
                    
                    <div class="form-section" style="margin-bottom: 2rem;">
                        <h3 style="margin-bottom: 1rem; color: var(--primary);">Story Integration</h3>
                        
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="char-arc" class="form-label">Character Arc</label>
                            <textarea id="char-arc" class="form-textarea" rows="3"
                                      style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; resize: vertical;"
                                      placeholder="How does this character change throughout the story?">${char.arc || ''}</textarea>
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="char-relationships" class="form-label">Key Relationships</label>
                            <textarea id="char-relationships" class="form-textarea" rows="3"
                                      style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; resize: vertical;"
                                      placeholder="Important relationships with other characters...">${char.relationships || ''}</textarea>
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="char-tags" class="form-label">Tags</label>
                            <input type="text" id="char-tags" class="form-input" value="${(char.tags || []).join(', ')}"
                                   style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;"
                                   placeholder="protagonist, warrior, mysterious, etc. (comma-separated)">
                            <div class="form-helper" style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem;">
                                Separate tags with commas
                            </div>
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="char-notes" class="form-label">Additional Notes</label>
                            <textarea id="char-notes" class="form-textarea" rows="4"
                                      style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; resize: vertical;"
                                      placeholder="Any other important details, ideas, or reminders...">${char.notes || ''}</textarea>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    init() {
        // Bind form submission
        const form = document.getElementById('character-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveCharacter();
            });
        }

        // Set up real-time validation
        this.setupValidation();
    }

    setupValidation() {
        const nameInput = document.getElementById('char-name');
        const roleSelect = document.getElementById('char-role');

        if (nameInput) {
            nameInput.addEventListener('input', () => {
                this.validateField(nameInput, nameInput.value.trim().length > 0, 'Name is required');
            });
        }

        if (roleSelect) {
            roleSelect.addEventListener('change', () => {
                this.validateField(roleSelect, roleSelect.value !== '', 'Role is required');
            });
        }
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

    updateImportanceDisplay(event) {
        const value = parseInt(event.target.value);
        const display = document.getElementById('importance-display');
        if (display) {
            display.textContent = '★'.repeat(value) + '☆'.repeat(5 - value);
        }
    }

    saveCharacter() {
        // Collect form data
        const formData = this.collectFormData();
        
        // Validate required fields
        if (!this.validateForm(formData)) {
            return;
        }

        try {
            if (this.isEditing) {
                // Update existing character
                this.state.updateCharacter(this.character.id, formData);
                this.showNotification('Character updated successfully!', 'success');
            } else {
                // Create new character
                const newCharacter = {
                    id: `char-${Date.now()}`,
                    created: new Date().toISOString(),
                    lastModified: new Date().toISOString(),
                    ...formData
                };
                this.state.addCharacter(newCharacter);
                this.showNotification('Character created successfully!', 'success');
            }

            // Refresh characters view if visible
            if (this.app.router.getCurrentRoute() === 'characters') {
                this.app.charactersView.refreshContent();
            }

            this.close();
        } catch (error) {
            console.error('Error saving character:', error);
            this.showNotification('Error saving character. Please try again.', 'error');
        }
    }

    collectFormData() {
        const tags = document.getElementById('char-tags').value
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);

        return {
            name: document.getElementById('char-name').value.trim(),
            subtitle: document.getElementById('char-subtitle').value.trim(),
            role: document.getElementById('char-role').value,
            importance: parseInt(document.getElementById('char-importance').value),
            status: document.getElementById('char-status').value,
            age: document.getElementById('char-age').value ? parseInt(document.getElementById('char-age').value) : null,
            gender: document.getElementById('char-gender').value.trim(),
            appearance: document.getElementById('char-appearance').value.trim(),
            description: document.getElementById('char-description').value.trim(),
            personality: document.getElementById('char-personality').value.trim(),
            background: document.getElementById('char-background').value.trim(),
            motivation: document.getElementById('char-motivation').value.trim(),
            conflict: document.getElementById('char-conflict').value.trim(),
            arc: document.getElementById('char-arc').value.trim(),
            relationships: document.getElementById('char-relationships').value.trim(),
            notes: document.getElementById('char-notes').value.trim(),
            tags: tags,
            lastModified: new Date().toISOString()
        };
    }

    validateForm(formData) {
        let isValid = true;

        // Validate name
        const nameInput = document.getElementById('char-name');
        if (!this.validateField(nameInput, formData.name.length > 0, 'Name is required')) {
            isValid = false;
        }

        // Validate role
        const roleSelect = document.getElementById('char-role');
        if (!this.validateField(roleSelect, formData.role !== '', 'Role is required')) {
            isValid = false;
        }

        // Validate age if provided
        const ageInput = document.getElementById('char-age');
        if (formData.age !== null) {
            if (!this.validateField(ageInput, formData.age >= 0 && formData.age <= 200, 'Age must be between 0 and 200')) {
                isValid = false;
            }
        }

        return isValid;
    }

    deleteCharacter() {
        if (!this.character) return;

        const confirmMessage = `Are you sure you want to delete "${this.character.name}"? This action cannot be undone.`;
        
        if (confirm(confirmMessage)) {
            try {
                this.state.deleteCharacter(this.character.id);
                this.showNotification('Character deleted successfully!', 'success');
                
                // Refresh characters view if visible
                if (this.app.router.getCurrentRoute() === 'characters') {
                    this.app.charactersView.refreshContent();
                }
                
                this.close();
            } catch (error) {
                console.error('Error deleting character:', error);
                this.showNotification('Error deleting character. Please try again.', 'error');
            }
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? 'var(--danger)' : type === 'success' ? 'var(--success)' : 'var(--info)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: var(--shadow-lg);
            z-index: 2000;
            font-weight: 500;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
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