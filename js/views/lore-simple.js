// Lore & Rules View (Simple version)
class LoreView {
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
            <div class="lore-view">
                <div class="lore-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <div class="header-title">
                        <h1>Lore & Rules</h1>
                        <p style="color: var(--text-secondary); margin: 0;">
                            World-building knowledge, history, magic systems, and universal rules
                        </p>
                    </div>
                    <div class="header-actions">
                        <button class="btn btn-secondary" onclick="window.app.loreView.showImportDialog()" style="margin-right: 0.5rem;">
                            📤 Import
                        </button>
                        <button class="btn btn-primary" onclick="window.app.loreView.showAddLoreDialog()">
                            ➕ Add Lore
                        </button>
                    </div>
                </div>

                <div class="lore-toolbar" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding: 1rem; background: var(--surface); border-radius: 0.5rem;">
                    <div class="search-section">
                        <input type="text" id="lore-search" placeholder="Search lore..." 
                               style="padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; width: 250px;"
                               onkeyup="window.app.loreView.handleSearch(event)">
                    </div>
                    
                    <div class="filter-section" style="display: flex; gap: 1rem;">
                        <select id="lore-sort" onchange="window.app.loreView.handleSort(event)" 
                                style="padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                            <option value="title">Sort by Title</option>
                            <option value="created">Sort by Created</option>
                            <option value="modified">Sort by Modified</option>
                            <option value="category">Sort by Category</option>
                        </select>
                        
                        <select id="lore-filter" onchange="window.app.loreView.handleFilter(event)"
                                style="padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                            <option value="all">All Categories</option>
                            <option value="history">History</option>
                            <option value="magic">Magic System</option>
                            <option value="technology">Technology</option>
                            <option value="culture">Culture</option>
                            <option value="rules">World Rules</option>
                            <option value="mythology">Mythology</option>
                        </select>
                    </div>
                </div>

                <div class="lore-content">
                    <div class="lore-container" id="lore-container">
                        ${this.renderLoreContent()}
                    </div>
                </div>
            </div>
        `;
    }

    renderLoreContent() {
        const allLore = Array.from(this.state.state.lore.values());
        
        if (allLore.length === 0) {
            return this.renderEmptyState();
        }

        const filteredLore = this.filterLore(allLore);
        return this.renderLoreGrid(filteredLore);
    }

    renderLoreGrid(loreItems) {
        return `
            <div class="lore-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem;">
                ${loreItems.map(lore => `
                    <div class="lore-card" onclick="window.app.router.navigate('lore/${lore.id}')" style="background: var(--surface); border: 1px solid var(--border); border-radius: 0.5rem; padding: 1.5rem; transition: transform 0.2s; cursor: pointer;"
                         onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='var(--shadow-lg)'" 
                         onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                        
                        <div class="lore-header" style="margin-bottom: 1rem;">
                            <h3 style="margin: 0 0 0.5rem 0;">${lore.title}</h3>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="background: var(--primary); color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">
                                    ${this.getLoreCategoryIcon(lore.category)} ${this.getLoreCategoryLabel(lore.category)}
                                </span>
                                ${lore.importance ? `<div style="font-size: 0.75rem;">${'⭐'.repeat(lore.importance)}</div>` : ''}
                            </div>
                        </div>
                        
                        <div class="lore-description" style="margin-bottom: 1rem;">
                            <p style="color: var(--text-secondary); margin: 0; line-height: 1.5;">${this.truncateText(lore.description || '', 120)}</p>
                        </div>
                        
                        ${lore.rules && lore.rules.length > 0 ? `
                            <div class="lore-rules" style="margin-bottom: 1rem;">
                                <h4 style="margin: 0 0 0.5rem 0; font-size: 0.875rem; color: var(--primary);">Key Rules:</h4>
                                <ul style="margin: 0; padding-left: 1rem; font-size: 0.75rem; color: var(--text-secondary);">
                                    ${lore.rules.slice(0, 2).map(rule => `<li>${this.truncateText(rule, 60)}</li>`).join('')}
                                    ${lore.rules.length > 2 ? `<li style="font-style: italic;">+${lore.rules.length - 2} more rules...</li>` : ''}
                                </ul>
                            </div>
                        ` : ''}
                        
                        ${lore.tags && lore.tags.length > 0 ? `
                            <div class="lore-tags" style="margin-bottom: 1rem;">
                                <div style="display: flex; flex-wrap: wrap; gap: 0.25rem;">
                                    ${lore.tags.slice(0, 3).map(tag => `
                                        <span style="background: var(--background); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">
                                            ${tag}
                                        </span>
                                    `).join('')}
                                    ${lore.tags.length > 3 ? `<span style="color: var(--text-secondary); font-size: 0.75rem;">+${lore.tags.length - 3}</span>` : ''}
                                </div>
                            </div>
                        ` : ''}
                        
                        <div class="lore-meta" style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--text-secondary);">
                            <span>${lore.scope || 'World-wide'}</span>
                            <span>${new Date(lore.lastModified).toLocaleDateString()}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderEmptyState() {
        return `
            <div class="empty-state" style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                <div style="font-size: 4rem; margin-bottom: 1rem;">📚</div>
                <h3>No lore yet</h3>
                <p>Start building your world's knowledge base with history, rules, and systems</p>
                <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 1rem;">
                    <button class="btn btn-primary" onclick="window.app.loreView.showAddLoreDialog('history')">
                        📜 Add History
                    </button>
                    <button class="btn btn-secondary" onclick="window.app.loreView.showAddLoreDialog('magic')">
                        ✨ Magic System
                    </button>
                    <button class="btn btn-secondary" onclick="window.app.loreView.showAddLoreDialog('rules')">
                        ⚖️ World Rules
                    </button>
                </div>
            </div>
        `;
    }

    filterLore(loreItems) {
        let filtered = [...loreItems];

        // Apply search filter
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(lore => 
                lore.title.toLowerCase().includes(query) ||
                (lore.description && lore.description.toLowerCase().includes(query)) ||
                (lore.category && lore.category.toLowerCase().includes(query)) ||
                (lore.tags && lore.tags.some(tag => tag.toLowerCase().includes(query)))
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
        const container = document.getElementById('lore-container');
        if (container) {
            container.innerHTML = this.renderLoreContent();
        }
    }

    // Action methods
    showAddLoreDialog(category = null) {
        alert('Lore creation feature coming soon!');
    }

    showImportDialog() {
        alert('Import lore feature coming soon!');
    }

    // Utility methods
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    }

    getLoreCategoryIcon(category) {
        const icons = {
            'history': '📜',
            'magic': '✨',
            'technology': '⚙️',
            'culture': '🏛️',
            'rules': '⚖️',
            'mythology': '🐲',
            'geography': '🗺️',
            'politics': '👑'
        };
        return icons[category] || '📚';
    }

    getLoreCategoryLabel(category) {
        const labels = {
            'history': 'History',
            'magic': 'Magic System',
            'technology': 'Technology',
            'culture': 'Culture',
            'rules': 'World Rules',
            'mythology': 'Mythology',
            'geography': 'Geography',
            'politics': 'Politics'
        };
        return labels[category] || category || 'Lore';
    }
}