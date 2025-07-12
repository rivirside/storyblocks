// Brainstorming View - Creative Workspace for Ideas and Inspiration
class BrainstormingView {
    constructor(app) {
        this.app = app;
        this.state = app.state;
        this.events = app.events;
        this.currentMode = 'ideas';
        this.timerInterval = null;
        this.freewriteStartTime = null;
        this.ideas = new Map();
        this.categories = ['plot', 'character', 'world', 'theme', 'dialogue', 'other'];
        this.searchQuery = '';
        this.filterCategory = 'all';
    }

    render() {
        return `
            <div class="brainstorming-view">
                <div class="brainstorming-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <div class="header-title">
                        <h1>🧠 Brainstorming</h1>
                        <p style="color: var(--text-secondary); margin: 0;">
                            Creative workspace for ${this.getActiveProductionName()}
                        </p>
                    </div>
                    <div class="header-actions">
                        <button class="btn btn-secondary" onclick="window.app.brainstormingView.exportIdeas()" style="margin-right: 0.5rem;">
                            📤 Export Ideas
                        </button>
                        <button class="btn btn-primary" onclick="window.app.brainstormingView.createNewIdea()">
                            💡 New Idea
                        </button>
                    </div>
                </div>

                <div class="brainstorming-modes" style="display: flex; gap: 1rem; margin-bottom: 2rem; background: var(--surface); padding: 0.5rem; border-radius: 0.5rem;">
                    <button class="mode-tab ${this.currentMode === 'ideas' ? 'active' : ''}" onclick="window.app.brainstormingView.switchMode('ideas')" style="flex: 1; padding: 0.75rem; border: none; background: ${this.currentMode === 'ideas' ? 'var(--primary)' : 'transparent'}; color: ${this.currentMode === 'ideas' ? 'white' : 'var(--text-primary)'}; border-radius: 0.375rem; cursor: pointer; transition: all 0.2s;">
                        💡 Ideas
                    </button>
                    <button class="mode-tab ${this.currentMode === 'prompts' ? 'active' : ''}" onclick="window.app.brainstormingView.switchMode('prompts')" style="flex: 1; padding: 0.75rem; border: none; background: ${this.currentMode === 'prompts' ? 'var(--primary)' : 'transparent'}; color: ${this.currentMode === 'prompts' ? 'white' : 'var(--text-primary)'}; border-radius: 0.375rem; cursor: pointer; transition: all 0.2s;">
                        ✨ Prompts
                    </button>
                    <button class="mode-tab ${this.currentMode === 'freewrite' ? 'active' : ''}" onclick="window.app.brainstormingView.switchMode('freewrite')" style="flex: 1; padding: 0.75rem; border: none; background: ${this.currentMode === 'freewrite' ? 'var(--primary)' : 'transparent'}; color: ${this.currentMode === 'freewrite' ? 'white' : 'var(--text-primary)'}; border-radius: 0.375rem; cursor: pointer; transition: all 0.2s;">
                        📝 Freewrite
                    </button>
                    <button class="mode-tab ${this.currentMode === 'mindmap' ? 'active' : ''}" onclick="window.app.brainstormingView.switchMode('mindmap')" style="flex: 1; padding: 0.75rem; border: none; background: ${this.currentMode === 'mindmap' ? 'var(--primary)' : 'transparent'}; color: ${this.currentMode === 'mindmap' ? 'white' : 'var(--text-primary)'}; border-radius: 0.375rem; cursor: pointer; transition: all 0.2s;">
                        🗺️ Mind Map
                    </button>
                </div>

                <div class="brainstorming-content">
                    ${this.renderCurrentMode()}
                </div>
            </div>
        `;
    }

    renderCurrentMode() {
        switch (this.currentMode) {
            case 'ideas':
                return this.renderIdeasMode();
            case 'prompts':
                return this.renderPromptsMode();
            case 'freewrite':
                return this.renderFreewriteMode();
            case 'mindmap':
                return this.renderMindMapMode();
            default:
                return this.renderIdeasMode();
        }
    }

    renderIdeasMode() {
        const ideas = this.getFilteredIdeas();
        
        return `
            <div class="ideas-mode">
                <div class="ideas-toolbar" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding: 1rem; background: var(--surface); border-radius: 0.5rem;">
                    <div class="search-section">
                        <input type="text" id="ideas-search" placeholder="Search ideas..." 
                               value="${this.searchQuery}"
                               style="padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; width: 250px;"
                               onkeyup="window.app.brainstormingView.handleSearch(event)">
                    </div>
                    
                    <div class="filter-section" style="display: flex; gap: 1rem;">
                        <select id="category-filter" onchange="window.app.brainstormingView.handleCategoryFilter(event)" 
                                style="padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                            <option value="all" ${this.filterCategory === 'all' ? 'selected' : ''}>All Categories</option>
                            ${this.categories.map(cat => `
                                <option value="${cat}" ${this.filterCategory === cat ? 'selected' : ''}>${this.getCategoryLabel(cat)}</option>
                            `).join('')}
                        </select>
                        
                        <select id="sort-ideas" onchange="window.app.brainstormingView.handleSort(event)"
                                style="padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="category">By Category</option>
                            <option value="title">By Title</option>
                        </select>
                    </div>
                </div>

                <div class="ideas-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;">
                    ${ideas.length === 0 ? this.renderEmptyIdeasState() : ideas.map(idea => this.renderIdeaCard(idea)).join('')}
                </div>
            </div>
        `;
    }

    renderIdeaCard(idea) {
        return `
            <div class="idea-card" style="background: var(--surface); border: 1px solid var(--border); border-radius: 0.5rem; padding: 1.5rem; transition: transform 0.2s; position: relative;"
                 onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='var(--shadow-lg)'" 
                 onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                
                <div class="idea-header" style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <h3 style="margin: 0; flex: 1;">${idea.title}</h3>
                    <div class="idea-actions" style="display: flex; gap: 0.25rem;">
                        <button class="btn btn-sm" onclick="window.app.brainstormingView.editIdea('${idea.id}')" title="Edit">
                            ✏️
                        </button>
                        <button class="btn btn-sm" onclick="window.app.brainstormingView.duplicateIdea('${idea.id}')" title="Duplicate">
                            📋
                        </button>
                        <button class="btn btn-sm" onclick="window.app.brainstormingView.deleteIdea('${idea.id}')" title="Delete" style="color: var(--danger);">
                            🗑️
                        </button>
                    </div>
                </div>
                
                <div class="idea-category" style="margin-bottom: 1rem;">
                    <span style="background: ${this.getCategoryColor(idea.category)}; color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">
                        ${this.getCategoryLabel(idea.category)}
                    </span>
                </div>
                
                <div class="idea-content" style="color: var(--text-secondary); margin-bottom: 1rem; line-height: 1.5;">
                    ${this.truncateText(idea.content, 150)}
                </div>
                
                ${idea.tags && idea.tags.length > 0 ? `
                    <div class="idea-tags" style="display: flex; flex-wrap: wrap; gap: 0.25rem; margin-bottom: 1rem;">
                        ${idea.tags.map(tag => `
                            <span style="background: var(--background); color: var(--text-secondary); padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-size: 0.75rem; border: 1px solid var(--border);">
                                #${tag}
                            </span>
                        `).join('')}
                    </div>
                ` : ''}
                
                <div class="idea-meta" style="font-size: 0.75rem; color: var(--text-secondary); display: flex; justify-content: space-between;">
                    <span>📅 ${new Date(idea.created).toLocaleDateString()}</span>
                    <span>💭 ${idea.connections || 0} connections</span>
                </div>
            </div>
        `;
    }

    renderEmptyIdeasState() {
        return `
            <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-secondary);">
                <div style="font-size: 4rem; margin-bottom: 1rem;">💡</div>
                <h3>No ideas yet</h3>
                <p>Start capturing your creative thoughts and inspiration</p>
                <button class="btn btn-primary" onclick="window.app.brainstormingView.createNewIdea()" style="margin-top: 1rem;">
                    Create First Idea
                </button>
            </div>
        `;
    }

    renderPromptsMode() {
        const prompts = this.getWritingPrompts();
        
        return `
            <div class="prompts-mode">
                <div class="prompts-header" style="text-align: center; margin-bottom: 2rem;">
                    <h2>✨ Creative Writing Prompts</h2>
                    <p style="color: var(--text-secondary);">Spark your imagination with these creative prompts</p>
                </div>
                
                <div class="prompts-toolbar" style="display: flex; justify-content: center; gap: 1rem; margin-bottom: 2rem;">
                    <button class="btn btn-primary" onclick="window.app.brainstormingView.generateNewPrompts()">
                        🎲 New Prompts
                    </button>
                    <button class="btn btn-secondary" onclick="window.app.brainstormingView.savePromptAsIdea()">
                        💾 Save Current Prompt
                    </button>
                </div>
                
                <div class="prompts-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2rem;">
                    ${prompts.map((prompt, index) => `
                        <div class="prompt-card" style="background: var(--surface); border: 1px solid var(--border); border-radius: 0.5rem; padding: 2rem; text-align: center;">
                            <div class="prompt-icon" style="font-size: 3rem; margin-bottom: 1rem;">${prompt.icon}</div>
                            <h3 style="color: var(--primary); margin-bottom: 1rem;">${prompt.title}</h3>
                            <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.5rem;">${prompt.text}</p>
                            <div class="prompt-actions" style="display: flex; gap: 0.5rem; justify-content: center;">
                                <button class="btn btn-sm btn-secondary" onclick="window.app.brainstormingView.copyPrompt(${index})">
                                    📋 Copy
                                </button>
                                <button class="btn btn-sm btn-primary" onclick="window.app.brainstormingView.usePrompt(${index})">
                                    ✍️ Use This
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderFreewriteMode() {
        return `
            <div class="freewrite-mode">
                <div class="freewrite-header" style="text-align: center; margin-bottom: 2rem;">
                    <h2>📝 Freewrite Session</h2>
                    <p style="color: var(--text-secondary);">Write continuously without stopping or editing</p>
                </div>
                
                <div class="freewrite-controls" style="display: flex; justify-content: center; align-items: center; gap: 1rem; margin-bottom: 2rem; padding: 1rem; background: var(--surface); border-radius: 0.5rem;">
                    <div class="timer-section" style="display: flex; align-items: center; gap: 1rem;">
                        <label>Duration:</label>
                        <select id="freewrite-duration" style="padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                            <option value="5">5 minutes</option>
                            <option value="10" selected>10 minutes</option>
                            <option value="15">15 minutes</option>
                            <option value="20">20 minutes</option>
                            <option value="30">30 minutes</option>
                        </select>
                    </div>
                    
                    <div class="timer-display" style="font-size: 1.25rem; font-weight: bold; color: var(--primary);">
                        <span id="timer-display">10:00</span>
                    </div>
                    
                    <div class="timer-controls">
                        <button class="btn btn-primary" id="start-timer" onclick="window.app.brainstormingView.startFreewrite()">
                            ▶️ Start
                        </button>
                        <button class="btn btn-secondary" id="pause-timer" onclick="window.app.brainstormingView.pauseFreewrite()" style="display: none;">
                            ⏸️ Pause
                        </button>
                        <button class="btn btn-secondary" id="stop-timer" onclick="window.app.brainstormingView.stopFreewrite()" style="display: none;">
                            ⏹️ Stop
                        </button>
                    </div>
                </div>
                
                <div class="freewrite-area" style="background: var(--surface); border-radius: 0.5rem; padding: 1rem;">
                    <textarea id="freewrite-textarea" placeholder="Start typing... Don't stop, don't edit, just let your thoughts flow..."
                              style="width: 100%; height: 400px; border: none; background: transparent; color: var(--text-primary); font-family: 'Georgia', serif; font-size: 1.1rem; line-height: 1.6; resize: none; outline: none;"
                              disabled></textarea>
                    
                    <div class="freewrite-stats" style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border); font-size: 0.875rem; color: var(--text-secondary);">
                        <div>
                            <span id="word-count">0 words</span> • 
                            <span id="char-count">0 characters</span>
                        </div>
                        <button class="btn btn-sm btn-primary" id="save-freewrite" onclick="window.app.brainstormingView.saveFreewrite()" style="display: none;">
                            💾 Save as Idea
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderMindMapMode() {
        return `
            <div class="mindmap-mode">
                <div class="mindmap-header" style="text-align: center; margin-bottom: 2rem;">
                    <h2>🗺️ Mind Map</h2>
                    <p style="color: var(--text-secondary);">Visual brainstorming and idea connections</p>
                </div>
                
                <div class="mindmap-placeholder" style="background: var(--surface); border: 2px dashed var(--border); border-radius: 0.5rem; padding: 4rem; text-align: center; color: var(--text-secondary);">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🚧</div>
                    <h3>Mind Map Coming Soon</h3>
                    <p>Interactive mind mapping functionality will be available in a future update</p>
                    <p style="margin-top: 2rem;">For now, try the Ideas mode to capture and organize your thoughts</p>
                    <button class="btn btn-primary" onclick="window.app.brainstormingView.switchMode('ideas')" style="margin-top: 1rem;">
                        Go to Ideas Mode
                    </button>
                </div>
            </div>
        `;
    }

    // Mode switching
    switchMode(mode) {
        this.currentMode = mode;
        this.refreshContent();
    }

    refreshContent() {
        const container = document.querySelector('.brainstorming-content');
        if (container) {
            container.innerHTML = this.renderCurrentMode();
        }
        
        // Update mode tabs
        document.querySelectorAll('.mode-tab').forEach(tab => {
            tab.classList.remove('active');
            tab.style.background = 'transparent';
            tab.style.color = 'var(--text-primary)';
        });
        
        const activeTab = document.querySelector(`.mode-tab:nth-child(${this.getModeIndex() + 1})`);
        if (activeTab) {
            activeTab.classList.add('active');
            activeTab.style.background = 'var(--primary)';
            activeTab.style.color = 'white';
        }
    }

    getModeIndex() {
        const modes = ['ideas', 'prompts', 'freewrite', 'mindmap'];
        return modes.indexOf(this.currentMode);
    }

    // Ideas management
    createNewIdea() {
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
            <div class="modal-content" style="background: var(--background); border-radius: 0.5rem; padding: 2rem; width: 90%; max-width: 600px; max-height: 80vh; overflow-y: auto;">
                <h2 style="margin: 0 0 1.5rem 0; color: var(--primary);">💡 New Idea</h2>
                
                <form id="idea-form">
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Title</label>
                        <input type="text" id="idea-title" required style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: 0.375rem; background: var(--surface);">
                    </div>
                    
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Category</label>
                        <select id="idea-category" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: 0.375rem; background: var(--surface);">
                            ${this.categories.map(cat => `<option value="${cat}">${this.getCategoryLabel(cat)}</option>`).join('')}
                        </select>
                    </div>
                    
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Content</label>
                        <textarea id="idea-content" rows="6" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: 0.375rem; background: var(--surface); resize: vertical;"></textarea>
                    </div>
                    
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Tags (comma-separated)</label>
                        <input type="text" id="idea-tags" placeholder="action, mystery, character-development" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: 0.375rem; background: var(--surface);">
                    </div>
                    
                    <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                        <button type="button" onclick="this.closest('.modal-overlay').remove()" class="btn btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" class="btn btn-primary">
                            Create Idea
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        modal.querySelector('#idea-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveNewIdea();
            modal.remove();
        });
        
        document.body.appendChild(modal);
        modal.querySelector('#idea-title').focus();
    }

    saveNewIdea() {
        const title = document.getElementById('idea-title').value;
        const category = document.getElementById('idea-category').value;
        const content = document.getElementById('idea-content').value;
        const tagsInput = document.getElementById('idea-tags').value;
        const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
        
        const idea = {
            id: 'idea_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            title: title,
            category: category,
            content: content,
            tags: tags,
            created: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            productionId: this.state.getActiveProduction()?.id || null,
            connections: 0
        };
        
        this.ideas.set(idea.id, idea);
        this.events.emit('ideaCreated', idea);
        this.events.emit('dataChanged');
        
        if (this.currentMode === 'ideas') {
            this.refreshContent();
        }
        
        console.log('Created new idea:', idea.title);
    }

    getActiveProductionName() {
        const activeProduction = this.state.getActiveProduction();
        return activeProduction ? activeProduction.title : 'All Productions';
    }

    getFilteredIdeas() {
        let filtered = Array.from(this.ideas.values());
        
        // Filter by production
        const activeProduction = this.state.getActiveProduction();
        if (activeProduction) {
            filtered = filtered.filter(idea => idea.productionId === activeProduction.id);
        } else {
            filtered = filtered.filter(idea => !idea.productionId);
        }
        
        // Apply search filter
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(idea => 
                idea.title.toLowerCase().includes(query) ||
                idea.content.toLowerCase().includes(query) ||
                (idea.tags && idea.tags.some(tag => tag.toLowerCase().includes(query)))
            );
        }
        
        // Apply category filter
        if (this.filterCategory !== 'all') {
            filtered = filtered.filter(idea => idea.category === this.filterCategory);
        }
        
        // Sort ideas
        filtered.sort((a, b) => new Date(b.created) - new Date(a.created));
        
        return filtered;
    }

    // Event handlers
    handleSearch(event) {
        this.searchQuery = event.target.value;
        this.refreshContent();
    }

    handleCategoryFilter(event) {
        this.filterCategory = event.target.value;
        this.refreshContent();
    }

    handleSort(event) {
        // Implement sorting logic
        this.refreshContent();
    }

    // Writing prompts
    getWritingPrompts() {
        const prompts = [
            {
                icon: '🏰',
                title: 'Fantasy Quest',
                text: 'Your protagonist discovers a hidden door in their basement that leads to a magical realm where they are the prophesied hero.'
            },
            {
                icon: '🔍',
                title: 'Mystery Element',
                text: 'A character receives a letter meant for someone who died 50 years ago. What secrets does this letter reveal?'
            },
            {
                icon: '💫',
                title: 'Sci-Fi Scenario',
                text: 'In the future, memories can be extracted and traded like currency. Your character just discovered their most precious memory has been stolen.'
            },
            {
                icon: '❤️',
                title: 'Character Development',
                text: 'Write about two characters who are complete opposites being forced to work together to achieve a common goal.'
            }
        ];
        
        return prompts;
    }

    generateNewPrompts() {
        // This would typically fetch new prompts from a larger database
        this.refreshContent();
    }

    copyPrompt(index) {
        const prompts = this.getWritingPrompts();
        const prompt = prompts[index];
        if (prompt) {
            navigator.clipboard.writeText(prompt.text);
            // Could show a toast notification here
        }
    }

    usePrompt(index) {
        const prompts = this.getWritingPrompts();
        const prompt = prompts[index];
        if (prompt) {
            this.switchMode('freewrite');
            setTimeout(() => {
                const textarea = document.getElementById('freewrite-textarea');
                if (textarea) {
                    textarea.value = `Prompt: ${prompt.text}\n\n`;
                    textarea.focus();
                }
            }, 100);
        }
    }

    // Freewrite functionality
    startFreewrite() {
        const duration = parseInt(document.getElementById('freewrite-duration').value);
        this.freewriteStartTime = Date.now();
        
        const textarea = document.getElementById('freewrite-textarea');
        textarea.disabled = false;
        textarea.focus();
        
        this.startTimer(duration);
        
        // Update UI
        document.getElementById('start-timer').style.display = 'none';
        document.getElementById('pause-timer').style.display = 'inline-block';
        document.getElementById('stop-timer').style.display = 'inline-block';
        
        // Track word count
        textarea.addEventListener('input', this.updateWordCount.bind(this));
    }

    startTimer(minutes) {
        let timeLeft = minutes * 60;
        const timerDisplay = document.getElementById('timer-display');
        
        this.timerInterval = setInterval(() => {
            const mins = Math.floor(timeLeft / 60);
            const secs = timeLeft % 60;
            timerDisplay.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
            
            if (timeLeft <= 0) {
                this.stopFreewrite();
                alert('Time\'s up! Great work on your freewrite session.');
            }
            
            timeLeft--;
        }, 1000);
    }

    pauseFreewrite() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        document.getElementById('pause-timer').style.display = 'none';
        document.getElementById('start-timer').style.display = 'inline-block';
        document.getElementById('start-timer').textContent = '▶️ Resume';
    }

    stopFreewrite() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        const textarea = document.getElementById('freewrite-textarea');
        textarea.disabled = true;
        
        // Reset UI
        document.getElementById('start-timer').style.display = 'inline-block';
        document.getElementById('start-timer').textContent = '▶️ Start';
        document.getElementById('pause-timer').style.display = 'none';
        document.getElementById('stop-timer').style.display = 'none';
        document.getElementById('save-freewrite').style.display = 'inline-block';
    }

    updateWordCount() {
        const textarea = document.getElementById('freewrite-textarea');
        const text = textarea.value;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const chars = text.length;
        
        document.getElementById('word-count').textContent = `${words} words`;
        document.getElementById('char-count').textContent = `${chars} characters`;
    }

    saveFreewrite() {
        const textarea = document.getElementById('freewrite-textarea');
        const content = textarea.value.trim();
        
        if (!content) {
            alert('No content to save.');
            return;
        }
        
        const title = prompt('Enter a title for this idea:', 'Freewrite Session');
        if (!title) return;
        
        const idea = {
            id: 'idea_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            title: title,
            category: 'other',
            content: content,
            tags: ['freewrite'],
            created: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            productionId: this.state.getActiveProduction()?.id || null,
            connections: 0
        };
        
        this.ideas.set(idea.id, idea);
        this.events.emit('ideaCreated', idea);
        this.events.emit('dataChanged');
        
        alert('Freewrite saved as an idea!');
        textarea.value = '';
        document.getElementById('save-freewrite').style.display = 'none';
    }

    // Utility methods
    getCategoryLabel(category) {
        const labels = {
            'plot': 'Plot',
            'character': 'Character',
            'world': 'World Building',
            'theme': 'Theme',
            'dialogue': 'Dialogue',
            'other': 'Other'
        };
        return labels[category] || category;
    }

    getCategoryColor(category) {
        const colors = {
            'plot': '#3b82f6',
            'character': '#10b981',
            'world': '#8b5cf6',
            'theme': '#f59e0b',
            'dialogue': '#ef4444',
            'other': '#6b7280'
        };
        return colors[category] || '#6b7280';
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    }

    editIdea(ideaId) {
        // Implementation for editing ideas
        console.log('Edit idea:', ideaId);
    }

    duplicateIdea(ideaId) {
        const original = this.ideas.get(ideaId);
        if (!original) return;
        
        const duplicate = {
            ...original,
            id: 'idea_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            title: original.title + ' (Copy)',
            created: new Date().toISOString(),
            lastModified: new Date().toISOString()
        };
        
        this.ideas.set(duplicate.id, duplicate);
        this.events.emit('ideaCreated', duplicate);
        this.events.emit('dataChanged');
        
        this.refreshContent();
    }

    deleteIdea(ideaId) {
        const idea = this.ideas.get(ideaId);
        if (!idea) return;
        
        if (confirm(`Are you sure you want to delete "${idea.title}"?`)) {
            this.ideas.delete(ideaId);
            this.events.emit('ideaDeleted', ideaId);
            this.events.emit('dataChanged');
            this.refreshContent();
        }
    }

    exportIdeas() {
        const ideas = this.getFilteredIdeas();
        if (ideas.length === 0) {
            alert('No ideas to export.');
            return;
        }
        
        const content = ideas.map(idea => `
# ${idea.title}
**Category:** ${this.getCategoryLabel(idea.category)}
**Created:** ${new Date(idea.created).toLocaleDateString()}
**Tags:** ${idea.tags.join(', ')}

${idea.content}

---
`).join('\n');
        
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'brainstorming-ideas.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}