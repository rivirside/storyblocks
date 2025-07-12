// Plots View (Simple version)
class PlotsView {
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
            <div class="plots-view">
                <div class="plots-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <div class="header-title">
                        <h1>Plots</h1>
                        <p style="color: var(--text-secondary); margin: 0;">
                            Reusable plot templates and story structures
                        </p>
                    </div>
                    <div class="header-actions">
                        <button class="btn btn-secondary" onclick="window.app.plotsView.showImportDialog()" style="margin-right: 0.5rem;">
                            📤 Import
                        </button>
                        <button class="btn btn-primary" onclick="window.app.plotsView.showAddPlotDialog()">
                            ➕ Add Plot
                        </button>
                    </div>
                </div>

                <div class="plots-toolbar" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding: 1rem; background: var(--surface); border-radius: 0.5rem;">
                    <div class="search-section">
                        <input type="text" id="plot-search" placeholder="Search plots..." 
                               style="padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; width: 250px;"
                               onkeyup="window.app.plotsView.handleSearch(event)">
                    </div>
                    
                    <div class="filter-section" style="display: flex; gap: 1rem;">
                        <select id="plot-sort" onchange="window.app.plotsView.handleSort(event)" 
                                style="padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                            <option value="title">Sort by Title</option>
                            <option value="created">Sort by Created</option>
                            <option value="modified">Sort by Modified</option>
                            <option value="type">Sort by Type</option>
                        </select>
                        
                        <select id="plot-filter" onchange="window.app.plotsView.handleFilter(event)"
                                style="padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                            <option value="all">All Plots</option>
                            <option value="main">Main Plots</option>
                            <option value="subplot">Subplots</option>
                            <option value="parallel">Parallel Plots</option>
                        </select>
                    </div>
                </div>

                <div class="plots-content">
                    <div class="plots-container" id="plots-container">
                        ${this.renderPlotContent()}
                    </div>
                </div>
            </div>
        `;
    }

    renderPlotContent() {
        const allPlots = Array.from(this.state.state.plots.values());
        
        if (allPlots.length === 0) {
            return this.renderEmptyState();
        }

        const filteredPlots = this.filterPlots(allPlots);
        return this.renderPlotGrid(filteredPlots);
    }

    renderPlotGrid(plots) {
        return `
            <div class="plots-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem;">
                ${plots.map(plot => `
                    <div class="plot-card" onclick="window.app.router.navigate('plot/${plot.id}')" style="background: var(--surface); border: 1px solid var(--border); border-radius: 0.5rem; padding: 1.5rem; transition: transform 0.2s; cursor: pointer;"
                         onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='var(--shadow-lg)'" 
                         onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                        
                        <div class="plot-header" style="margin-bottom: 1rem;">
                            <h3 style="margin: 0 0 0.5rem 0;">${plot.title}</h3>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="background: var(--primary); color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">
                                    ${this.getPlotTypeLabel(plot.type)}
                                </span>
                                ${plot.isTemplate ? '<span style="color: var(--text-secondary); font-size: 0.75rem;">📋 Template</span>' : ''}
                            </div>
                        </div>
                        
                        <div class="plot-description" style="margin-bottom: 1rem;">
                            <p style="color: var(--text-secondary); margin: 0; line-height: 1.5;">${this.truncateText(plot.description || '', 120)}</p>
                        </div>
                        
                        <div class="plot-structure" style="margin-bottom: 1rem;">
                            <h4 style="margin: 0 0 0.5rem 0; font-size: 0.875rem; color: var(--primary);">Structure:</h4>
                            <div style="font-size: 0.75rem; color: var(--text-secondary);">
                                ${plot.structure.hook ? '🪝 Hook • ' : ''}
                                ${plot.structure.incitingIncident ? '⚡ Inciting Incident • ' : ''}
                                ${plot.structure.climax ? '🎯 Climax • ' : ''}
                                ${plot.structure.resolution ? '✅ Resolution' : ''}
                            </div>
                        </div>
                        
                        <div class="plot-meta" style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--text-secondary);">
                            <span>Used in ${plot.productionIds.length} ${plot.productionIds.length === 1 ? 'story' : 'stories'}</span>
                            <span>${new Date(plot.lastModified).toLocaleDateString()}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderEmptyState() {
        return `
            <div class="empty-state" style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                <div style="font-size: 4rem; margin-bottom: 1rem;">📖</div>
                <h3>No plots yet</h3>
                <p>Create your first plot template to start structuring your stories</p>
                <button class="btn btn-primary" onclick="window.app.plotsView.showAddPlotDialog()" style="margin-top: 1rem;">
                    Add First Plot
                </button>
            </div>
        `;
    }

    filterPlots(plots) {
        let filtered = [...plots];

        // Apply search filter
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(plot => 
                plot.title.toLowerCase().includes(query) ||
                (plot.description && plot.description.toLowerCase().includes(query)) ||
                (plot.type && plot.type.toLowerCase().includes(query))
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
                case 'type':
                    return a.type.localeCompare(b.type);
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
        const container = document.getElementById('plots-container');
        if (container) {
            container.innerHTML = this.renderPlotContent();
        }
    }

    // Action methods
    showAddPlotDialog() {
        this.showPlotCreationModal();
    }

    showImportDialog() {
        alert('Import plots feature coming soon!');
    }

    showPlotCreationModal() {
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
                max-height: 80vh;
                overflow-y: auto;
            ">
                <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <h2 style="margin: 0; color: var(--primary);">📖 Create New Plot</h2>
                    <button onclick="this.closest('.modal-overlay').remove()" style="
                        background: none;
                        border: none;
                        font-size: 1.5rem;
                        cursor: pointer;
                        color: var(--text-secondary);
                    ">×</button>
                </div>
                
                <form id="plot-creation-form">
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Plot Title *</label>
                        <input type="text" id="plot-title" required style="
                            width: 100%;
                            padding: 0.75rem;
                            border: 1px solid var(--border);
                            border-radius: 0.375rem;
                            background: var(--surface);
                            color: var(--text-primary);
                        " placeholder="Enter plot title...">
                    </div>
                    
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Plot Type *</label>
                        <select id="plot-type" required style="
                            width: 100%;
                            padding: 0.75rem;
                            border: 1px solid var(--border);
                            border-radius: 0.375rem;
                            background: var(--surface);
                            color: var(--text-primary);
                        ">
                            <option value="">Select plot type...</option>
                            <option value="main">Main Plot</option>
                            <option value="subplot">Subplot</option>
                            <option value="parallel">Parallel Plot</option>
                            <option value="character">Character Plot</option>
                            <option value="thematic">Thematic Plot</option>
                        </select>
                    </div>
                    
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Description</label>
                        <textarea id="plot-description" rows="3" style="
                            width: 100%;
                            padding: 0.75rem;
                            border: 1px solid var(--border);
                            border-radius: 0.375rem;
                            background: var(--surface);
                            color: var(--text-primary);
                            resize: vertical;
                        " placeholder="Describe the plot..."></textarea>
                    </div>
                    
                    <div style="margin-bottom: 1.5rem;">
                        <h3 style="margin-bottom: 1rem; color: var(--primary);">Plot Structure</h3>
                        
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Hook</label>
                            <input type="text" id="plot-hook" style="
                                width: 100%;
                                padding: 0.75rem;
                                border: 1px solid var(--border);
                                border-radius: 0.375rem;
                                background: var(--surface);
                                color: var(--text-primary);
                            " placeholder="Opening hook that grabs attention...">
                        </div>
                        
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Inciting Incident</label>
                            <input type="text" id="plot-inciting" style="
                                width: 100%;
                                padding: 0.75rem;
                                border: 1px solid var(--border);
                                border-radius: 0.375rem;
                                background: var(--surface);
                                color: var(--text-primary);
                            " placeholder="Event that starts the main story...">
                        </div>
                        
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Climax</label>
                            <input type="text" id="plot-climax" style="
                                width: 100%;
                                padding: 0.75rem;
                                border: 1px solid var(--border);
                                border-radius: 0.375rem;
                                background: var(--surface);
                                color: var(--text-primary);
                            " placeholder="Peak moment of conflict...">
                        </div>
                        
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Resolution</label>
                            <input type="text" id="plot-resolution" style="
                                width: 100%;
                                padding: 0.75rem;
                                border: 1px solid var(--border);
                                border-radius: 0.375rem;
                                background: var(--surface);
                                color: var(--text-primary);
                            " placeholder="How the story concludes...">
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: flex; align-items: center; gap: 0.5rem;">
                            <input type="checkbox" id="plot-template">
                            <span>Make this a reusable template</span>
                        </label>
                    </div>
                    
                    <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                        <button type="button" onclick="this.closest('.modal-overlay').remove()" class="btn btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" class="btn btn-primary">
                            Create Plot
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        // Add form submit handler
        modal.querySelector('#plot-creation-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createPlot({
                title: modal.querySelector('#plot-title').value,
                type: modal.querySelector('#plot-type').value,
                description: modal.querySelector('#plot-description').value,
                structure: {
                    hook: modal.querySelector('#plot-hook').value,
                    incitingIncident: modal.querySelector('#plot-inciting').value,
                    climax: modal.querySelector('#plot-climax').value,
                    resolution: modal.querySelector('#plot-resolution').value
                },
                isTemplate: modal.querySelector('#plot-template').checked
            });
            modal.remove();
        });
        
        document.body.appendChild(modal);
        
        // Focus the title input
        setTimeout(() => {
            modal.querySelector('#plot-title').focus();
        }, 100);
    }
    
    createPlot(plotData) {
        const newPlot = {
            id: 'plot_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            title: plotData.title,
            type: plotData.type,
            description: plotData.description,
            structure: plotData.structure,
            isTemplate: plotData.isTemplate,
            tags: [],
            productionIds: [],
            files: [],
            created: new Date().toISOString(),
            lastModified: new Date().toISOString()
        };
        
        // Add to state
        this.state.state.plots.set(newPlot.id, newPlot);
        
        // Trigger events
        this.events.emit('plotCreated', newPlot);
        this.events.emit('dataChanged');
        
        // Refresh the view
        this.refreshContent();
        
        console.log('Created new plot:', newPlot);
    }

    // Utility methods
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    }

    getPlotTypeLabel(type) {
        const typeLabels = {
            'main': 'Main Plot',
            'subplot': 'Subplot',
            'parallel': 'Parallel Plot',
            'character': 'Character Plot',
            'thematic': 'Thematic Plot'
        };
        return typeLabels[type] || type || 'Plot';
    }
}