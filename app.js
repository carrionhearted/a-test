// App State
const appState = {
    messages: [],
    currentTheme: localStorage.getItem('theme') || 'light',
    customWallpaper: localStorage.getItem('wallpaper') || null,
};

// DOM Elements
const chatArea = document.getElementById('chatArea');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettings = document.getElementById('closeSettings');
const wallpaperUpload = document.getElementById('wallpaperUpload');
const wallpaperPreview = document.getElementById('wallpaperPreview');
const resetBtn = document.getElementById('resetBtn');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    loadWallpaper();
    setupEventListeners();
    loadMessages();
});

// Setup Event Listeners
function setupEventListeners() {
    // Send message
    sendBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Settings modal
    settingsBtn.addEventListener('click', openSettings);
    closeSettings.addEventListener('click', closeSettingsModal);
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) closeSettingsModal();
    });

    // Theme buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => changeTheme(btn.dataset.theme));
    });

    // Wallpaper buttons
    document.querySelectorAll('.wallpaper-btn').forEach(btn => {
        btn.addEventListener('click', () => changeWallpaper(btn.dataset.wallpaper));
    });

    // Wallpaper upload
    wallpaperUpload.addEventListener('change', handleWallpaperUpload);

    // Reset button
    resetBtn.addEventListener('click', resetToDefaults);
}

// Message Functions
function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;

    const message = {
        id: Date.now(),
        text: text,
        type: 'user',
        timestamp: new Date(),
    };

    appState.messages.push(message);
    messageInput.value = '';
    messageInput.focus();

    displayMessage(message);
    saveMessages();

    // Simulate response after 500ms
    setTimeout(() => {
        const responses = [
            'That\'s interesting! 😊',
            'I agree! 👍',
            'Tell me more! 📝',
            'Haha, nice! 😂',
            'Sounds good! ✨',
            'Great point! 💡',
            'Absolutely! 🎉',
            'I hear you! 👂',
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const botMessage = {
            id: Date.now(),
            text: randomResponse,
            type: 'other',
            timestamp: new Date(),
        };

        appState.messages.push(botMessage);
        displayMessage(botMessage);
        saveMessages();
    }, 500);
}

function displayMessage(message) {
    // Clear empty state if needed
    const emptyState = chatArea.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }

    const messageEl = document.createElement('div');
    messageEl.className = `message ${message.type}`;

    const time = message.timestamp.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });

    messageEl.innerHTML = `
        ${message.type === 'user' ? `<span class="message-time">${time}</span>` : ''}
        <div class="message-content">${escapeHtml(message.text)}</div>
        ${message.type === 'other' ? `<span class="message-time">${time}</span>` : ''}
    `;

    chatArea.appendChild(messageEl);
    chatArea.scrollTop = chatArea.scrollHeight;
}

function loadMessages() {
    const saved = localStorage.getItem('messages');
    if (saved) {
        try {
            appState.messages = JSON.parse(saved);
            appState.messages.forEach(msg => {
                msg.timestamp = new Date(msg.timestamp);
                displayMessage(msg);
            });
        } catch (e) {
            console.error('Error loading messages:', e);
        }
    }
}

function saveMessages() {
    localStorage.setItem('messages', JSON.stringify(appState.messages));
}

// Theme Functions
function changeTheme(theme) {
    appState.currentTheme = theme;
    loadTheme();
    updateThemeButtons();
    localStorage.setItem('theme', theme);
}

function loadTheme() {
    document.body.className = '';
    if (appState.currentTheme !== 'light') {
        document.body.classList.add(`${appState.currentTheme}-theme`);
    }
    updateThemeButtons();
}

function updateThemeButtons() {
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.theme === appState.currentTheme) {
            btn.classList.add('active');
        }
    });
}

// Wallpaper Functions
function changeWallpaper(wallpaper) {
    localStorage.setItem('wallpaper', wallpaper);
    appState.customWallpaper = null;
    loadWallpaper();
    updateWallpaperButtons();
}

function loadWallpaper() {
    const wallpaper = localStorage.getItem('wallpaper') || 'default';
    const customWallpaper = localStorage.getItem('customWallpaperData');

    if (customWallpaper) {
        chatArea.style.backgroundImage = `url('${customWallpaper}')`;
        wallpaperPreview.style.backgroundImage = `url('${customWallpaper}')`;
    } else {
        switch (wallpaper) {
            case 'gradient':
                chatArea.style.backgroundImage = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                break;
            case 'pattern':
                chatArea.style.backgroundImage = `
                    repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(68, 68, 68, 0.05) 35px, rgba(68, 68, 68, 0.05) 70px)
                `;
                break;
            default:
                chatArea.style.backgroundImage = 'none';
                chatArea.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-primary');
        }
    }

    updateWallpaperButtons();
}

function handleWallpaperUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const imageData = event.target.result;
        localStorage.setItem('customWallpaperData', imageData);
        appState.customWallpaper = imageData;
        
        chatArea.style.backgroundImage = `url('${imageData}')`;
        wallpaperPreview.style.backgroundImage = `url('${imageData}')`;
    };

    reader.readAsDataURL(file);
}

function updateWallpaperButtons() {
    document.querySelectorAll('.wallpaper-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    if (appState.customWallpaper || localStorage.getItem('customWallpaperData')) {
        wallpaperPreview.style.display = 'block';
    } else {
        const wallpaper = localStorage.getItem('wallpaper') || 'default';
        const activeBtn = document.querySelector(`[data-wallpaper="${wallpaper}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }
}

// Settings Modal
function openSettings() {
    settingsModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeSettingsModal() {
    settingsModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function resetToDefaults() {
    if (confirm('Are you sure you want to reset to default settings?')) {
        localStorage.removeItem('theme');
        localStorage.removeItem('wallpaper');
        localStorage.removeItem('customWallpaperData');
        appState.currentTheme = 'light';
        appState.customWallpaper = null;
        wallpaperUpload.value = '';
        loadTheme();
        loadWallpaper();
    }
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    if (settingsModal && !settingsModal.classList.contains('hidden')) {
        if (!settingsModal.querySelector('.modal-content').contains(e.target) && 
            e.target !== settingsBtn) {
            closeSettingsModal();
        }
    }
});
