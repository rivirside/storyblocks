// Arc Detail View (Full Page)
class ArcDetailView {
    constructor(app) {
        this.app = app;
        this.state = app.state;
        this.events = app.events;
        this.arcId = null;
    }

    render(arcId) {
        this.arcId = arcId;
        const arc = this.state.state.arcs.get(arcId);
        
        if (!arc) {
            return this.renderNotFound();
        }

        return `
            <div class="arc-detail-view">
                <div class="detail-header" style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 2rem;">
                    <div>
                        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
                            <button class="btn btn-secondary" onclick="window.app.router.navigate('arcs')" style="padding: 0.5rem;">
                                ← Back to Arcs
                            </button>
                            <h1 style="margin: 0;">${arc.title}</h1>
                        </div>
                        <p style="color: var(--text-secondary); margin: 0;">
                            ${this.getArcTypeLabel(arc.type)} ${arc.isTemplate ? '• Template' : ''}
                        </p>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-primary" onclick="alert('Arc editing coming soon!')">
                            ✏️ Edit Arc
                        </button>
                    </div>
                </div>

                <div class="detail-content" style="display: grid; grid-template-columns: 300px 1fr; gap: 2rem;">
                    <div class="arc-sidebar">
                        ${this.renderSidebar(arc)}
                    </div>
                    <div class="arc-main">
                        ${this.renderMainContent(arc)}
                    </div>
                </div>
            </div>
        `;
    }

    renderSidebar(arc) {
        return `
            <div class="sidebar-section" style="background: var(--surface); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                <div style="text-align: center; margin-bottom: 1.5rem;">
                    <div style="width: 100%; height: 120px; border-radius: 0.5rem; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 3rem;">📈</div>
                </div>
                
                <h3 style="margin-bottom: 1rem;">Arc Info</h3>
                
                <div style="margin-bottom: 1rem;">
                    <strong style="display: block; color: var(--text-secondary); font-size: 0.875rem;">Type</strong>
                    <span>${this.getArcTypeLabel(arc.type)}</span>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <strong style="display: block; color: var(--text-secondary); font-size: 0.875rem;">Stages</strong>
                    <span>${arc.stages ? arc.stages.length : 0} stages</span>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <strong style="display: block; color: var(--text-secondary); font-size: 0.875rem;">Template</strong>
                    <span>${arc.isTemplate ? 'Yes' : 'No'}</span>
                </div>
                
                ${arc.tags && arc.tags.length > 0 ? `
                    <div style="margin-bottom: 1rem;">
                        <strong style="display: block; color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 0.5rem;">Tags</strong>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.25rem;">
                            ${arc.tags.map(tag => 
                                `<span style="background: var(--primary); color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">${tag}</span>`
                            ).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>

            ${this.renderStoriesSection(arc)}
        `;
    }

    renderMainContent(arc) {
        return `
            <div class="content-tabs" style="display: flex; border-bottom: 2px solid var(--border); margin-bottom: 2rem;">
                <button class="tab-button active" data-tab="stages" onclick="window.app.arcDetailView.switchTab('stages')"
                        style="padding: 1rem 1.5rem; background: none; border: none; border-bottom: 3px solid var(--primary); cursor: pointer; font-weight: 600;">
                    📈 Stages
                </button>
                <button class="tab-button" data-tab="files" onclick="window.app.arcDetailView.switchTab('files')"
                        style="padding: 1rem 1.5rem; background: none; border: none; border-bottom: 3px solid transparent; cursor: pointer;">
                    📁 Files
                </button>
            </div>

            <div class="tab-content">
                <div id="stages-tab" class="tab-panel">
                    ${this.renderStagesTab(arc)}
                </div>
                
                <div id="files-tab" class="tab-panel" style="display: none;">
                    ${this.renderFilesTab(arc)}
                </div>
            </div>
        `;
    }

    renderStagesTab(arc) {
        return `
            <div class="stages-content">
                ${arc.description ? `
                    <section style="margin-bottom: 2rem;">
                        <h2 style="color: var(--primary); margin-bottom: 1rem;">Description</h2>
                        <p style="line-height: 1.6;">${arc.description}</p>
                    </section>
                ` : ''}
                
                <section style="margin-bottom: 2rem;">
                    <h2 style="color: var(--primary); margin-bottom: 1rem;">Arc Stages</h2>
                    ${arc.stages && arc.stages.length > 0 ? `
                        <div class="stages-timeline" style="position: relative;">
                            ${arc.stages.map((stage, index) => `
                                <div class="stage-item" style="display: flex; margin-bottom: 2rem; position: relative;">
                                    <!-- Stage Number -->
                                    <div class="stage-number" style="flex-shrink: 0; width: 40px; height: 40px; border-radius: 50%; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; margin-right: 1.5rem; position: relative; z-index: 1;">
                                        ${index + 1}
                                    </div>
                                    
                                    <!-- Connecting Line -->
                                    ${index < arc.stages.length - 1 ? `
                                        <div style="position: absolute; left: 19px; top: 40px; width: 2px; height: calc(100% + 2rem); background: var(--border); z-index: 0;"></div>
                                    ` : ''}
                                    
                                    <!-- Stage Content -->
                                    <div class="stage-content" style="flex: 1; background: var(--surface); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid var(--primary);">
                                        <h3 style="margin: 0 0 1rem 0; color: var(--primary);">${stage.name}</h3>
                                        ${stage.description ? `
                                            <p style="margin: 0; line-height: 1.6; color: var(--text-secondary);">${stage.description}</p>
                                        ` : `
                                            <p style="margin: 0; font-style: italic; color: var(--text-secondary);">No description provided</p>
                                        `}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="empty-stages" style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                            <div style="font-size: 3rem; margin-bottom: 1rem;">📈</div>
                            <h3>No stages defined</h3>
                            <p>This arc template doesn't have any stages defined yet</p>
                        </div>
                    `}
                </section>
            </div>
        `;
    }

    renderFilesTab(arc) {
        if (!arc.files) arc.files = [];
        
        return `
            <div class="files-content">
                <div class="files-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <div>
                        <h2 style="color: var(--primary); margin: 0;">Arc Files</h2>
                        <p style="color: var(--text-secondary); margin: 0.5rem 0 0 0;">Documents and templates for ${arc.title}</p>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-primary" onclick="window.app.arcDetailView.createNewFile('${arc.id}', 'text')">
                            📄 Text
                        </button>
                        <button class="btn btn-secondary" onclick="window.app.arcDetailView.createNewFile('${arc.id}', 'image')">
                            🖼️ Image
                        </button>
                    </div>
                </div>
                
                ${arc.files.length === 0 ? `
                    <div class="empty-files" style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">📁</div>
                        <h3>No files yet</h3>
                        <p>Create files to store arc templates, character development guides, and references</p>
                    </div>
                ` : ''}
            </div>
        `;
    }

    // File management methods
    createNewFile(arcId, fileType = 'text') {
        alert('File creation coming soon!');
    }

    renderStoriesSection(arc) {
        const productions = arc.productionIds ? 
            arc.productionIds.map(id => this.state.state.productions.get(id)).filter(p => p) : [];

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
            <div class="arc-not-found" style="text-align: center; padding: 3rem;">
                <h1>Arc Not Found</h1>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">The arc you're looking for doesn't exist.</p>
                <button class="btn btn-primary" onclick="window.app.router.navigate('arcs')">
                    Back to Arcs
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

    getArcTypeLabel(type) {
        const labels = {
            'character': '👤 Character Arc',
            'story': '📖 Story Arc',
            'relationship': '💞 Relationship Arc',
            'thematic': '💡 Thematic Arc'
        };
        return labels[type] || type || 'Arc';
    }
}