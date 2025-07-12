// Simple Persistence Manager
class PersistenceManager {
    constructor(state) {
        this.state = state;
        this.autoSaveInterval = 30000; // 30 seconds
        this.autoSaveTimer = null;
        this.isLoading = false;
        this.isSaving = false;
        
        // Set up auto-save
        this.startAutoSave();
        
        // Listen for state changes
        this.state.on('data-changed', () => {
            if (!this.isLoading) {
                this.scheduleSave();
            }
        });
    }
    
    startAutoSave() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
        }
        
        this.autoSaveTimer = setInterval(() => {
            this.saveToLocalStorage();
        }, this.autoSaveInterval);
    }
    
    stopAutoSave() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
            this.autoSaveTimer = null;
        }
    }
    
    scheduleSave() {
        // Debounce saves - only save 1 second after last change
        if (this.saveTimer) {
            clearTimeout(this.saveTimer);
        }
        
        this.saveTimer = setTimeout(() => {
            this.saveToLocalStorage();
        }, 1000);
    }
    
    saveToLocalStorage() {
        if (this.isSaving) return;
        
        try {
            this.isSaving = true;
            const data = this.state.exportState();
            const serializedData = JSON.stringify(data);
            
            // Save to localStorage
            localStorage.setItem('storyblocks-data', serializedData);
            localStorage.setItem('storyblocks-last-save', new Date().toISOString());
            
            console.log('[Persistence] Data saved to localStorage');
            this.showSaveIndicator();
            
        } catch (error) {
            console.error('[Persistence] Failed to save:', error);
            this.showSaveError(error);
        } finally {
            this.isSaving = false;
        }
    }
    
    loadFromLocalStorage() {
        try {
            this.isLoading = true;
            const serializedData = localStorage.getItem('storyblocks-data');
            
            if (serializedData) {
                const data = JSON.parse(serializedData);
                this.state.importState(data);
                
                const lastSave = localStorage.getItem('storyblocks-last-save');
                console.log('[Persistence] Data loaded from localStorage. Last save:', lastSave);
                
                return true;
            } else {
                console.log('[Persistence] No saved data found');
                return false;
            }
        } catch (error) {
            console.error('[Persistence] Failed to load:', error);
            return false;
        } finally {
            this.isLoading = false;
        }
    }
    
    exportToFile() {
        try {
            const data = this.state.exportState();
            const serializedData = JSON.stringify(data, null, 2);
            
            // Create blob and download
            const blob = new Blob([serializedData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `storyblocks-${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            URL.revokeObjectURL(url);
            
            console.log('[Persistence] Data exported to file');
            this.showExportSuccess();
            
        } catch (error) {
            console.error('[Persistence] Failed to export:', error);
            this.showExportError(error);
        }
    }
    
    importFromFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    this.isLoading = true;
                    const data = JSON.parse(e.target.result);
                    this.state.importState(data);
                    
                    // Save to localStorage immediately
                    this.saveToLocalStorage();
                    
                    console.log('[Persistence] Data imported from file');
                    this.showImportSuccess();
                    resolve(data);
                    
                } catch (error) {
                    console.error('[Persistence] Failed to import:', error);
                    this.showImportError(error);
                    reject(error);
                } finally {
                    this.isLoading = false;
                }
            };
            
            reader.onerror = () => {
                const error = new Error('Failed to read file');
                console.error('[Persistence]', error);
                this.showImportError(error);
                reject(error);
            };
            
            reader.readAsText(file);
        });
    }
    
    clearData() {
        if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
            localStorage.removeItem('storyblocks-data');
            localStorage.removeItem('storyblocks-last-save');
            
            // Reload the page to start fresh
            window.location.reload();
        }
    }
    
    getDataSize() {
        const data = localStorage.getItem('storyblocks-data');
        if (data) {
            return Math.round(new Blob([data]).size / 1024); // Size in KB
        }
        return 0;
    }
    
    getLastSaveTime() {
        const lastSave = localStorage.getItem('storyblocks-last-save');
        return lastSave ? new Date(lastSave) : null;
    }
    
    // UI feedback methods
    showSaveIndicator() {
        this.showNotification('💾 Saved', 'success', 1000);
    }
    
    showSaveError(error) {
        this.showNotification('❌ Save failed: ' + error.message, 'error', 3000);
    }
    
    showExportSuccess() {
        this.showNotification('📁 Exported successfully', 'success', 2000);
    }
    
    showExportError(error) {
        this.showNotification('❌ Export failed: ' + error.message, 'error', 3000);
    }
    
    showImportSuccess() {
        this.showNotification('📥 Imported successfully', 'success', 2000);
    }
    
    showImportError(error) {
        this.showNotification('❌ Import failed: ' + error.message, 'error', 3000);
    }
    
    showNotification(message, type = 'info', duration = 3000) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
            color: white;
            font-weight: 600;
            z-index: 2000;
            transition: opacity 0.3s ease;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            background: ${type === 'error' ? '#dc2626' : type === 'success' ? '#16a34a' : '#2563eb'};
        `;
        notification.textContent = message;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Remove after duration
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }
    
    destroy() {
        this.stopAutoSave();
        if (this.saveTimer) {
            clearTimeout(this.saveTimer);
        }
    }
}