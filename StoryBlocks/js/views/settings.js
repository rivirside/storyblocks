// Settings View
class SettingsView {
    constructor(app) {
        this.app = app;
        this.state = app.state;
        this.events = app.events;
        
        // Default settings
        this.defaultSettings = {
            appearance: {
                theme: 'dark',
                fontSize: '16px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                lineHeight: '1.6',
                
                // Colors
                primaryColor: '#2563eb',
                secondaryColor: '#6366f1',
                successColor: '#22c55e',
                warningColor: '#f59e0b',
                dangerColor: '#ef4444',
                
                // Text colors
                textPrimary: '#e5e7eb',
                textSecondary: '#9ca3af',
                textTertiary: '#6b7280',
                
                // UI colors
                backgroundColor: '#111827',
                surfaceColor: '#1f2937',
                borderColor: '#374151',
                
                // Component specific
                inputBackground: '#1f2937',
                inputText: '#e5e7eb',
                inputBorder: '#374151',
                inputFocusBorder: '#2563eb',
                
                buttonBackground: '#2563eb',
                buttonText: '#ffffff',
                buttonHoverBackground: '#1d4ed8',
                
                sectionTitleSize: '1.5rem',
                sectionTitleWeight: '600',
                sectionTitleColor: '#2563eb',
                
                captionSize: '0.875rem',
                captionColor: '#9ca3af',
                captionStyle: 'italic'
            },
            
            editor: {
                autoSave: true,
                autoSaveInterval: 30, // seconds
                showWordCount: true,
                showCharacterCount: true,
                enableMarkdown: true,
                enableSpellCheck: true,
                tabSize: 4,
                wordWrap: true
            },
            
            timeline: {
                defaultView: 'story',
                showLegend: true,
                eventSize: 'medium',
                showConnections: true,
                animateTransitions: true
            },
            
            workspace: {
                confirmDelete: true,
                showEmptyStates: true,
                defaultProductionType: 'novel',
                compactMode: false
            }
        };
        
        // Load saved settings or use defaults
        this.settings = this.loadSettings();
    }
    
    render() {
        return `
            <div class="settings-view">
                <div class="settings-header" style="margin-bottom: 2rem;">
                    <h1>Settings</h1>
                    <p style="color: var(--text-secondary); margin: 0;">Customize your StoryBlocks experience</p>
                </div>
                
                <div class="settings-content" style="display: grid; grid-template-columns: 200px 1fr; gap: 2rem;">
                    <!-- Settings Navigation -->
                    <div class="settings-nav" style="background: var(--surface); border-radius: 0.5rem; padding: 1rem;">
                        <button class="settings-nav-item active" data-section="appearance" onclick="window.app.settingsView.showSection('appearance')"
                                style="display: block; width: 100%; padding: 0.75rem; margin-bottom: 0.5rem; background: var(--primary); color: white; border: none; border-radius: 0.375rem; text-align: left; cursor: pointer;">
                            🎨 Appearance
                        </button>
                        <button class="settings-nav-item" data-section="editor" onclick="window.app.settingsView.showSection('editor')"
                                style="display: block; width: 100%; padding: 0.75rem; margin-bottom: 0.5rem; background: none; color: var(--text-primary); border: none; border-radius: 0.375rem; text-align: left; cursor: pointer;">
                            ✏️ Editor
                        </button>
                        <button class="settings-nav-item" data-section="timeline" onclick="window.app.settingsView.showSection('timeline')"
                                style="display: block; width: 100%; padding: 0.75rem; margin-bottom: 0.5rem; background: none; color: var(--text-primary); border: none; border-radius: 0.375rem; text-align: left; cursor: pointer;">
                            ⏰ Timeline
                        </button>
                        <button class="settings-nav-item" data-section="workspace" onclick="window.app.settingsView.showSection('workspace')"
                                style="display: block; width: 100%; padding: 0.75rem; margin-bottom: 0.5rem; background: none; color: var(--text-primary); border: none; border-radius: 0.375rem; text-align: left; cursor: pointer;">
                            🗂️ Workspace
                        </button>
                        
                        <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--border);">
                            <button class="btn btn-secondary" onclick="window.app.settingsView.resetSection()" style="width: 100%; margin-bottom: 0.5rem;">
                                🔄 Reset Section
                            </button>
                            <button class="btn btn-danger" onclick="window.app.settingsView.resetAll()" style="width: 100%;">
                                ⚠️ Reset All
                            </button>
                        </div>
                    </div>
                    
                    <!-- Settings Sections -->
                    <div class="settings-sections">
                        ${this.renderAppearanceSection()}
                        ${this.renderEditorSection()}
                        ${this.renderTimelineSection()}
                        ${this.renderWorkspaceSection()}
                    </div>
                </div>
                
                <!-- Save Bar -->
                <div class="settings-save-bar" style="position: fixed; bottom: 0; left: 0; right: 0; background: var(--surface); border-top: 1px solid var(--border); padding: 1rem; display: none;">
                    <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
                        <span>You have unsaved changes</span>
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn btn-secondary" onclick="window.app.settingsView.discardChanges()">
                                Discard
                            </button>
                            <button class="btn btn-primary" onclick="window.app.settingsView.saveSettings()">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderAppearanceSection() {
        const appearance = this.settings.appearance;
        
        return `
            <div class="settings-section" id="appearance-section" style="background: var(--surface); padding: 2rem; border-radius: 0.5rem;">
                <h2 style="margin-bottom: 1.5rem;">Appearance Settings</h2>
                
                <!-- Theme -->
                <div class="setting-group" style="margin-bottom: 2rem;">
                    <h3 style="margin-bottom: 1rem;">Theme</h3>
                    <select id="theme-select" onchange="window.app.settingsView.updateSetting('appearance.theme', this.value)" 
                            style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: 0.375rem; background: var(--input-bg);">
                        <option value="dark" ${appearance.theme === 'dark' ? 'selected' : ''}>Dark</option>
                        <option value="light" ${appearance.theme === 'light' ? 'selected' : ''}>Light</option>
                        <option value="auto" ${appearance.theme === 'auto' ? 'selected' : ''}>Auto (System)</option>
                    </select>
                </div>
                
                <!-- Typography -->
                <div class="setting-group" style="margin-bottom: 2rem;">
                    <h3 style="margin-bottom: 1rem;">Typography</h3>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem;">Font Size</label>
                            <input type="text" value="${appearance.fontSize}" 
                                   onchange="window.app.settingsView.updateSetting('appearance.fontSize', this.value)"
                                   style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem;">Line Height</label>
                            <input type="text" value="${appearance.lineHeight}" 
                                   onchange="window.app.settingsView.updateSetting('appearance.lineHeight', this.value)"
                                   style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                        </div>
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem;">Font Family</label>
                        <input type="text" value="${appearance.fontFamily}" 
                               onchange="window.app.settingsView.updateSetting('appearance.fontFamily', this.value)"
                               style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                    </div>
                </div>
                
                <!-- Colors -->
                <div class="setting-group" style="margin-bottom: 2rem;">
                    <h3 style="margin-bottom: 1rem;">Colors</h3>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;">
                        ${this.renderColorSetting('Primary Color', 'appearance.primaryColor', appearance.primaryColor)}
                        ${this.renderColorSetting('Text Primary', 'appearance.textPrimary', appearance.textPrimary)}
                        ${this.renderColorSetting('Text Secondary', 'appearance.textSecondary', appearance.textSecondary)}
                        ${this.renderColorSetting('Background', 'appearance.backgroundColor', appearance.backgroundColor)}
                        ${this.renderColorSetting('Surface', 'appearance.surfaceColor', appearance.surfaceColor)}
                        ${this.renderColorSetting('Border', 'appearance.borderColor', appearance.borderColor)}
                    </div>
                </div>
                
                <!-- Component Specific -->
                <div class="setting-group">
                    <h3 style="margin-bottom: 1rem;">Component Styles</h3>
                    
                    <h4 style="margin-bottom: 0.5rem; color: var(--text-secondary);">Section Titles</h4>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem;">Size</label>
                            <input type="text" value="${appearance.sectionTitleSize}" 
                                   onchange="window.app.settingsView.updateSetting('appearance.sectionTitleSize', this.value)"
                                   style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem;">Weight</label>
                            <select onchange="window.app.settingsView.updateSetting('appearance.sectionTitleWeight', this.value)"
                                    style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                                <option value="400" ${appearance.sectionTitleWeight === '400' ? 'selected' : ''}>Normal</option>
                                <option value="500" ${appearance.sectionTitleWeight === '500' ? 'selected' : ''}>Medium</option>
                                <option value="600" ${appearance.sectionTitleWeight === '600' ? 'selected' : ''}>Semibold</option>
                                <option value="700" ${appearance.sectionTitleWeight === '700' ? 'selected' : ''}>Bold</option>
                            </select>
                        </div>
                        ${this.renderColorSetting('Color', 'appearance.sectionTitleColor', appearance.sectionTitleColor)}
                    </div>
                    
                    <h4 style="margin-bottom: 0.5rem; color: var(--text-secondary);">Captions</h4>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem;">Size</label>
                            <input type="text" value="${appearance.captionSize}" 
                                   onchange="window.app.settingsView.updateSetting('appearance.captionSize', this.value)"
                                   style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                        </div>
                        ${this.renderColorSetting('Color', 'appearance.captionColor', appearance.captionColor)}
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem;">Style</label>
                            <select onchange="window.app.settingsView.updateSetting('appearance.captionStyle', this.value)"
                                    style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                                <option value="normal" ${appearance.captionStyle === 'normal' ? 'selected' : ''}>Normal</option>
                                <option value="italic" ${appearance.captionStyle === 'italic' ? 'selected' : ''}>Italic</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderColorSetting(label, settingPath, value) {
        return `
            <div>
                <label style="display: block; margin-bottom: 0.5rem;">${label}</label>
                <div style="display: flex; gap: 0.5rem;">
                    <input type="color" value="${value}" 
                           onchange="window.app.settingsView.updateSetting('${settingPath}', this.value)"
                           style="width: 50px; height: 38px; border: 1px solid var(--border); border-radius: 0.375rem; cursor: pointer;">
                    <input type="text" value="${value}" 
                           onchange="window.app.settingsView.updateSetting('${settingPath}', this.value)"
                           style="flex: 1; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                </div>
            </div>
        `;
    }
    
    renderEditorSection() {
        const editor = this.settings.editor;
        
        return `
            <div class="settings-section" id="editor-section" style="background: var(--surface); padding: 2rem; border-radius: 0.5rem; display: none;">
                <h2 style="margin-bottom: 1.5rem;">Editor Settings</h2>
                
                <div class="setting-group" style="margin-bottom: 2rem;">
                    <h3 style="margin-bottom: 1rem;">Auto Save</h3>
                    <label style="display: flex; align-items: center; margin-bottom: 1rem;">
                        <input type="checkbox" ${editor.autoSave ? 'checked' : ''} 
                               onchange="window.app.settingsView.updateSetting('editor.autoSave', this.checked)"
                               style="margin-right: 0.5rem;">
                        Enable auto-save
                    </label>
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem;">Auto-save interval (seconds)</label>
                        <input type="number" value="${editor.autoSaveInterval}" min="10" max="300"
                               onchange="window.app.settingsView.updateSetting('editor.autoSaveInterval', parseInt(this.value))"
                               style="width: 200px; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                    </div>
                </div>
                
                <div class="setting-group" style="margin-bottom: 2rem;">
                    <h3 style="margin-bottom: 1rem;">Display Options</h3>
                    <label style="display: flex; align-items: center; margin-bottom: 0.5rem;">
                        <input type="checkbox" ${editor.showWordCount ? 'checked' : ''} 
                               onchange="window.app.settingsView.updateSetting('editor.showWordCount', this.checked)"
                               style="margin-right: 0.5rem;">
                        Show word count
                    </label>
                    <label style="display: flex; align-items: center; margin-bottom: 0.5rem;">
                        <input type="checkbox" ${editor.showCharacterCount ? 'checked' : ''} 
                               onchange="window.app.settingsView.updateSetting('editor.showCharacterCount', this.checked)"
                               style="margin-right: 0.5rem;">
                        Show character count
                    </label>
                    <label style="display: flex; align-items: center; margin-bottom: 0.5rem;">
                        <input type="checkbox" ${editor.enableMarkdown ? 'checked' : ''} 
                               onchange="window.app.settingsView.updateSetting('editor.enableMarkdown', this.checked)"
                               style="margin-right: 0.5rem;">
                        Enable markdown formatting
                    </label>
                    <label style="display: flex; align-items: center;">
                        <input type="checkbox" ${editor.enableSpellCheck ? 'checked' : ''} 
                               onchange="window.app.settingsView.updateSetting('editor.enableSpellCheck', this.checked)"
                               style="margin-right: 0.5rem;">
                        Enable spell check
                    </label>
                </div>
                
                <div class="setting-group">
                    <h3 style="margin-bottom: 1rem;">Editor Behavior</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem;">Tab size</label>
                            <input type="number" value="${editor.tabSize}" min="2" max="8"
                                   onchange="window.app.settingsView.updateSetting('editor.tabSize', parseInt(this.value))"
                                   style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                        </div>
                        <div>
                            <label style="display: flex; align-items: center;">
                                <input type="checkbox" ${editor.wordWrap ? 'checked' : ''} 
                                       onchange="window.app.settingsView.updateSetting('editor.wordWrap', this.checked)"
                                       style="margin-right: 0.5rem;">
                                Word wrap
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderTimelineSection() {
        const timeline = this.settings.timeline;
        
        return `
            <div class="settings-section" id="timeline-section" style="background: var(--surface); padding: 2rem; border-radius: 0.5rem; display: none;">
                <h2 style="margin-bottom: 1.5rem;">Timeline Settings</h2>
                
                <div class="setting-group" style="margin-bottom: 2rem;">
                    <h3 style="margin-bottom: 1rem;">Display Options</h3>
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem;">Default view</label>
                        <select onchange="window.app.settingsView.updateSetting('timeline.defaultView', this.value)"
                                style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                            <option value="story" ${timeline.defaultView === 'story' ? 'selected' : ''}>Story Time</option>
                            <option value="real" ${timeline.defaultView === 'real' ? 'selected' : ''}>Real Time</option>
                            <option value="chapter" ${timeline.defaultView === 'chapter' ? 'selected' : ''}>Chapters</option>
                            <option value="scenes" ${timeline.defaultView === 'scenes' ? 'selected' : ''}>Scenes</option>
                        </select>
                    </div>
                    <label style="display: flex; align-items: center; margin-bottom: 0.5rem;">
                        <input type="checkbox" ${timeline.showLegend ? 'checked' : ''} 
                               onchange="window.app.settingsView.updateSetting('timeline.showLegend', this.checked)"
                               style="margin-right: 0.5rem;">
                        Show legend
                    </label>
                    <label style="display: flex; align-items: center;">
                        <input type="checkbox" ${timeline.showConnections ? 'checked' : ''} 
                               onchange="window.app.settingsView.updateSetting('timeline.showConnections', this.checked)"
                               style="margin-right: 0.5rem;">
                        Show event connections
                    </label>
                </div>
                
                <div class="setting-group">
                    <h3 style="margin-bottom: 1rem;">Event Display</h3>
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem;">Event size</label>
                        <select onchange="window.app.settingsView.updateSetting('timeline.eventSize', this.value)"
                                style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                            <option value="small" ${timeline.eventSize === 'small' ? 'selected' : ''}>Small</option>
                            <option value="medium" ${timeline.eventSize === 'medium' ? 'selected' : ''}>Medium</option>
                            <option value="large" ${timeline.eventSize === 'large' ? 'selected' : ''}>Large</option>
                        </select>
                    </div>
                    <label style="display: flex; align-items: center;">
                        <input type="checkbox" ${timeline.animateTransitions ? 'checked' : ''} 
                               onchange="window.app.settingsView.updateSetting('timeline.animateTransitions', this.checked)"
                               style="margin-right: 0.5rem;">
                        Animate transitions
                    </label>
                </div>
            </div>
        `;
    }
    
    renderWorkspaceSection() {
        const workspace = this.settings.workspace;
        
        return `
            <div class="settings-section" id="workspace-section" style="background: var(--surface); padding: 2rem; border-radius: 0.5rem; display: none;">
                <h2 style="margin-bottom: 1.5rem;">Workspace Settings</h2>
                
                <div class="setting-group" style="margin-bottom: 2rem;">
                    <h3 style="margin-bottom: 1rem;">General</h3>
                    <label style="display: flex; align-items: center; margin-bottom: 0.5rem;">
                        <input type="checkbox" ${workspace.confirmDelete ? 'checked' : ''} 
                               onchange="window.app.settingsView.updateSetting('workspace.confirmDelete', this.checked)"
                               style="margin-right: 0.5rem;">
                        Confirm before deleting items
                    </label>
                    <label style="display: flex; align-items: center; margin-bottom: 0.5rem;">
                        <input type="checkbox" ${workspace.showEmptyStates ? 'checked' : ''} 
                               onchange="window.app.settingsView.updateSetting('workspace.showEmptyStates', this.checked)"
                               style="margin-right: 0.5rem;">
                        Show helpful empty states
                    </label>
                    <label style="display: flex; align-items: center;">
                        <input type="checkbox" ${workspace.compactMode ? 'checked' : ''} 
                               onchange="window.app.settingsView.updateSetting('workspace.compactMode', this.checked)"
                               style="margin-right: 0.5rem;">
                        Compact mode (smaller UI elements)
                    </label>
                </div>
                
                <div class="setting-group">
                    <h3 style="margin-bottom: 1rem;">Defaults</h3>
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem;">Default production type</label>
                        <select onchange="window.app.settingsView.updateSetting('workspace.defaultProductionType', this.value)"
                                style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                            <option value="novel" ${workspace.defaultProductionType === 'novel' ? 'selected' : ''}>Novel</option>
                            <option value="series" ${workspace.defaultProductionType === 'series' ? 'selected' : ''}>Book Series</option>
                            <option value="screenplay" ${workspace.defaultProductionType === 'screenplay' ? 'selected' : ''}>Screenplay</option>
                            <option value="tv_series" ${workspace.defaultProductionType === 'tv_series' ? 'selected' : ''}>TV Series</option>
                            <option value="short_story" ${workspace.defaultProductionType === 'short_story' ? 'selected' : ''}>Short Story</option>
                            <option value="game" ${workspace.defaultProductionType === 'game' ? 'selected' : ''}>Game</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
    }
    
    showSection(section) {
        // Hide all sections
        document.querySelectorAll('.settings-section').forEach(s => s.style.display = 'none');
        
        // Show selected section
        const sectionEl = document.getElementById(`${section}-section`);
        if (sectionEl) sectionEl.style.display = 'block';
        
        // Update nav
        document.querySelectorAll('.settings-nav-item').forEach(item => {
            item.classList.remove('active');
            item.style.background = 'none';
            item.style.color = 'var(--text-primary)';
        });
        
        const activeItem = document.querySelector(`[data-section="${section}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
            activeItem.style.background = 'var(--primary)';
            activeItem.style.color = 'white';
        }
    }
    
    updateSetting(path, value) {
        // Navigate to the setting using dot notation
        const parts = path.split('.');
        let current = this.settings;
        
        for (let i = 0; i < parts.length - 1; i++) {
            current = current[parts[i]];
        }
        
        current[parts[parts.length - 1]] = value;
        
        // Show save bar
        const saveBar = document.querySelector('.settings-save-bar');
        if (saveBar) saveBar.style.display = 'block';
        
        // Apply setting immediately for preview
        this.applySettings();
    }
    
    applySettings() {
        const root = document.documentElement;
        const appearance = this.settings.appearance;
        
        // Apply CSS variables
        root.style.setProperty('--primary', appearance.primaryColor);
        root.style.setProperty('--text-primary', appearance.textPrimary);
        root.style.setProperty('--text-secondary', appearance.textSecondary);
        root.style.setProperty('--text-tertiary', appearance.textTertiary);
        root.style.setProperty('--background', appearance.backgroundColor);
        root.style.setProperty('--surface', appearance.surfaceColor);
        root.style.setProperty('--border', appearance.borderColor);
        root.style.setProperty('--font-size', appearance.fontSize);
        root.style.setProperty('--font-family', appearance.fontFamily);
        root.style.setProperty('--line-height', appearance.lineHeight);
        
        // Apply component-specific styles
        const style = document.getElementById('dynamic-settings-styles') || document.createElement('style');
        style.id = 'dynamic-settings-styles';
        style.textContent = `
            body {
                font-size: ${appearance.fontSize};
                font-family: ${appearance.fontFamily};
                line-height: ${appearance.lineHeight};
            }
            
            h2, .section-title {
                font-size: ${appearance.sectionTitleSize};
                font-weight: ${appearance.sectionTitleWeight};
                color: ${appearance.sectionTitleColor};
            }
            
            .caption, small, .text-caption {
                font-size: ${appearance.captionSize};
                color: ${appearance.captionColor};
                font-style: ${appearance.captionStyle};
            }
            
            input[type="text"], textarea, select {
                background: ${appearance.inputBackground};
                color: ${appearance.inputText};
                border-color: ${appearance.inputBorder};
            }
            
            input[type="text"]:focus, textarea:focus, select:focus {
                border-color: ${appearance.inputFocusBorder};
            }
            
            .btn-primary {
                background: ${appearance.buttonBackground};
                color: ${appearance.buttonText};
            }
            
            .btn-primary:hover {
                background: ${appearance.buttonHoverBackground};
            }
        `;
        
        if (!document.getElementById('dynamic-settings-styles')) {
            document.head.appendChild(style);
        }
    }
    
    saveSettings() {
        // Save to localStorage
        localStorage.setItem('storyblocks_settings', JSON.stringify(this.settings));
        
        // Hide save bar
        const saveBar = document.querySelector('.settings-save-bar');
        if (saveBar) saveBar.style.display = 'none';
        
        // Apply settings
        this.applySettings();
        
        // Emit event
        this.events.emit('settingsChanged', this.settings);
        
        alert('Settings saved successfully!');
    }
    
    discardChanges() {
        // Reload settings from storage
        this.settings = this.loadSettings();
        
        // Re-render
        const content = document.getElementById('content');
        if (content) {
            content.innerHTML = this.render();
        }
        
        // Hide save bar
        const saveBar = document.querySelector('.settings-save-bar');
        if (saveBar) saveBar.style.display = 'none';
        
        // Re-apply settings
        this.applySettings();
    }
    
    resetSection() {
        const activeSection = document.querySelector('.settings-nav-item.active');
        if (!activeSection) return;
        
        const section = activeSection.dataset.section;
        if (confirm(`Reset all ${section} settings to defaults?`)) {
            this.settings[section] = { ...this.defaultSettings[section] };
            
            // Re-render section
            const sectionEl = document.getElementById(`${section}-section`);
            if (sectionEl) {
                const newContent = this[`render${section.charAt(0).toUpperCase() + section.slice(1)}Section`]();
                const temp = document.createElement('div');
                temp.innerHTML = newContent;
                sectionEl.replaceWith(temp.firstElementChild);
            }
            
            // Show save bar
            const saveBar = document.querySelector('.settings-save-bar');
            if (saveBar) saveBar.style.display = 'block';
        }
    }
    
    resetAll() {
        if (confirm('Reset ALL settings to defaults? This cannot be undone.')) {
            this.settings = JSON.parse(JSON.stringify(this.defaultSettings));
            
            // Re-render
            const content = document.getElementById('content');
            if (content) {
                content.innerHTML = this.render();
            }
            
            // Save and apply
            this.saveSettings();
        }
    }
    
    loadSettings() {
        const saved = localStorage.getItem('storyblocks_settings');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Deep merge with defaults to ensure all properties exist
                return this.deepMerge(JSON.parse(JSON.stringify(this.defaultSettings)), parsed);
            } catch (e) {
                console.error('Failed to parse saved settings:', e);
            }
        }
        return JSON.parse(JSON.stringify(this.defaultSettings));
    }
    
    deepMerge(target, source) {
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                if (!target[key]) target[key] = {};
                this.deepMerge(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        }
        return target;
    }
    
    exportSettings() {
        const data = JSON.stringify(this.settings, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'storyblocks-settings.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    importSettings() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            try {
                const text = await file.text();
                const imported = JSON.parse(text);
                
                // Validate and merge
                this.settings = this.deepMerge(JSON.parse(JSON.stringify(this.defaultSettings)), imported);
                
                // Save and apply
                this.saveSettings();
                
                // Re-render
                const content = document.getElementById('content');
                if (content) {
                    content.innerHTML = this.render();
                }
                
            } catch (error) {
                alert('Failed to import settings: ' + error.message);
            }
        };
        
        input.click();
    }
}