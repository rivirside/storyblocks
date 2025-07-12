// Location Detail View (Full Page)
class LocationDetailView {
    constructor(app) {
        this.app = app;
        this.state = app.state;
        this.events = app.events;
        this.locationId = null;
    }

    render(locationId) {
        this.locationId = locationId;
        const location = this.state.state.locations.get(locationId);
        
        if (!location) {
            return this.renderNotFound();
        }

        return `
            <div class="location-detail-view">
                <div class="detail-header" style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 2rem;">
                    <div>
                        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
                            <button class="btn btn-secondary" onclick="window.app.router.navigate('locations')" style="padding: 0.5rem;">
                                ← Back to Locations
                            </button>
                            <h1 style="margin: 0;">${location.name}</h1>
                        </div>
                        <p style="color: var(--text-secondary); margin: 0;">
                            ${this.getLocationSubtitle(location)}
                        </p>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-primary" onclick="alert('Location editing coming soon!')">
                            ✏️ Edit Location
                        </button>
                    </div>
                </div>

                <div class="detail-content" style="display: grid; grid-template-columns: 300px 1fr; gap: 2rem;">
                    <!-- Left Sidebar -->
                    <div class="location-sidebar">
                        ${this.renderSidebar(location)}
                    </div>

                    <!-- Main Content -->
                    <div class="location-main">
                        ${this.renderMainContent(location)}
                    </div>
                </div>
            </div>
        `;
    }

    renderSidebar(location) {
        return `
            <div class="sidebar-section" style="background: var(--surface); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                <div style="text-align: center; margin-bottom: 1.5rem;">
                    <div style="width: 100%; height: 150px; border-radius: 0.5rem; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 3rem;">${this.getLocationIcon(location.type)}</div>
                </div>
                
                <h3 style="margin-bottom: 1rem;">Quick Info</h3>
                
                <div style="margin-bottom: 1rem;">
                    <strong style="display: block; color: var(--text-secondary); font-size: 0.875rem;">Type</strong>
                    <span>${this.getLocationTypeLabel(location.type)}</span>
                </div>
                
                ${location.tags && location.tags.length > 0 ? `
                    <div style="margin-bottom: 1rem;">
                        <strong style="display: block; color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 0.5rem;">Tags</strong>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.25rem;">
                            ${location.tags.map(tag => 
                                `<span style="background: var(--primary); color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">${tag}</span>`
                            ).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>

            ${this.renderStoriesSection(location)}
        `;
    }

    renderMainContent(location) {
        return `
            <!-- Navigation Tabs -->
            <div class="content-tabs" style="display: flex; border-bottom: 2px solid var(--border); margin-bottom: 2rem;">
                <button class="tab-button active" data-tab="about" onclick="window.app.locationDetailView.switchTab('about')"
                        style="padding: 1rem 1.5rem; background: none; border: none; border-bottom: 3px solid var(--primary); cursor: pointer; font-weight: 600;">
                    🏛️ About
                </button>
                <button class="tab-button" data-tab="files" onclick="window.app.locationDetailView.switchTab('files')"
                        style="padding: 1rem 1.5rem; background: none; border: none; border-bottom: 3px solid transparent; cursor: pointer;">
                    📁 Files
                </button>
            </div>

            <!-- Tab Content -->
            <div class="tab-content">
                <div id="about-tab" class="tab-panel">
                    ${this.renderAboutTab(location)}
                </div>
                
                <div id="files-tab" class="tab-panel" style="display: none;">
                    ${this.renderFilesTab(location)}
                </div>
            </div>
        `;
    }

    renderAboutTab(location) {
        return `
            <div class="about-content">
                <div class="location-overview">
                    ${location.description ? `
                        <section style="margin-bottom: 2rem;">
                            <h2 style="color: var(--primary); margin-bottom: 1rem;">Description</h2>
                            <p style="line-height: 1.6;">${location.description}</p>
                        </section>
                    ` : ''}
                    
                    ${location.geography ? `
                        <section style="margin-bottom: 2rem;">
                            <h2 style="color: var(--primary); margin-bottom: 1rem;">Geography</h2>
                            <p style="line-height: 1.6;">${location.geography}</p>
                        </section>
                    ` : ''}
                    
                    ${location.appearance ? `
                        <section style="margin-bottom: 2rem;">
                            <h2 style="color: var(--primary); margin-bottom: 1rem;">Appearance</h2>
                            <p style="line-height: 1.6;">${location.appearance}</p>
                        </section>
                    ` : ''}
                    
                    ${location.atmosphere ? `
                        <section style="margin-bottom: 2rem;">
                            <h2 style="color: var(--primary); margin-bottom: 1rem;">Atmosphere</h2>
                            <p style="line-height: 1.6;">${location.atmosphere}</p>
                        </section>
                    ` : ''}
                    
                    ${location.significance ? `
                        <section style="margin-bottom: 2rem;">
                            <h2 style="color: var(--primary); margin-bottom: 1rem;">Significance</h2>
                            <p style="line-height: 1.6;">${location.significance}</p>
                        </section>
                    ` : ''}
                    
                    ${location.history ? `
                        <section style="margin-bottom: 2rem;">
                            <h2 style="color: var(--primary); margin-bottom: 1rem;">History</h2>
                            <p style="line-height: 1.6;">${location.history}</p>
                        </section>
                    ` : ''}
                </div>
                
                ${!location.description && !location.geography && !location.appearance && !location.atmosphere ? `
                    <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                        <p>No location details available yet.</p>
                        <button class="btn btn-primary" onclick="alert('Location editing coming soon!')" style="margin-top: 1rem;">
                            Add Location Details
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }

    renderFilesTab(location) {
        // Initialize location files if they don't exist
        if (!location.files) {
            location.files = [];
        }
        
        return `
            <div class="files-content">
                <div class="files-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <div>
                        <h2 style="color: var(--primary); margin: 0;">Location Files</h2>
                        <p style="color: var(--text-secondary); margin: 0.5rem 0 0 0;">Documents, maps, and references for ${location.name}</p>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-primary" onclick="window.app.locationDetailView.createNewFile('${location.id}', 'text')">
                            📄 Text
                        </button>
                        <button class="btn btn-secondary" onclick="window.app.locationDetailView.createNewFile('${location.id}', 'image')">
                            🖼️ Image
                        </button>
                    </div>
                </div>
                
                ${location.files.length > 0 ? `
                    <div class="files-list">
                        ${location.files.map(file => `
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
                                        <button class="btn btn-secondary btn-sm" onclick="window.app.locationDetailView.editFile('${location.id}', '${file.id}')">
                                            ✏️ Edit
                                        </button>
                                        <button class="btn btn-danger btn-sm" onclick="window.app.locationDetailView.deleteFile('${location.id}', '${file.id}')">
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                                
                                <div class="file-content" style="padding: 1rem;">
                                    ${file.type === 'text' ? `
                                        <div style="white-space: pre-wrap; line-height: 1.6; font-family: monospace; background: var(--background); padding: 1rem; border-radius: 0.375rem; max-height: 200px; overflow-y: auto;">
                                            ${file.content || 'Empty file'}
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
                        <p>Create files to store location maps, references, and documents</p>
                        <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 1rem;">
                            <button class="btn btn-primary" onclick="window.app.locationDetailView.createNewFile('${location.id}', 'text')">
                                📄 Text File
                            </button>
                            <button class="btn btn-secondary" onclick="window.app.locationDetailView.createNewFile('${location.id}', 'image')">
                                🖼️ Image
                            </button>
                        </div>
                    </div>
                `}
            </div>
        `;
    }

    // File management methods (similar to character detail)
    createNewFile(locationId, fileType = 'text') {
        const fileName = prompt('Enter file name:');
        if (!fileName) return;
        
        const location = this.state.state.locations.get(locationId);
        if (!location.files) location.files = [];
        
        const newFile = {
            id: `file-${Date.now()}`,
            name: fileName,
            type: fileType,
            content: '',
            description: '',
            created: new Date().toISOString(),
            lastModified: new Date().toISOString()
        };
        
        location.files.push(newFile);
        
        // Re-render the files tab content
        const filesTab = document.getElementById('files-tab');
        if (filesTab) {
            filesTab.innerHTML = this.renderFilesTab(location);
        }
        
        // Switch to files tab
        this.switchTab('files');
        
        // Immediately open for editing
        setTimeout(() => this.editFile(locationId, newFile.id), 100);
    }
    
    editFile(locationId, fileId) {
        const location = this.state.state.locations.get(locationId);
        const file = location.files.find(f => f.id === fileId);
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
                        
                        ${file.type === 'text' ? `
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
                        <button type="button" class="btn btn-primary" onclick="window.app.locationDetailView.saveFile('${locationId}', '${fileId}', this)">
                            Save File
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', dialogHtml);
    }
    
    saveFile(locationId, fileId, buttonElement) {
        const modal = buttonElement.closest('.file-editor-modal');
        const location = this.state.state.locations.get(locationId);
        const file = location.files.find(f => f.id === fileId);
        
        if (!file) return;
        
        // Update file data
        file.name = modal.querySelector('#file-name').value;
        file.description = modal.querySelector('#file-description').value;
        
        if (file.type === 'text') {
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
            filesTab.innerHTML = this.renderFilesTab(location);
        }
        
        // Switch to files tab
        this.switchTab('files');
    }
    
    deleteFile(locationId, fileId) {
        const location = this.state.state.locations.get(locationId);
        const file = location.files.find(f => f.id === fileId);
        
        if (!file) return;
        
        if (confirm(`Are you sure you want to delete "${file.name}"?`)) {
            location.files = location.files.filter(f => f.id !== fileId);
            
            // Re-render the files tab content
            const filesTab = document.getElementById('files-tab');
            if (filesTab) {
                filesTab.innerHTML = this.renderFilesTab(location);
            }
            
            // Switch to files tab
            this.switchTab('files');
        }
    }

    renderStoriesSection(location) {
        const productions = location.productionIds ? 
            location.productionIds.map(id => this.state.state.productions.get(id)).filter(p => p) : [];

        if (productions.length === 0) {
            return '';
        }

        return `
            <div class="sidebar-section" style="background: var(--surface); padding: 1.5rem; border-radius: 0.5rem;">
                <h3 style="margin-bottom: 1rem;">Used In</h3>
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
            <div class="location-not-found" style="text-align: center; padding: 3rem;">
                <h1>Location Not Found</h1>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">The location you're looking for doesn't exist.</p>
                <button class="btn btn-primary" onclick="window.app.router.navigate('locations')">
                    Back to Locations
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

    getLocationSubtitle(location) {
        const storyCount = location.productionIds ? location.productionIds.length : 0;
        if (storyCount > 0) {
            return `Used in ${storyCount} ${storyCount === 1 ? 'story' : 'stories'}`;
        }
        return 'World Location';
    }

    getLocationIcon(type) {
        const icons = {
            'city': '🏙️',
            'town': '🏘️',
            'village': '🏡',
            'building': '🏢',
            'room': '🚪',
            'outdoor': '🌲',
            'landmark': '🏛️',
            'dungeon': '🕳️',
            'castle': '🏰',
            'temple': '⛪'
        };
        return icons[type] || '📍';
    }

    getLocationTypeLabel(type) {
        const labels = {
            'city': 'City',
            'town': 'Town', 
            'village': 'Village',
            'building': 'Building',
            'room': 'Room',
            'outdoor': 'Outdoor Area',
            'landmark': 'Landmark',
            'dungeon': 'Dungeon',
            'castle': 'Castle',
            'temple': 'Temple'
        };
        return labels[type] || type || 'Location';
    }

    getFileIcon(type) {
        const icons = {
            'text': '📄',
            'image': '🖼️',
            'pdf': '📜',
            'link': '🔗'
        };
        return icons[type] || '📄';
    }
}