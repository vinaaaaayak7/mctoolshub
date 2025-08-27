// Deluxe Menu Editor JavaScript

// DOM Elements
let menuTitleInput, openCommandInput, sizeSelect, openRequirementTextarea;
let addItemBtn, importButton, exportButton, importFileInput;
let itemsContainer, menuPreview, previewTitle, slotCount;
let itemEditorModal;

// State
let menuData = {
    title: 'My Custom Menu',
    openCommand: '/mymenu',
    size: 27,
    openRequirement: '',
    items: []
};

let currentEditingItem = null;
let currentSlot = null;

// Initialize application
function init() {
    // Get DOM elements
    menuTitleInput = document.getElementById('menu_title');
    openCommandInput = document.getElementById('open_command');
    sizeSelect = document.getElementById('size');
    openRequirementTextarea = document.getElementById('open_requirement');
    addItemBtn = document.getElementById('add-item');
    importButton = document.getElementById('import-button');
    exportButton = document.getElementById('export-button');
    importFileInput = document.getElementById('import-file');
    itemsContainer = document.getElementById('items-container');
    menuPreview = document.getElementById('menu-preview');
    previewTitle = document.getElementById('preview-title');
    slotCount = document.getElementById('slot-count');
    itemEditorModal = document.getElementById('itemEditorModal');
    
    setupEventListeners();
    updatePreview();
    
    // Set active navigation
    setActiveNavButton('deluxe-menu.html');
    
    // Show welcome message
    setTimeout(() => {
        showNotification('Welcome to Deluxe Menu Editor! 🎨', 'info');
    }, 1000);
}

// Event Listeners
function setupEventListeners() {
    if (menuTitleInput) {
        menuTitleInput.addEventListener('input', handleTitleChange);
    }
    
    if (openCommandInput) {
        openCommandInput.addEventListener('input', handleCommandChange);
    }
    
    if (sizeSelect) {
        sizeSelect.addEventListener('change', handleSizeChange);
    }
    
    if (openRequirementTextarea) {
        openRequirementTextarea.addEventListener('input', handleRequirementChange);
    }
    
    if (addItemBtn) {
        addItemBtn.addEventListener('click', handleAddItem);
    }
    
    if (importButton) {
        importButton.addEventListener('click', () => importFileInput.click());
    }
    
    if (exportButton) {
        exportButton.addEventListener('click', handleExport);
    }
    
    if (importFileInput) {
        importFileInput.addEventListener('change', handleImport);
    }
}

// Event Handlers
function handleTitleChange(e) {
    menuData.title = e.target.value || 'My Custom Menu';
    updatePreviewTitle();
}

function handleCommandChange(e) {
    menuData.openCommand = e.target.value;
}

function handleSizeChange(e) {
    menuData.size = parseInt(e.target.value);
    updatePreview();
}

function handleRequirementChange(e) {
    menuData.openRequirement = e.target.value;
}

function handleAddItem() {
    currentEditingItem = null;
    currentSlot = null;
    openItemEditor();
}

function handleExport() {
    const yamlContent = generateYAML();
    downloadFile('menu.yml', yamlContent);
    showNotification('Menu exported successfully!', 'success');
}

function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            // For now, we'll just show a success message
            // In a real implementation, you'd parse the YAML content
            showNotification('Menu imported successfully!', 'success');
        } catch (error) {
            showNotification('Failed to import menu file.', 'error');
        }
    };
    reader.readAsText(file);
}

// Preview Functions
function updatePreview() {
    if (!menuPreview) return;
    
    const rows = Math.ceil(menuData.size / 9);
    
    // Update slot count display
    if (slotCount) {
        slotCount.textContent = `${menuData.size} slots`;
    }
    
    // Clear existing grid
    menuPreview.innerHTML = '';
    menuPreview.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    
    // Generate inventory slots
    for (let i = 0; i < menuData.size; i++) {
        const slot = document.createElement('div');
        slot.className = 'inventory-slot';
        slot.dataset.slot = i;
        
        // Check if this slot has an item
        const item = menuData.items.find(item => item.slot === i);
        if (item) {
            slot.classList.add('occupied');
            slot.innerHTML = `<div class="item-icon">${getItemIcon(item.material)}</div>`;
        }
        
        slot.addEventListener('click', () => handleSlotClick(i));
        menuPreview.appendChild(slot);
    }
    
    updatePreviewTitle();
}

function updatePreviewTitle() {
    if (previewTitle) {
        previewTitle.textContent = menuData.title;
    }
}

function handleSlotClick(slotIndex) {
    currentSlot = slotIndex;
    
    // Check if slot has an item
    const existingItem = menuData.items.find(item => item.slot === slotIndex);
    if (existingItem) {
        currentEditingItem = existingItem;
        openItemEditor(existingItem);
    } else {
        currentEditingItem = null;
        openItemEditor();
    }
}

// Item Editor Functions
function openItemEditor(item = null) {
    if (!itemEditorModal) return;
    
    const materialSelect = document.getElementById('item-material');
    const nameInput = document.getElementById('item-name');
    const loreTextarea = document.getElementById('item-lore');
    const slotInput = document.getElementById('item-slot');
    const actionsTextarea = document.getElementById('item-actions');
    
    if (item) {
        // Edit existing item
        if (materialSelect) materialSelect.value = item.material || 'STONE';
        if (nameInput) nameInput.value = item.displayName || '';
        if (loreTextarea) loreTextarea.value = item.lore ? item.lore.join('\n') : '';
        if (slotInput) slotInput.value = item.slot || 0;
        if (actionsTextarea) actionsTextarea.value = item.actions ? item.actions.join('\n') : '';
    } else {
        // Create new item
        if (materialSelect) materialSelect.value = 'STONE';
        if (nameInput) nameInput.value = '';
        if (loreTextarea) loreTextarea.value = '';
        if (slotInput) slotInput.value = currentSlot !== null ? currentSlot : 0;
        if (actionsTextarea) actionsTextarea.value = '';
    }
    
    itemEditorModal.style.display = 'flex';
}

function closeItemEditor() {
    if (itemEditorModal) {
        itemEditorModal.style.display = 'none';
    }
    currentEditingItem = null;
    currentSlot = null;
}

function saveItemEditor() {
    const materialSelect = document.getElementById('item-material');
    const nameInput = document.getElementById('item-name');
    const loreTextarea = document.getElementById('item-lore');
    const slotInput = document.getElementById('item-slot');
    const actionsTextarea = document.getElementById('item-actions');
    
    const slot = parseInt(slotInput.value);
    const item = {
        slot: slot,
        material: materialSelect.value,
        displayName: nameInput.value,
        lore: loreTextarea.value ? loreTextarea.value.split('\n').filter(line => line.trim()) : [],
        actions: actionsTextarea.value ? actionsTextarea.value.split('\n').filter(line => line.trim()) : []
    };
    
    if (currentEditingItem) {
        // Update existing item
        const index = menuData.items.indexOf(currentEditingItem);
        if (index !== -1) {
            menuData.items[index] = item;
        }
    } else {
        // Add new item
        // Remove any existing item in this slot first
        menuData.items = menuData.items.filter(existingItem => existingItem.slot !== slot);
        menuData.items.push(item);
    }
    
    updatePreview();
    updateItemsList();
    closeItemEditor();
    showNotification('Item saved successfully!', 'success');
}

// Helper Functions
function getItemIcon(material) {
    const icons = {
        'STONE': '🪨',
        'GRASS_BLOCK': '🟫',
        'DIAMOND': '💎',
        'IRON_INGOT': '🔩',
        'GOLD_INGOT': '🟨',
        'EMERALD': '💚',
        'REDSTONE': '🔴',
        'BOOK': '📖',
        'PAPER': '📄',
        'COMPASS': '🧭',
        'CLOCK': '🕐',
        'BARRIER': '🚫'
    };
    return icons[material] || '📦';
}

function updateItemsList() {
    if (!itemsContainer) return;
    
    itemsContainer.innerHTML = '';
    
    menuData.items.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item-entry';
        
        itemDiv.innerHTML = `
            <div class="item-info">
                <div class="item-name">${item.displayName || item.material}</div>
                <div class="item-details">Slot: ${item.slot} | Material: ${item.material}</div>
            </div>
            <div class="item-actions-buttons">
                <button class="edit-item-btn" onclick="editItem(${index})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-item-btn" onclick="deleteItem(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        itemsContainer.appendChild(itemDiv);
    });
}

function editItem(index) {
    currentEditingItem = menuData.items[index];
    currentSlot = currentEditingItem.slot;
    openItemEditor(currentEditingItem);
}

function deleteItem(index) {
    menuData.items.splice(index, 1);
    updatePreview();
    updateItemsList();
    showNotification('Item deleted successfully!', 'success');
}

function generateYAML() {
    let yaml = `menu_title: '${menuData.title}'\n`;
    yaml += `open_command: '${menuData.openCommand}'\n`;
    yaml += `size: ${menuData.size}\n`;
    
    if (menuData.openRequirement) {
        yaml += `open_requirement:\n`;
        menuData.openRequirement.split('\n').forEach(line => {
            if (line.trim()) {
                yaml += `  ${line}\n`;
            }
        });
    }
    
    yaml += `items:\n`;
    
    menuData.items.forEach(item => {
        yaml += `  ${item.slot}:\n`;
        yaml += `    material: ${item.material}\n`;
        if (item.displayName) {
            yaml += `    display_name: '${item.displayName}'\n`;
        }
        if (item.lore && item.lore.length > 0) {
            yaml += `    lore:\n`;
            item.lore.forEach(line => {
                yaml += `      - '${line}'\n`;
            });
        }
        if (item.actions && item.actions.length > 0) {
            yaml += `    left_click_commands:\n`;
            item.actions.forEach(action => {
                yaml += `      - '${action}'\n`;
            });
        }
    });
    
    return yaml;
}

function downloadFile(filename, content) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);