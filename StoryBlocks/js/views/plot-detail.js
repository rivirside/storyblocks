// Plot Detail View (Full Page)
class PlotDetailView {
    constructor(app) {
        this.app = app;
        this.state = app.state;
        this.events = app.events;
        this.plotId = null;
    }

    render(plotId) {
        this.plotId = plotId;
        const plot = this.state.state.plots.get(plotId);
        
        if (!plot) {
            return this.renderNotFound();
        }

        return `
            <div class="plot-detail-view">
                <div class="detail-header" style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 2rem;">
                    <div>
                        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
                            <button class="btn btn-secondary" onclick="window.app.router.navigate('plots')" style="padding: 0.5rem;">
                                ← Back to Plots
                            </button>
                            <h1 style="margin: 0;">${plot.title}</h1>
                        </div>
                        <p style="color: var(--text-secondary); margin: 0;">
                            ${this.getPlotTypeLabel(plot.type)} ${plot.isTemplate ? '• Template' : ''}
                        </p>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-primary" onclick="alert('Plot editing coming soon!')">
                            ✏️ Edit Plot
                        </button>
                    </div>
                </div>

                <div class="detail-content" style="display: grid; grid-template-columns: 300px 1fr; gap: 2rem;">
                    <div class="plot-sidebar">
                        ${this.renderSidebar(plot)}
                    </div>
                    <div class="plot-main">
                        ${this.renderMainContent(plot)}
                    </div>
                </div>
            </div>
        `;
    }

    renderSidebar(plot) {
        return `
            <div class="sidebar-section" style="background: var(--surface); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                <div style="text-align: center; margin-bottom: 1.5rem;">
                    <div style="width: 100%; height: 120px; border-radius: 0.5rem; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 3rem;">📖</div>
                </div>
                
                <h3 style="margin-bottom: 1rem;">Plot Info</h3>
                
                <div style="margin-bottom: 1rem;">
                    <strong style="display: block; color: var(--text-secondary); font-size: 0.875rem;">Type</strong>
                    <span>${this.getPlotTypeLabel(plot.type)}</span>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <strong style="display: block; color: var(--text-secondary); font-size: 0.875rem;">Template</strong>
                    <span>${plot.isTemplate ? 'Yes' : 'No'}</span>
                </div>
                
                ${plot.tags && plot.tags.length > 0 ? `
                    <div style="margin-bottom: 1rem;">
                        <strong style="display: block; color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 0.5rem;">Tags</strong>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.25rem;">
                            ${plot.tags.map(tag => 
                                `<span style="background: var(--primary); color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">${tag}</span>`
                            ).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>

            ${this.renderStoriesSection(plot)}
        `;
    }

    renderMainContent(plot) {
        return `
            <div class="content-tabs" style="display: flex; border-bottom: 2px solid var(--border); margin-bottom: 2rem;">
                <button class="tab-button active" data-tab="structure" onclick="window.app.plotDetailView.switchTab('structure')"
                        style="padding: 1rem 1.5rem; background: none; border: none; border-bottom: 3px solid var(--primary); cursor: pointer; font-weight: 600;">
                    🏗️ Structure
                </button>
                <button class="tab-button" data-tab="files" onclick="window.app.plotDetailView.switchTab('files')"
                        style="padding: 1rem 1.5rem; background: none; border: none; border-bottom: 3px solid transparent; cursor: pointer;">
                    📁 Files
                </button>
            </div>

            <div class="tab-content">
                <div id="structure-tab" class="tab-panel">
                    ${this.renderStructureTab(plot)}
                </div>
                
                <div id="files-tab" class="tab-panel" style="display: none;">
                    ${this.renderFilesTab(plot)}
                </div>
            </div>
        `;
    }

    renderStructureTab(plot) {
        return `
            <div class="structure-content">
                ${plot.description ? `
                    <section style="margin-bottom: 2rem;">
                        <h2 style="color: var(--primary); margin-bottom: 1rem;">Description</h2>
                        <p style="line-height: 1.6;">${plot.description}</p>
                    </section>
                ` : ''}
                
                <section style="margin-bottom: 2rem;">
                    <h2 style="color: var(--primary); margin-bottom: 1rem;">Plot Structure</h2>
                    <div class="structure-grid" style="display: grid; gap: 1.5rem;">
                        ${this.renderStructureElement('Hook', plot.structure.hook)}
                        ${this.renderStructureElement('Inciting Incident', plot.structure.incitingIncident)}
                        ${this.renderStructureElement('Rising Action', Array.isArray(plot.structure.risingAction) ? plot.structure.risingAction.join(', ') : plot.structure.risingAction)}
                        ${this.renderStructureElement('Climax', plot.structure.climax)}
                        ${this.renderStructureElement('Falling Action', Array.isArray(plot.structure.fallingAction) ? plot.structure.fallingAction.join(', ') : plot.structure.fallingAction)}
                        ${this.renderStructureElement('Resolution', plot.structure.resolution)}
                    </div>
                </section>
            </div>
        `;
    }

    renderStructureElement(title, content) {
        if (!content) return '';
        
        return `
            <div class="structure-element" style="background: var(--surface); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid var(--primary);">
                <h3 style="margin: 0 0 1rem 0; color: var(--primary);">${title}</h3>
                <p style="margin: 0; line-height: 1.6;">${content}</p>
            </div>
        `;
    }

    renderFilesTab(plot) {
        if (!plot.files) plot.files = [];
        
        return `
            <div class="files-content">
                <div class="files-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <div>
                        <h2 style="color: var(--primary); margin: 0;">Plot Files</h2>
                        <p style="color: var(--text-secondary); margin: 0.5rem 0 0 0;">Documents and references for ${plot.title}</p>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-primary" onclick="window.app.plotDetailView.createNewFile('${plot.id}', 'text')">
                            📄 Text
                        </button>
                        <button class="btn btn-secondary" onclick="window.app.plotDetailView.createNewFile('${plot.id}', 'image')">
                            🖼️ Image
                        </button>
                    </div>
                </div>
                
                ${plot.files.length === 0 ? `
                    <div class="empty-files" style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">📁</div>
                        <h3>No files yet</h3>
                        <p>Create files to store plot outlines, research, and references</p>
                    </div>
                ` : ''}
            </div>
        `;
    }

    // File management methods
    createNewFile(plotId, fileType = 'text') {
        alert('File creation coming soon!');
    }

    renderStoriesSection(plot) {
        const productions = plot.productionIds ? 
            plot.productionIds.map(id => this.state.state.productions.get(id)).filter(p => p) : [];

        if (productions.length === 0) {
            return '';
        }

        return `
            <div class="sidebar-section" style="background: var(--surface); padding: 1.5rem; border-radius: 0.5rem;">
                <h3 style="margin-bottom: 1rem;">Used In</h3>
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    ${productions.map(prod => `
                        <div style="padding: 0.75rem; background: var(--background); border-radius: 0.375rem;">
                            <div style="font-weight: 600;">${prod.title}</div>
                            <div style="font-size: 0.75rem; opacity: 0.8;">
                                ${this.app.productionSelector.getProductionTypeLabel(prod.type)}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderNotFound() {
        return `
            <div class="plot-not-found" style="text-align: center; padding: 3rem;">
                <h1>Plot Not Found</h1>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">The plot you're looking for doesn't exist.</p>
                <button class="btn btn-primary" onclick="window.app.router.navigate('plots')">
                    Back to Plots
                </button>
            </div>
        `;
    }

    switchTab(tabName) {
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.style.display = 'none';
        });
        
        document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.remove('active');
            button.style.borderBottom = '3px solid transparent';
        });
        
        const selectedTab = document.getElementById(`${tabName}-tab`);
        if (selectedTab) {
            selectedTab.style.display = 'block';
        }
        
        const selectedButton = document.querySelector(`[data-tab="${tabName}"]`);
        if (selectedButton) {
            selectedButton.classList.add('active');
            selectedButton.style.borderBottom = '3px solid var(--primary)';
        }
    }

    getPlotTypeLabel(type) {
        const labels = {
            'main': 'Main Plot',
            'subplot': 'Subplot',
            'parallel': 'Parallel Plot',
            'character': 'Character Plot',
            'thematic': 'Thematic Plot'
        };
        return labels[type] || type || 'Plot';
    }
}