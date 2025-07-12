// Production Selector Component
class ProductionSelector {
    constructor(app) {
        this.app = app;
        this.state = app.state;
        this.events = app.events;
        this.isDropdownOpen = false;
    }

    render() {
        const activeProduction = this.state.getActiveProduction();
        const productions = Array.from(this.state.state.productions.values());
        
        return `
            <div class="production-selector" style="position: relative; margin-left: 2rem;">
                <button class="production-selector-button" onclick="window.app.productionSelector.toggleDropdown()" 
                        style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: var(--surface); border: 1px solid var(--border); border-radius: 0.375rem; cursor: pointer;">
                    <span style="font-weight: 600; color: var(--text-primary);">
                        ${activeProduction ? activeProduction.title : 'World Overview'}
                    </span>
                    <span style="font-size: 0.75rem; color: var(--text-secondary);">
                        ${activeProduction ? `(${this.getProductionTypeLabel(activeProduction.type)})` : '(All Productions)'}
                    </span>
                    <span style="margin-left: 0.5rem;">▼</span>
                </button>
                
                <div class="production-dropdown" id="production-dropdown" style="display: none; position: absolute; top: 100%; left: 0; right: 0; margin-top: 0.25rem; background: var(--background); border: 1px solid var(--border); border-radius: 0.375rem; box-shadow: var(--shadow-lg); z-index: 1000; min-width: 300px;">
                    <div class="dropdown-header" style="padding: 1rem; border-bottom: 1px solid var(--border);">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <h3 style="margin: 0; font-size: 1rem;">Select Production</h3>
                            <button class="btn btn-primary btn-sm" onclick="window.app.productionSelector.showCreateProductionDialog()">
                                ➕ New Production
                            </button>
                        </div>
                    </div>
                    
                    <div class="dropdown-content" style="max-height: 400px; overflow-y: auto;">
                        <div class="production-option ${!activeProduction ? 'active' : ''}" 
                             onclick="window.app.productionSelector.selectProduction(null)"
                             style="padding: 0.75rem 1rem; cursor: pointer; border-bottom: 1px solid var(--border); ${!activeProduction ? 'background: var(--primary); color: white;' : ''}">
                            <div style="font-weight: 600;">🌍 World Overview</div>
                            <div style="font-size: 0.75rem; opacity: 0.8;">View all productions and world elements</div>
                        </div>
                        
                        ${productions.length > 0 ? productions.map(production => `
                            <div class="production-option ${activeProduction && activeProduction.id === production.id ? 'active' : ''}" 
                                 onclick="window.app.productionSelector.selectProduction('${production.id}')"
                                 style="padding: 0.75rem 1rem; cursor: pointer; border-bottom: 1px solid var(--border); ${activeProduction && activeProduction.id === production.id ? 'background: var(--primary); color: white;' : ''}">
                                <div style="display: flex; justify-content: space-between; align-items: start;">
                                    <div style="flex: 1;">
                                        <div style="font-weight: 600;">${production.title}</div>
                                        <div style="font-size: 0.75rem; opacity: 0.8;">
                                            ${this.getProductionTypeIcon(production.type)} ${this.getProductionTypeLabel(production.type)} · ${production.status}
                                        </div>
                                        ${production.logline ? `
                                            <div style="font-size: 0.75rem; opacity: 0.7; margin-top: 0.25rem;">
                                                ${this.truncateText(production.logline, 60)}
                                            </div>
                                        ` : ''}
                                    </div>
                                    <button onclick="event.stopPropagation(); window.app.productionSelector.showProductionMenu('${production.id}')" 
                                            style="background: none; border: none; cursor: pointer; padding: 0.25rem; opacity: 0.7;">
                                        ⋮
                                    </button>
                                </div>
                            </div>
                        `).join('') : `
                            <div style="padding: 2rem; text-align: center; color: var(--text-secondary);">
                                <p>No productions created yet</p>
                                <button class="btn btn-primary" onclick="window.app.productionSelector.showCreateProductionDialog()">
                                    Create Your First Production
                                </button>
                            </div>
                        `}
                    </div>
                    
                    ${productions.length > 0 ? `
                        <div class="dropdown-footer" style="padding: 0.75rem 1rem; border-top: 1px solid var(--border); background: var(--surface);">
                            <div style="display: flex; justify-content: between; align-items: center; font-size: 0.875rem; color: var(--text-secondary);">
                                <span>${productions.length} ${productions.length === 1 ? 'production' : 'productions'} in this world</span>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen;
        const dropdown = document.getElementById('production-dropdown');
        if (dropdown) {
            dropdown.style.display = this.isDropdownOpen ? 'block' : 'none';
        }

        // Close on outside click
        if (this.isDropdownOpen) {
            setTimeout(() => {
                const closeHandler = (e) => {
                    if (!e.target.closest('.production-selector')) {
                        this.closeDropdown();
                        document.removeEventListener('click', closeHandler);
                    }
                };
                document.addEventListener('click', closeHandler);
            }, 100);
        }
    }

    closeDropdown() {
        this.isDropdownOpen = false;
        const dropdown = document.getElementById('production-dropdown');
        if (dropdown) {
            dropdown.style.display = 'none';
        }
    }

    selectProduction(productionId) {
        this.state.setActiveProduction(productionId);
        this.closeDropdown();
        
        // Update the selector button
        this.updateSelector();
        
        // Update navigation
        this.app.render();
        
        // Navigate to appropriate view
        if (productionId) {
            this.app.router.navigate('screenplay');
        } else {
            this.app.router.navigate('welcome');
        }
    }

    updateSelector() {
        const selectorContainer = document.querySelector('.production-selector');
        if (selectorContainer) {
            selectorContainer.outerHTML = this.render();
        }
    }

    showCreateProductionDialog() {
        this.closeDropdown();
        
        const dialogHtml = `
            <div class="production-creator-overlay" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
                <div class="production-creator-modal" style="background: var(--background); border-radius: 0.5rem; width: 90%; max-width: 600px; box-shadow: var(--shadow-xl);">
                    <div class="modal-header" style="padding: 1.5rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
                        <h2 style="margin: 0;">Create New Production</h2>
                        <button onclick="this.closest('.production-creator-overlay').remove()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-secondary);">×</button>
                    </div>
                    
                    <form id="production-form" style="padding: 1.5rem;">
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="production-title" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Production Title *</label>
                            <input type="text" id="production-title" required 
                                   style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;"
                                   placeholder="The Dragon's Quest">
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="production-type" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Production Type *</label>
                            <select id="production-type" required
                                    style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                                <option value="">Select type...</option>
                                <option value="movie">🎬 Feature Film</option>
                                <option value="tv_series">📺 TV Series</option>
                                <option value="short_series">📱 Short Form Series</option>
                                <option value="web_series">🌐 Web Series</option>
                                <option value="play">🎭 Stage Play</option>
                                <option value="audio_drama">🎙️ Audio Drama</option>
                            </select>
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="production-logline" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Logline</label>
                            <textarea id="production-logline" rows="2"
                                      style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; resize: vertical;"
                                      placeholder="A one-sentence summary of your production..."></textarea>
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="production-premise" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Premise</label>
                            <textarea id="production-premise" rows="3"
                                      style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; resize: vertical;"
                                      placeholder="The core concept and conflict..."></textarea>
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="production-description" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Description</label>
                            <textarea id="production-description" rows="4"
                                      style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; resize: vertical;"
                                      placeholder="Detailed description of your production..."></textarea>
                        </div>
                        
                        <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                            <div class="form-group">
                                <label for="production-genre" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Genre</label>
                                <input type="text" id="production-genre"
                                       style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;"
                                       placeholder="Drama, Comedy, etc.">
                            </div>
                            <div class="form-group">
                                <label for="production-audience" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Target Audience</label>
                                <input type="text" id="production-audience"
                                       style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;"
                                       placeholder="PG-13, Adult, etc.">
                            </div>
                        </div>
                    </form>
                    
                    <div class="modal-footer" style="padding: 1.5rem; border-top: 1px solid var(--border); display: flex; justify-content: end; gap: 0.5rem;">
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.production-creator-overlay').remove()">
                            Cancel
                        </button>
                        <button type="submit" class="btn btn-primary" form="production-form" onclick="window.app.productionSelector.createProduction(event)">
                            Create Production
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', dialogHtml);
        
        // Focus on title input
        setTimeout(() => {
            document.getElementById('production-title')?.focus();
        }, 100);
    }

    createProduction(event) {
        event.preventDefault();
        
        const title = document.getElementById('production-title').value.trim();
        const type = document.getElementById('production-type').value;
        const logline = document.getElementById('production-logline').value.trim();
        const premise = document.getElementById('production-premise').value.trim();
        const description = document.getElementById('production-description').value.trim();
        const genre = document.getElementById('production-genre').value.trim();
        const audience = document.getElementById('production-audience').value.trim();
        
        if (!title || !type) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Create the production
        const production = this.state.createProduction({
            title,
            type,
            logline,
            premise,
            description,
            genre: genre ? genre.split(',').map(g => g.trim()) : [],
            targetAudience: audience
        });
        
        // Set as active production
        this.state.setActiveProduction(production.id);
        
        // Close dialog
        document.querySelector('.production-creator-overlay')?.remove();
        
        // Update selector and navigation
        this.updateSelector();
        this.app.render();
        
        // Navigate to screenplay
        this.app.router.navigate('screenplay');
        
        // Show success notification
        this.showNotification(`Production "${production.title}" created successfully!`, 'success');
    }

    showProductionMenu(productionId) {
        // TODO: Implement production context menu (edit, delete, duplicate, etc.)
        alert('Production menu coming soon!');
    }

    getProductionTypeIcon(type) {
        const icons = {
            'movie': '🎬',
            'tv_series': '📺',
            'short_series': '📱',
            'web_series': '🌐',
            'play': '🎭',
            'audio_drama': '🎙️'
        };
        return icons[type] || '🎥';
    }

    getProductionTypeLabel(type) {
        const labels = {
            'movie': 'Feature Film',
            'tv_series': 'TV Series',
            'short_series': 'Short Form',
            'web_series': 'Web Series',
            'play': 'Stage Play',
            'audio_drama': 'Audio Drama'
        };
        return labels[type] || type;
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    }

    showNotification(message, type = 'info') {
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
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}