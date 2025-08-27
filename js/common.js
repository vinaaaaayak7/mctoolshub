// Common JavaScript functionality

// Global notification element
let notification;

// Initialize common functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    notification = document.getElementById('notification');
    
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Initialize notification system
    if (notification) {
        // Auto-hide notification if it's shown initially
        setTimeout(() => {
            if (notification.classList.contains('show')) {
                notification.classList.remove('show');
            }
        }, 3000);
    }
});

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showNotification(message, type = 'success') {
    if (!notification) return;
    
    const notificationText = notification.querySelector('.notification-text');
    const notificationIcon = notification.querySelector('i');
    
    if (notificationText) notificationText.textContent = message;
    
    // Update icon and color based on type
    if (notificationIcon) {
        if (type === 'success') {
            notificationIcon.className = 'fas fa-check-circle';
            notification.style.background = 'linear-gradient(45deg, #ff6b6b, #ff8787)';
        } else if (type === 'error') {
            notificationIcon.className = 'fas fa-exclamation-circle';
            notification.style.background = 'linear-gradient(45deg, #e74c3c, #c0392b)';
        } else if (type === 'info') {
            notificationIcon.className = 'fas fa-info-circle';
            notification.style.background = 'linear-gradient(45deg, #4ecdc4, #44a08d)';
        }
    }
    
    // Show notification
    notification.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Copy to clipboard functionality
function copyToClipboard(text, successMessage = 'Copied to clipboard!') {
    try {
        navigator.clipboard.writeText(text).then(() => {
            showNotification(successMessage, 'success');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showNotification(successMessage, 'success');
        });
    } catch (error) {
        console.error('Copy failed:', error);
        showNotification('Copy failed. Please try again.', 'error');
    }
}

// Color utility functions
function adjustBrightness(hex, percent) {
    // Remove the hash if present
    hex = hex.replace('#', '');
    
    // Parse the hex values
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Adjust brightness
    const newR = Math.min(255, Math.max(0, r + (r * percent / 100)));
    const newG = Math.min(255, Math.max(0, g + (g * percent / 100)));
    const newB = Math.min(255, Math.max(0, b + (b * percent / 100)));
    
    // Convert back to hex
    return `#${Math.round(newR).toString(16).padStart(2, '0')}${Math.round(newG).toString(16).padStart(2, '0')}${Math.round(newB).toString(16).padStart(2, '0')}`;
}

// Navigation active state management
function setActiveNavButton(activePage) {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.classList.remove('active');
        const href = btn.getAttribute('href');
        if (href && href.includes(activePage)) {
            btn.classList.add('active');
        }
    });
}

// Add hover effects to buttons
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects for buttons
    const buttons = document.querySelectorAll('.primary-btn, .secondary-btn, .generate-btn, .download-btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });
        
        button.addEventListener('mousedown', () => {
            button.style.transform = 'translateY(0) scale(0.98)';
        });
        
        button.addEventListener('mouseup', () => {
            button.style.transform = 'translateY(-2px) scale(1.02)';
        });
    });
});