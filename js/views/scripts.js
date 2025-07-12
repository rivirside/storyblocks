// Scripts View - Script Management and List
class ScriptsView {
    constructor(app) {
        this.app = app;
        this.state = app.state;
        this.events = app.events;
        this.currentView = 'grid';
        this.searchQuery = '';
        this.sortBy = 'lastModified';
    }

    render() {
        return `
            <div class="scripts-view">
                <div class="scripts-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <div class="header-title">
                        <h1>Scripts</h1>
                        <p style="color: var(--text-secondary); margin: 0;">
                            Fountain format screenplay editor - ${this.getActiveProductionName()}
                        </p>
                    </div>
                    <div class="header-actions">
                        <button class="btn btn-secondary" onclick="window.app.scriptsView.loadTutorialScript()" style="margin-right: 0.5rem;">
                            📚 Tutorial
                        </button>
                        <button class="btn btn-secondary" onclick="window.app.scriptsView.showImportDialog()" style="margin-right: 0.5rem;">
                            📤 Import
                        </button>
                        <button class="btn btn-primary" onclick="window.app.scriptsView.createNewScript()">
                            ➕ New Script
                        </button>
                    </div>
                </div>

                <div class="scripts-toolbar" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding: 1rem; background: var(--surface); border-radius: 0.5rem;">
                    <div class="search-section">
                        <input type="text" id="script-search" placeholder="Search scripts..." 
                               style="padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; width: 250px;"
                               onkeyup="window.app.scriptsView.handleSearch(event)">
                    </div>
                    
                    <div class="filter-section" style="display: flex; gap: 1rem;">
                        <select id="script-sort" onchange="window.app.scriptsView.handleSort(event)" 
                                style="padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                            <option value="lastModified">Sort by Modified</option>
                            <option value="title">Sort by Title</option>
                            <option value="created">Sort by Created</option>
                            <option value="pageCount">Sort by Page Count</option>
                            <option value="status">Sort by Status</option>
                        </select>
                        
                        <select id="script-filter" onchange="window.app.scriptsView.handleFilter(event)"
                                style="padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                            <option value="all">All Scripts</option>
                            <option value="draft">Drafts</option>
                            <option value="revision">Revisions</option>
                            <option value="final">Final</option>
                        </select>
                        
                        <button class="btn btn-sm" onclick="window.app.scriptsView.toggleView()" id="view-toggle">
                            📋 List View
                        </button>
                    </div>
                </div>

                <div class="scripts-content">
                    <div class="scripts-container" id="scripts-container">
                        ${this.renderScriptContent()}
                    </div>
                </div>
            </div>
        `;
    }

    renderScriptContent() {
        const allScripts = this.getProductionScripts();
        
        if (allScripts.length === 0) {
            return this.renderEmptyState();
        }

        const filteredScripts = this.filterScripts(allScripts);
        
        if (this.currentView === 'grid') {
            return this.renderScriptGrid(filteredScripts);
        } else {
            return this.renderScriptList(filteredScripts);
        }
    }

    getProductionScripts() {
        const allScripts = Array.from(this.state.state.scripts.values());
        const activeProduction = this.state.getActiveProduction();
        
        if (activeProduction) {
            return allScripts.filter(script => 
                script.productionId === activeProduction.id
            );
        }
        
        return allScripts.filter(script => !script.productionId);
    }

    getActiveProductionName() {
        const activeProduction = this.state.getActiveProduction();
        return activeProduction ? activeProduction.title : 'All Productions';
    }

    renderScriptGrid(scripts) {
        return `
            <div class="scripts-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem;">
                ${scripts.map(script => `
                    <div class="script-card" onclick="window.app.router.navigate('scripts/${script.id}')" style="background: var(--surface); border: 1px solid var(--border); border-radius: 0.5rem; padding: 1.5rem; transition: transform 0.2s; cursor: pointer;"
                         onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='var(--shadow-lg)'" 
                         onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                        
                        <div class="script-header" style="margin-bottom: 1rem;">
                            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                                <h3 style="margin: 0; flex: 1;">${script.title}</h3>
                                <div class="script-actions" onclick="event.stopPropagation()" style="display: flex; gap: 0.25rem;">
                                    <button class="btn btn-sm" onclick="window.app.scriptsView.duplicateScript('${script.id}')" title="Duplicate">
                                        📋
                                    </button>
                                    <button class="btn btn-sm" onclick="window.app.scriptsView.showScriptMenu('${script.id}', event)" title="More">
                                        ⋯
                                    </button>
                                </div>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="background: var(--primary); color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">
                                    ${this.getScriptTypeLabel(script.type)}
                                </span>
                                <span style="background: ${this.getStatusColor(script.status)}; color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">
                                    ${this.getStatusLabel(script.status)}
                                </span>
                            </div>
                        </div>
                        
                        <div class="script-meta" style="margin-bottom: 1rem;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.875rem; color: var(--text-secondary);">
                                <div>📄 ${script.pageCount || 1} pages</div>
                                <div>⏱️ ${this.getTimeAgo(script.lastModified)}</div>
                                <div>📅 ${new Date(script.created).toLocaleDateString()}</div>
                                <div>💾 ${script.content ? Math.round(script.content.length / 1000) + 'k chars' : 'Empty'}</div>
                            </div>
                        </div>
                        
                        ${script.notes && script.notes.trim() ? `
                            <div class="script-notes" style="margin-bottom: 1rem;">
                                <p style="color: var(--text-secondary); margin: 0; font-size: 0.875rem; font-style: italic;">
                                    "${this.truncateText(script.notes, 100)}"
                                </p>
                            </div>
                        ` : ''}
                        
                        <div class="script-preview" style="font-family: 'Courier New', monospace; font-size: 0.75rem; color: var(--text-secondary); background: var(--background); padding: 0.75rem; border-radius: 0.25rem; max-height: 60px; overflow: hidden;">
                            ${this.getScriptPreview(script)}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderScriptList(scripts) {
        return `
            <div class="scripts-list" style="background: var(--surface); border-radius: 0.5rem; overflow: hidden;">
                <div class="list-header" style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr auto; gap: 1rem; padding: 1rem; background: var(--background); font-weight: 600; border-bottom: 1px solid var(--border);">
                    <div>Title</div>
                    <div>Type</div>
                    <div>Status</div>
                    <div>Pages</div>
                    <div>Modified</div>
                    <div>Actions</div>
                </div>
                ${scripts.map(script => `
                    <div class="list-item" onclick="window.app.router.navigate('scripts/${script.id}')" style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr auto; gap: 1rem; padding: 1rem; border-bottom: 1px solid var(--border); cursor: pointer; transition: background 0.2s;"
                         onmouseover="this.style.background='var(--surface-hover)'" 
                         onmouseout="this.style.background='transparent'">
                        <div style="font-weight: 600;">${script.title}</div>
                        <div style="color: var(--text-secondary);">${this.getScriptTypeLabel(script.type)}</div>
                        <div>
                            <span style="background: ${this.getStatusColor(script.status)}; color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">
                                ${this.getStatusLabel(script.status)}
                            </span>
                        </div>
                        <div style="color: var(--text-secondary);">${script.pageCount || 1}</div>
                        <div style="color: var(--text-secondary);">${this.getTimeAgo(script.lastModified)}</div>
                        <div onclick="event.stopPropagation()" style="display: flex; gap: 0.25rem;">
                            <button class="btn btn-sm" onclick="window.app.scriptsView.duplicateScript('${script.id}')" title="Duplicate">
                                📋
                            </button>
                            <button class="btn btn-sm" onclick="window.app.scriptsView.showScriptMenu('${script.id}', event)" title="More">
                                ⋯
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderEmptyState() {
        const activeProduction = this.state.getActiveProduction();
        const productionText = activeProduction ? ` for ${activeProduction.title}` : '';
        
        return `
            <div class="empty-state" style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🎬</div>
                <h3>No scripts yet${productionText}</h3>
                <p>Create your first screenplay to start writing</p>
                <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 1rem;">
                    <button class="btn btn-secondary" onclick="window.app.scriptsView.loadTutorialScript()">
                        📚 Try Tutorial
                    </button>
                    <button class="btn btn-primary" onclick="window.app.scriptsView.createNewScript()">
                        Create First Script
                    </button>
                </div>
            </div>
        `;
    }

    filterScripts(scripts) {
        let filtered = [...scripts];

        // Apply search filter
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(script => 
                script.title.toLowerCase().includes(query) ||
                (script.notes && script.notes.toLowerCase().includes(query)) ||
                (script.content && script.content.toLowerCase().includes(query))
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (this.sortBy) {
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'created':
                    return new Date(b.created || 0) - new Date(a.created || 0);
                case 'lastModified':
                    return new Date(b.lastModified || 0) - new Date(a.lastModified || 0);
                case 'pageCount':
                    return (b.pageCount || 0) - (a.pageCount || 0);
                case 'status':
                    return a.status.localeCompare(b.status);
                default:
                    return 0;
            }
        });

        return filtered;
    }

    // Event handlers
    handleSearch(event) {
        this.searchQuery = event.target.value;
        this.refreshContent();
    }

    handleSort(event) {
        this.sortBy = event.target.value;
        this.refreshContent();
    }

    handleFilter(event) {
        // Implement filter logic
        this.refreshContent();
    }

    toggleView() {
        this.currentView = this.currentView === 'grid' ? 'list' : 'grid';
        const toggle = document.getElementById('view-toggle');
        if (toggle) {
            toggle.textContent = this.currentView === 'grid' ? '📋 List View' : '🔲 Grid View';
        }
        this.refreshContent();
    }

    refreshContent() {
        const container = document.getElementById('scripts-container');
        if (container) {
            container.innerHTML = this.renderScriptContent();
        }
    }

    // Action methods
    createNewScript() {
        window.app.router.navigate('scripts/new');
    }

    loadTutorialScript() {
        const tutorialContent = `Title: StoryBlocks Fountain Tutorial
Credit: Based on Beat iOS Tutorial
Author: StoryBlocks Team
Draft date: Version 1.0
Contact:
support@storyblocks.app


INT. SCHOOL ROOM - DAY

Is this your first time using StoryBlocks? This file is a playground for you to experiment with Fountain formatting. For more features, check out our comprehensive screenplay editor.

In StoryBlocks, you don't need to press any special keys to write dialogue or a scene header. Just type "int. school" or "ext. park" on a new line and it will become a scene header.

Try it out yourself!


EXT. PARK - DAY

The same is true with dialogue. Just type in CHARACTER NAME (all caps) and then follow it with a dialogue block (or parenthetical) on the next line. It will become dialogue. 

Try it out!

CHARACTER
Hello. This is your first dialogue block.

CHARACTER 2
(gently nodding their head)
Well done.

You can also press Tab to force a character cue and not worry about writing in all caps.

After one empty line break the format will change back to action. StoryBlocks automatically formats elements as you type.

You can also use transitions just by typing out something in all-caps and ending it with a colon, like this:

CUT TO:

Well, that was easy. You should be able to write a full screenplay by using those elements. 

Now, if you dare, let's get more technical!


/*

This is a note. It won't be printed or exported, don't worry. This way, you can add longer comments and omit scenes.

Oh, and check out the live preview by clicking the Preview button!

The title page info you see at the beginning of this file will be used when exporting your script.

*/


# This is a new section

= This is a synopsis line. Let's get a bit more technical.

INT. TUNNEL - NIGHT 

You can use sections and synopses (as above) to help structure your story. They won't be printed out, don't worry.

Take a look at the scene navigator dropdown to see how the structure is laid out!


INT./EXT. BEACH HOUSE - NIGHT

[[Stylizing your script. Notes can provide scene context and descriptions.]]

Text formatting can be done with simple markup. Because **StoryBlocks** uses Fountain markup language, some characters will show up on screen, but *they won't print out*.

Basically, text formatting works so that anything inside dual asterisks is **bolded** and single asterisks make it *italic*. You can also _underline_ stuff using underscores.

Text can be centered by surrounding it with > and <

>Centered text<

Transitions can be forced using single >

> Forced, surprisingly slow transition...


EXT. STREET - NIGHT [[BLUE]]

= Dual dialogue & other special elements

You can set the color for your scene just by typing it out as above [[COLOR]].

Dual dialogue can be written by adding a ^ symbol after a character name.

CHARACTER
Hello, have you heard about StoryBlocks?

CHARACTER 2 ^
(interrupting)
Leave me alone, I'm writing!


INT. NIGHT CLUB - NIGHT [[RED]]

Here's some lyrics:

~"If you come to my house, friend
~bring me a lamp and a window I can look through
~at the crowd in the happy alley."

That's about it. Edit this file and try out stuff. If you ever mess something up, you can usually reformat it by just removing something and adding it back.


EXT. UNIVERSITY CLASSROOM - MORNING

[[marker: You can also add markers to indicate parts that need work or attention.]]

[[marker pink: This is a pink marker for important notes!]]

StoryBlocks supports the full Fountain markup language. For more information about Fountain, visit https://www.fountain.io/

**Bold text**, *italic text*, and _underlined text_ all work in action lines and dialogue.

Try experimenting with different elements:
- Scene headers with colors
- Character names with ^ for dual dialogue
- Centered text with > and <
- Forced transitions with >
- Notes with /* */
- Sections with #
- Synopsis lines with =

> FADE OUT

/*

This tutorial covers the basic Fountain formatting supported in StoryBlocks. 

Advanced features:
- Real-time preview
- Character auto-completion
- Scene navigation
- Export to multiple formats
- Auto-save functionality
- Production integration

Start writing your screenplay and explore all the features!

*/`;

        const tutorialScript = {
            id: 'tutorial_script_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            title: 'Fountain Tutorial',
            type: 'feature',
            content: tutorialContent,
            notes: 'This is the StoryBlocks Fountain formatting tutorial script. Feel free to experiment and modify it!',
            productionId: this.state.getActiveProduction()?.id || null,
            status: 'draft',
            pageCount: Math.max(1, Math.ceil(tutorialContent.split('\n').length / 55)),
            created: new Date().toISOString(),
            lastModified: new Date().toISOString()
        };
        
        this.state.state.scripts.set(tutorialScript.id, tutorialScript);
        this.events.emit('scriptCreated', tutorialScript);
        this.events.emit('dataChanged');
        
        this.refreshContent();
        
        // Navigate to the tutorial script
        window.app.router.navigate(`scripts/${tutorialScript.id}`);
        
        console.log('Created tutorial script:', tutorialScript.title);
    }

    duplicateScript(scriptId) {
        const originalScript = this.state.state.scripts.get(scriptId);
        if (!originalScript) return;

        const duplicatedScript = {
            ...originalScript,
            id: 'script_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            title: originalScript.title + ' (Copy)',
            status: 'draft',
            created: new Date().toISOString(),
            lastModified: new Date().toISOString()
        };

        this.state.state.scripts.set(duplicatedScript.id, duplicatedScript);
        this.events.emit('scriptCreated', duplicatedScript);
        this.events.emit('dataChanged');

        this.refreshContent();
        console.log('Duplicated script:', duplicatedScript.title);
    }

    showScriptMenu(scriptId, event) {
        event.stopPropagation();
        
        const menu = document.createElement('div');
        menu.className = 'context-menu';
        menu.style.cssText = `
            position: fixed;
            top: ${event.clientY}px;
            left: ${event.clientX}px;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 0.375rem;
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            min-width: 150px;
        `;
        
        menu.innerHTML = `
            <button onclick="window.app.router.navigate('scripts/${scriptId}'); this.closest('.context-menu').remove();" style="
                width: 100%;
                padding: 0.75rem;
                border: none;
                background: none;
                text-align: left;
                cursor: pointer;
                border-bottom: 1px solid var(--border);
            ">📝 Edit</button>
            
            <button onclick="window.app.scriptsView.renameScript('${scriptId}'); this.closest('.context-menu').remove();" style="
                width: 100%;
                padding: 0.75rem;
                border: none;
                background: none;
                text-align: left;
                cursor: pointer;
                border-bottom: 1px solid var(--border);
            ">✏️ Rename</button>
            
            <button onclick="window.app.scriptsView.duplicateScript('${scriptId}'); this.closest('.context-menu').remove();" style="
                width: 100%;
                padding: 0.75rem;
                border: none;
                background: none;
                text-align: left;
                cursor: pointer;
                border-bottom: 1px solid var(--border);
            ">📋 Duplicate</button>
            
            <button onclick="window.app.scriptsView.exportScript('${scriptId}'); this.closest('.context-menu').remove();" style="
                width: 100%;
                padding: 0.75rem;
                border: none;
                background: none;
                text-align: left;
                cursor: pointer;
                border-bottom: 1px solid var(--border);
            ">📤 Export</button>
            
            <button onclick="window.app.scriptsView.deleteScript('${scriptId}'); this.closest('.context-menu').remove();" style="
                width: 100%;
                padding: 0.75rem;
                border: none;
                background: none;
                text-align: left;
                cursor: pointer;
                color: var(--danger);
            ">🗑️ Delete</button>
        `;
        
        document.body.appendChild(menu);
        
        // Remove menu when clicking outside
        setTimeout(() => {
            document.addEventListener('click', () => menu.remove(), { once: true });
        }, 10);
    }

    renameScript(scriptId) {
        const script = this.state.state.scripts.get(scriptId);
        if (!script) return;

        const newTitle = prompt('Enter new script title:', script.title);
        if (newTitle && newTitle.trim() !== script.title) {
            script.title = newTitle.trim();
            script.lastModified = new Date().toISOString();
            
            this.state.state.scripts.set(scriptId, script);
            this.events.emit('scriptUpdated', script);
            this.events.emit('dataChanged');
            
            this.refreshContent();
        }
    }

    exportScript(scriptId) {
        const script = this.state.state.scripts.get(scriptId);
        if (!script) return;

        const content = script.content || '';
        const filename = script.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.fountain`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    deleteScript(scriptId) {
        const script = this.state.state.scripts.get(scriptId);
        if (!script) return;

        if (confirm(`Are you sure you want to delete "${script.title}"? This action cannot be undone.`)) {
            this.state.state.scripts.delete(scriptId);
            this.events.emit('scriptDeleted', scriptId);
            this.events.emit('dataChanged');
            
            this.refreshContent();
            console.log('Deleted script:', script.title);
        }
    }

    showImportDialog() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;
        
        modal.innerHTML = `
            <div class="modal-content" style="
                background: var(--background);
                border-radius: 0.5rem;
                padding: 2rem;
                width: 90%;
                max-width: 500px;
            ">
                <h2 style="margin: 0 0 1rem 0; color: var(--primary);">📤 Import Script</h2>
                
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Select File</label>
                    <input type="file" id="script-file" accept=".fountain,.txt,.fdx" style="
                        width: 100%;
                        padding: 0.75rem;
                        border: 1px solid var(--border);
                        border-radius: 0.375rem;
                        background: var(--surface);
                    ">
                    <small style="color: var(--text-secondary);">Supported formats: .fountain, .txt, .fdx</small>
                </div>
                
                <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                    <button onclick="this.closest('.modal-overlay').remove()" class="btn btn-secondary">
                        Cancel
                    </button>
                    <button onclick="window.app.scriptsView.importScript(); this.closest('.modal-overlay').remove();" class="btn btn-primary">
                        Import
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    importScript() {
        const fileInput = document.getElementById('script-file');
        const file = fileInput?.files[0];
        
        if (!file) {
            alert('Please select a file to import.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            const filename = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
            
            const newScript = {
                id: 'script_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                title: filename,
                type: 'feature',
                content: content,
                notes: '',
                productionId: this.state.getActiveProduction()?.id || null,
                status: 'draft',
                pageCount: Math.max(1, Math.ceil(content.split('\n').length / 55)),
                created: new Date().toISOString(),
                lastModified: new Date().toISOString()
            };
            
            this.state.state.scripts.set(newScript.id, newScript);
            this.events.emit('scriptCreated', newScript);
            this.events.emit('dataChanged');
            
            this.refreshContent();
            console.log('Imported script:', newScript.title);
        };
        
        reader.readAsText(file);
    }

    // Utility methods
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    }

    getScriptPreview(script) {
        if (!script.content) return 'Empty script';
        
        const lines = script.content.split('\n').slice(0, 3);
        return lines.map(line => line.trim()).filter(line => line).join('\n') || 'Empty script';
    }

    getScriptTypeLabel(type) {
        const labels = {
            'feature': 'Feature Film',
            'short': 'Short Film',
            'tv_episode': 'TV Episode',
            'tv_pilot': 'TV Pilot',
            'web_series': 'Web Series',
            'stage_play': 'Stage Play',
            'audio_drama': 'Audio Drama'
        };
        return labels[type] || type;
    }

    getStatusLabel(status) {
        const labels = {
            'draft': 'Draft',
            'revision': 'Revision',
            'final': 'Final',
            'locked': 'Locked'
        };
        return labels[status] || status;
    }

    getStatusColor(status) {
        const colors = {
            'draft': '#6b7280',
            'revision': '#f59e0b',
            'final': '#10b981',
            'locked': '#dc2626'
        };
        return colors[status] || '#6b7280';
    }

    getTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    }
}