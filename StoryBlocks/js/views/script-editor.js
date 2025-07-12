// Script Editor View - Fountain Format Screenplay Editor
class ScriptEditorView {
    constructor(app) {
        this.app = app;
        this.state = app.state;
        this.events = app.events;
        this.scriptId = null;
        this.currentScript = null;
        this.editor = null;
        this.autoSaveTimer = null;
        this.lastSaved = null;
    }

    render(scriptId) {
        this.scriptId = scriptId;
        this.currentScript = this.getScript(scriptId);
        
        if (!this.currentScript) {
            return this.renderNotFound();
        }

        return `
            <div class="script-editor-view" style="height: 100vh; display: flex; flex-direction: column;">
                <div class="editor-header" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--surface); border-bottom: 1px solid var(--border);">
                    <div class="header-left" style="display: flex; align-items: center; gap: 1rem;">
                        <button class="btn btn-secondary" onclick="window.app.router.navigate('scripts')" style="padding: 0.5rem;">
                            ← Back to Scripts
                        </button>
                        <div>
                            <h1 style="margin: 0; font-size: 1.25rem;">${this.currentScript.title}</h1>
                            <div style="display: flex; align-items: center; gap: 1rem; margin-top: 0.25rem; font-size: 0.875rem; color: var(--text-secondary);">
                                <span>🎬 ${this.getScriptTypeLabel(this.currentScript.type)}</span>
                                <span id="save-status">Saved</span>
                                <span id="page-count">${this.calculatePageCount()} pages</span>
                            </div>
                        </div>
                    </div>
                    <div class="header-actions" style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-secondary" onclick="window.app.scriptEditorView.showHelp()" title="Fountain Format Help">
                            ❓ Help
                        </button>
                        <button class="btn btn-secondary" onclick="window.app.scriptEditorView.togglePreview()" id="preview-toggle">
                            👁️ Preview
                        </button>
                        <button class="btn btn-secondary" onclick="window.app.scriptEditorView.showExportDialog()">
                            📤 Export
                        </button>
                        <button class="btn btn-primary" onclick="window.app.scriptEditorView.saveScript()">
                            💾 Save
                        </button>
                    </div>
                </div>

                <div class="editor-toolbar" style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 1rem; background: var(--background); border-bottom: 1px solid var(--border);">
                    <div class="toolbar-left" style="display: flex; gap: 1rem;">
                        <button class="btn btn-sm" onclick="window.app.scriptEditorView.insertElement('character')" title="Insert Character">
                            👤 Character
                        </button>
                        <button class="btn btn-sm" onclick="window.app.scriptEditorView.insertElement('action')" title="Insert Action">
                            🎭 Action
                        </button>
                        <button class="btn btn-sm" onclick="window.app.scriptEditorView.insertElement('dialogue')" title="Insert Dialogue">
                            💬 Dialogue
                        </button>
                        <button class="btn btn-sm" onclick="window.app.scriptEditorView.insertElement('parenthetical')" title="Insert Parenthetical">
                            📝 Parenthetical
                        </button>
                        <button class="btn btn-sm" onclick="window.app.scriptEditorView.insertElement('transition')" title="Insert Transition">
                            ➡️ Transition
                        </button>
                        <button class="btn btn-sm" onclick="window.app.scriptEditorView.insertElement('note')" title="Insert Note">
                            📝 Note
                        </button>
                        <button class="btn btn-sm" onclick="window.app.scriptEditorView.insertElement('section')" title="Insert Section">
                            📑 Section
                        </button>
                        <button class="btn btn-sm" onclick="window.app.scriptEditorView.insertElement('synopsis')" title="Insert Synopsis">
                            📋 Synopsis
                        </button>
                    </div>
                    <div class="toolbar-right" style="display: flex; gap: 0.5rem; align-items: center;">
                        <select id="scene-navigator" onchange="window.app.scriptEditorView.navigateToScene(this.value)" style="padding: 0.25rem 0.5rem; border: 1px solid var(--border); border-radius: 0.25rem;">
                            <option value="">Navigate to scene...</option>
                        </select>
                    </div>
                </div>

                <div class="editor-container" style="flex: 1; display: flex; overflow: hidden;">
                    <div class="editor-pane" id="editor-pane" style="flex: 1; display: flex; flex-direction: column;">
                        <div class="editor-tabs" style="display: flex; background: var(--surface); border-bottom: 1px solid var(--border);">
                            <button class="editor-tab active" data-tab="fountain" onclick="window.app.scriptEditorView.switchTab('fountain')" style="padding: 0.5rem 1rem; background: none; border: none; border-bottom: 2px solid var(--primary);">
                                📝 Fountain
                            </button>
                            <button class="editor-tab" data-tab="notes" onclick="window.app.scriptEditorView.switchTab('notes')" style="padding: 0.5rem 1rem; background: none; border: none; border-bottom: 2px solid transparent;">
                                📄 Notes
                            </button>
                        </div>
                        <div class="editor-content" style="flex: 1; position: relative;">
                            <div id="fountain-editor" class="tab-content active" style="height: 100%;">
                                <textarea id="script-textarea" style="
                                    width: 100%;
                                    height: 100%;
                                    padding: 2rem;
                                    border: none;
                                    outline: none;
                                    font-family: 'Courier New', monospace;
                                    font-size: 12pt;
                                    line-height: 1.2;
                                    background: white;
                                    color: black;
                                    resize: none;
                                " placeholder="Type your screenplay in Fountain format...

Advanced Fountain Examples:

# ACT I

= Opening sequence with our hero

/*
This is a note - won't be printed
*/

FADE IN:

EXT. MANSION - DAY [[BLUE]]

A grand Victorian mansion sits atop a hill.

JOHN SMITH (30s, rugged) walks up the front steps.

                    JOHN
          This is it. The place where it all 
          **began**.

                    MARY ^
          (interrupting)
          Are you sure?

>Centered text<

> FADE OUT">${this.currentScript.content || ''}</textarea>
                            </div>
                            <div id="notes-editor" class="tab-content" style="height: 100%; display: none;">
                                <textarea id="notes-textarea" style="
                                    width: 100%;
                                    height: 100%;
                                    padding: 2rem;
                                    border: none;
                                    outline: none;
                                    font-family: system-ui, -apple-system, sans-serif;
                                    font-size: 14px;
                                    line-height: 1.5;
                                    background: var(--surface);
                                    color: var(--text-primary);
                                    resize: none;
                                " placeholder="Add your script notes, character insights, plot points...">${this.currentScript.notes || ''}</textarea>
                            </div>
                        </div>
                    </div>

                    <div class="preview-pane" id="preview-pane" style="flex: 1; border-left: 1px solid var(--border); background: white; overflow-y: auto; display: none;">
                        <div class="preview-content" id="preview-content" style="padding: 3rem; max-width: 8.5in; margin: 0 auto; font-family: 'Courier New', monospace; font-size: 12pt; line-height: 1.2;">
                            <!-- Preview content will be generated here -->
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupEditor() {
        const textarea = document.getElementById('script-textarea');
        const notesTextarea = document.getElementById('notes-textarea');
        
        if (textarea) {
            // Auto-save functionality
            textarea.addEventListener('input', () => {
                this.markAsUnsaved();
                this.scheduleAutoSave();
                this.updatePreview();
                this.updatePageCount();
                this.updateSceneNavigator();
            });

            // Auto-completion and formatting
            textarea.addEventListener('keydown', (e) => this.handleKeydown(e));
        }

        if (notesTextarea) {
            notesTextarea.addEventListener('input', () => {
                this.markAsUnsaved();
                this.scheduleAutoSave();
            });
        }

        this.updatePreview();
        this.updatePageCount();
        this.updateSceneNavigator();
    }

    handleKeydown(e) {
        const textarea = e.target;
        const cursorPos = textarea.selectionStart;
        const text = textarea.value;
        const currentLine = this.getCurrentLine(text, cursorPos);

        // Auto-formatting based on Fountain rules
        if (e.key === 'Enter') {
            const trimmedLine = currentLine.trim();
            
            // Character name formatting
            if (trimmedLine.toUpperCase() === trimmedLine && trimmedLine.length > 0 && !trimmedLine.includes('.') && !trimmedLine.includes('-')) {
                setTimeout(() => {
                    const newPos = textarea.selectionStart;
                    const beforeCursor = textarea.value.substring(0, newPos);
                    const afterCursor = textarea.value.substring(newPos);
                    
                    // Add dialogue indent
                    textarea.value = beforeCursor + '                    ' + afterCursor;
                    textarea.selectionStart = textarea.selectionEnd = newPos + 20;
                }, 10);
            }
        }

        // Tab for character auto-complete or force character cue
        if (e.key === 'Tab') {
            e.preventDefault();
            
            // If line is empty, force character cue
            if (currentLine.trim() === '') {
                const beforeCursor = textarea.value.substring(0, cursorPos);
                const afterCursor = textarea.value.substring(cursorPos);
                textarea.value = beforeCursor + 'CHARACTER NAME\n                    ' + afterCursor;
                textarea.selectionStart = textarea.selectionEnd = cursorPos + 'CHARACTER NAME'.length;
            } else {
                this.showCharacterSuggestions(textarea, cursorPos);
            }
        }
    }

    showCharacterSuggestions(textarea, cursorPos) {
        const text = textarea.value;
        const currentLine = this.getCurrentLine(text, cursorPos);
        const characters = this.getCharacterList();
        
        // Simple character name completion
        if (characters.length > 0) {
            const match = characters.find(char => 
                char.name.toUpperCase().startsWith(currentLine.trim().toUpperCase())
            );
            
            if (match) {
                const lineStart = this.getLineStart(text, cursorPos);
                const lineEnd = this.getLineEnd(text, cursorPos);
                
                textarea.value = text.substring(0, lineStart) + 
                    match.name.toUpperCase() + 
                    text.substring(lineEnd);
                    
                textarea.selectionStart = textarea.selectionEnd = lineStart + match.name.length;
            }
        }
    }

    getCurrentLine(text, cursorPos) {
        const lineStart = this.getLineStart(text, cursorPos);
        const lineEnd = this.getLineEnd(text, cursorPos);
        return text.substring(lineStart, lineEnd);
    }

    getLineStart(text, cursorPos) {
        let pos = cursorPos;
        while (pos > 0 && text[pos - 1] !== '\n') {
            pos--;
        }
        return pos;
    }

    getLineEnd(text, cursorPos) {
        let pos = cursorPos;
        while (pos < text.length && text[pos] !== '\n') {
            pos++;
        }
        return pos;
    }

    getCharacterList() {
        const allCharacters = Array.from(this.state.state.characters.values());
        const activeProduction = this.state.getActiveProduction();
        
        if (activeProduction) {
            return allCharacters.filter(char => 
                char.productionIds && char.productionIds.includes(activeProduction.id)
            );
        }
        
        return allCharacters;
    }

    insertElement(elementType) {
        const textarea = document.getElementById('script-textarea');
        if (!textarea) return;

        const cursorPos = textarea.selectionStart;
        const text = textarea.value;
        let insertText = '';

        switch (elementType) {
            case 'character':
                insertText = '\n\nCHARACTER NAME\n                    ';
                break;
            case 'action':
                insertText = '\n\nAction description here.\n';
                break;
            case 'dialogue':
                insertText = '\n                    Dialogue goes here.\n';
                break;
            case 'parenthetical':
                insertText = '\n                         (parenthetical)\n';
                break;
            case 'transition':
                insertText = '\n\nFADE TO:\n';
                break;
            case 'note':
                insertText = '\n\n/*\nThis is a note - won\'t be printed\n*/\n';
                break;
            case 'section':
                insertText = '\n\n# SECTION TITLE\n';
                break;
            case 'synopsis':
                insertText = '\n\n= Synopsis line describing this scene\n';
                break;
        }

        textarea.value = text.substring(0, cursorPos) + insertText + text.substring(cursorPos);
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = cursorPos + insertText.length;
        
        this.markAsUnsaved();
        this.scheduleAutoSave();
    }

    switchTab(tabName) {
        document.querySelectorAll('.editor-tab').forEach(tab => {
            tab.classList.remove('active');
            tab.style.borderBottom = '2px solid transparent';
        });
        
        document.querySelectorAll('.tab-content').forEach(content => {
            content.style.display = 'none';
        });

        const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
        const activeContent = document.getElementById(`${tabName}-editor`);
        
        if (activeTab) {
            activeTab.classList.add('active');
            activeTab.style.borderBottom = '2px solid var(--primary)';
        }
        
        if (activeContent) {
            activeContent.style.display = 'block';
        }
    }

    togglePreview() {
        const previewPane = document.getElementById('preview-pane');
        const editorPane = document.getElementById('editor-pane');
        const toggleButton = document.getElementById('preview-toggle');
        
        if (previewPane.style.display === 'none') {
            previewPane.style.display = 'block';
            editorPane.style.flex = '1';
            toggleButton.textContent = '📝 Editor';
            this.updatePreview();
        } else {
            previewPane.style.display = 'none';
            editorPane.style.flex = '1';
            toggleButton.textContent = '👁️ Preview';
        }
    }

    updatePreview() {
        const textarea = document.getElementById('script-textarea');
        const previewContent = document.getElementById('preview-content');
        
        if (!textarea || !previewContent) return;
        
        const fountainText = textarea.value;
        const htmlPreview = this.fountainToHTML(fountainText);
        previewContent.innerHTML = htmlPreview;
    }

    fountainToHTML(fountainText) {
        let html = '';
        const lines = fountainText.split('\n');
        let inNote = false;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();
            
            // Handle multi-line notes
            if (trimmed.startsWith('/*')) {
                inNote = true;
                if (trimmed.endsWith('*/')) {
                    inNote = false;
                }
                continue; // Don't render notes
            }
            if (inNote) {
                if (trimmed.endsWith('*/')) {
                    inNote = false;
                }
                continue; // Don't render notes
            }
            
            if (trimmed === '') {
                html += '<br>';
                continue;
            }
            
            // Sections (# TITLE)
            if (trimmed.startsWith('#')) {
                const sectionText = trimmed.substring(1).trim();
                html += `<div style="font-weight: bold; font-size: 1.2em; margin: 2em 0 1em 0; color: #333; border-bottom: 2px solid #ccc; padding-bottom: 0.5em;">${sectionText}</div>`;
            }
            // Synopsis (= text)
            else if (trimmed.startsWith('=')) {
                const synopsisText = trimmed.substring(1).trim();
                html += `<div style="font-style: italic; color: #666; margin: 1em 0; padding: 0.5em; background: #f9f9f9; border-left: 4px solid #ccc;">${synopsisText}</div>`;
            }
            // Scene headers with colors
            else if (trimmed.match(/^(INT\.|EXT\.|EST\.)/) || trimmed.match(/^[A-Z\s]+\s-\s(DAY|NIGHT|MORNING|EVENING|CONTINUOUS)/)) {
                let sceneText = trimmed;
                let sceneColor = '';
                
                // Extract scene color [[COLOR]]
                const colorMatch = trimmed.match(/\[\[(.+?)\]\]/);
                if (colorMatch) {
                    sceneColor = colorMatch[1].toLowerCase();
                    sceneText = trimmed.replace(/\[\[.+?\]\]/, '').trim();
                }
                
                const colorStyle = sceneColor ? `background: ${sceneColor}; color: white; padding: 0.25em 0.5em; border-radius: 0.25em;` : '';
                html += `<div style="font-weight: bold; margin: 1.5em 0 1em 0; text-decoration: underline; ${colorStyle}">${sceneText}</div>`;
            }
            // Centered text (>text<)
            else if (trimmed.startsWith('>') && trimmed.endsWith('<')) {
                const centeredText = trimmed.slice(1, -1);
                html += `<div style="text-align: center; margin: 1em 0; font-weight: bold;">${centeredText}</div>`;
            }
            // Forced transitions (> TRANSITION)
            else if (trimmed.startsWith('> ')) {
                const transitionText = trimmed.substring(2);
                html += `<div style="text-align: right; margin: 1em 0; font-weight: bold;">${transitionText}</div>`;
            }
            // Dual dialogue (CHARACTER ^)
            else if (trimmed.endsWith(' ^')) {
                const characterName = trimmed.slice(0, -2);
                html += `<div style="text-align: center; margin: 1em 0 0.5em 0; font-weight: bold; float: right; width: 45%;">${characterName}</div>`;
            }
            // Character names (all caps, centered)
            else if (trimmed === trimmed.toUpperCase() && trimmed.length > 0 && !trimmed.includes('.') && !line.startsWith('                    ') && !trimmed.includes(':')) {
                html += `<div style="text-align: center; margin: 1em 0 0.5em 0; font-weight: bold;">${trimmed}</div>`;
            }
            // Dialogue (indented)
            else if (line.startsWith('                    ')) {
                let dialogueText = trimmed;
                
                // Handle text formatting
                dialogueText = dialogueText.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'); // **bold**
                dialogueText = dialogueText.replace(/\*(.+?)\*/g, '<em>$1</em>'); // *italic*
                dialogueText = dialogueText.replace(/_(.+?)_/g, '<u>$1</u>'); // _underline_
                
                html += `<div style="margin-left: 2.5in; margin-right: 1in; margin-bottom: 0.5em;">${dialogueText}</div>`;
            }
            // Parentheticals
            else if (trimmed.startsWith('(') && trimmed.endsWith(')')) {
                html += `<div style="margin-left: 3in; margin-bottom: 0.5em; font-style: italic;">${trimmed}</div>`;
            }
            // Lyrics (~text)
            else if (trimmed.startsWith('~')) {
                const lyricText = trimmed.substring(1);
                html += `<div style="margin: 0.5em 0; font-style: italic; margin-left: 1em;">${lyricText}</div>`;
            }
            // Transitions (right aligned, all caps with colon)
            else if (trimmed === trimmed.toUpperCase() && trimmed.endsWith(':')) {
                html += `<div style="text-align: right; margin: 1em 0; font-weight: bold;">${trimmed}</div>`;
            }
            // Action/description with text formatting
            else {
                let actionText = trimmed;
                
                // Handle text formatting
                actionText = actionText.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'); // **bold**
                actionText = actionText.replace(/\*(.+?)\*/g, '<em>$1</em>'); // *italic*
                actionText = actionText.replace(/_(.+?)_/g, '<u>$1</u>'); // _underline_
                
                html += `<div style="margin: 0.5em 0;">${actionText}</div>`;
            }
        }
        
        return html;
    }

    updatePageCount() {
        const textarea = document.getElementById('script-textarea');
        if (!textarea) return;
        
        const pageCount = this.calculatePageCount();
        const pageCountElement = document.getElementById('page-count');
        if (pageCountElement) {
            pageCountElement.textContent = `${pageCount} pages`;
        }
    }

    calculatePageCount() {
        const textarea = document.getElementById('script-textarea');
        if (!textarea) return 0;
        
        const text = textarea.value;
        const lines = text.split('\n').length;
        
        // Rough estimate: 55 lines per page for screenplay format
        return Math.max(1, Math.ceil(lines / 55));
    }

    updateSceneNavigator() {
        const textarea = document.getElementById('script-textarea');
        const navigator = document.getElementById('scene-navigator');
        
        if (!textarea || !navigator) return;
        
        const scenes = this.extractScenes(textarea.value);
        
        navigator.innerHTML = '<option value="">Navigate to scene...</option>';
        scenes.forEach((scene, index) => {
            const option = document.createElement('option');
            option.value = scene.line;
            option.textContent = `${index + 1}. ${scene.header}`;
            navigator.appendChild(option);
        });
    }

    extractScenes(text) {
        const lines = text.split('\n');
        const scenes = [];
        
        lines.forEach((line, index) => {
            const trimmed = line.trim();
            
            // Sections
            if (trimmed.startsWith('#')) {
                scenes.push({
                    header: '📑 ' + trimmed.substring(1).trim(),
                    line: index
                });
            }
            // Scene headers
            else if (trimmed.match(/^(INT\.|EXT\.|EST\.)/) || trimmed.match(/^[A-Z\s]+\s-\s(DAY|NIGHT|MORNING|EVENING|CONTINUOUS)/)) {
                // Remove color annotations for navigation
                const cleanHeader = trimmed.replace(/\[\[.+?\]\]/, '').trim();
                scenes.push({
                    header: cleanHeader,
                    line: index
                });
            }
        });
        
        return scenes;
    }

    navigateToScene(lineNumber) {
        if (!lineNumber) return;
        
        const textarea = document.getElementById('script-textarea');
        if (!textarea) return;
        
        const lines = textarea.value.split('\n');
        let charPosition = 0;
        
        for (let i = 0; i < parseInt(lineNumber); i++) {
            charPosition += lines[i].length + 1; // +1 for newline
        }
        
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = charPosition;
        textarea.scrollTop = textarea.scrollHeight * (parseInt(lineNumber) / lines.length);
    }

    markAsUnsaved() {
        const saveStatus = document.getElementById('save-status');
        if (saveStatus) {
            saveStatus.textContent = 'Unsaved changes';
            saveStatus.style.color = 'var(--warning)';
        }
    }

    markAsSaved() {
        const saveStatus = document.getElementById('save-status');
        if (saveStatus) {
            saveStatus.textContent = 'Saved';
            saveStatus.style.color = 'var(--text-secondary)';
        }
        this.lastSaved = new Date();
    }

    scheduleAutoSave() {
        if (this.autoSaveTimer) {
            clearTimeout(this.autoSaveTimer);
        }
        
        this.autoSaveTimer = setTimeout(() => {
            this.saveScript(true);
        }, 5000); // Auto-save after 5 seconds of inactivity
    }

    async saveScript(isAutoSave = false) {
        const textarea = document.getElementById('script-textarea');
        const notesTextarea = document.getElementById('notes-textarea');
        
        if (!textarea || !this.currentScript) return;
        
        this.currentScript.content = textarea.value;
        this.currentScript.notes = notesTextarea ? notesTextarea.value : '';
        this.currentScript.lastModified = new Date().toISOString();
        this.currentScript.pageCount = this.calculatePageCount();
        
        // Update in state
        this.state.state.scripts.set(this.currentScript.id, this.currentScript);
        
        // Save to .fountain file if we have directory access
        if (this.app.workspaceDirectoryHandle) {
            try {
                await this.saveFountainFile();
            } catch (error) {
                console.error('Error saving fountain file:', error);
            }
        }
        
        // Trigger events
        this.events.emit('scriptSaved', this.currentScript);
        this.events.emit('dataChanged');
        
        this.markAsSaved();
        
        console.log(isAutoSave ? 'Auto-saved script:' : 'Saved script:', this.currentScript.title);
    }
    
    async saveFountainFile() {
        if (!this.app.workspaceDirectoryHandle || !this.currentScript) return;
        
        try {
            // Get or create scripts folder
            const scriptsDir = await this.app.workspaceDirectoryHandle.getDirectoryHandle('scripts', { create: true });
            
            // Create filename from script title
            const fileName = `${this.currentScript.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.fountain`;
            
            // Get file handle
            const fileHandle = await scriptsDir.getFileHandle(fileName, { create: true });
            
            // Create fountain content with metadata
            let fountainContent = '';
            
            // Add metadata header if not already present
            if (!this.currentScript.content.includes('Title:')) {
                fountainContent = `Title: ${this.currentScript.title}\n`;
                fountainContent += `Credit: ${this.currentScript.credit || 'Written by'}\n`;
                fountainContent += `Author: ${this.currentScript.author || ''}\n`;
                fountainContent += `Draft date: ${new Date().toLocaleDateString()}\n`;
                fountainContent += `Contact:\n    \n\n`;
            }
            
            fountainContent += this.currentScript.content;
            
            // Write file
            const writable = await fileHandle.createWritable();
            await writable.write(fountainContent);
            await writable.close();
            
            // Store file reference
            this.currentScript.fileName = fileName;
            
        } catch (error) {
            console.error('Error saving fountain file:', error);
            throw error;
        }
    }

    showHelp() {
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
                max-width: 800px;
                max-height: 80vh;
                overflow-y: auto;
            ">
                <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <h2 style="margin: 0; color: var(--primary);">❓ Fountain Format Help</h2>
                    <button onclick="this.closest('.modal-overlay').remove()" style="
                        background: none;
                        border: none;
                        font-size: 1.5rem;
                        cursor: pointer;
                        color: var(--text-secondary);
                    ">×</button>
                </div>
                
                <div class="help-content">
                    <div style="margin-bottom: 2rem;">
                        <h3 style="color: var(--primary); margin-bottom: 1rem;">📝 Quick Reference</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem;">
                            <div style="background: var(--surface); padding: 1rem; border-radius: 0.375rem;">
                                <h4 style="margin: 0 0 0.5rem 0;">Scene Headers</h4>
                                <code style="background: var(--background); padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.875rem;">INT. ROOM - DAY</code><br>
                                <code style="background: var(--background); padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.875rem;">EXT. PARK - NIGHT [[BLUE]]</code>
                            </div>
                            <div style="background: var(--surface); padding: 1rem; border-radius: 0.375rem;">
                                <h4 style="margin: 0 0 0.5rem 0;">Characters & Dialogue</h4>
                                <code style="background: var(--background); padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.875rem;">CHARACTER NAME</code><br>
                                <code style="background: var(--background); padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.875rem;">    Dialogue goes here</code><br>
                                <code style="background: var(--background); padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.875rem;">CHARACTER ^</code> (dual)
                            </div>
                            <div style="background: var(--surface); padding: 1rem; border-radius: 0.375rem;">
                                <h4 style="margin: 0 0 0.5rem 0;">Structure</h4>
                                <code style="background: var(--background); padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.875rem;"># SECTION TITLE</code><br>
                                <code style="background: var(--background); padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.875rem;">= Synopsis line</code><br>
                                <code style="background: var(--background); padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.875rem;">/* Note */</code>
                            </div>
                            <div style="background: var(--surface); padding: 1rem; border-radius: 0.375rem;">
                                <h4 style="margin: 0 0 0.5rem 0;">Formatting</h4>
                                <code style="background: var(--background); padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.875rem;">**bold**</code><br>
                                <code style="background: var(--background); padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.875rem;">*italic*</code><br>
                                <code style="background: var(--background); padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.875rem;">_underline_</code>
                            </div>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 2rem;">
                        <h3 style="color: var(--primary); margin-bottom: 1rem;">🎯 Pro Tips</h3>
                        <ul style="margin: 0; padding-left: 1.5rem;">
                            <li style="margin-bottom: 0.5rem;"><strong>Tab Key:</strong> Press Tab on empty line to insert character name</li>
                            <li style="margin-bottom: 0.5rem;"><strong>Auto-format:</strong> Just type naturally - formatting happens automatically</li>
                            <li style="margin-bottom: 0.5rem;"><strong>Scene Colors:</strong> Add [[COLOR]] after scene headers</li>
                            <li style="margin-bottom: 0.5rem;"><strong>Dual Dialogue:</strong> Add ^ after character name for side-by-side</li>
                            <li style="margin-bottom: 0.5rem;"><strong>Centered Text:</strong> Wrap with >text<</li>
                            <li style="margin-bottom: 0.5rem;"><strong>Notes:</strong> Use /* */ for production notes that won't print</li>
                        </ul>
                    </div>
                    
                    <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 2rem;">
                        <button onclick="window.app.scriptEditorView.loadTutorialScript(); this.closest('.modal-overlay').remove();" class="btn btn-primary">
                            📚 Load Tutorial Script
                        </button>
                        <button onclick="this.closest('.modal-overlay').remove()" class="btn btn-secondary">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    showExportDialog() {
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
                max-width: 400px;
            ">
                <h2 style="margin: 0 0 1rem 0; color: var(--primary);">📤 Export Script</h2>
                
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Export Format</label>
                    <select id="export-format" style="
                        width: 100%;
                        padding: 0.75rem;
                        border: 1px solid var(--border);
                        border-radius: 0.375rem;
                        background: var(--surface);
                    ">
                        <option value="fountain">Fountain (.fountain)</option>
                        <option value="pdf">PDF (Formatted Screenplay)</option>
                        <option value="txt">Plain Text (.txt)</option>
                        <option value="html">HTML Preview</option>
                    </select>
                </div>
                
                <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                    <button onclick="this.closest('.modal-overlay').remove()" class="btn btn-secondary">
                        Cancel
                    </button>
                    <button onclick="window.app.scriptEditorView.exportScript(document.getElementById('export-format').value); this.closest('.modal-overlay').remove();" class="btn btn-primary">
                        Export
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    exportScript(format) {
        const textarea = document.getElementById('script-textarea');
        if (!textarea || !this.currentScript) return;
        
        const content = textarea.value;
        const filename = this.currentScript.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        
        let exportContent = '';
        let mimeType = '';
        let fileExtension = '';
        
        switch (format) {
            case 'fountain':
                exportContent = content;
                mimeType = 'text/plain';
                fileExtension = 'fountain';
                break;
            case 'txt':
                exportContent = content;
                mimeType = 'text/plain';
                fileExtension = 'txt';
                break;
            case 'html':
                exportContent = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>${this.currentScript.title}</title>
                        <style>
                            body { font-family: 'Courier New', monospace; font-size: 12pt; line-height: 1.2; margin: 3rem; background: white; color: black; }
                            .page { max-width: 8.5in; margin: 0 auto; }
                        </style>
                    </head>
                    <body>
                        <div class="page">
                            <h1>${this.currentScript.title}</h1>
                            ${this.fountainToHTML(content)}
                        </div>
                    </body>
                    </html>
                `;
                mimeType = 'text/html';
                fileExtension = 'html';
                break;
            case 'pdf':
                alert('PDF export requires a server-side conversion. For now, export as HTML and print to PDF.');
                return;
        }
        
        // Create and download file
        const blob = new Blob([exportContent], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.${fileExtension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log(`Exported script as ${format}:`, filename);
    }

    getScript(scriptId) {
        if (scriptId === 'new') {
            return this.createNewScript();
        }
        
        return this.state.state.scripts.get(scriptId);
    }

    loadTutorialScript() {
        const tutorialContent = `Title: StoryBlocks Fountain Tutorial
Credit: Based on Beat iOS Tutorial
Author: StoryBlocks Team
Draft date: Version 1.0
Contact:
support@storyblocks.app


INT. SCHOOL ROOM - DAY

Is this your first time using StoryBlocks? This file is a playground for you to experiment with Fountain formatting. For more features, check out our comprehensive screenplay editor.

In StoryBlocks, you don't need to press any special keys to write dialogue or a scene header. Just type "int. school" or "ext. park" on a new line and it will become a scene header.

Try it out yourself!


EXT. PARK - DAY

The same is true with dialogue. Just type in CHARACTER NAME (all caps) and then follow it with a dialogue block (or parenthetical) on the next line. It will become dialogue. 

Try it out!

CHARACTER
Hello. This is your first dialogue block.

CHARACTER 2
(gently nodding their head)
Well done.

You can also press Tab to force a character cue and not worry about writing in all caps.

After one empty line break the format will change back to action. StoryBlocks automatically formats elements as you type.

You can also use transitions just by typing out something in all-caps and ending it with a colon, like this:

CUT TO:

Well, that was easy. You should be able to write a full screenplay by using those elements. 

Now, if you dare, let's get more technical!


/*

This is a note. It won't be printed or exported, don't worry. This way, you can add longer comments and omit scenes.

Oh, and check out the live preview by clicking the Preview button!

The title page info you see at the beginning of this file will be used when exporting your script.

*/


# This is a new section

= This is a synopsis line. Let's get a bit more technical.

INT. TUNNEL - NIGHT 

You can use sections and synopses (as above) to help structure your story. They won't be printed out, don't worry.

Take a look at the scene navigator dropdown to see how the structure is laid out!


INT./EXT. BEACH HOUSE - NIGHT

[[Stylizing your script. Notes can provide scene context and descriptions.]]

Text formatting can be done with simple markup. Because **StoryBlocks** uses Fountain markup language, some characters will show up on screen, but *they won't print out*.

Basically, text formatting works so that anything inside dual asterisks is **bolded** and single asterisks make it *italic*. You can also _underline_ stuff using underscores.

Text can be centered by surrounding it with > and <

>Centered text<

Transitions can be forced using single >

> Forced, surprisingly slow transition...


EXT. STREET - NIGHT [[BLUE]]

= Dual dialogue & other special elements

You can set the color for your scene just by typing it out as above [[COLOR]].

Dual dialogue can be written by adding a ^ symbol after a character name.

CHARACTER
Hello, have you heard about StoryBlocks?

CHARACTER 2 ^
(interrupting)
Leave me alone, I'm writing!


INT. NIGHT CLUB - NIGHT [[RED]]

Here's some lyrics:

~"If you come to my house, friend
~bring me a lamp and a window I can look through
~at the crowd in the happy alley."

That's about it. Edit this file and try out stuff. If you ever mess something up, you can usually reformat it by just removing something and adding it back.


EXT. UNIVERSITY CLASSROOM - MORNING

[[marker: You can also add markers to indicate parts that need work or attention.]]

[[marker pink: This is a pink marker for important notes!]]

StoryBlocks supports the full Fountain markup language. For more information about Fountain, visit https://www.fountain.io/

**Bold text**, *italic text*, and _underlined text_ all work in action lines and dialogue.

Try experimenting with different elements:
- Scene headers with colors
- Character names with ^ for dual dialogue
- Centered text with > and <
- Forced transitions with >
- Notes with /* */
- Sections with #
- Synopsis lines with =

> FADE OUT

/*

This tutorial covers the basic Fountain formatting supported in StoryBlocks. 

Advanced features:
- Real-time preview
- Character auto-completion
- Scene navigation
- Export to multiple formats
- Auto-save functionality
- Production integration

Start writing your screenplay and explore all the features!

*/`;

        // Update current script with tutorial content
        if (this.currentScript) {
            this.currentScript.content = tutorialContent;
            this.currentScript.title = 'Fountain Tutorial';
            this.currentScript.lastModified = new Date().toISOString();
            
            // Update the textarea
            const textarea = document.getElementById('script-textarea');
            if (textarea) {
                textarea.value = tutorialContent;
            }
            
            // Update state
            this.state.state.scripts.set(this.currentScript.id, this.currentScript);
            this.events.emit('scriptUpdated', this.currentScript);
            this.events.emit('dataChanged');
            
            // Update UI
            this.updatePreview();
            this.updatePageCount();
            this.updateSceneNavigator();
            this.markAsUnsaved();
            
            console.log('Loaded tutorial script');
        }
    }

    createNewScript() {
        const activeProduction = this.state.getActiveProduction();
        
        const newScript = {
            id: 'script_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            title: 'Untitled Script',
            type: activeProduction ? activeProduction.type : 'feature',
            content: '',
            notes: '',
            productionId: activeProduction ? activeProduction.id : null,
            status: 'draft',
            pageCount: 1,
            created: new Date().toISOString(),
            lastModified: new Date().toISOString()
        };
        
        // Add to state
        this.state.state.scripts.set(newScript.id, newScript);
        
        // Update URL
        window.history.replaceState(null, '', `#/scripts/${newScript.id}`);
        this.scriptId = newScript.id;
        
        return newScript;
    }

    getScriptTypeLabel(type) {
        const labels = {
            'feature': 'Feature Film',
            'short': 'Short Film',
            'tv_episode': 'TV Episode',
            'tv_pilot': 'TV Pilot',
            'web_series': 'Web Series',
            'stage_play': 'Stage Play',
            'audio_drama': 'Audio Drama'
        };
        return labels[type] || type;
    }

    renderNotFound() {
        return `
            <div class="script-not-found" style="text-align: center; padding: 3rem;">
                <h1>Script Not Found</h1>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">The script you're looking for doesn't exist.</p>
                <button class="btn btn-primary" onclick="window.app.router.navigate('scripts')">
                    Back to Scripts
                </button>
            </div>
        `;
    }

    // Lifecycle methods
    onMount() {
        setTimeout(() => this.setupEditor(), 100);
    }

    onUnmount() {
        if (this.autoSaveTimer) {
            clearTimeout(this.autoSaveTimer);
        }
        
        // Save before leaving
        this.saveScript();
    }
}