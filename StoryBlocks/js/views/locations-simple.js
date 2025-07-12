// Locations View (Simple version)
class LocationsView {
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
            <div class="locations-view">
                <div class="locations-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <div class="header-title">
                        <h1>Locations</h1>
                        <p style="color: var(--text-secondary); margin: 0;">
                            Settings and places in your world
                        </p>
                    </div>
                    <div class="header-actions">
                        <button class="btn btn-secondary" onclick="window.app.locationsView.showImportDialog()" style="margin-right: 0.5rem;">
                            📤 Import
                        </button>
                        <button class="btn btn-primary" onclick="window.app.locationsView.showAddLocationDialog()">
                            ➕ Add Location
                        </button>
                    </div>
                </div>

                <div class="locations-toolbar" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding: 1rem; background: var(--surface); border-radius: 0.5rem;">
                    <div class="search-section">
                        <input type="text" id="location-search" placeholder="Search locations..." 
                               style="padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; width: 250px;"
                               onkeyup="window.app.locationsView.handleSearch(event)">
                    </div>
                    
                    <div class="filter-section" style="display: flex; gap: 1rem;">
                        <select id="location-sort" onchange="window.app.locationsView.handleSort(event)" 
                                style="padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                            <option value="name">Sort by Name</option>
                            <option value="created">Sort by Created</option>
                            <option value="modified">Sort by Modified</option>
                            <option value="type">Sort by Type</option>
                        </select>
                        
                        <select id="location-filter" onchange="window.app.locationsView.handleFilter(event)"
                                style="padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                            <option value="all">All Locations</option>
                            <option value="city">Cities</option>
                            <option value="building">Buildings</option>
                            <option value="outdoor">Outdoor</option>
                            <option value="landmark">Landmarks</option>
                        </select>
                    </div>
                </div>

                <div class="locations-content">
                    <div class="locations-container" id="locations-container">
                        ${this.renderLocationContent()}
                    </div>
                </div>
            </div>
        `;
    }

    renderLocationContent() {
        const allLocations = Array.from(this.state.state.locations.values());
        
        if (allLocations.length === 0) {
            return this.renderEmptyState();
        }

        const filteredLocations = this.filterLocations(allLocations);
        return this.renderLocationGrid(filteredLocations);
    }

    renderLocationGrid(locations) {
        return `
            <div class="locations-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem;">
                ${locations.map(location => `
                    <div class="location-card" onclick="window.app.router.navigate('location/${location.id}')" style="background: var(--surface); border: 1px solid var(--border); border-radius: 0.5rem; padding: 1.5rem; transition: transform 0.2s; cursor: pointer;"
                         onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='var(--shadow-lg)'" 
                         onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                        
                        <div class="location-header" style="margin-bottom: 1rem;">
                            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
                                <span style="font-size: 2rem;">${this.getLocationIcon(location.type)}</span>
                                <div style="flex: 1;">
                                    <h3 style="margin: 0;">${location.name}</h3>
                                    <span style="background: var(--primary); color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">
                                        ${this.getLocationTypeLabel(location.type)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="location-description" style="margin-bottom: 1rem;">
                            <p style="color: var(--text-secondary); margin: 0; line-height: 1.5;">${this.truncateText(location.description || '', 120)}</p>
                        </div>
                        
                        ${location.tags && location.tags.length > 0 ? `
                            <div class="location-tags" style="margin-bottom: 1rem;">
                                <div style="display: flex; flex-wrap: wrap; gap: 0.25rem;">
                                    ${location.tags.slice(0, 3).map(tag => `
                                        <span style="background: var(--background); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">
                                            ${tag}
                                        </span>
                                    `).join('')}
                                    ${location.tags.length > 3 ? `<span style="color: var(--text-secondary); font-size: 0.75rem;">+${location.tags.length - 3}</span>` : ''}
                                </div>
                            </div>
                        ` : ''}
                        
                        <div class="location-meta" style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--text-secondary);">
                            <span>Used in ${location.productionIds ? location.productionIds.length : 0} ${location.productionIds && location.productionIds.length === 1 ? 'story' : 'stories'}</span>
                            <span>${new Date(location.lastModified).toLocaleDateString()}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderEmptyState() {
        return `
            <div class="empty-state" style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🗺️</div>
                <h3>No locations yet</h3>
                <p>Create your first location to start building your world</p>
                <button class="btn btn-primary" onclick="window.app.locationsView.showAddLocationDialog()" style="margin-top: 1rem;">
                    Add First Location
                </button>
            </div>
        `;
    }

    filterLocations(locations) {
        let filtered = [...locations];

        // Apply search filter
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(location => 
                location.name.toLowerCase().includes(query) ||
                (location.description && location.description.toLowerCase().includes(query)) ||
                (location.type && location.type.toLowerCase().includes(query))
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
        const container = document.getElementById('locations-container');
        if (container) {
            container.innerHTML = this.renderLocationContent();
        }
    }

    // Action methods
    showAddLocationDialog() {
        this.showLocationCreationModal();
    }

    showImportDialog() {
        alert('Import locations feature coming soon!');
    }

    showLocationCreationModal() {
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
                    <h2 style="margin: 0; color: var(--primary);">🗺️ Create New Location</h2>
                    <button onclick="this.closest('.modal-overlay').remove()" style="
                        background: none;
                        border: none;
                        font-size: 1.5rem;
                        cursor: pointer;
                        color: var(--text-secondary);
                    ">×</button>
                </div>
                
                <form id="location-creation-form">
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Location Name *</label>
                        <input type="text" id="location-name" required style="
                            width: 100%;
                            padding: 0.75rem;
                            border: 1px solid var(--border);
                            border-radius: 0.375rem;
                            background: var(--surface);
                            color: var(--text-primary);
                        " placeholder="Enter location name...">
                    </div>
                    
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Location Type *</label>
                        <select id="location-type" required style="
                            width: 100%;
                            padding: 0.75rem;
                            border: 1px solid var(--border);
                            border-radius: 0.375rem;
                            background: var(--surface);
                            color: var(--text-primary);
                        ">
                            <option value="">Select location type...</option>
                            <option value="city">City</option>
                            <option value="town">Town</option>
                            <option value="village">Village</option>
                            <option value="building">Building</option>
                            <option value="room">Room</option>
                            <option value="outdoor">Outdoor Area</option>
                            <option value="landmark">Landmark</option>
                            <option value="dungeon">Dungeon</option>
                            <option value="castle">Castle</option>
                            <option value="temple">Temple</option>
                        </select>
                    </div>
                    
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Description</label>
                        <textarea id="location-description" rows="4" style="
                            width: 100%;
                            padding: 0.75rem;
                            border: 1px solid var(--border);
                            border-radius: 0.375rem;
                            background: var(--surface);
                            color: var(--text-primary);
                            resize: vertical;
                        " placeholder="Describe the location, its atmosphere, notable features..."></textarea>
                    </div>
                    
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Tags</label>
                        <input type="text" id="location-tags" style="
                            width: 100%;
                            padding: 0.75rem;
                            border: 1px solid var(--border);
                            border-radius: 0.375rem;
                            background: var(--surface);
                            color: var(--text-primary);
                        " placeholder="Enter tags separated by commas (e.g. royal, grand, mysterious)...">
                        <small style="color: var(--text-secondary); font-size: 0.75rem;">Separate multiple tags with commas</small>
                    </div>
                    
                    <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                        <button type="button" onclick="this.closest('.modal-overlay').remove()" class="btn btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" class="btn btn-primary">
                            Create Location
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        // Add form submit handler
        modal.querySelector('#location-creation-form').addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Parse tags
            const tagsInput = modal.querySelector('#location-tags').value;
            const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [];
            
            this.createLocation({
                name: modal.querySelector('#location-name').value,
                type: modal.querySelector('#location-type').value,
                description: modal.querySelector('#location-description').value,
                tags: tags
            });
            modal.remove();
        });
        
        document.body.appendChild(modal);
        
        // Focus the name input
        setTimeout(() => {
            modal.querySelector('#location-name').focus();
        }, 100);
    }
    
    createLocation(locationData) {
        const newLocation = {
            id: 'location_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            name: locationData.name,
            type: locationData.type,
            description: locationData.description,
            tags: locationData.tags,
            productionIds: [],
            files: [],
            created: new Date().toISOString(),
            lastModified: new Date().toISOString()
        };
        
        // Add to state
        this.state.state.locations.set(newLocation.id, newLocation);
        
        // Trigger events
        this.events.emit('locationCreated', newLocation);
        this.events.emit('dataChanged');
        
        // Refresh the view
        this.refreshContent();
        
        console.log('Created new location:', newLocation);
    }

    // Utility methods
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    }

    getLocationIcon(type) {
        const icons = {
            'city': '🏙️',
            'town': '🏘️',
            'village': '🏡',
            'building': '🏢',
            'room': '🚪',
            'outdoor': '🌲',
            'landmark': '🏛️',
            'dungeon': '🕳️',
            'castle': '🏰',
            'temple': '⛪'
        };
        return icons[type] || '📍';
    }

    getLocationTypeLabel(type) {
        const labels = {
            'city': 'City',
            'town': 'Town', 
            'village': 'Village',
            'building': 'Building',
            'room': 'Room',
            'outdoor': 'Outdoor Area',
            'landmark': 'Landmark',
            'dungeon': 'Dungeon',
            'castle': 'Castle',
            'temple': 'Temple'
        };
        return labels[type] || type || 'Location';
    }
}