// Themes View (Simple version)
class ThemesView {
    constructor(app) {
        this.app = app;
        this.state = app.state;
        this.events = app.events;
        this.currentView = 'grid';
        this.searchQuery = '';
        this.sortBy = 'title';
    }

    render() {
        return `
            <div class="themes-view">
                <div class="themes-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <div class="header-title">
                        <h1>Themes</h1>
                        <p style="color: var(--text-secondary); margin: 0;">
                            Explore and develop your story's deeper meanings and messages
                        </p>
                    </div>
                    <div class="header-actions">
                        <button class="btn btn-secondary" onclick="window.app.themesView.showImportDialog()" style="margin-right: 0.5rem;">
                            📤 Import
                        </button>
                        <button class="btn btn-primary" onclick="window.app.themesView.showAddThemeDialog()">
                            ➕ Add Theme
                        </button>
                    </div>
                </div>

                <div class="themes-toolbar" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding: 1rem; background: var(--surface); border-radius: 0.5rem;">
                    <div class="search-section">
                        <input type="text" id="theme-search" placeholder="Search themes..." 
                               style="padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; width: 250px;"
                               onkeyup="window.app.themesView.handleSearch(event)">
                    </div>
                    
                    <div class="filter-section" style="display: flex; gap: 1rem;">
                        <select id="theme-sort" onchange="window.app.themesView.handleSort(event)" 
                                style="padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                            <option value="title">Sort by Title</option>
                            <option value="created">Sort by Created</option>
                            <option value="modified">Sort by Modified</option>
                            <option value="category">Sort by Category</option>
                        </select>
                        
                        <select id="theme-filter" onchange="window.app.themesView.handleFilter(event)"
                                style="padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                            <option value="all">All Categories</option>
                            <option value="universal">Universal</option>
                            <option value="moral">Moral</option>
                            <option value="social">Social</option>
                            <option value="personal">Personal</option>
                            <option value="philosophical">Philosophical</option>
                        </select>
                    </div>
                </div>

                <div class="themes-content">
                    <div class="themes-container" id="themes-container">
                        ${this.renderThemeContent()}
                    </div>
                </div>
            </div>
        `;
    }

    renderThemeContent() {
        const allThemes = Array.from(this.state.state.themes.values());
        
        if (allThemes.length === 0) {
            return this.renderEmptyState();
        }

        const filteredThemes = this.filterThemes(allThemes);
        return this.renderThemeGrid(filteredThemes);
    }

    renderThemeGrid(themes) {
        return `
            <div class="themes-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem;">
                ${themes.map(theme => `
                    <div class="theme-card" onclick="window.app.router.navigate('theme/${theme.id}')" style="background: var(--surface); border: 1px solid var(--border); border-radius: 0.5rem; padding: 1.5rem; transition: transform 0.2s; cursor: pointer;"
                         onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='var(--shadow-lg)'" 
                         onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                        
                        <div class="theme-header" style="margin-bottom: 1rem;">
                            <h3 style="margin: 0 0 0.5rem 0;">${theme.title}</h3>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="background: var(--primary); color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">
                                    ${this.getThemeCategoryIcon(theme.category)} ${this.getThemeCategoryLabel(theme.category)}
                                </span>
                            </div>
                        </div>
                        
                        <div class="theme-description" style="margin-bottom: 1rem;">
                            <p style="color: var(--text-secondary); margin: 0; line-height: 1.5;">${this.truncateText(theme.description || '', 120)}</p>
                        </div>
                        
                        ${theme.statement ? `
                            <div class="theme-statement" style="margin-bottom: 1rem; padding: 1rem; background: var(--background); border-radius: 0.375rem; border-left: 4px solid var(--primary);">
                                <h4 style="margin: 0 0 0.5rem 0; font-size: 0.875rem; color: var(--primary);">Theme Statement:</h4>
                                <p style="margin: 0; font-style: italic; font-size: 0.875rem;">"${this.truncateText(theme.statement, 100)}"</p>
                            </div>
                        ` : ''}
                        
                        ${theme.questions && theme.questions.length > 0 ? `
                            <div class="theme-questions" style="margin-bottom: 1rem;">
                                <h4 style="margin: 0 0 0.5rem 0; font-size: 0.875rem; color: var(--primary);">Key Questions:</h4>
                                <ul style="margin: 0; padding-left: 1rem; font-size: 0.75rem; color: var(--text-secondary);">
                                    ${theme.questions.slice(0, 2).map(question => `<li>${this.truncateText(question, 60)}</li>`).join('')}
                                    ${theme.questions.length > 2 ? `<li style="font-style: italic;">+${theme.questions.length - 2} more questions...</li>` : ''}
                                </ul>
                            </div>
                        ` : ''}
                        
                        ${theme.symbols && theme.symbols.length > 0 ? `
                            <div class="theme-symbols" style="margin-bottom: 1rem;">
                                <h4 style="margin: 0 0 0.5rem 0; font-size: 0.875rem; color: var(--primary);">Symbols:</h4>
                                <div style="display: flex; flex-wrap: wrap; gap: 0.25rem;">
                                    ${theme.symbols.slice(0, 3).map(symbol => `
                                        <span style="background: var(--background); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">
                                            ${symbol}
                                        </span>
                                    `).join('')}
                                    ${theme.symbols.length > 3 ? `<span style="color: var(--text-secondary); font-size: 0.75rem;">+${theme.symbols.length - 3}</span>` : ''}
                                </div>
                            </div>
                        ` : ''}
                        
                        <div class="theme-meta" style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--text-secondary);">
                            <span>Used in ${theme.productionIds.length} ${theme.productionIds.length === 1 ? 'story' : 'stories'}</span>
                            <span>${new Date(theme.lastModified).toLocaleDateString()}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderEmptyState() {
        return `
            <div class="empty-state" style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                <div style="font-size: 4rem; margin-bottom: 1rem;">💡</div>
                <h3>No themes yet</h3>
                <p>Start exploring the deeper meanings and messages in your stories</p>
                <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 1rem;">
                    <button class="btn btn-primary" onclick="window.app.themesView.showAddThemeDialog('universal')">
                        🌍 Universal Theme
                    </button>
                    <button class="btn btn-secondary" onclick="window.app.themesView.showAddThemeDialog('moral')">
                        ⚖️ Moral Theme
                    </button>
                    <button class="btn btn-secondary" onclick="window.app.themesView.showAddThemeDialog('social')">
                        👥 Social Theme
                    </button>
                </div>
            </div>
        `;
    }

    filterThemes(themes) {
        let filtered = [...themes];

        // Apply search filter
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(theme => 
                theme.title.toLowerCase().includes(query) ||
                (theme.description && theme.description.toLowerCase().includes(query)) ||
                (theme.statement && theme.statement.toLowerCase().includes(query)) ||
                (theme.category && theme.category.toLowerCase().includes(query))
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (this.sortBy) {
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'created':
                    return new Date(b.created || 0) - new Date(a.created || 0);
                case 'modified':
                    return new Date(b.lastModified || 0) - new Date(a.lastModified || 0);
                case 'category':
                    return a.category.localeCompare(b.category);
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

    refreshContent() {
        const container = document.getElementById('themes-container');
        if (container) {
            container.innerHTML = this.renderThemeContent();
        }
    }

    // Action methods
    showAddThemeDialog(category = null) {
        alert('Theme creation feature coming soon!');
    }

    showImportDialog() {
        alert('Import themes feature coming soon!');
    }

    // Utility methods
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    }

    getThemeCategoryIcon(category) {
        const icons = {
            'universal': '🌍',
            'moral': '⚖️',
            'social': '👥',
            'personal': '👤',
            'philosophical': '🤔',
            'spiritual': '✨',
            'political': '🏛️'
        };
        return icons[category] || '💡';
    }

    getThemeCategoryLabel(category) {
        const labels = {
            'universal': 'Universal',
            'moral': 'Moral',
            'social': 'Social',
            'personal': 'Personal',
            'philosophical': 'Philosophical',
            'spiritual': 'Spiritual',
            'political': 'Political'
        };
        return labels[category] || category || 'Theme';
    }
}