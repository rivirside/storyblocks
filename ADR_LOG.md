# Architecture Decision Records (ADR) Log

## Table of Contents

1. [ADR-001: Use React with TypeScript](#adr-001-use-react-with-typescript)
2. [ADR-002: File System Access API for Storage](#adr-002-file-system-access-api-for-storage)
3. [ADR-003: Client-Side Only Architecture](#adr-003-client-side-only-architecture)
4. [ADR-004: Monaco Editor for Text Editing](#adr-004-monaco-editor-for-text-editing)
5. [ADR-005: Custom Fountain Parser](#adr-005-custom-fountain-parser)
6. [ADR-006: IndexedDB for Metadata Cache](#adr-006-indexeddb-for-metadata-cache)
7. [ADR-007: Zustand for State Management](#adr-007-zustand-for-state-management)
8. [ADR-008: D3.js for Timeline Visualization](#adr-008-d3js-for-timeline-visualization)
9. [ADR-009: Material-UI Component Library](#adr-009-material-ui-component-library)
10. [ADR-010: Vite as Build Tool](#adr-010-vite-as-build-tool)
11. [ADR-011: JSON + Markdown Data Format](#adr-011-json--markdown-data-format)
12. [ADR-012: Event-Driven Architecture](#adr-012-event-driven-architecture)
13. [ADR-013: Web Workers for Heavy Operations](#adr-013-web-workers-for-heavy-operations)
14. [ADR-014: Modular Feature Architecture](#adr-014-modular-feature-architecture)
15. [ADR-015: Git-Friendly File Structure](#adr-015-git-friendly-file-structure)

---

## ADR-001: Use Vanilla JavaScript with Web Components (Build-Free)

**Status**: Accepted (Revised)  
**Date**: 2024-01-16  
**Deciders**: Development Team  
**Supersedes**: Original React/TypeScript decision

### Context
The requirement to avoid any build process eliminates React, TypeScript, and bundlers. We need a modern approach that works directly in browsers while maintaining code organization and component architecture.

### Decision
Use vanilla JavaScript with ES Modules and Web Components for the entire application, with no build step required.

### Consequences

**Positive:**
- Zero build configuration or maintenance
- Instant development feedback (save and refresh)
- No dependency management or node_modules
- Direct browser debugging without source maps
- Easy deployment (just static files)
- Lower barrier to contribution
- Future-proof web standards
- Smaller total size (no framework overhead)

**Negative:**
- No TypeScript type checking
- Less IDE support compared to React
- Manual component state management
- Fewer ready-made components
- More boilerplate for components
- No JSX syntax
- Limited to modern browsers

**Alternatives Considered:**
- React with CDN: Still requires JSX transformation
- Vue with CDN: Template compilation overhead
- Alpine.js: Limited for complex apps
- Lit via CDN: Chose vanilla for maximum simplicity

---

## ADR-002: File System Access API for Storage

**Status**: Accepted  
**Date**: 2024-01-15  
**Deciders**: Development Team  

### Context
The application needs to read/write files directly to the user's file system without requiring a server. This enables users to maintain full control over their data and work offline.

### Decision
Use the File System Access API for all file operations, with a fallback to file upload/download for unsupported browsers.

### Consequences

**Positive:**
- Direct file system access without server
- Users maintain full control of their data
- No data privacy concerns
- Works offline
- Native file system integration
- Can watch for external file changes

**Negative:**
- Limited browser support (Chrome, Edge only)
- Requires user permission for each folder
- Cannot access files outside selected directory
- Need fallback for other browsers
- Security restrictions on file access

**Alternatives Considered:**
- Local Storage: 5MB limit too restrictive
- IndexedDB only: No direct file access
- Electron: Requires installation
- WebDAV: Requires server setup

---

## ADR-003: Client-Side Only Architecture

**Status**: Accepted  
**Date**: 2024-01-15  
**Deciders**: Development Team  

### Context
Users want to maintain complete privacy and control over their creative work without depending on external services or internet connectivity.

### Decision
Build the entire application to run client-side with no server dependencies.

### Consequences

**Positive:**
- Complete data privacy
- No hosting costs
- Works offline
- No server maintenance
- Instant response times
- No API rate limits

**Negative:**
- No real-time collaboration
- No cloud backup built-in
- Limited to browser capabilities
- Larger initial download
- No server-side processing
- Manual backup responsibility

**Alternatives Considered:**
- Traditional server architecture: Privacy concerns
- Hybrid approach: Complexity without clear benefits
- P2P architecture: Too experimental

---

## ADR-004: Monaco Editor for Text Editing

**Status**: Accepted  
**Date**: 2024-01-15  
**Deciders**: Development Team  

### Context
We need a powerful text editor for markdown notes and screenplay writing with syntax highlighting, autocomplete, and professional editing features.

### Decision
Use Monaco Editor (VS Code's editor) for all text editing functionality.

### Consequences

**Positive:**
- Professional IDE-like experience
- Excellent performance
- Built-in syntax highlighting
- Extensible with custom languages
- Find/replace, multi-cursor, etc.
- Familiar to developers

**Negative:**
- Large bundle size (~4MB)
- Complex API
- Overkill for simple text fields
- Learning curve for customization
- Memory intensive for many instances

**Alternatives Considered:**
- CodeMirror: Smaller but less features
- Quill: Rich text, not code editing
- Textarea: Too basic
- Ace Editor: Less modern than Monaco

---

## ADR-005: Custom Fountain Parser

**Status**: Accepted  
**Date**: 2024-01-15  
**Deciders**: Development Team  

### Context
Fountain is the industry-standard plain text screenplay format. We need to parse and render it correctly while adding smart features like character autocomplete.

### Decision
Build a custom Fountain parser with TypeScript for full control over parsing and rendering.

### Consequences

**Positive:**
- Full control over parsing rules
- Can add custom extensions
- Tight integration with our data model
- Character/location validation
- Better error messages

**Negative:**
- Development time investment
- Need to maintain compatibility
- Testing complexity
- Potential edge case bugs

**Alternatives Considered:**
- fountain.js: Abandoned, outdated
- Fountain.ts: Limited features
- Server-side parsing: Against our architecture

---

## ADR-006: IndexedDB for Metadata Cache

**Status**: Accepted  
**Date**: 2024-01-15  
**Deciders**: Development Team  

### Context
We need client-side storage for metadata, file handles, user preferences, and search indexes that persists between sessions.

### Decision
Use IndexedDB with Dexie.js wrapper for all persistent client-side storage needs.

### Consequences

**Positive:**
- Large storage capacity
- Asynchronous API
- Good performance
- Structured data storage
- Transactions support
- Wide browser support

**Negative:**
- Complex API (mitigated by Dexie)
- No SQL queries
- Browser storage limits
- Can be cleared by user
- Debugging challenges

**Alternatives Considered:**
- LocalStorage: Too small, synchronous
- WebSQL: Deprecated
- Cache API: Wrong use case
- Memory only: No persistence

---

## ADR-007: Proxy-based State Management

**Status**: Accepted (Revised)  
**Date**: 2024-01-16  
**Deciders**: Development Team  
**Supersedes**: Zustand decision

### Context
Without a build process, we need a state management solution that works in vanilla JavaScript while providing reactivity and good developer experience.

### Decision
Use JavaScript Proxy objects with a custom event system for global state management.

### Consequences

**Positive:**
- Zero dependencies
- Native JavaScript feature
- Automatic change detection
- Simple mental model
- Direct debugging in DevTools
- No build or compilation needed

**Negative:**
- Manual subscription management
- No time-travel debugging
- Less ecosystem support
- Need to build own utilities
- IE11 incompatible (acceptable)

**Alternatives Considered:**
- MobX via CDN: Too heavy
- Redux via CDN: Too much boilerplate
- Custom events only: Less elegant
- localStorage only: Not reactive

---

## ADR-008: D3.js for Timeline Visualization

**Status**: Accepted  
**Date**: 2024-01-15  
**Deciders**: Development Team  

### Context
Timeline visualization is a core feature requiring complex interactions, zooming, panning, and custom rendering.

### Decision
Use D3.js for timeline visualization with React wrapper components.

### Consequences

**Positive:**
- Industry standard for data viz
- Extremely flexible
- Great performance
- Rich interaction models
- Extensive examples
- SVG and Canvas support

**Negative:**
- Steep learning curve
- Large API surface
- Complex integration with React
- Bundle size
- Imperative API in declarative framework

**Alternatives Considered:**
- Chart.js: Too limiting
- Victory: Less flexible
- Recharts: Not suitable for timelines
- Custom SVG: Too much work

---

## ADR-009: Material-UI Component Library

**Status**: Accepted  
**Date**: 2024-01-15  
**Deciders**: Development Team  

### Context
We need a comprehensive component library that provides consistent design, accessibility, and customization options.

### Decision
Use Material-UI (MUI) v5 as the primary component library.

### Consequences

**Positive:**
- Comprehensive component set
- Excellent accessibility
- Strong theming system
- Good documentation
- Active development
- TypeScript support

**Negative:**
- Large bundle size
- Material Design opinions
- CSS-in-JS performance
- Learning curve for customization
- Potential over-engineering

**Alternatives Considered:**
- Ant Design: Different design language
- Chakra UI: Smaller ecosystem
- Tailwind: Just CSS, no components
- Custom: Too time-consuming

---

## ADR-010: No Build Tool (Direct Browser Execution)

**Status**: Accepted (Revised)  
**Date**: 2024-01-16  
**Deciders**: Development Team  
**Supersedes**: Vite decision

### Context
The requirement is to avoid any build process entirely, allowing the application to run directly by opening HTML files in a browser.

### Decision
Use no build tool. Rely on native ES modules and CDN-hosted libraries.

### Consequences

**Positive:**
- Zero configuration or maintenance
- Instant start - just open HTML
- No build times ever
- Simpler debugging
- No version conflicts
- Easy deployment
- Lower learning curve

**Negative:**
- No minification or bundling
- No tree shaking
- Slower initial load (multiple requests)
- No TypeScript compilation
- Manual dependency management
- No hot module replacement

**Alternatives Considered:**
- Vite: Requires build step
- Webpack: Too complex
- Parcel: Still needs building
- ES-Dev-Server: Still a dev dependency

---

## ADR-011: JSON + Markdown Data Format

**Status**: Accepted  
**Date**: 2024-01-15  
**Deciders**: Development Team  

### Context
We need a data format that is human-readable, git-friendly, and supports both structured data and long-form content.

### Decision
Use JSON for structured data and Markdown for narrative content, stored as separate files.

### Consequences

**Positive:**
- Human readable/editable
- Git diff friendly
- Clear separation of concerns
- Standard formats
- Easy to parse
- Portable data

**Negative:**
- Multiple files per entity
- Need to sync changes
- No built-in relationships
- Manual ID management
- Potential inconsistencies

**Alternatives Considered:**
- Single JSON with embedded MD: Poor git diffs
- YAML: Less universal than JSON
- SQLite: Not human readable
- XML: Too verbose

---

## ADR-012: Event-Driven Architecture

**Status**: Accepted  
**Date**: 2024-01-15  
**Deciders**: Development Team  

### Context
Different parts of the application need to react to changes in data without tight coupling between components.

### Decision
Implement an event-driven architecture with a central event bus for cross-component communication.

### Consequences

**Positive:**
- Loose coupling
- Easy to add new features
- Clear data flow
- Testable components
- Pluggable architecture
- Async operations

**Negative:**
- Event chain complexity
- Debugging challenges
- Potential memory leaks
- Learning curve
- Documentation needs

**Alternatives Considered:**
- Direct component communication: Too coupled
- Redux only: Not flexible enough
- RxJS: Too complex
- Callbacks: Callback hell

---

## ADR-013: Web Workers for Heavy Operations

**Status**: Accepted  
**Date**: 2024-01-15  
**Deciders**: Development Team  

### Context
Search indexing, file parsing, and export operations can block the UI thread, creating poor user experience.

### Decision
Use Web Workers for CPU-intensive operations like search indexing, validation, and export generation.

### Consequences

**Positive:**
- Non-blocking UI
- Better performance
- Parallel processing
- Responsive interface
- Can use full CPU

**Negative:**
- Complex data serialization
- No DOM access
- Debugging difficulties
- Browser inconsistencies
- Memory overhead

**Alternatives Considered:**
- Async/await only: Still blocks UI
- Server processing: Against architecture
- WASM: Too complex for now
- RequestIdleCallback: Not enough

---

## ADR-014: Modular Feature Architecture

**Status**: Accepted  
**Date**: 2024-01-15  
**Deciders**: Development Team  

### Context
The application has distinct feature areas (characters, timeline, screenplay) that should be maintainable independently.

### Decision
Organize code by feature modules with clear boundaries and interfaces.

### Consequences

**Positive:**
- Clear code organization
- Easy to find code
- Independent development
- Better code splitting
- Easier testing
- Pluggable features

**Negative:**
- Some code duplication
- Need clear interfaces
- Cross-feature complexity
- Import path length

**Alternatives Considered:**
- Layer architecture: Less intuitive
- Monolithic: Hard to maintain
- Micro-frontends: Too complex

---

## ADR-015: Git-Friendly File Structure

**Status**: Accepted  
**Date**: 2024-01-15  
**Deciders**: Development Team  

### Context
Users may want to version control their story data using Git, requiring a file structure that produces meaningful diffs.

### Decision
Design the data file structure to be Git-friendly with one concept per file and human-readable formats.

### Consequences

**Positive:**
- Clear git history
- Easy collaboration
- Meaningful diffs
- Selective commits
- Conflict resolution
- Backup strategy

**Negative:**
- Many small files
- Directory traversal cost
- Need unique IDs
- File system limits
- Sync complexity

**Alternatives Considered:**
- Single database file: No meaningful diffs
- Binary format: Not readable
- Compressed: No diffs
- Memory only: No persistence

---

## Future ADRs to Consider

1. **ADR-016**: Plugin Architecture Design
2. **ADR-017**: Real-time Collaboration Protocol
3. **ADR-018**: Mobile Application Strategy
4. **ADR-019**: AI Integration Approach
5. **ADR-020**: Cloud Sync Architecture
6. **ADR-021**: Localization Strategy
7. **ADR-022**: Performance Monitoring
8. **ADR-023**: Error Reporting System
9. **ADR-024**: Authentication Method
10. **ADR-025**: Data Migration Strategy

## ADR Template for Future Decisions

```markdown
## ADR-XXX: [Title]

**Status**: [Proposed | Accepted | Deprecated | Superseded]  
**Date**: YYYY-MM-DD  
**Deciders**: [List of people involved]  
**Technical Story**: [Ticket/issue number]  

### Context
[Describe the forces at play, including technological, political, social, and project local. These forces are probably in tension and should be called out as such.]

### Decision
[Describe the decision and the reasoning behind it.]

### Consequences

**Positive:**
- [List positive consequences]

**Negative:**
- [List negative consequences]

**Alternatives Considered:**
- [Alternative 1]: [Why not chosen]
- [Alternative 2]: [Why not chosen]
```