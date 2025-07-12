// Characters View (Simple version)
class CharactersView {
    constructor(app) {
        this.app = app;
        this.state = app.state;
        this.events = app.events;
        this.currentView = 'grid';
        this.searchQuery = '';
        this.sortBy = 'name';
    }

    render() {
        return `
            <div class="characters-view">
                <div class="characters-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <div class="header-title">
                        <h1>Characters</h1>
                        <p style="color: var(--text-secondary); margin: 0;">
                            ${this.getPageDescription()}
                        </p>
                    </div>
                    <div class="header-actions">
                        <button class="btn btn-secondary" onclick="window.app.charactersView.showImportDialog()" style="margin-right: 0.5rem;">
                            📤 Import
                        </button>
                        <button class="btn btn-primary" onclick="window.app.charactersView.showAddCharacterDialog()">
                            ➕ Add Character
                        </button>
                    </div>
                </div>

                <div class="characters-toolbar" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding: 1rem; background: var(--surface); border-radius: 0.5rem;">
                    <div class="search-section">
                        <input type="text" id="character-search" placeholder="Search characters..." 
                               style="padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; width: 250px;"
                               onkeyup="window.app.charactersView.handleSearch(event)">
                    </div>
                    
                    <div class="filter-section" style="display: flex; gap: 1rem;">
                        <select id="character-sort" onchange="window.app.charactersView.handleSort(event)" 
                                style="padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                            <option value="name">Sort by Name</option>
                            <option value="created">Sort by Created</option>
                            <option value="modified">Sort by Modified</option>
                            <option value="importance">Sort by Importance</option>
                        </select>
                        
                        <select id="character-filter" onchange="window.app.charactersView.handleFilter(event)"
                                style="padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                            <option value="all">All Characters</option>
                            <option value="main">Main Characters</option>
                            <option value="supporting">Supporting</option>
                            <option value="minor">Minor Characters</option>
                        </select>
                    </div>
                    
                    <div class="view-section">
                        <button class="btn btn-secondary btn-sm active" onclick="window.app.charactersView.switchView('grid')" data-view="grid">
                            📊 Grid
                        </button>
                        <button class="btn btn-secondary btn-sm" onclick="window.app.charactersView.switchView('list')" data-view="list" style="margin-left: 0.25rem;">
                            📋 List
                        </button>
                    </div>
                </div>

                <div class="characters-content">
                    <div class="characters-container" id="characters-container">
                        ${this.renderCharacterContent()}
                    </div>
                </div>
            </div>
        `;
    }

    renderCharacterContent() {
        const activeProduction = this.state.getActiveProduction();
        const allCharacters = Array.from(this.state.state.characters.values());
        
        // If we're in a specific production, filter to characters in that production
        const characters = activeProduction ? 
            allCharacters.filter(char => char.productionIds && char.productionIds.includes(activeProduction.id)) :
            allCharacters;
        
        if (characters.length === 0) {
            return this.renderEmptyState();
        }

        const filteredCharacters = this.filterCharacters(characters);
        
        if (this.currentView === 'grid') {
            return this.renderCharacterGrid(filteredCharacters);
        } else {
            return this.renderCharacterList(filteredCharacters);
        }
    }

    renderCharacterGrid(characters) {
        return `
            <div class="characters-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;">
                ${characters.map(character => `
                    <div class="character-card" onclick="window.app.router.navigate('character/${character.id}')" style="background: var(--surface); border: 1px solid var(--border); border-radius: 0.5rem; padding: 1.5rem; transition: transform 0.2s; cursor: pointer;"
                         onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='var(--shadow-lg)'" 
                         onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                        <div class="character-avatar" style="text-align: center; margin-bottom: 1rem;">
                            ${character.avatar ? 
                                `<img src="${character.avatar}" alt="${character.name}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;">` : 
                                `<div style="width: 80px; height: 80px; border-radius: 50%; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin: 0 auto;">${this.getInitials(character.name)}</div>`
                            }
                        </div>
                        
                        <div class="character-info" style="text-align: center; margin-bottom: 1rem;">
                            <h3 style="margin: 0 0 0.5rem 0;">${character.name}</h3>
                            <p style="color: var(--text-secondary); margin: 0 0 0.5rem 0;">${this.getCharacterRoleDisplay(character)}</p>
                            <p style="color: var(--text-secondary); font-size: 0.875rem; margin: 0;">${this.truncateText(character.description || '', 100)}</p>
                        </div>
                        
                        <div class="character-meta" style="margin-bottom: 1rem;">
                            <div class="character-importance" style="text-align: center; margin-bottom: 0.5rem;">
                                ${this.renderImportanceStars(character.importance || 1)}
                            </div>
                            <div class="character-tags" style="display: flex; flex-wrap: wrap; gap: 0.25rem; justify-content: center;">
                                ${(character.tags || []).slice(0, 3).map(tag => 
                                    `<span style="background: var(--primary); color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">${tag}</span>`
                                ).join('')}
                            </div>
                        </div>
                        
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderCharacterList(characters) {
        return `
            <div class="characters-list">
                <div class="list-header" style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr; gap: 1rem; padding: 1rem; background: var(--surface); border-radius: 0.5rem; font-weight: 600; margin-bottom: 1rem;">
                    <div>Name</div>
                    <div>Role</div>
                    <div>Importance</div>
                    <div>Modified</div>
                    <div>Actions</div>
                </div>
                ${characters.map(character => `
                    <div class="character-row" style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr; gap: 1rem; padding: 1rem; border: 1px solid var(--border); border-radius: 0.5rem; margin-bottom: 0.5rem; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            ${character.avatar ? 
                                `<img src="${character.avatar}" alt="${character.name}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">` : 
                                `<div style="width: 40px; height: 40px; border-radius: 50%; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 1rem;">${this.getInitials(character.name)}</div>`
                            }
                            <div>
                                <h4 style="margin: 0; font-size: 1rem;">${character.name}</h4>
                                <p style="margin: 0; color: var(--text-secondary); font-size: 0.875rem;">${this.truncateText(character.description || '', 50)}</p>
                            </div>
                        </div>
                        <div>${this.getCharacterRoleDisplay(character)}</div>
                        <div>${this.renderImportanceStars(character.importance || 1)}</div>
                        <div style="font-size: 0.875rem; color: var(--text-secondary);">${character.lastModified ? new Date(character.lastModified).toLocaleDateString() : 'Never'}</div>
                        <div>
                            <button class="btn btn-secondary btn-sm" onclick="window.app.router.navigate('character/${character.id}')" style="font-size: 0.75rem;">View Details</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderEmptyState() {
        return `
            <div class="empty-state" style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🎭</div>
                <h3>No characters yet</h3>
                <p>Create your first character to start building your cast</p>
                <button class="btn btn-primary" onclick="window.app.charactersView.showAddCharacterDialog()" style="margin-top: 1rem;">
                    Add First Character
                </button>
            </div>
        `;
    }

    filterCharacters(characters) {
        let filtered = [...characters];

        // Apply search filter
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(character => 
                character.name.toLowerCase().includes(query) ||
                (character.description && character.description.toLowerCase().includes(query)) ||
                (character.role && character.role.toLowerCase().includes(query))
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (this.sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'created':
                    return new Date(b.created || 0) - new Date(a.created || 0);
                case 'modified':
                    return new Date(b.lastModified || 0) - new Date(a.lastModified || 0);
                case 'importance':
                    return (b.importance || 1) - (a.importance || 1);
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

    switchView(view) {
        this.currentView = view;
        
        // Update button states
        const buttons = document.querySelectorAll('[data-view]');
        buttons.forEach(btn => {
            if (btn.dataset.view === view) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        this.refreshContent();
    }

    refreshContent() {
        console.log('[CharactersView] Refreshing content...');
        const container = document.getElementById('characters-container');
        console.log('[CharactersView] Container found:', !!container);
        console.log('[CharactersView] Characters in state:', this.state.state.characters.size);
        if (container) {
            container.innerHTML = this.renderCharacterContent();
            console.log('[CharactersView] Content refreshed');
        }
    }

    // Action methods
    showAddCharacterDialog() {
        this.app.showCharacterEditor();
    }

    showImportDialog() {
        alert('Import characters feature coming soon!');
    }

    editCharacter(id) {
        const character = this.state.state.characters.get(id);
        if (character) {
            this.app.showCharacterEditor(character);
        }
    }

    viewCharacter(id) {
        const character = this.state.state.characters.get(id);
        if (character) {
            this.showCharacterDetailView(character);
        }
    }

    showCharacterDetailView(character) {
        // Show character in read-only detail view
        const detailHtml = `
            <div class="character-detail-overlay" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
                <div class="character-detail-modal" style="background: var(--background); border-radius: 0.5rem; width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto; box-shadow: var(--shadow-xl);">
                    <div class="detail-header" style="padding: 1.5rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
                        <h2 style="margin: 0;">${character.name}</h2>
                        <button onclick="this.closest('.character-detail-overlay').remove()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-secondary);">×</button>
                    </div>
                    
                    <div class="detail-content" style="padding: 1.5rem;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                            <div>
                                <h3 style="color: var(--primary); margin-bottom: 1rem;">Basic Information</h3>
                                <div style="margin-bottom: 0.5rem;"><strong>Role:</strong> ${this.getCharacterRoleDisplay(character)}</div>
                                <div style="margin-bottom: 0.5rem;"><strong>Importance:</strong> ${'★'.repeat(character.importance || 1)}</div>
                                <div style="margin-bottom: 0.5rem;"><strong>Status:</strong> ${character.status || 'Active'}</div>
                                ${character.age ? `<div style="margin-bottom: 0.5rem;"><strong>Age:</strong> ${character.age}</div>` : ''}
                                ${character.gender ? `<div style="margin-bottom: 0.5rem;"><strong>Gender:</strong> ${character.gender}</div>` : ''}
                                
                                ${character.appearance ? `
                                    <h4 style="margin-top: 1.5rem; margin-bottom: 0.5rem;">Appearance</h4>
                                    <p style="color: var(--text-secondary);">${character.appearance}</p>
                                ` : ''}
                                
                                ${character.tags && character.tags.length > 0 ? `
                                    <h4 style="margin-top: 1.5rem; margin-bottom: 0.5rem;">Tags</h4>
                                    <div style="display: flex; flex-wrap: wrap; gap: 0.25rem;">
                                        ${character.tags.map(tag => `<span style="background: var(--primary); color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">${tag}</span>`).join('')}
                                    </div>
                                ` : ''}
                            </div>
                            
                            <div>
                                ${character.description ? `
                                    <h3 style="color: var(--primary); margin-bottom: 1rem;">Description</h3>
                                    <p style="margin-bottom: 1.5rem; color: var(--text-secondary);">${character.description}</p>
                                ` : ''}
                                
                                ${character.personality ? `
                                    <h4 style="margin-bottom: 0.5rem;">Personality</h4>
                                    <p style="margin-bottom: 1rem; color: var(--text-secondary);">${character.personality}</p>
                                ` : ''}
                                
                                ${character.motivation ? `
                                    <h4 style="margin-bottom: 0.5rem;">Goals & Motivation</h4>
                                    <p style="margin-bottom: 1rem; color: var(--text-secondary);">${character.motivation}</p>
                                ` : ''}
                                
                                ${character.background ? `
                                    <h4 style="margin-bottom: 0.5rem;">Background</h4>
                                    <p style="margin-bottom: 1rem; color: var(--text-secondary);">${character.background}</p>
                                ` : ''}
                            </div>
                        </div>
                        
                        ${character.arc || character.relationships || character.conflict || character.notes ? `
                            <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--border);">
                                <h3 style="color: var(--primary); margin-bottom: 1rem;">Story Development</h3>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                                    <div>
                                        ${character.arc ? `
                                            <h4 style="margin-bottom: 0.5rem;">Character Arc</h4>
                                            <p style="margin-bottom: 1rem; color: var(--text-secondary);">${character.arc}</p>
                                        ` : ''}
                                        
                                        ${character.conflict ? `
                                            <h4 style="margin-bottom: 0.5rem;">Internal Conflict</h4>
                                            <p style="margin-bottom: 1rem; color: var(--text-secondary);">${character.conflict}</p>
                                        ` : ''}
                                    </div>
                                    <div>
                                        ${character.relationships ? `
                                            <h4 style="margin-bottom: 0.5rem;">Relationships</h4>
                                            <p style="margin-bottom: 1rem; color: var(--text-secondary);">${character.relationships}</p>
                                        ` : ''}
                                        
                                        ${character.notes ? `
                                            <h4 style="margin-bottom: 0.5rem;">Notes</h4>
                                            <p style="margin-bottom: 1rem; color: var(--text-secondary);">${character.notes}</p>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="detail-footer" style="padding: 1.5rem; border-top: 1px solid var(--border); display: flex; justify-content: end; gap: 0.5rem;">
                        <button class="btn btn-primary" onclick="window.app.charactersView.editCharacter('${character.id}'); this.closest('.character-detail-overlay').remove();">
                            ✏️ Edit Character
                        </button>
                        <button class="btn btn-secondary" onclick="this.closest('.character-detail-overlay').remove()">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', detailHtml);
    }

    // Utility methods
    getInitials(name) {
        return name.split(' ')
            .map(part => part.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    }

    renderImportanceStars(importance) {
        const stars = Math.min(Math.max(importance, 1), 5);
        return Array.from({ length: 5 }, (_, i) => 
            `<span style="color: ${i < stars ? 'var(--warning)' : 'var(--border)'};">★</span>`
        ).join('');
    }
    
    getPageDescription() {
        const activeProduction = this.state.getActiveProduction();
        return activeProduction ? 
            `Characters in "${activeProduction.title}"` : 
            'All characters in your world';
    }
    
    getCharacterRoleDisplay(character) {
        const activeProduction = this.state.getActiveProduction();
        if (!activeProduction) {
            // In world view, show how many productions they're in
            const productionCount = character.productionIds ? character.productionIds.length : 0;
            return productionCount > 0 ? `In ${productionCount} ${productionCount === 1 ? 'story' : 'stories'}` : 'Not in any stories';
        }
        
        // In production view, show their role in this production
        const productionData = this.state.getCharacterProductionData(character.id, activeProduction.id);
        if (!productionData) return 'Not in this story';
        
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
        
        return roleLabels[productionData.role] || productionData.role || 'No role';
    }
}