// Character Detail View (Full Page)
class CharacterDetailView {
    constructor(app) {
        this.app = app;
        this.state = app.state;
        this.events = app.events;
        this.characterId = null;
    }

    render(characterId) {
        this.characterId = characterId;
        const character = this.state.state.characters.get(characterId);
        
        if (!character) {
            return this.renderNotFound();
        }

        const activeProduction = this.state.getActiveProduction();
        const productionData = activeProduction ? 
            this.state.getCharacterProductionData(character.id, activeProduction.id) : null;

        return `
            <div class="character-detail-view">
                <div class="detail-header" style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 2rem;">
                    <div>
                        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
                            <button class="btn btn-secondary" onclick="window.app.router.navigate('characters')" style="padding: 0.5rem;">
                                ← Back to Characters
                            </button>
                            <h1 style="margin: 0;">${character.name}</h1>
                        </div>
                        <p style="color: var(--text-secondary); margin: 0;">
                            ${this.getCharacterSubtitle(character, productionData)}
                        </p>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-primary" onclick="window.app.showCharacterEditor(window.app.charactersView.state.state.characters.get('${character.id}'))">
                            ✏️ Edit Character
                        </button>
                    </div>
                </div>

                <div class="detail-content" style="display: grid; grid-template-columns: 300px 1fr; gap: 2rem;">
                    <!-- Left Sidebar -->
                    <div class="character-sidebar">
                        ${this.renderSidebar(character, productionData)}
                    </div>

                    <!-- Main Content -->
                    <div class="character-main">
                        ${this.renderMainContent(character, productionData)}
                    </div>
                </div>
            </div>
        `;
    }

    renderSidebar(character, productionData) {
        return `
            <div class="sidebar-section" style="background: var(--surface); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                <div style="text-align: center; margin-bottom: 1.5rem;">
                    ${character.avatar ? 
                        `<img src="${character.avatar}" alt="${character.name}" style="width: 150px; height: 150px; border-radius: 50%; object-fit: cover;">` : 
                        `<div style="width: 150px; height: 150px; border-radius: 50%; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 3rem; margin: 0 auto;">${this.getInitials(character.name)}</div>`
                    }
                </div>
                
                <h3 style="margin-bottom: 1rem;">Quick Info</h3>
                
                ${productionData ? `
                    <div style="margin-bottom: 1rem;">
                        <strong style="display: block; color: var(--text-secondary); font-size: 0.875rem;">Role in Story</strong>
                        <span>${this.getRoleLabel(productionData.role)}</span>
                    </div>
                ` : ''}
                
                <div style="margin-bottom: 1rem;">
                    <strong style="display: block; color: var(--text-secondary); font-size: 0.875rem;">Importance</strong>
                    <div>${this.renderImportanceStars(productionData?.importance || character.importance || 1)}</div>
                </div>
                
                ${character.age ? `
                    <div style="margin-bottom: 1rem;">
                        <strong style="display: block; color: var(--text-secondary); font-size: 0.875rem;">Age</strong>
                        <span>${character.age}</span>
                    </div>
                ` : ''}
                
                ${character.gender ? `
                    <div style="margin-bottom: 1rem;">
                        <strong style="display: block; color: var(--text-secondary); font-size: 0.875rem;">Gender</strong>
                        <span>${character.gender}</span>
                    </div>
                ` : ''}
                
                ${character.tags && character.tags.length > 0 ? `
                    <div style="margin-bottom: 1rem;">
                        <strong style="display: block; color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 0.5rem;">Tags</strong>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.25rem;">
                            ${character.tags.map(tag => 
                                `<span style="background: var(--primary); color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">${tag}</span>`
                            ).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>

            ${this.renderStoriesSection(character)}
        `;
    }

    renderMainContent(character, productionData) {
        const activeProduction = this.state.getActiveProduction();
        
        return `
            <!-- Navigation Tabs -->
            <div class="content-tabs" style="display: flex; border-bottom: 2px solid var(--border); margin-bottom: 2rem;">
                <button class="tab-button active" data-tab="about" onclick="window.app.characterDetailView.switchTab('about')"
                        style="padding: 1rem 1.5rem; background: none; border: none; border-bottom: 3px solid var(--primary); cursor: pointer; font-weight: 600;">
                    📋 About
                </button>
                <button class="tab-button" data-tab="timeline" onclick="window.app.characterDetailView.switchTab('timeline')"
                        style="padding: 1rem 1.5rem; background: none; border: none; border-bottom: 3px solid transparent; cursor: pointer;">
                    ⏰ Timeline
                </button>
                <button class="tab-button" data-tab="files" onclick="window.app.characterDetailView.switchTab('files')"
                        style="padding: 1rem 1.5rem; background: none; border: none; border-bottom: 3px solid transparent; cursor: pointer;">
                    📁 Files
                </button>
            </div>

            <!-- Tab Content -->
            <div class="tab-content">
                <div id="about-tab" class="tab-panel">
                    ${this.renderAboutTab(character, productionData, activeProduction)}
                </div>
                
                <div id="timeline-tab" class="tab-panel" style="display: none;">
                    ${this.renderTimelineTab(character)}
                </div>
                
                <div id="files-tab" class="tab-panel" style="display: none;">
                    ${this.renderFilesTab(character)}
                </div>
            </div>
        `;
    }

    renderAboutTab(character, productionData, activeProduction) {
        return `
            <div class="about-content">
                <!-- Character Overview -->
                <div class="character-overview" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                    <div class="overview-left">
                        ${character.description ? `
                            <section style="margin-bottom: 2rem;">
                                <h2 style="color: var(--primary); margin-bottom: 1rem;">Description</h2>
                                <p style="line-height: 1.6;">${character.description}</p>
                            </section>
                        ` : ''}
                        
                        ${character.personality ? `
                            <section style="margin-bottom: 2rem;">
                                <h2 style="color: var(--primary); margin-bottom: 1rem;">Personality</h2>
                                <p style="line-height: 1.6;">${character.personality}</p>
                            </section>
                        ` : ''}
                        
                        ${character.background ? `
                            <section style="margin-bottom: 2rem;">
                                <h2 style="color: var(--primary); margin-bottom: 1rem;">Background</h2>
                                <p style="line-height: 1.6;">${character.background}</p>
                            </section>
                        ` : ''}
                    </div>
                    
                    <div class="overview-right">
                        ${character.appearance ? `
                            <section style="margin-bottom: 2rem;">
                                <h2 style="color: var(--primary); margin-bottom: 1rem;">Appearance</h2>
                                <p style="line-height: 1.6;">${character.appearance}</p>
                            </section>
                        ` : ''}
                        
                        ${character.relationships ? `
                            <section style="margin-bottom: 2rem;">
                                <h2 style="color: var(--primary); margin-bottom: 1rem;">Relationships</h2>
                                <p style="line-height: 1.6;">${character.relationships}</p>
                            </section>
                        ` : ''}
                        
                        ${character.notes ? `
                            <section style="margin-bottom: 2rem;">
                                <h2 style="color: var(--primary); margin-bottom: 1rem;">Notes</h2>
                                <p style="line-height: 1.6; white-space: pre-wrap;">${character.notes}</p>
                            </section>
                        ` : ''}
                    </div>
                </div>
                
                <!-- Story-Specific Information -->
                ${activeProduction && productionData ? `
                    <div class="story-specific" style="border-top: 2px solid var(--border); padding-top: 2rem;">
                        <h2 style="color: var(--primary); margin-bottom: 1.5rem;">Role in "${activeProduction.title}"</h2>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                            <div>
                                <div style="background: var(--surface); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                                    <h4 style="margin: 0 0 1rem 0;">Story Role</h4>
                                    <p><strong>Role:</strong> ${this.getRoleLabel(productionData.role)}</p>
                                    <p><strong>Importance:</strong> ${this.renderImportanceStars(productionData.importance)}</p>
                                    <p><strong>Status:</strong> ${productionData.status || 'Active'}</p>
                                </div>
                                
                                ${productionData.motivation ? `
                                    <section style="margin-bottom: 1rem;">
                                        <h4>Goals & Motivation</h4>
                                        <p style="line-height: 1.6;">${productionData.motivation}</p>
                                    </section>
                                ` : ''}
                            </div>
                            
                            <div>
                                ${productionData.arc ? `
                                    <section style="margin-bottom: 1rem;">
                                        <h4>Character Arc</h4>
                                        <p style="line-height: 1.6;">${productionData.arc}</p>
                                    </section>
                                ` : ''}
                                
                                ${productionData.conflict ? `
                                    <section style="margin-bottom: 1rem;">
                                        <h4>Internal Conflict</h4>
                                        <p style="line-height: 1.6;">${productionData.conflict}</p>
                                    </section>
                                ` : ''}
                                
                                ${productionData.relationships ? `
                                    <section style="margin-bottom: 1rem;">
                                        <h4>Story Relationships</h4>
                                        <p style="line-height: 1.6;">${productionData.relationships}</p>
                                    </section>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                ` : ''}
                
                ${!character.description && !character.personality && !character.appearance && !character.background ? `
                    <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                        <p>No character details available yet.</p>
                        <button class="btn btn-primary" onclick="window.app.showCharacterEditor(window.app.charactersView.state.state.characters.get('${character.id}'))" style="margin-top: 1rem;">
                            Add Character Details
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }

    renderTimelineTab(character) {
        // Get events where this character is involved
        const characterEvents = Array.from(this.state.state.events.values())
            .filter(event => event.characterIds && event.characterIds.includes(character.id))
            .sort((a, b) => new Date(a.storyTime || a.created) - new Date(b.storyTime || b.created));
        
        return `
            <div class="timeline-content">
                <div class="timeline-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <div>
                        <h2 style="color: var(--primary); margin: 0;">Character Timeline</h2>
                        <p style="color: var(--text-secondary); margin: 0.5rem 0 0 0;">Events involving ${character.name}</p>
                    </div>
                    <button class="btn btn-primary" onclick="window.app.characterDetailView.addTimelineEvent('${character.id}')">
                        ➕ Add Event
                    </button>
                </div>
                
                ${characterEvents.length > 0 ? `
                    <div class="timeline-events">
                        ${characterEvents.map(event => {
                            const production = event.productionId ? this.state.state.productions.get(event.productionId) : null;
                            return `
                                <div class="timeline-event" style="border-left: 4px solid var(--primary); padding: 1rem; margin-bottom: 1rem; background: var(--surface); border-radius: 0 0.5rem 0.5rem 0;">
                                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                                        <h4 style="margin: 0;">${event.title}</h4>
                                        ${production ? `
                                            <span style="background: var(--primary); color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">
                                                ${production.title}
                                            </span>
                                        ` : ''}
                                    </div>
                                    
                                    ${event.description ? `
                                        <p style="margin: 0.5rem 0; line-height: 1.6;">${event.description}</p>
                                    ` : ''}
                                    
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; font-size: 0.875rem; color: var(--text-secondary);">
                                        <span>
                                            ${event.storyTime ? `Story: ${event.storyTime}` : ''}
                                            ${event.chapter ? ` • Chapter ${event.chapter}` : ''}
                                            ${event.scene ? ` • Scene ${event.scene}` : ''}
                                        </span>
                                        <div>
                                            <button class="btn btn-secondary btn-sm" onclick="window.app.characterDetailView.editTimelineEvent('${event.id}')" style="margin-right: 0.5rem;">
                                                Edit
                                            </button>
                                            <button class="btn btn-danger btn-sm" onclick="window.app.characterDetailView.deleteTimelineEvent('${event.id}')">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                ` : `
                    <div class="empty-timeline" style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">⏰</div>
                        <h3>No timeline events yet</h3>
                        <p>Add events to track ${character.name}'s story progression</p>
                        <button class="btn btn-primary" onclick="window.app.characterDetailView.addTimelineEvent('${character.id}')" style="margin-top: 1rem;">
                            Add First Event
                        </button>
                    </div>
                `}
            </div>
        `;
    }

    renderFilesTab(character) {
        // Initialize character files if they don't exist
        if (!character.files) {
            character.files = [];
        }
        
        return `
            <div class="files-content">
                <div class="files-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <div>
                        <h2 style="color: var(--primary); margin: 0;">Character Files</h2>
                        <p style="color: var(--text-secondary); margin: 0.5rem 0 0 0;">Documents, notes, and references for ${character.name}</p>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-secondary" onclick="window.app.characterDetailView.importCharacterNotes('${character.id}')">
                            📥 Import Notes
                        </button>
                        <button class="btn btn-primary" onclick="window.app.characterDetailView.createNewFile('${character.id}', 'text')">
                            📄 Text
                        </button>
                        <button class="btn btn-secondary" onclick="window.app.characterDetailView.createNewFile('${character.id}', 'image')">
                            🖼️ Image
                        </button>
                    </div>
                </div>
                
                ${character.files.length > 0 ? `
                    <div class="files-list">
                        ${character.files.map(file => `
                            <div class="file-item" style="border: 1px solid var(--border); border-radius: 0.5rem; margin-bottom: 1rem; overflow: hidden;">
                                <div class="file-header" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--surface); border-bottom: 1px solid var(--border);">
                                    <div>
                                        <h4 style="margin: 0; display: flex; align-items: center; gap: 0.5rem;">
                                            ${this.getFileIcon(file.type)}
                                            <span>${file.name}</span>
                                        </h4>
                                        <p style="margin: 0.25rem 0 0 0; color: var(--text-secondary); font-size: 0.875rem;">
                                            ${file.type} • Last modified: ${new Date(file.lastModified).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div style="display: flex; gap: 0.5rem;">
                                        <button class="btn btn-secondary btn-sm" onclick="window.app.characterDetailView.editFile('${character.id}', '${file.id}')">
                                            ✏️ Edit
                                        </button>
                                        <button class="btn btn-danger btn-sm" onclick="window.app.characterDetailView.deleteFile('${character.id}', '${file.id}')">
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                                
                                <div class="file-content" style="padding: 1rem;">
                                    ${file.type === 'text' ? `
                                        <div style="white-space: pre-wrap; line-height: 1.6; font-family: monospace; background: var(--background); padding: 1rem; border-radius: 0.375rem; max-height: 200px; overflow-y: auto;">
                                            ${file.content || 'Empty file'}
                                        </div>
                                    ` : file.type === 'markdown' ? `
                                        <div style="line-height: 1.6; max-height: 200px; overflow-y: auto;">
                                            ${this.renderMarkdown(file.content || 'Empty file')}
                                        </div>
                                    ` : file.type === 'image' ? `
                                        <div style="text-align: center;">
                                            ${file.content ? `
                                                <img src="${file.content}" alt="${file.name}" style="max-width: 100%; max-height: 200px; border-radius: 0.375rem;">
                                            ` : `
                                                <div style="background: var(--surface); padding: 2rem; border-radius: 0.375rem; color: var(--text-secondary);">
                                                    No image uploaded
                                                </div>
                                            `}
                                        </div>
                                    ` : `
                                        <div style="background: var(--surface); padding: 1rem; border-radius: 0.375rem; color: var(--text-secondary);">
                                            ${file.description || 'No preview available'}
                                        </div>
                                    `}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div class="empty-files" style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">📁</div>
                        <h3>No files yet</h3>
                        <p>Create files to store character notes, references, and documents</p>
                        <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 1rem;">
                            <button class="btn btn-primary" onclick="window.app.characterDetailView.createNewFile('${character.id}', 'text')">
                                📄 Text File
                            </button>
                            <button class="btn btn-secondary" onclick="window.app.characterDetailView.createNewFile('${character.id}', 'markdown')">
                                📝 Markdown
                            </button>
                            <button class="btn btn-secondary" onclick="window.app.characterDetailView.createNewFile('${character.id}', 'image')">
                                🖼️ Image
                            </button>
                        </div>
                    </div>
                `}
            </div>
        `;
    }

    // File management methods
    createNewFile(characterId, fileType = 'text') {
        const fileName = prompt('Enter file name:');
        if (!fileName) return;
        
        const character = this.state.state.characters.get(characterId);
        if (!character.files) character.files = [];
        
        const newFile = {
            id: `file-${Date.now()}`,
            name: fileName,
            type: fileType,
            content: '',
            description: '',
            created: new Date().toISOString(),
            lastModified: new Date().toISOString()
        };
        
        character.files.push(newFile);
        
        // Re-render the files tab content
        const filesTab = document.getElementById('files-tab');
        if (filesTab) {
            filesTab.innerHTML = this.renderFilesTab(character);
        }
        
        // Switch to files tab
        this.switchTab('files');
        
        // Immediately open for editing
        setTimeout(() => this.editFile(characterId, newFile.id), 100);
    }
    
    editFile(characterId, fileId) {
        const character = this.state.state.characters.get(characterId);
        const file = character.files.find(f => f.id === fileId);
        if (!file) return;
        
        const dialogHtml = `
            <div class="file-editor-overlay" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
                <div class="file-editor-modal" style="background: var(--background); border-radius: 0.5rem; width: 90%; max-width: 800px; max-height: 90vh; overflow: hidden; box-shadow: var(--shadow-xl);">
                    <div class="modal-header" style="padding: 1.5rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
                        <h2 style="margin: 0;">Edit ${file.name}</h2>
                        <button onclick="this.closest('.file-editor-overlay').remove()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-secondary);">×</button>
                    </div>
                    
                    <div class="modal-body" style="padding: 1.5rem; max-height: 70vh; overflow-y: auto;">
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="file-name" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">File Name</label>
                            <input type="text" id="file-name" value="${file.name}" 
                                   style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                        </div>
                        
                        ${file.type === 'text' || file.type === 'markdown' ? `
                            <div class="form-group" style="margin-bottom: 1rem;">
                                <label for="file-content" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Content</label>
                                <textarea id="file-content" rows="15" 
                                          style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; font-family: monospace; resize: vertical;"
                                          placeholder="Enter your content here...">${file.content}</textarea>
                            </div>
                        ` : file.type === 'image' ? `
                            <div class="form-group" style="margin-bottom: 1rem;">
                                <label for="file-url" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Image URL</label>
                                <input type="url" id="file-url" value="${file.content}" 
                                       style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;"
                                       placeholder="https://example.com/image.jpg">
                            </div>
                        ` : ''}
                        
                        <div class="form-group">
                            <label for="file-description" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Description</label>
                            <textarea id="file-description" rows="3" 
                                      style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; resize: vertical;"
                                      placeholder="Optional description...">${file.description || ''}</textarea>
                        </div>
                    </div>
                    
                    <div class="modal-footer" style="padding: 1.5rem; border-top: 1px solid var(--border); display: flex; justify-content: end; gap: 0.5rem;">
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.file-editor-overlay').remove()">
                            Cancel
                        </button>
                        <button type="button" class="btn btn-primary" onclick="window.app.characterDetailView.saveFile('${characterId}', '${fileId}', this)">
                            Save File
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', dialogHtml);
    }
    
    saveFile(characterId, fileId, buttonElement) {
        const modal = buttonElement.closest('.file-editor-modal');
        const character = this.state.state.characters.get(characterId);
        const file = character.files.find(f => f.id === fileId);
        
        if (!file) return;
        
        // Update file data
        file.name = modal.querySelector('#file-name').value;
        file.description = modal.querySelector('#file-description').value;
        
        if (file.type === 'text' || file.type === 'markdown') {
            file.content = modal.querySelector('#file-content').value;
        } else if (file.type === 'image') {
            file.content = modal.querySelector('#file-url').value;
        }
        
        file.lastModified = new Date().toISOString();
        
        // Close modal
        modal.closest('.file-editor-overlay').remove();
        
        // Re-render the files tab content
        const filesTab = document.getElementById('files-tab');
        if (filesTab) {
            filesTab.innerHTML = this.renderFilesTab(character);
        }
        
        // Switch to files tab
        this.switchTab('files');
    }
    
    deleteFile(characterId, fileId) {
        const character = this.state.state.characters.get(characterId);
        const file = character.files.find(f => f.id === fileId);
        
        if (!file) return;
        
        if (confirm(`Are you sure you want to delete "${file.name}"?`)) {
            character.files = character.files.filter(f => f.id !== fileId);
            
            // Re-render the files tab content
            const filesTab = document.getElementById('files-tab');
            if (filesTab) {
                filesTab.innerHTML = this.renderFilesTab(character);
            }
            
            // Switch to files tab
            this.switchTab('files');
        }
    }
    
    // Timeline event methods
    addTimelineEvent(characterId) {
        const character = this.state.state.characters.get(characterId);
        if (!character) return;
        
        // Get all characters for multi-selection
        const allCharacters = Array.from(this.state.state.characters.values());
        const productions = Array.from(this.state.state.productions.values());
        
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
            <div class="modal-content" style="background: var(--background); border-radius: 0.5rem; padding: 2rem; width: 90%; max-width: 700px; max-height: 90vh; overflow-y: auto;">
                <h2 style="margin: 0 0 1.5rem 0; color: var(--primary);">📅 Add Timeline Event</h2>
                
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Event Title</label>
                    <input type="text" id="event-title" placeholder="e.g., Meeting at Foundation Headquarters" style="
                        width: 100%;
                        padding: 0.75rem;
                        border: 1px solid var(--border);
                        border-radius: 0.375rem;
                        background: var(--surface);
                        margin-bottom: 1rem;
                    ">
                    
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Description</label>
                    <textarea id="event-description" placeholder="Describe what happens in this event..." style="
                        width: 100%;
                        padding: 0.75rem;
                        border: 1px solid var(--border);
                        border-radius: 0.375rem;
                        background: var(--surface);
                        min-height: 100px;
                        margin-bottom: 1rem;
                        resize: vertical;
                    "></textarea>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">World Time</label>
                            <input type="text" id="event-story-time" placeholder="e.g., 2040-03-15, Age 25, Early War" style="
                                width: 100%;
                                padding: 0.75rem;
                                border: 1px solid var(--border);
                                border-radius: 0.375rem;
                                background: var(--surface);
                            ">
                            <small style="color: var(--text-secondary);">When this actually happens in your world</small>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Include in Story (Optional)</label>
                            <select id="event-production" style="
                                width: 100%;
                                padding: 0.75rem;
                                border: 1px solid var(--border);
                                border-radius: 0.375rem;
                                background: var(--surface);
                            ">
                                <option value="">World Event Only (No Story Yet)</option>
                                ${productions.map(prod => 
                                    `<option value="${prod.id}" ${prod.id === this.state.activeProductionId ? 'selected' : ''}>${prod.title}</option>`
                                ).join('')}
                            </select>
                            <small style="color: var(--text-secondary);">You can add to stories later</small>
                        </div>
                    </div>
                    
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Characters Involved</label>
                    <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 0.375rem; padding: 1rem; max-height: 200px; overflow-y: auto;">
                        ${allCharacters.map(char => `
                            <label style="display: flex; align-items: center; padding: 0.5rem; cursor: pointer; border-radius: 0.25rem;" 
                                   onmouseover="this.style.background='var(--background)'" 
                                   onmouseout="this.style.background='transparent'">
                                <input type="checkbox" value="${char.id}" ${char.id === characterId ? 'checked' : ''} 
                                       style="margin-right: 0.5rem;">
                                <span>${char.name}</span>
                                ${char.id === characterId ? '<span style="margin-left: auto; color: var(--primary); font-size: 0.75rem;">CURRENT</span>' : ''}
                            </label>
                        `).join('')}
                    </div>
                </div>
                
                <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                    <button onclick="this.closest('.modal-overlay').remove()" class="btn btn-secondary">
                        Cancel
                    </button>
                    <button onclick="window.app.characterDetailView.saveTimelineEvent('${characterId}'); this.closest('.modal-overlay').remove();" class="btn btn-primary">
                        Add Event
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.getElementById('event-title').focus();
    }
    
    saveTimelineEvent(characterId) {
        const title = document.getElementById('event-title').value.trim();
        const description = document.getElementById('event-description').value.trim();
        const storyTime = document.getElementById('event-story-time').value.trim();
        const productionId = document.getElementById('event-production').value;
        
        if (!title) {
            alert('Please enter an event title');
            return;
        }
        
        // Get selected characters
        const characterCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
        const selectedCharacterIds = Array.from(characterCheckboxes).map(cb => cb.value);
        
        if (selectedCharacterIds.length === 0) {
            alert('Please select at least one character');
            return;
        }
        
        // Create the event as a world-level event
        const event = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            title: title,
            description: description,
            worldTime: storyTime,  // When it happens in the world
            characterIds: selectedCharacterIds,
            location: '',  // Can be added later
            type: 'general',  // event type: general, meeting, battle, discovery, etc.
            visibility: 'known',  // known, secret, forgotten
            
            // Story inclusion tracking
            storyInclusion: {},
            
            // If a production is selected, add initial inclusion
            ...(productionId && {
                storyInclusion: {
                    [productionId]: {
                        included: true,
                        storyTime: storyTime,  // When/where it appears in this story
                        perspective: characterId,  // From whose POV
                        shown: 'full',  // full, mentioned, implied, flashback
                        notes: ''
                    }
                }
            }),
            
            created: new Date().toISOString(),
            lastModified: new Date().toISOString()
        };
        
        // Add to state
        this.state.state.events.set(event.id, event);
        
        // Save changes
        this.app.persistence.save();
        this.app.events.emit('dataChanged');
        
        // Re-render the timeline tab
        const timelineTab = document.getElementById('timeline-tab');
        if (timelineTab) {
            const character = this.state.state.characters.get(characterId);
            timelineTab.innerHTML = this.renderTimelineTab(character);
        }
        
        // Switch to timeline tab
        this.switchTab('timeline');
        
        // Show success message
        const characterNames = selectedCharacterIds.map(id => 
            this.state.state.characters.get(id)?.name || id
        ).join(', ');
        
        alert(`✅ Event "${title}" added to timeline!\\n\\nCharacters involved: ${characterNames}`);
    }

    editTimelineEvent(eventId) {
        // TODO: Implement timeline event editing
        alert('Timeline event editing coming soon!');
    }
    
    deleteTimelineEvent(eventId) {
        if (confirm('Are you sure you want to delete this timeline event?')) {
            this.state.state.events.delete(eventId);
            this.switchTab('timeline'); // Refresh
        }
    }
    
    getFileIcon(type) {
        const icons = {
            'text': '📄',
            'markdown': '📝',
            'image': '🖼️',
            'pdf': '📜',
            'link': '🔗'
        };
        return icons[type] || '📄';
    }
    
    renderMarkdown(content) {
        // Simple markdown rendering (basic implementation)
        return content
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/gim, '<em>$1</em>')
            .replace(/\n/gim, '<br>');
    }

    renderStoriesSection(character) {
        const productions = character.productionIds ? 
            character.productionIds.map(id => this.state.state.productions.get(id)).filter(p => p) : [];

        if (productions.length === 0) {
            return '';
        }

        return `
            <div class="sidebar-section" style="background: var(--surface); padding: 1.5rem; border-radius: 0.5rem;">
                <h3 style="margin-bottom: 1rem;">Appears In</h3>
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    ${productions.map(prod => {
                        const isActive = this.state.activeProductionId === prod.id;
                        return `
                            <div onclick="window.app.selectProduction('${prod.id}')" 
                                 style="padding: 0.75rem; background: ${isActive ? 'var(--primary)' : 'var(--background)'}; 
                                        color: ${isActive ? 'white' : 'var(--text-primary)'}; 
                                        border-radius: 0.375rem; cursor: pointer; transition: all 0.2s;">
                                <div style="font-weight: 600;">${prod.title}</div>
                                <div style="font-size: 0.75rem; opacity: 0.8;">
                                    ${this.app.productionSelector.getProductionTypeLabel(prod.type)}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    renderNotFound() {
        return `
            <div class="character-not-found" style="text-align: center; padding: 3rem;">
                <h1>Character Not Found</h1>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">The character you're looking for doesn't exist.</p>
                <button class="btn btn-primary" onclick="window.app.router.navigate('characters')">
                    Back to Characters
                </button>
            </div>
        `;
    }

    switchTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.style.display = 'none';
        });
        
        // Remove active class from all buttons
        document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.remove('active');
            button.style.borderBottom = '3px solid transparent';
        });
        
        // Show selected tab
        const selectedTab = document.getElementById(`${tabName}-tab`);
        if (selectedTab) {
            selectedTab.style.display = 'block';
        }
        
        // Add active class to selected button
        const selectedButton = document.querySelector(`[data-tab="${tabName}"]`);
        if (selectedButton) {
            selectedButton.classList.add('active');
            selectedButton.style.borderBottom = '3px solid var(--primary)';
        }
    }

    getCharacterSubtitle(character, productionData) {
        const activeProduction = this.state.getActiveProduction();
        
        if (activeProduction && productionData) {
            return `${this.getRoleLabel(productionData.role)} in "${activeProduction.title}"`;
        }
        
        const storyCount = character.productionIds ? character.productionIds.length : 0;
        if (storyCount > 0) {
            return `Appears in ${storyCount} ${storyCount === 1 ? 'story' : 'stories'}`;
        }
        
        return 'World Character';
    }

    getRoleLabel(role) {
        const roleLabels = {
            'protagonist': '🌟 Protagonist',
            'antagonist': '⚔️ Antagonist',
            'deuteragonist': '🎭 Deuteragonist',
            'supporting': '👥 Supporting',
            'minor': '🔸 Minor',
            'mentor': '🧙 Mentor',
            'love_interest': '💕 Love Interest',
            'comic_relief': '😄 Comic Relief'
        };
        
        return roleLabels[role] || role || 'No role';
    }

    getInitials(name) {
        return name.split(' ')
            .map(part => part.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }

    renderImportanceStars(importance) {
        const stars = Math.min(Math.max(importance, 1), 5);
        return Array.from({ length: 5 }, (_, i) => 
            `<span style="color: ${i < stars ? 'var(--warning)' : 'var(--border)'};">★</span>`
        ).join('');
    }
    
    importCharacterNotes(characterId) {
        const character = this.state.state.characters.get(characterId);
        if (!character) return;
        
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = '.md,.txt';
        
        input.onchange = async (e) => {
            const files = Array.from(e.target.files);
            if (files.length === 0) return;
            
            // Initialize character files if they don't exist
            if (!character.files) {
                character.files = [];
            }
            
            const loadingOverlay = document.createElement('div');
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
                color: white;
                font-size: 1.2rem;
            `;
            loadingOverlay.innerHTML = `
                <div style="text-align: center;">
                    <div style="margin-bottom: 1rem;">📥 Importing character notes...</div>
                    <div style="font-size: 0.9rem;">Processing ${files.length} file(s)</div>
                </div>
            `;
            document.body.appendChild(loadingOverlay);
            
            try {
                for (const file of files) {
                    const content = await this.readFile(file);
                    const fileType = file.name.endsWith('.md') ? 'markdown' : 'text';
                    
                    const characterFile = {
                        id: Date.now() + Math.random().toString(36).substr(2, 9),
                        name: file.name,
                        type: fileType,
                        content: content,
                        created: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        imported: true
                    };
                    
                    character.files.push(characterFile);
                }
                
                // Save changes
                this.app.persistence.save();
                this.app.events.emit('dataChanged');
                
                // Re-render the files tab
                const filesTab = document.getElementById('files-tab');
                if (filesTab) {
                    filesTab.innerHTML = this.renderFilesTab(character);
                }
                
                // Switch to files tab to show imported files
                this.switchTab('files');
                
                loadingOverlay.remove();
                alert(`✅ Successfully imported ${files.length} character note(s) for ${character.name}!`);
                
            } catch (error) {
                console.error('Error importing character notes:', error);
                loadingOverlay.remove();
                alert('Error importing character notes: ' + error.message);
            }
        };
        
        input.click();
    }
    
    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }
}