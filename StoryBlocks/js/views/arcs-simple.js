// Arcs View (Simple version)
class ArcsView {
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
            <div class="arcs-view">
                <div class="arcs-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <div class="header-title">
                        <h1>Character & Story Arcs</h1>
                        <p style="color: var(--text-secondary); margin: 0;">
                            Development templates for character growth and story progression
                        </p>
                    </div>
                    <div class="header-actions">
                        <button class="btn btn-secondary" onclick="window.app.arcsView.showImportDialog()" style="margin-right: 0.5rem;">
                            📤 Import
                        </button>
                        <button class="btn btn-primary" onclick="window.app.arcsView.showAddArcDialog()">
                            ➕ Add Arc
                        </button>
                    </div>
                </div>

                <div class="arcs-toolbar" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding: 1rem; background: var(--surface); border-radius: 0.5rem;">
                    <div class="search-section">
                        <input type="text" id="arc-search" placeholder="Search arcs..." 
                               style="padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; width: 250px;"
                               onkeyup="window.app.arcsView.handleSearch(event)">
                    </div>
                    
                    <div class="filter-section" style="display: flex; gap: 1rem;">
                        <select id="arc-sort" onchange="window.app.arcsView.handleSort(event)" 
                                style="padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                            <option value="title">Sort by Title</option>
                            <option value="created">Sort by Created</option>
                            <option value="modified">Sort by Modified</option>
                            <option value="type">Sort by Type</option>
                        </select>
                        
                        <select id="arc-filter" onchange="window.app.arcsView.handleFilter(event)"
                                style="padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                            <option value="all">All Arcs</option>
                            <option value="character">Character Arcs</option>
                            <option value="story">Story Arcs</option>
                            <option value="relationship">Relationship Arcs</option>
                        </select>
                    </div>
                </div>

                <div class="arcs-content">
                    <div class="arcs-container" id="arcs-container">
                        ${this.renderArcContent()}
                    </div>
                </div>
            </div>
        `;
    }

    renderArcContent() {
        const allArcs = Array.from(this.state.state.arcs.values());
        
        if (allArcs.length === 0) {
            return this.renderEmptyState();
        }

        const filteredArcs = this.filterArcs(allArcs);
        return this.renderArcGrid(filteredArcs);
    }

    renderArcGrid(arcs) {
        return `
            <div class="arcs-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem;">
                ${arcs.map(arc => `
                    <div class="arc-card" onclick="window.app.router.navigate('arc/${arc.id}')" style="background: var(--surface); border: 1px solid var(--border); border-radius: 0.5rem; padding: 1.5rem; transition: transform 0.2s; cursor: pointer;"
                         onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='var(--shadow-lg)'" 
                         onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                        
                        <div class="arc-header" style="margin-bottom: 1rem;">
                            <h3 style="margin: 0 0 0.5rem 0;">${arc.title}</h3>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="background: var(--primary); color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">
                                    ${this.getArcTypeLabel(arc.type)}
                                </span>
                                ${arc.isTemplate ? '<span style="color: var(--text-secondary); font-size: 0.75rem;">📋 Template</span>' : ''}
                            </div>
                        </div>
                        
                        <div class="arc-description" style="margin-bottom: 1rem;">
                            <p style="color: var(--text-secondary); margin: 0; line-height: 1.5;">${this.truncateText(arc.description || '', 120)}</p>
                        </div>
                        
                        <div class="arc-stages" style="margin-bottom: 1rem;">
                            <h4 style="margin: 0 0 0.5rem 0; font-size: 0.875rem; color: var(--primary);">Arc Stages:</h4>
                            <div style="display: flex; flex-wrap: wrap; gap: 0.25rem;">
                                ${arc.stages.slice(0, 3).map((stage, index) => `
                                    <span style="background: var(--background); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">
                                        ${index + 1}. ${stage.name}
                                    </span>
                                `).join('')}
                                ${arc.stages.length > 3 ? `<span style="color: var(--text-secondary); font-size: 0.75rem;">+${arc.stages.length - 3} more</span>` : ''}
                            </div>
                        </div>
                        
                        <div class="arc-meta" style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--text-secondary);">
                            <span>Used in ${arc.productionIds.length} ${arc.productionIds.length === 1 ? 'story' : 'stories'}</span>
                            <span>${new Date(arc.lastModified).toLocaleDateString()}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderEmptyState() {
        return `
            <div class="empty-state" style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                <div style="font-size: 4rem; margin-bottom: 1rem;">📈</div>
                <h3>No arcs yet</h3>
                <p>Create your first character or story arc template to guide development</p>
                <button class="btn btn-primary" onclick="window.app.arcsView.showAddArcDialog()" style="margin-top: 1rem;">
                    Add First Arc
                </button>
            </div>
        `;
    }

    filterArcs(arcs) {
        let filtered = [...arcs];

        // Apply search filter
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(arc => 
                arc.title.toLowerCase().includes(query) ||
                (arc.description && arc.description.toLowerCase().includes(query)) ||
                (arc.type && arc.type.toLowerCase().includes(query))
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
        const container = document.getElementById('arcs-container');
        if (container) {
            container.innerHTML = this.renderArcContent();
        }
    }

    // Action methods
    showAddArcDialog() {
        this.showArcCreationModal();
    }

    showImportDialog() {
        alert('Import arcs feature coming soon!');
    }

    showArcCreationModal() {
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
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
            ">
                <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <h2 style="margin: 0; color: var(--primary);">📈 Create New Arc</h2>
                    <button onclick="this.closest('.modal-overlay').remove()" style="
                        background: none;
                        border: none;
                        font-size: 1.5rem;
                        cursor: pointer;
                        color: var(--text-secondary);
                    ">×</button>
                </div>
                
                <form id="arc-creation-form">
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Arc Title *</label>
                        <input type="text" id="arc-title" required style="
                            width: 100%;
                            padding: 0.75rem;
                            border: 1px solid var(--border);
                            border-radius: 0.375rem;
                            background: var(--surface);
                            color: var(--text-primary);
                        " placeholder="Enter arc title...">
                    </div>
                    
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Arc Type *</label>
                        <select id="arc-type" required style="
                            width: 100%;
                            padding: 0.75rem;
                            border: 1px solid var(--border);
                            border-radius: 0.375rem;
                            background: var(--surface);
                            color: var(--text-primary);
                        ">
                            <option value="">Select arc type...</option>
                            <option value="character">Character Arc</option>
                            <option value="story">Story Arc</option>
                            <option value="relationship">Relationship Arc</option>
                            <option value="thematic">Thematic Arc</option>
                        </select>
                    </div>
                    
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Description</label>
                        <textarea id="arc-description" rows="3" style="
                            width: 100%;
                            padding: 0.75rem;
                            border: 1px solid var(--border);
                            border-radius: 0.375rem;
                            background: var(--surface);
                            color: var(--text-primary);
                            resize: vertical;
                        " placeholder="Describe the arc..."></textarea>
                    </div>
                    
                    <div style="margin-bottom: 1.5rem;">
                        <h3 style="margin-bottom: 1rem; color: var(--primary);">Arc Stages</h3>
                        <p style="margin-bottom: 1rem; color: var(--text-secondary); font-size: 0.875rem;">Define the key stages of development for this arc</p>
                        
                        <div id="arc-stages-container">
                            <div class="arc-stage" style="margin-bottom: 1rem; padding: 1rem; background: var(--surface); border-radius: 0.375rem;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                    <label style="font-weight: 600;">Stage 1</label>
                                </div>
                                <input type="text" class="stage-name" style="
                                    width: 100%;
                                    padding: 0.5rem;
                                    border: 1px solid var(--border);
                                    border-radius: 0.25rem;
                                    background: var(--background);
                                    color: var(--text-primary);
                                    margin-bottom: 0.5rem;
                                " placeholder="Stage name...">
                                <textarea class="stage-description" rows="2" style="
                                    width: 100%;
                                    padding: 0.5rem;
                                    border: 1px solid var(--border);
                                    border-radius: 0.25rem;
                                    background: var(--background);
                                    color: var(--text-primary);
                                    resize: vertical;
                                " placeholder="Stage description..."></textarea>
                            </div>
                        </div>
                        
                        <button type="button" onclick="window.app.arcsView.addArcStage()" class="btn btn-secondary" style="margin-top: 0.5rem;">
                            + Add Stage
                        </button>
                    </div>
                    
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: flex; align-items: center; gap: 0.5rem;">
                            <input type="checkbox" id="arc-template">
                            <span>Make this a reusable template</span>
                        </label>
                    </div>
                    
                    <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                        <button type="button" onclick="this.closest('.modal-overlay').remove()" class="btn btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" class="btn btn-primary">
                            Create Arc
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        // Add form submit handler
        modal.querySelector('#arc-creation-form').addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Collect stages data
            const stageElements = modal.querySelectorAll('.arc-stage');
            const stages = Array.from(stageElements).map((stage, index) => {
                const nameInput = stage.querySelector('.stage-name');
                const descInput = stage.querySelector('.stage-description');
                return {
                    name: nameInput.value || `Stage ${index + 1}`,
                    description: descInput.value
                };
            }).filter(stage => stage.name.trim() !== '' && stage.name !== `Stage ${stages.length}`);
            
            this.createArc({
                title: modal.querySelector('#arc-title').value,
                type: modal.querySelector('#arc-type').value,
                description: modal.querySelector('#arc-description').value,
                stages: stages,
                isTemplate: modal.querySelector('#arc-template').checked
            });
            modal.remove();
        });
        
        document.body.appendChild(modal);
        
        // Store reference for adding stages
        this.currentModal = modal;
        
        // Focus the title input
        setTimeout(() => {
            modal.querySelector('#arc-title').focus();
        }, 100);
    }
    
    addArcStage() {
        if (!this.currentModal) return;
        
        const container = this.currentModal.querySelector('#arc-stages-container');
        const stageCount = container.querySelectorAll('.arc-stage').length + 1;
        
        const stageDiv = document.createElement('div');
        stageDiv.className = 'arc-stage';
        stageDiv.style.cssText = 'margin-bottom: 1rem; padding: 1rem; background: var(--surface); border-radius: 0.375rem;';
        
        stageDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <label style="font-weight: 600;">Stage ${stageCount}</label>
                <button type="button" onclick="this.closest('.arc-stage').remove()" style="
                    background: none;
                    border: none;
                    color: var(--danger);
                    cursor: pointer;
                    font-size: 1.2rem;
                ">×</button>
            </div>
            <input type="text" class="stage-name" style="
                width: 100%;
                padding: 0.5rem;
                border: 1px solid var(--border);
                border-radius: 0.25rem;
                background: var(--background);
                color: var(--text-primary);
                margin-bottom: 0.5rem;
            " placeholder="Stage name...">
            <textarea class="stage-description" rows="2" style="
                width: 100%;
                padding: 0.5rem;
                border: 1px solid var(--border);
                border-radius: 0.25rem;
                background: var(--background);
                color: var(--text-primary);
                resize: vertical;
            " placeholder="Stage description..."></textarea>
        `;
        
        container.appendChild(stageDiv);
    }
    
    createArc(arcData) {
        const newArc = {
            id: 'arc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            title: arcData.title,
            type: arcData.type,
            description: arcData.description,
            stages: arcData.stages,
            isTemplate: arcData.isTemplate,
            tags: [],
            productionIds: [],
            files: [],
            created: new Date().toISOString(),
            lastModified: new Date().toISOString()
        };
        
        // Add to state
        this.state.state.arcs.set(newArc.id, newArc);
        
        // Trigger events
        this.events.emit('arcCreated', newArc);
        this.events.emit('dataChanged');
        
        // Refresh the view
        this.refreshContent();
        
        // Clear modal reference
        this.currentModal = null;
        
        console.log('Created new arc:', newArc);
    }

    // Utility methods
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    }

    getArcTypeLabel(type) {
        const typeLabels = {
            'character': '👤 Character Arc',
            'story': '📖 Story Arc',
            'relationship': '💞 Relationship Arc',
            'thematic': '💡 Thematic Arc'
        };
        return typeLabels[type] || type || 'Arc';
    }
}