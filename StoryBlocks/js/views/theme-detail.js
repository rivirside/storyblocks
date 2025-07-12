// Theme Detail View (Full Page)
class ThemeDetailView {
    constructor(app) {
        this.app = app;
        this.state = app.state;
        this.events = app.events;
        this.themeId = null;
        this.currentTab = 'overview';
    }

    render(themeId) {
        this.themeId = themeId;
        const theme = this.state.state.themes.get(themeId);
        
        if (!theme) {
            return this.renderNotFound();
        }

        return `
            <div class="theme-detail-view">
                <div class="detail-header" style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 2rem;">
                    <div>
                        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
                            <button class="btn btn-secondary" onclick="window.app.router.navigate('themes')" style="padding: 0.5rem;">
                                ← Back to Themes
                            </button>
                            <h1 style="margin: 0;">${theme.title}</h1>
                        </div>
                        <p style="color: var(--text-secondary); margin: 0;">
                            ${theme.category.charAt(0).toUpperCase() + theme.category.slice(1)} Theme
                        </p>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-primary" onclick="window.app.themeDetailView.editTheme()">
                            ✏️ Edit Theme
                        </button>
                        <button class="btn btn-danger" onclick="window.app.themeDetailView.deleteTheme()">
                            🗑️ Delete
                        </button>
                    </div>
                </div>

                <!-- Tabs -->
                <div class="detail-tabs" style="border-bottom: 1px solid var(--border); margin-bottom: 2rem;">
                    <button class="tab-button ${this.currentTab === 'overview' ? 'active' : ''}" 
                            onclick="window.app.themeDetailView.switchTab('overview')"
                            style="padding: 1rem 1.5rem; background: none; border: none; border-bottom: 2px solid ${this.currentTab === 'overview' ? 'var(--primary)' : 'transparent'}; cursor: pointer;">
                        Overview
                    </button>
                    <button class="tab-button ${this.currentTab === 'exploration' ? 'active' : ''}" 
                            onclick="window.app.themeDetailView.switchTab('exploration')"
                            style="padding: 1rem 1.5rem; background: none; border: none; border-bottom: 2px solid ${this.currentTab === 'exploration' ? 'var(--primary)' : 'transparent'}; cursor: pointer;">
                        Exploration
                    </button>
                    <button class="tab-button ${this.currentTab === 'files' ? 'active' : ''}" 
                            onclick="window.app.themeDetailView.switchTab('files')"
                            style="padding: 1rem 1.5rem; background: none; border: none; border-bottom: 2px solid ${this.currentTab === 'files' ? 'var(--primary)' : 'transparent'}; cursor: pointer;">
                        Files
                    </button>
                    <button class="tab-button ${this.currentTab === 'usage' ? 'active' : ''}" 
                            onclick="window.app.themeDetailView.switchTab('usage')"
                            style="padding: 1rem 1.5rem; background: none; border: none; border-bottom: 2px solid ${this.currentTab === 'usage' ? 'var(--primary)' : 'transparent'}; cursor: pointer;">
                        Usage
                    </button>
                </div>

                <!-- Tab Content -->
                <div class="tab-content" id="theme-tab-content">
                    ${this.renderTabContent(theme)}
                </div>
            </div>
        `;
    }

    renderTabContent(theme) {
        switch(this.currentTab) {
            case 'overview':
                return this.renderOverviewTab(theme);
            case 'exploration':
                return this.renderExplorationTab(theme);
            case 'files':
                return this.renderFilesTab(theme);
            case 'usage':
                return this.renderUsageTab(theme);
            default:
                return this.renderOverviewTab(theme);
        }
    }

    renderOverviewTab(theme) {
        return `
            <div class="overview-tab">
                <div class="info-section" style="background: var(--surface); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <h3 style="margin-bottom: 1rem;">Theme Statement</h3>
                    <p style="font-style: italic; font-size: 1.125rem; line-height: 1.6;">
                        ${theme.statement || 'No theme statement yet.'}
                    </p>
                </div>

                <div class="info-section" style="background: var(--surface); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <h3 style="margin-bottom: 1rem;">Description</h3>
                    <p style="white-space: pre-wrap;">${theme.description || 'No description yet.'}</p>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                    <div class="info-section" style="background: var(--surface); padding: 1.5rem; border-radius: 0.5rem;">
                        <h3 style="margin-bottom: 1rem;">Details</h3>
                        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                            <div>
                                <strong style="color: var(--text-secondary);">Category:</strong>
                                <span>${theme.category.charAt(0).toUpperCase() + theme.category.slice(1)}</span>
                            </div>
                            <div>
                                <strong style="color: var(--text-secondary);">Created:</strong>
                                <span>${new Date(theme.created).toLocaleDateString()}</span>
                            </div>
                            <div>
                                <strong style="color: var(--text-secondary);">Last Modified:</strong>
                                <span>${new Date(theme.lastModified).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    <div class="info-section" style="background: var(--surface); padding: 1.5rem; border-radius: 0.5rem;">
                        <h3 style="margin-bottom: 1rem;">Tags</h3>
                        ${theme.tags && theme.tags.length > 0 ? `
                            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                                ${theme.tags.map(tag => `
                                    <span style="background: var(--primary); color: white; padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.875rem;">
                                        ${tag}
                                    </span>
                                `).join('')}
                            </div>
                        ` : '<p style="color: var(--text-secondary);">No tags added yet.</p>'}
                    </div>
                </div>
            </div>
        `;
    }

    renderExplorationTab(theme) {
        return `
            <div class="exploration-tab">
                <div class="section" style="margin-bottom: 2rem;">
                    <h3 style="margin-bottom: 1rem;">Guiding Questions</h3>
                    ${theme.questions && theme.questions.length > 0 ? `
                        <ul style="list-style: none; padding: 0;">
                            ${theme.questions.map((question, index) => `
                                <li style="background: var(--surface); padding: 1rem; border-radius: 0.5rem; margin-bottom: 0.5rem;">
                                    <span style="color: var(--primary); font-weight: 600;">Q${index + 1}:</span> ${question}
                                </li>
                            `).join('')}
                        </ul>
                    ` : `
                        <p style="color: var(--text-secondary);">No guiding questions added yet.</p>
                    `}
                </div>

                <div class="section">
                    <h3 style="margin-bottom: 1rem;">Symbols & Motifs</h3>
                    ${theme.symbols && theme.symbols.length > 0 ? `
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;">
                            ${theme.symbols.map(symbol => `
                                <div style="background: var(--surface); padding: 1rem; border-radius: 0.5rem; text-align: center;">
                                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">${symbol.icon || '🔮'}</div>
                                    <strong>${symbol.name}</strong>
                                    ${symbol.meaning ? `<p style="font-size: 0.875rem; color: var(--text-secondary); margin: 0.5rem 0 0 0;">${symbol.meaning}</p>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <p style="color: var(--text-secondary);">No symbols or motifs added yet.</p>
                    `}
                </div>
            </div>
        `;
    }

    renderFilesTab(theme) {
        return `
            <div class="files-tab">
                <div class="files-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h3 style="margin: 0;">Theme Files & Notes</h3>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-secondary" onclick="window.app.themeDetailView.importThemeNotes('${theme.id}')">
                            📤 Import Files
                        </button>
                        <button class="btn btn-primary" onclick="window.app.themeDetailView.createNewFile('${theme.id}', 'text')">
                            ➕ New Text File
                        </button>
                        <button class="btn btn-primary" onclick="window.app.themeDetailView.createNewFile('${theme.id}', 'markdown')">
                            ➕ New Markdown
                        </button>
                    </div>
                </div>

                ${theme.files && theme.files.length > 0 ? `
                    <div class="files-grid" style="display: grid; gap: 1rem;">
                        ${theme.files.map(file => this.renderFileCard(theme, file)).join('')}
                    </div>
                ` : `
                    <div style="text-align: center; padding: 3rem; background: var(--surface); border-radius: 0.5rem;">
                        <p style="color: var(--text-secondary); margin-bottom: 1rem;">No files yet. Add notes, research, or related documents.</p>
                        <button class="btn btn-primary" onclick="window.app.themeDetailView.createNewFile('${theme.id}', 'markdown')">
                            Create First File
                        </button>
                    </div>
                `}
            </div>
        `;
    }

    renderFileCard(theme, file) {
        const preview = file.type === 'markdown' ? 
            this.getMarkdownPreview(file.content) : 
            file.content.substring(0, 200);

        return `
            <div class="file-card" style="background: var(--surface); padding: 1.5rem; border-radius: 0.5rem; border: 1px solid var(--border);">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div>
                        <h4 style="margin: 0; display: flex; align-items: center; gap: 0.5rem;">
                            ${file.type === 'markdown' ? '📝' : file.type === 'image' ? '🖼️' : '📄'}
                            ${file.name}
                        </h4>
                        <p style="color: var(--text-secondary); font-size: 0.875rem; margin: 0.25rem 0 0 0;">
                            ${file.type} • Modified ${new Date(file.lastModified).toLocaleDateString()}
                        </p>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-sm" onclick="window.app.themeDetailView.editFile('${theme.id}', '${file.id}')">
                            ✏️
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="window.app.themeDetailView.deleteFile('${theme.id}', '${file.id}')">
                            🗑️
                        </button>
                    </div>
                </div>
                
                ${file.type === 'image' ? `
                    <img src="${file.content}" alt="${file.name}" style="max-width: 100%; height: auto; border-radius: 0.375rem;">
                ` : `
                    <div style="color: var(--text-secondary); font-size: 0.875rem; line-height: 1.5;">
                        ${preview}${file.content.length > 200 ? '...' : ''}
                    </div>
                `}
                
                ${file.description ? `
                    <p style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border); color: var(--text-secondary); font-size: 0.875rem;">
                        ${file.description}
                    </p>
                ` : ''}
            </div>
        `;
    }

    renderUsageTab(theme) {
        const productions = Array.from(this.state.state.productions.values())
            .filter(prod => theme.productionIds.includes(prod.id));

        return `
            <div class="usage-tab">
                <h3 style="margin-bottom: 1rem;">Used in Productions</h3>
                ${productions.length > 0 ? `
                    <div style="display: grid; gap: 1rem;">
                        ${productions.map(prod => `
                            <div style="background: var(--surface); padding: 1rem; border-radius: 0.5rem;">
                                <strong>${prod.title}</strong>
                                <span style="color: var(--text-secondary); margin-left: 1rem;">${prod.type}</span>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <p style="color: var(--text-secondary);">This theme is not currently used in any productions.</p>
                `}
            </div>
        `;
    }

    renderNotFound() {
        return `
            <div style="text-align: center; padding: 3rem;">
                <h2>Theme Not Found</h2>
                <p style="color: var(--text-secondary);">The theme you're looking for doesn't exist.</p>
                <button class="btn btn-primary" onclick="window.app.router.navigate('themes')">
                    Back to Themes
                </button>
            </div>
        `;
    }

    // Tab switching
    switchTab(tab) {
        this.currentTab = tab;
        const content = document.getElementById('theme-tab-content');
        const theme = this.state.state.themes.get(this.themeId);
        if (content && theme) {
            content.innerHTML = this.renderTabContent(theme);
        }
        
        // Update tab button styles
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
            btn.style.borderBottom = '2px solid transparent';
        });
        const activeBtn = document.querySelector(`.tab-button:nth-child(${['overview', 'exploration', 'files', 'usage'].indexOf(tab) + 1})`);
        if (activeBtn) {
            activeBtn.classList.add('active');
            activeBtn.style.borderBottom = '2px solid var(--primary)';
        }
    }

    // File management methods
    createNewFile(themeId, fileType) {
        const theme = this.state.state.themes.get(themeId);
        if (!theme) return;

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
            <div class="modal-content" style="background: var(--background); border-radius: 0.5rem; padding: 2rem; width: 90%; max-width: 800px; max-height: 90vh; overflow-y: auto;">
                <h2 style="margin: 0 0 1.5rem 0;">Create New ${fileType === 'markdown' ? 'Markdown' : 'Text'} File</h2>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">File Name</label>
                    <input type="text" id="file-name" placeholder="Enter file name..." 
                           style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">Content</label>
                    <textarea id="file-content" placeholder="Enter content..." 
                              style="width: 100%; min-height: 300px; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; font-family: ${fileType === 'markdown' ? 'monospace' : 'inherit'};"></textarea>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">Description (optional)</label>
                    <input type="text" id="file-description" placeholder="Brief description of this file..." 
                           style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                </div>
                
                <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                    <button onclick="this.closest('.modal-overlay').remove()" class="btn btn-secondary">Cancel</button>
                    <button onclick="window.app.themeDetailView.saveNewFile('${themeId}', '${fileType}', this)" class="btn btn-primary">Create File</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        document.getElementById('file-name').focus();
    }

    saveNewFile(themeId, fileType, buttonElement) {
        const theme = this.state.state.themes.get(themeId);
        if (!theme) return;

        const name = document.getElementById('file-name').value.trim();
        const content = document.getElementById('file-content').value;
        const description = document.getElementById('file-description').value.trim();

        if (!name) {
            alert('Please enter a file name');
            return;
        }

        const file = {
            id: `file-${Date.now()}`,
            name: name,
            type: fileType,
            content: content,
            description: description,
            created: new Date().toISOString(),
            lastModified: new Date().toISOString()
        };

        if (!theme.files) {
            theme.files = [];
        }
        theme.files.push(file);
        theme.lastModified = new Date().toISOString();

        this.state.emit('data-changed');
        
        // Close modal and refresh
        buttonElement.closest('.modal-overlay').remove();
        this.switchTab('files');
    }

    editFile(themeId, fileId) {
        const theme = this.state.state.themes.get(themeId);
        if (!theme) return;

        const file = theme.files.find(f => f.id === fileId);
        if (!file) return;

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
            <div class="modal-content" style="background: var(--background); border-radius: 0.5rem; padding: 2rem; width: 90%; max-width: 800px; max-height: 90vh; overflow-y: auto;">
                <h2 style="margin: 0 0 1.5rem 0;">Edit ${file.type === 'markdown' ? 'Markdown' : 'Text'} File</h2>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">File Name</label>
                    <input type="text" id="file-name" value="${file.name}" 
                           style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">Content</label>
                    <textarea id="file-content" style="width: 100%; min-height: 300px; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; font-family: ${file.type === 'markdown' ? 'monospace' : 'inherit'};">${file.content}</textarea>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">Description (optional)</label>
                    <input type="text" id="file-description" value="${file.description || ''}" 
                           style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                </div>
                
                <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                    <button onclick="this.closest('.modal-overlay').remove()" class="btn btn-secondary">Cancel</button>
                    <button onclick="window.app.themeDetailView.saveFile('${themeId}', '${fileId}', this)" class="btn btn-primary">Save Changes</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    saveFile(themeId, fileId, buttonElement) {
        const theme = this.state.state.themes.get(themeId);
        if (!theme) return;

        const file = theme.files.find(f => f.id === fileId);
        if (!file) return;

        const name = document.getElementById('file-name').value.trim();
        const content = document.getElementById('file-content').value;
        const description = document.getElementById('file-description').value.trim();

        if (!name) {
            alert('Please enter a file name');
            return;
        }

        file.name = name;
        file.content = content;
        file.description = description;
        file.lastModified = new Date().toISOString();

        theme.lastModified = new Date().toISOString();
        this.state.emit('data-changed');
        
        // Close modal and refresh
        buttonElement.closest('.modal-overlay').remove();
        this.switchTab('files');
    }

    deleteFile(themeId, fileId) {
        if (!confirm('Are you sure you want to delete this file?')) return;

        const theme = this.state.state.themes.get(themeId);
        if (!theme) return;

        theme.files = theme.files.filter(f => f.id !== fileId);
        theme.lastModified = new Date().toISOString();
        
        this.state.emit('data-changed');
        this.switchTab('files');
    }

    importThemeNotes(themeId) {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = '.txt,.md';
        
        input.onchange = async (e) => {
            const files = Array.from(e.target.files);
            const theme = this.state.state.themes.get(themeId);
            if (!theme) return;

            if (!theme.files) {
                theme.files = [];
            }

            for (const file of files) {
                const content = await this.readFile(file);
                const fileObj = {
                    id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    name: file.name,
                    type: file.name.endsWith('.md') ? 'markdown' : 'text',
                    content: content,
                    description: `Imported from ${file.name}`,
                    created: new Date().toISOString(),
                    lastModified: new Date().toISOString()
                };
                theme.files.push(fileObj);
            }

            theme.lastModified = new Date().toISOString();
            this.state.emit('data-changed');
            this.switchTab('files');
            
            alert(`Successfully imported ${files.length} file(s)`);
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

    // Theme management
    editTheme() {
        // Implement theme editing dialog
        alert('Theme editing coming soon!');
    }

    deleteTheme() {
        if (!confirm('Are you sure you want to delete this theme? This cannot be undone.')) return;

        this.state.deleteTheme(this.themeId);
        this.app.router.navigate('themes');
    }

    // Helper methods
    getMarkdownPreview(content) {
        // Simple markdown preview - just show first paragraph
        const lines = content.split('\n');
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('-') && !trimmed.startsWith('*')) {
                return trimmed.substring(0, 200);
            }
        }
        return content.substring(0, 200);
    }
}