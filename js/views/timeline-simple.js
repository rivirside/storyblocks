// Timeline View with D3.js Visualization
class TimelineView {
    constructor(app) {
        this.app = app;
        this.state = app.state;
        this.events = app.events;
        this.timeline = null;
        this.currentScale = 'story';
        this.zoomLevel = 1;
        this.selectedEvent = null;
        this.filters = {
            type: 'all',
            characters: []
        };
    }

    render() {
        return `
            <div class="timeline-view">
                <div class="timeline-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <div class="header-title">
                        <h1>World Timeline</h1>
                        <p style="color: var(--text-secondary); margin: 0;">All events that happen in your world</p>
                    </div>
                    <div class="header-actions" style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-secondary" onclick="window.app.timelineView.showTimelineSettings()">
                            ⚙️ Settings
                        </button>
                        <button class="btn btn-primary" onclick="window.app.timelineView.showAddEventDialog()">
                            ➕ Add Event
                        </button>
                    </div>
                </div>

                <div class="timeline-controls" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding: 1rem; background: var(--surface); border-radius: 0.5rem;">
                    <div class="control-group" style="display: flex; gap: 1rem; align-items: center;">
                        <label for="timeline-scale" style="font-weight: 600;">Time Scale:</label>
                        <select id="timeline-scale" onchange="window.app.timelineView.changeScale(event)" style="padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                            <option value="story">Story Time</option>
                            <option value="real">Real Time</option>
                            <option value="chapter">Chapters</option>
                            <option value="scenes">Scenes</option>
                        </select>
                        
                        <label for="timeline-filter" style="font-weight: 600; margin-left: 1rem;">Filter:</label>
                        <select id="timeline-filter" onchange="window.app.timelineView.changeFilter(event)" style="padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                            <option value="all">All Events</option>
                            <option value="character">Character Events</option>
                            <option value="plot">Plot Events</option>
                            <option value="world">World Events</option>
                            <option value="milestone">Milestones</option>
                        </select>
                    </div>
                    
                    <div class="zoom-controls" style="display: flex; gap: 0.5rem; align-items: center;">
                        <span style="font-weight: 600; margin-right: 0.5rem;">Zoom:</span>
                        <button class="btn btn-secondary btn-sm" onclick="window.app.timelineView.zoomOut()">🔍-</button>
                        <span id="zoom-level" style="min-width: 60px; text-align: center; font-weight: 600;">100%</span>
                        <button class="btn btn-secondary btn-sm" onclick="window.app.timelineView.zoomIn()">🔍+</button>
                        <button class="btn btn-secondary btn-sm" onclick="window.app.timelineView.resetZoom()" style="margin-left: 0.5rem;">Reset</button>
                    </div>
                </div>

                <div class="timeline-container" style="display: flex; height: 600px; border: 1px solid var(--border); border-radius: 0.5rem; overflow: hidden;">
                    <div class="timeline-sidebar" style="width: 200px; background: var(--surface); border-right: 1px solid var(--border); overflow-y: auto;">
                        <div class="timeline-tracks" id="timeline-tracks">
                            <!-- Timeline tracks will be populated here -->
                        </div>
                    </div>
                    <div class="timeline-content" style="flex: 1; position: relative; overflow: hidden;">
                        <div class="timeline-svg-container" id="timeline-svg-container" style="width: 100%; height: 100%;">
                            <!-- D3.js timeline will be rendered here -->
                        </div>
                    </div>
                </div>

                <div class="timeline-legend" style="display: flex; justify-content: center; gap: 2rem; margin-top: 1rem; padding: 1rem; background: var(--surface); border-radius: 0.5rem;">
                    <div class="legend-item" style="display: flex; align-items: center; gap: 0.5rem;">
                        <div style="width: 12px; height: 12px; background: #3b82f6; border-radius: 50%;"></div>
                        <span>Character Events</span>
                    </div>
                    <div class="legend-item" style="display: flex; align-items: center; gap: 0.5rem;">
                        <div style="width: 12px; height: 12px; background: #ef4444; border-radius: 50%;"></div>
                        <span>Plot Events</span>
                    </div>
                    <div class="legend-item" style="display: flex; align-items: center; gap: 0.5rem;">
                        <div style="width: 12px; height: 12px; background: #22c55e; border-radius: 50%;"></div>
                        <span>World Events</span>
                    </div>
                    <div class="legend-item" style="display: flex; align-items: center; gap: 0.5rem;">
                        <div style="width: 16px; height: 16px; background: none; border: 3px solid #6b7280; border-radius: 50%;"></div>
                        <span>World Only</span>
                    </div>
                    <div class="legend-item" style="display: flex; align-items: center; gap: 0.5rem;">
                        <div style="width: 16px; height: 16px; background: none; border: 3px solid #f59e0b; border-radius: 50%;"></div>
                        <span>In Multiple Stories</span>
                    </div>
                </div>

                <div class="event-details" id="event-details" style="margin-top: 2rem; display: none;">
                    <!-- Event details will be shown here when an event is selected -->
                </div>
            </div>
        `;
    }

    init() {
        // Initialize D3 timeline
        this.initializeTimeline();
        
        // Render tracks
        this.renderTracks();
        
        // Render timeline
        this.renderTimeline();
    }

    loadSampleTimelineData() {
        // This method is no longer needed - we'll use actual world events
        // Events are now stored in state.events
    }

    initializeTimeline() {
        const container = d3.select('#timeline-svg-container');
        container.selectAll('*').remove();

        const margin = { top: 20, right: 20, bottom: 60, left: 20 };
        const containerNode = container.node();
        const width = containerNode.clientWidth - margin.left - margin.right;
        const height = containerNode.clientHeight - margin.top - margin.bottom;

        this.width = width;
        this.height = height;
        this.margin = margin;

        this.svg = container
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom);

        this.g = this.svg
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Add zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([0.1, 10])
            .on('zoom', (event) => {
                this.g.attr('transform', 
                    `translate(${margin.left + event.transform.x},${margin.top}) scale(${event.transform.k}, 1)`
                );
                this.zoomLevel = event.transform.k;
                this.updateZoomDisplay();
            });

        this.svg.call(zoom);
        this.zoom = zoom;
    }

    renderTracks() {
        const tracksContainer = document.getElementById('timeline-tracks');
        const tracks = this.getTimelineTracks();

        tracksContainer.innerHTML = tracks.map(track => `
            <div class="timeline-track" style="padding: 1rem; border-bottom: 1px solid var(--border);">
                <div class="track-header">
                    <h4 style="margin: 0 0 0.5rem 0; font-size: 0.875rem;">${track.name}</h4>
                    <span style="color: var(--text-secondary); font-size: 0.75rem;">${track.events.length} events</span>
                </div>
            </div>
        `).join('');
    }

    getTimelineTracks() {
        const events = Array.from(this.state.getState().events.values());
        const tracks = new Map();

        // Group events by type
        events.forEach(event => {
            const trackId = event.type || 'other';
            if (!tracks.has(trackId)) {
                tracks.set(trackId, {
                    id: trackId,
                    name: this.getTrackName(trackId),
                    events: []
                });
            }
            tracks.get(trackId).events.push(event);
        });

        return Array.from(tracks.values());
    }

    getTrackName(trackId) {
        const trackNames = {
            'character': 'Character Arcs',
            'plot': 'Main Plot',
            'world': 'World Events',
            'milestone': 'Milestones',
            'other': 'Other Events'
        };
        return trackNames[trackId] || trackId;
    }

    renderTimeline() {
        const events = this.getFilteredEvents();
        
        if (events.length === 0) {
            this.showEmptyTimeline();
            return;
        }

        // Clear previous timeline
        this.g.selectAll('.timeline-content').remove();

        // Create scales
        const xScale = this.createTimeScale(events);
        const yScale = this.createTrackScale(events);

        // Draw timeline background
        this.drawTimelineBackground(xScale);

        // Draw events
        this.drawEvents(events, xScale, yScale);

        // Draw connections between related events
        this.drawConnections(events, xScale, yScale);

        // Add axes
        this.drawAxes(xScale);
    }

    getFilteredEvents() {
        let events = Array.from(this.state.getState().events.values());

        // Apply type filter
        if (this.filters.type !== 'all') {
            events = events.filter(event => event.type === this.filters.type);
        }

        // Apply character filter
        if (this.filters.characters.length > 0) {
            events = events.filter(event => 
                event.characterIds && 
                event.characterIds.some(charId => this.filters.characters.includes(charId))
            );
        }

        return events.sort((a, b) => {
            // Sort by worldTime (string comparison works for ISO dates)
            const aTime = a.worldTime || a.storyTime || '';
            const bTime = b.worldTime || b.storyTime || '';
            return aTime.localeCompare(bTime);
        });
    }

    createTimeScale(events) {
        const timeValues = events.map(event => {
            switch (this.currentScale) {
                case 'story':
                    return event.storyTime || 0;
                case 'real':
                    return event.realTime ? new Date(event.realTime) : new Date();
                case 'chapter':
                    return event.chapter || 1;
                case 'scenes':
                    return (event.chapter || 1) * 10 + (event.scene || 1);
                default:
                    return event.storyTime || 0;
            }
        });

        const minTime = d3.min(timeValues);
        const maxTime = d3.max(timeValues);

        if (this.currentScale === 'real') {
            return d3.scaleTime()
                .domain([minTime, maxTime])
                .range([0, this.width]);
        } else {
            return d3.scaleLinear()
                .domain([minTime, maxTime])
                .range([0, this.width]);
        }
    }

    createTrackScale(events) {
        const tracks = this.getTimelineTracks();
        const trackHeight = this.height / Math.max(tracks.length, 1);
        
        return d3.scaleBand()
            .domain(tracks.map(t => t.id))
            .range([0, this.height])
            .paddingInner(0.1);
    }

    drawTimelineBackground(xScale) {
        const timelineGroup = this.g.append('g').attr('class', 'timeline-content');

        // Add grid lines
        const ticks = xScale.ticks(10);
        timelineGroup.selectAll('.grid-line')
            .data(ticks)
            .enter()
            .append('line')
            .attr('class', 'grid-line')
            .attr('x1', d => xScale(d))
            .attr('x2', d => xScale(d))
            .attr('y1', 0)
            .attr('y2', this.height)
            .attr('stroke', '#e2e8f0')
            .attr('stroke-width', 1)
            .attr('opacity', 0.5);
    }

    drawEvents(events, xScale, yScale) {
        const colorScale = d3.scaleOrdinal()
            .domain(['character', 'plot', 'world', 'milestone'])
            .range(['#3b82f6', '#ef4444', '#22c55e', '#f59e0b']);

        const eventGroups = this.g.selectAll('.event-group')
            .data(events)
            .enter()
            .append('g')
            .attr('class', 'event-group')
            .attr('transform', d => {
                const x = xScale(this.getEventTimeValue(d));
                const y = yScale(d.type || 'other') + yScale.bandwidth() / 2;
                return `translate(${x}, ${y})`;
            });

        // Event circles
        eventGroups
            .append('circle')
            .attr('r', d => Math.sqrt((d.importance || 1) * 3) + 3)
            .attr('fill', d => colorScale(d.type || 'other'))
            .attr('stroke', d => {
                // Different stroke if event is in multiple stories
                const storyCount = Object.keys(d.storyInclusion || {}).length;
                if (storyCount > 1) return '#f59e0b'; // Orange for multi-story
                if (storyCount === 1) return '#ffffff'; // White for single story
                return '#6b7280'; // Gray for world-only events
            })
            .attr('stroke-width', d => {
                const storyCount = Object.keys(d.storyInclusion || {}).length;
                return storyCount > 0 ? 3 : 2;
            })
            .attr('cursor', 'pointer')
            .on('click', (event, d) => this.selectEvent(d))
            .on('mouseover', (event, d) => this.showEventTooltip(event, d))
            .on('mouseout', () => this.hideEventTooltip());
            
        // Story inclusion indicators (small dots around the main event)
        eventGroups.each(function(d) {
            const storyKeys = Object.keys(d.storyInclusion || {});
            if (storyKeys.length > 0) {
                const group = d3.select(this);
                const angleStep = (2 * Math.PI) / storyKeys.length;
                
                storyKeys.forEach((storyId, i) => {
                    const angle = i * angleStep - Math.PI / 2;
                    const radius = 12;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    
                    group.append('circle')
                        .attr('cx', x)
                        .attr('cy', y)
                        .attr('r', 3)
                        .attr('fill', '#f59e0b')
                        .attr('stroke', '#ffffff')
                        .attr('stroke-width', 1)
                        .attr('opacity', 0.8);
                });
            }
        });

        // Event duration bars (if applicable)
        eventGroups
            .filter(d => d.duration && d.duration > 0)
            .append('rect')
            .attr('x', 0)
            .attr('y', -2)
            .attr('width', d => xScale(this.getEventTimeValue(d) + (d.duration || 0)) - xScale(this.getEventTimeValue(d)))
            .attr('height', 4)
            .attr('fill', d => colorScale(d.type || 'other'))
            .attr('opacity', 0.3);

        // Event labels
        eventGroups
            .append('text')
            .text(d => d.title)
            .attr('dy', -15)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('fill', 'var(--text-primary)')
            .style('pointer-events', 'none');
    }

    drawConnections(events, xScale, yScale) {
        // Draw connections between events that have character relationships
        const connections = this.findEventConnections(events);

        const connectionGroup = this.g.append('g').attr('class', 'connections');

        connectionGroup.selectAll('.connection')
            .data(connections)
            .enter()
            .append('path')
            .attr('class', 'connection')
            .attr('d', d => {
                const x1 = xScale(this.getEventTimeValue(d.source));
                const y1 = yScale(d.source.type || 'other') + yScale.bandwidth() / 2;
                const x2 = xScale(this.getEventTimeValue(d.target));
                const y2 = yScale(d.target.type || 'other') + yScale.bandwidth() / 2;

                // Create curved path
                const midX = (x1 + x2) / 2;
                return `M ${x1} ${y1} Q ${midX} ${(y1 + y2) / 2 - 20} ${x2} ${y2}`;
            })
            .attr('stroke', '#94a3b8')
            .attr('stroke-width', 1)
            .attr('fill', 'none')
            .attr('opacity', 0.4);
    }

    findEventConnections(events) {
        const connections = [];
        
        for (let i = 0; i < events.length - 1; i++) {
            for (let j = i + 1; j < events.length; j++) {
                const event1 = events[i];
                const event2 = events[j];
                
                // Check if events share characters
                if (event1.characters && event2.characters) {
                    const sharedCharacters = event1.characters.filter(char => 
                        event2.characters.includes(char)
                    );
                    
                    if (sharedCharacters.length > 0) {
                        connections.push({
                            source: event1,
                            target: event2,
                            sharedCharacters
                        });
                    }
                }
            }
        }
        
        return connections;
    }

    drawAxes(xScale) {
        // Remove existing axes
        this.g.selectAll('.axis').remove();

        // X-axis
        const xAxis = d3.axisBottom(xScale)
            .tickFormat(d => this.formatTimeValue(d));

        this.g.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0, ${this.height})`)
            .call(xAxis);
    }

    getEventTimeValue(event) {
        switch (this.currentScale) {
            case 'story':
                return event.storyTime || 0;
            case 'real':
                return event.realTime ? new Date(event.realTime) : new Date();
            case 'chapter':
                return event.chapter || 1;
            case 'scenes':
                return (event.chapter || 1) * 10 + (event.scene || 1);
            default:
                return event.storyTime || 0;
        }
    }

    formatTimeValue(value) {
        switch (this.currentScale) {
            case 'story':
                return `T${value}`;
            case 'real':
                return d3.timeFormat('%m/%d')(value);
            case 'chapter':
                return `Ch ${value}`;
            case 'scenes':
                const chapter = Math.floor(value / 10);
                const scene = value % 10;
                return `${chapter}.${scene}`;
            default:
                return value.toString();
        }
    }

    showEmptyTimeline() {
        this.g.selectAll('*').remove();
        
        this.g.append('text')
            .attr('x', this.width / 2)
            .attr('y', this.height / 2)
            .attr('text-anchor', 'middle')
            .attr('font-size', '18px')
            .attr('fill', 'var(--text-secondary)')
            .text('No events to display');
    }

    // Event handlers
    changeScale(event) {
        this.currentScale = event.target.value;
        this.renderTimeline();
    }

    changeFilter(event) {
        this.filters.type = event.target.value;
        this.renderTimeline();
    }

    zoomIn() {
        this.svg.transition().call(
            this.zoom.scaleBy, 1.5
        );
    }

    zoomOut() {
        this.svg.transition().call(
            this.zoom.scaleBy, 1 / 1.5
        );
    }

    resetZoom() {
        this.svg.transition().call(
            this.zoom.transform,
            d3.zoomIdentity
        );
    }

    updateZoomDisplay() {
        const zoomElement = document.getElementById('zoom-level');
        if (zoomElement) {
            zoomElement.textContent = `${Math.round(this.zoomLevel * 100)}%`;
        }
    }

    selectEvent(event) {
        this.selectedEvent = event;
        this.showEventDetails(event);
        
        // Highlight selected event
        this.g.selectAll('circle')
            .attr('stroke-width', d => d.id === event.id ? 4 : 2);
    }

    showEventDetails(event) {
        const detailsContainer = document.getElementById('event-details');
        detailsContainer.style.display = 'block';
        
        const characters = this.state.getState().characters;
        const productions = this.state.getState().productions;
        const characterNames = (event.characterIds || event.characters || [])
            .map(charId => characters.get(charId)?.name || charId)
            .join(', ');

        // Build story inclusion HTML
        const storyInclusionHtml = Object.entries(event.storyInclusion || {}).map(([storyId, inclusion]) => {
            const production = productions.get(storyId);
            return `
                <div style="background: var(--background); padding: 1rem; border-radius: 0.375rem; margin-bottom: 0.5rem;">
                    <strong>${production?.title || storyId}</strong>
                    <div style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.5rem;">
                        <div>📍 Appears: ${inclusion.storyTime || 'TBD'}</div>
                        <div>👁️ Shown as: ${inclusion.shown || 'full'}</div>
                        <div>🎭 POV: ${characters.get(inclusion.perspective)?.name || 'Multiple'}</div>
                        ${inclusion.notes ? `<div>📝 ${inclusion.notes}</div>` : ''}
                    </div>
                </div>
            `;
        }).join('');

        detailsContainer.innerHTML = `
            <div style="background: var(--surface); padding: 1.5rem; border-radius: 0.5rem; border: 1px solid var(--border);">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <h3 style="margin: 0; color: var(--primary);">${event.title}</h3>
                    <button onclick="window.app.timelineView.hideEventDetails()" style="background: none; border: none; font-size: 1.2rem; cursor: pointer; color: var(--text-secondary);">×</button>
                </div>
                <p style="margin-bottom: 1rem;">${event.description || 'No description'}</p>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
                    <div>
                        <strong>World Time:</strong> ${event.worldTime || 'Unknown'}
                    </div>
                    <div>
                        <strong>Type:</strong> ${event.type || 'general'}
                    </div>
                    <div>
                        <strong>Story Time:</strong> ${event.storyTime || 'N/A'}
                    </div>
                    <div>
                        <strong>Chapter:</strong> ${event.chapter || 'N/A'}
                    </div>
                    <div>
                        <strong>Scene:</strong> ${event.scene || 'N/A'}
                    </div>
                    <div>
                        <strong>Characters:</strong> ${characterNames || 'None'}
                    </div>
                    <div>
                        <strong>Location:</strong> ${event.location || 'Unknown'}
                    </div>
                    <div>
                        <strong>Visibility:</strong> ${event.visibility || 'known'}
                    </div>
                </div>
                
                ${storyInclusionHtml ? `
                    <div style="margin-top: 1.5rem;">
                        <h4 style="margin-bottom: 0.5rem; color: var(--primary);">📚 Story Inclusion</h4>
                        ${storyInclusionHtml}
                    </div>
                ` : `
                    <div style="margin-top: 1.5rem; padding: 1rem; background: var(--background); border-radius: 0.375rem; text-align: center; color: var(--text-secondary);">
                        This event exists in the world but hasn't been included in any stories yet.
                    </div>
                `}
                
                <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
                    <button class="btn btn-primary" onclick="window.app.timelineView.editEvent('${event.id}')">Edit Event</button>
                    <button class="btn btn-secondary" onclick="window.app.timelineView.addEventToStory('${event.id}')">Add to Story</button>
                    <button class="btn btn-secondary" onclick="window.app.timelineView.deleteEvent('${event.id}')">Delete Event</button>
                </div>
            </div>
        `;
    }

    hideEventDetails() {
        const detailsContainer = document.getElementById('event-details');
        detailsContainer.style.display = 'none';
        this.selectedEvent = null;
        
        // Remove event highlighting
        this.g.selectAll('circle').attr('stroke-width', 2);
    }

    showEventTooltip(event, data) {
        // Create tooltip
        const tooltip = d3.select('body').append('div')
            .attr('class', 'timeline-tooltip')
            .style('position', 'absolute')
            .style('background', 'var(--surface)')
            .style('border', '1px solid var(--border)')
            .style('border-radius', '4px')
            .style('padding', '8px')
            .style('font-size', '12px')
            .style('z-index', '1000')
            .style('pointer-events', 'none')
            .html(`
                <strong>${data.title}</strong><br/>
                Type: ${data.type || 'Other'}<br/>
                Time: ${data.storyTime || 'N/A'}
            `);

        tooltip.style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px');
    }

    hideEventTooltip() {
        d3.selectAll('.timeline-tooltip').remove();
    }

    // Action methods
    showAddEventDialog() {
        alert('Add event dialog coming soon! For now, sample events are pre-loaded.');
    }

    showTimelineSettings() {
        alert('Timeline settings coming soon!');
    }

    editEvent(eventId) {
        alert(`Edit event ${eventId} - feature coming soon!`);
    }

    deleteEvent(eventId) {
        if (confirm('Are you sure you want to delete this event?')) {
            this.state.deleteEvent(eventId);
            this.renderTimeline();
            this.hideEventDetails();
        }
    }
}