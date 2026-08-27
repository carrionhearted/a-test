# Mobile Chat App

A lightweight HTML-based chat application for mobile devices with built-in themes and custom wallpaper support.

## Features

- Mobile-optimized responsive design
- 4 built-in themes: Light, Dark, Ocean, Forest
- Wallpaper customization with upload support
- Local message storage
- Auto-reply bot functionality
- Persistent settings and message history

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/carrionhearted/mobile-chat-app.git
cd mobile-chat-app
```

2. Open `index.html` in your web browser or run a local server:
```bash
python -m http.server 8000
```

3. Navigate to `http://localhost:8000` or open the file directly

## Usage

### Sending Messages
Type your message and press Enter or click Send. The bot will respond automatically.

### Changing Themes
Click the settings icon in the top right and select a theme. Your choice is saved automatically.

### Custom Wallpaper
In settings, you can select a preset wallpaper or upload your own image. The wallpaper is applied to the chat background.

### Resetting Settings
Click settings and select "Reset to Defaults" to restore all settings to their original state.

## File Structure

```
mobile-chat-app/
├── index.html
├── styles.css
├── app.js
└── README.md
```

## Technical Details

- Built with vanilla HTML, CSS, and JavaScript
- No external dependencies
- Uses CSS variables for theming
- LocalStorage API for data persistence
- Base64 encoding for custom wallpapers

## Browser Support

Works on all modern browsers including Chrome, Firefox, Safari, and mobile browsers.

## License

MIT License - feel free to use and modify as needed.
