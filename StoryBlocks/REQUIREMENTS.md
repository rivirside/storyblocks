# StoryBlocks Requirements Document

## Project Overview

StoryBlocks is a client-side story development and world-building application that operates entirely in the browser without requiring a server or build process. The application allows authors to organize, visualize, and edit complex story elements including characters, locations, timelines, and plot arcs through both a visual interface and command-line compatible file structure.

## Core Principles

1. **No Server Required**: The application must run entirely in the browser by opening an HTML file
2. **File-Based Storage**: All data stored in human-readable formats (JSON and Markdown)
3. **Dual Interface**: Support both GUI editing and direct file manipulation
4. **Timeline-Centric**: All story elements connect through various timeline systems
5. **Tag-Based Organization**: Flexible categorization through tags rather than rigid hierarchies

## Data Structure

### Directory Organization

```
StoryBlocks/
├── index.html
├── app.js
├── styles.css
├── data/
│   ├── brainstorming/
│   │   ├── characters/
│   │   ├── locations/
│   │   ├── plots/
│   │   ├── themes/
│   │   └── notes/
│   ├── canon/
│   │   ├── characters/
│   │   │   ├── [character-id]/
│   │   │   │   ├── profile.json
│   │   │   │   ├── about.md
│   │   │   │   ├── notes/
│   │   │   │   │   ├── [note-title].md
│   │   │   │   │   └── ...
│   │   │   │   └── timeline.json
│   │   │   └── ...
│   │   ├── locations/
│   │   │   ├── [location-id]/
│   │   │   │   ├── profile.json
│   │   │   │   ├── description.md
│   │   │   │   ├── notes/
│   │   │   │   │   └── [note-title].md
│   │   │   │   └── timeline.json
│   │   │   └── ...
│   │   ├── plots/
│   │   │   ├── [plot-id]/
│   │   │   │   ├── profile.json
│   │   │   │   ├── summary.md
│   │   │   │   ├── notes/
│   │   │   │   │   └── [note-title].md
│   │   │   │   └── timeline.json
│   │   │   └── ...
│   │   ├── themes/
│   │   │   ├── [theme-id]/
│   │   │   │   ├── profile.json
│   │   │   │   ├── description.md
│   │   │   │   └── notes/
│   │   │   │       └── [note-title].md
│   │   │   └── ...
│   │   └── events/
│   │       ├── [event-id].json
│   │       └── ...
│   ├── scripts/
│   │   ├── [script-id]/
│   │   │   ├── metadata.json
│   │   │   ├── screenplay.fountain
│   │   │   ├── revisions/
│   │   │   │   └── [timestamp].fountain
│   │   │   └── notes.md
│   │   └── ...
│   ├── timelines/
│   │   ├── global.json
│   │   ├── [custom-timeline-id].json
│   │   └── ...
│   └── project.json
└── assets/
    ├── images/
    └── documents/
```

### Data Schema

#### Character Profile (profile.json)
```json
{
  "id": "unique-character-id",
  "name": "Character Name",
  "aliases": ["Alternative Name"],
  "tags": ["protagonist", "mars-born", "scientist"],
  "demographics": {
    "birthDate": "2025-03-15",
    "deathDate": null,
    "age": "calculated or specified",
    "gender": "string",
    "ethnicity": "string",
    "occupation": "string"
  },
  "appearance": {
    "height": "string",
    "build": "string",
    "distinguishingFeatures": ["array of strings"]
  },
  "personality": {
    "traits": ["array of strings"],
    "motivations": ["array of strings"],
    "fears": ["array of strings"]
  },
  "relationships": [
    {
      "characterId": "other-character-id",
      "type": "family|friend|enemy|romantic|professional",
      "description": "string"
    }
  ],
  "affiliations": ["organization names or ids"],
  "notes": ["note-file-names"],
  "themes": ["theme-ids"],
  "status": "brainstorming|canon",
  "createdAt": "ISO-8601 timestamp",
  "updatedAt": "ISO-8601 timestamp"
}
```

#### Event (event-id.json)
```json
{
  "id": "unique-event-id",
  "title": "Event Title",
  "date": "ISO-8601 or relative date",
  "duration": "ISO-8601 duration",
  "description": "Brief description",
  "detailedDescription": "markdown filename or inline markdown",
  "participants": {
    "characters": ["character-ids"],
    "locations": ["location-ids"],
    "plots": ["plot-ids"]
  },
  "tags": ["battle", "discovery", "personal"],
  "timelineIds": ["timeline-ids this event appears on"],
  "scale": "moment|scene|story|macro|historical",
  "visibility": "public|private|draft",
  "consequences": ["event-ids of events triggered by this"],
  "prerequisites": ["event-ids that must occur before this"]
}
```

#### Timeline (timeline.json)
```json
{
  "id": "unique-timeline-id",
  "name": "Timeline Name",
  "type": "global|character|location|plot|custom",
  "description": "Timeline description",
  "events": ["ordered array of event-ids"],
  "scale": "default scale for this timeline",
  "tags": ["timeline categorization tags"],
  "color": "#hex-color for UI display"
}
```

#### Theme (profile.json)
```json
{
  "id": "unique-theme-id",
  "name": "Theme Name",
  "description": "Brief theme description",
  "tags": ["categorization tags"],
  "relatedElements": {
    "characters": ["character-ids that embody this theme"],
    "plots": ["plot-ids that explore this theme"],
    "events": ["event-ids that demonstrate this theme"],
    "locations": ["location-ids significant to this theme"]
  },
  "symbolism": ["symbols, metaphors, or motifs"],
  "questions": ["thematic questions explored"],
  "status": "brainstorming|canon",
  "createdAt": "ISO-8601 timestamp",
  "updatedAt": "ISO-8601 timestamp"
}
```

#### Script Metadata (metadata.json)
```json
{
  "id": "unique-script-id",
  "title": "Script Title",
  "type": "feature|short|episode|scene",
  "logline": "One-sentence description",
  "synopsis": "Brief synopsis",
  "characters": ["character-ids appearing in script"],
  "locations": ["location-ids used in script"],
  "themes": ["theme-ids explored"],
  "plotId": "associated plot-id",
  "timelineEvents": ["event-ids covered in script"],
  "draftNumber": 1,
  "status": "outline|draft|revision|final",
  "pageCount": 0,
  "estimatedDuration": "HH:MM:SS",
  "createdAt": "ISO-8601 timestamp",
  "updatedAt": "ISO-8601 timestamp"
}
```

## User Interface Requirements

### Main Layout

1. **Header Bar**
   - Project title
   - Mode toggle (View/Edit)
   - Search bar (global search across all content)
   - Settings menu

2. **Navigation Sidebar**
   - Timeline view
   - Characters
   - Locations
   - Plots/Arcs
   - Themes
   - Scripts
   - Events
   - World Elements
   - Brainstorming
   - Research
   - Production Notes

3. **Main Content Area**
   - Dynamic based on selected navigation item
   - Split view option for comparing elements

### Character Interface

#### Character List View
- Grid of character cards showing:
  - Character portrait/placeholder
  - Name
  - Key tags
  - Brief description
- Filter sidebar:
  - Tags (multi-select)
  - Affiliations
  - Status (active/deceased/unknown)
  - Timeline presence
- Sort options:
  - Alphabetical
  - Chronological (by birth)
  - Last modified
  - Relevance to selected plot/timeline

#### Character Detail View
- Tabbed interface:
  - **Overview Tab**
    - Profile information (view/edit modes)
    - Character portrait
    - Demographics
    - Quick stats
  - **Timeline Tab**
    - Character-specific timeline
    - Events involving character
    - Life milestones
  - **Relationships Tab**
    - Visual relationship map
    - Relationship list with descriptions
  - **Notes Tab**
    - List of all note files
    - Create new note
    - View/edit individual notes
  - **Gallery Tab** (if applicable)
    - Character art/references

### Timeline Interface

#### Multi-Scale Timeline View
- Zoom levels:
  - Historical (decades/centuries)
  - Macro (years)
  - Story (months/seasons)
  - Scene (days/weeks)
  - Moment (hours/minutes)
- Timeline tracks:
  - Global events track
  - Character tracks (toggleable)
  - Location tracks (toggleable)
  - Plot arc tracks (toggleable)
- Event representation:
  - Color-coded by type/plot
  - Click to view details
  - Drag to reorder (edit mode)
- Timeline controls:
  - Zoom in/out
  - Pan left/right
  - Jump to date
  - Filter events

### Theme Interface

#### Theme Explorer
- Visual theme map showing connections
- Theme cards with:
  - Theme name and icon
  - Brief description
  - Related element count
  - Color coding
- Filter by:
  - Status (brainstorming/canon)
  - Related plots
  - Character associations
- Theme detail view:
  - Description and notes
  - Symbol/motif gallery
  - Thematic questions
  - Related elements grid
  - Evolution timeline

### Brainstorming Interface

#### Brainstorming Dashboard
- Separate workspace from canon content
- Quick capture widgets:
  - Character sketch pad
  - Location notepad
  - Plot idea board
  - Theme explorer
- Promotion workflow:
  - Review brainstormed content
  - Refine and complete required fields
  - Promote to canon with one click
  - Maintain link to original brainstorm
- Version comparison view
- Bulk operations for organizing ideas

### Screenwriting Interface

#### Script Editor
- Fountain format support with syntax highlighting
- Auto-formatting for:
  - Scene headings (INT./EXT.)
  - Character names (UPPERCASE)
  - Dialogue
  - Action lines
  - Parentheticals
  - Transitions
- Smart features:
  - Character name auto-complete
  - Location suggestions
  - Scene numbering
  - Page count estimation
  - Read time calculation
- Dual pane view:
  - Edit fountain markup
  - Live preview with proper formatting
- Script tools:
  - Scene navigator sidebar
  - Character dialogue tracker
  - Location usage report
  - Revision comparison
- Export options:
  - PDF with standard screenplay formatting
  - Final Draft (FDX)
  - Plain text/Fountain

### Edit/View Modes

#### View Mode
- Renders markdown content
- Interactive elements (links between entities)
- Timeline navigation
- Relationship visualization
- Read-only interface

#### Edit Mode
- Markdown editor with preview
- Form-based editing for structured data
- Drag-and-drop for timeline events
- Tag management
- File upload for assets
- Auto-save with version tracking

## Technical Requirements

### Frontend Architecture

1. **No Build Process**
   - Pure vanilla JavaScript (ES6+)
   - No transpilation required
   - CSS without preprocessors
   - HTML5 with semantic markup

2. **File System Access**
   - Use File System Access API where available
   - Fallback to file upload/download
   - Local storage for preferences
   - IndexedDB for caching

3. **Data Management**
   - JSON parsing/serialization
   - Markdown rendering (use marked.js or similar)
   - Client-side search indexing
   - Lazy loading for large datasets

4. **UI Components**
   - Custom web components where beneficial
   - Modal system for editing
   - Responsive design
   - Keyboard navigation support
   - Accessibility (ARIA labels, semantic HTML)

### Performance Considerations

1. **Lazy Loading**
   - Load character details on demand
   - Paginate large lists
   - Virtual scrolling for timelines

2. **Caching Strategy**
   - Cache parsed markdown
   - Store computed relationships
   - Timeline event indexing

3. **Search Optimization**
   - Client-side full-text search
   - Tag-based filtering
   - Relationship traversal

## User Workflows

### Creating a New Character

1. Click "Add Character" button
2. Fill in basic profile information
3. System generates unique ID and file structure
4. User can immediately add notes
5. Character appears in relevant timelines

### Viewing Character Information

1. Browse or search character list
2. Filter by tags/affiliations
3. Click character card
4. View tabbed information
5. Navigate to related characters/events

### Editing Character Notes

1. Navigate to character detail
2. Toggle to edit mode
3. Select Notes tab
4. Either:
   - Edit existing note in markdown editor
   - Create new note file
5. Changes auto-save
6. Version history available

### Timeline Management

1. View global timeline
2. Toggle character/location/plot tracks
3. Zoom to desired scale
4. Click events for details
5. In edit mode:
   - Drag events to reposition
   - Create new events
   - Link events to entities

### Connecting Elements

1. When creating/editing events:
   - Tag participating characters
   - Specify locations
   - Associate with plots
   - Link to themes
2. System automatically:
   - Updates character timelines
   - Updates location timelines
   - Maintains relationship graph
   - Updates theme connections

### Brainstorming to Canon Workflow

1. Create content in brainstorming area
2. Develop and refine ideas
3. When ready, click "Promote to Canon"
4. System validates required fields
5. Content moves to canon with:
   - Status update
   - Timestamp of promotion
   - Link to original brainstorm
6. Original remains in brainstorming for reference

### Theme Development Workflow

1. Identify theme in brainstorming
2. Create theme profile
3. Tag related story elements
4. Track theme evolution through:
   - Character arcs
   - Plot developments
   - Symbolic representations
5. Generate theme reports showing coverage

### Screenwriting Workflow

1. Select plot/timeline events to adapt
2. Create new script with metadata
3. System pre-populates:
   - Character list
   - Location list
   - Relevant themes
4. Write in Fountain format with:
   - Auto-formatting
   - Character/location validation
   - Real-time preview
5. Track revisions automatically
6. Export to standard formats

## Migration Strategy

### Phase 1: Data Structure Migration
- Convert existing markdown files to new structure
- Parse character information into profile.json
- Preserve all existing notes as separate files
- Generate unique IDs for all entities

### Phase 2: Timeline Construction
- Extract events from existing content
- Create initial timeline entries
- Link events to characters/locations

### Phase 3: Relationship Mapping
- Parse existing character relationships
- Generate relationship data
- Create initial relationship visualizations

## Future Enhancements

1. **Export Options**
   - Timeline visualizations (SVG/PNG)
   - Character sheets (PDF)
   - Full story export (formatted markdown)
   - Data backup (ZIP archive)

2. **Collaboration Features**
   - Change tracking
   - Merge conflict resolution
   - Comment system

3. **Advanced Visualizations**
   - Character relationship graphs
   - Plot arc diagrams
   - Location maps
   - Family trees

4. **AI Integration**
   - Character consistency checking
   - Timeline conflict detection
   - Plot hole identification
   - Writing suggestions

## Security Considerations

1. **Data Privacy**
   - All data stored locally
   - No external API calls
   - No analytics or tracking

2. **Data Integrity**
   - Backup reminders
   - Data validation
   - Recovery from corrupted files

3. **Browser Compatibility**
   - Graceful degradation
   - Feature detection
   - Fallback options

## Success Criteria

1. Application loads instantly from file://
2. All CRUD operations work without server
3. Intuitive navigation between related elements
4. Markdown rendering matches preview
5. Timeline visualization is performant with 1000+ events
6. Search returns results in <100ms
7. File structure remains human-readable
8. Command-line tools can manipulate data directly