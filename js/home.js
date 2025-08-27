// Home page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Set active navigation
    setActiveNavButton('index.html');
    
    // Add click animations to tool cards
    const toolCards = document.querySelectorAll('.tool-card');
    
    toolCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
        
        card.addEventListener('mousedown', () => {
            card.style.transform = 'translateY(-4px) scale(0.98)';
        });
        
        card.addEventListener('mouseup', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });
    });
    
    // Add staggered animation to tool cards
    toolCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Show welcome notification
    setTimeout(() => {
        showNotification('Welcome to Minecraft Tools Hub! 🎮', 'info');
    }, 1000);
});