# Stock Market Clock - Vanilla JavaScript Version

A real-time linear stock market clock with contextual trading messages for NYSE hours, built with vanilla HTML, CSS, and JavaScript.

## Features

- **Real-time Clock**: Updates every second with EST timezone
- **Linear Timeline**: Visual progress bar from 9:15 AM to 4:00 PM
- **Contextual Messages**: Different trading alerts based on market timing
- **Voice Narration**: Text-to-speech for message announcements
- **Responsive Design**: Works on desktop and mobile devices
- **Market Status**: Visual indicators for different market states

## Files

- `index.html` - Main HTML structure
- `styles.css` - All styling and animations
- `script.js` - JavaScript functionality and logic
- `README.md` - This file

## Setup

1. Download all files to a folder
2. Open `index.html` in a web browser
3. The clock will start automatically

## Voice Feature

The voice feature uses two methods:
1. **ElevenLabs API** (premium, requires API key)
2. **Browser Speech Synthesis** (free, built-in fallback)

To use ElevenLabs:
1. Get an API key from [ElevenLabs](https://elevenlabs.io)
2. Replace `YOUR_ELEVENLABS_API_KEY` in `script.js` with your actual key

The browser's built-in speech synthesis will work without any setup.

## Hosting Options

Since this is vanilla HTML/CSS/JS, you can host it anywhere:

### Free Options:
- **GitHub Pages**: Upload to a GitHub repo and enable Pages
- **Netlify**: Drag and drop the folder to netlify.com
- **Vercel**: Connect your GitHub repo
- **Firebase Hosting**: Google's free hosting service
- **Surge.sh**: Simple command-line publishing

### Quick Deploy Steps (Netlify):
1. Go to [netlify.com](https://netlify.com)
2. Drag the entire folder to the deploy area
3. Your site will be live instantly with a random URL
4. Optional: Connect a custom domain

### Quick Deploy Steps (GitHub Pages):
1. Create a new GitHub repository
2. Upload all files to the repository
3. Go to Settings > Pages
4. Select "Deploy from a branch" > "main"
5. Your site will be available at `yourusername.github.io/repository-name`

## Market Schedule

The clock follows NYSE hours:
- **9:15 AM**: Pre-market alert
- **9:30 AM**: Market open with volatility warning
- **10:00 AM**: Movement expectations
- **12:00 PM**: Lunch consolidation warning
- **1:00 PM**: Post-lunch movement potential
- **3:00 PM**: Power hour activation
- **3:45 PM**: 15-minute closing warning
- **4:00 PM**: Market close

## Customization

You can easily customize:
- **Colors**: Edit CSS variables in `styles.css`
- **Messages**: Modify the message logic in `script.js`
- **Timing**: Adjust market schedule in the `getMarketTimeInfo()` function
- **Voice**: Change voice settings or add different voices

## Browser Compatibility

Works in all modern browsers that support:
- ES6 JavaScript
- CSS Grid and Flexbox
- Web Audio API (for voice features)

## License

Free to use and modify for personal and commercial projects.