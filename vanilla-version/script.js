class StockMarketClock {
    constructor() {
        this.isVoiceEnabled = false;
        this.lastMessage = '';
        this.elements = {
            currentTime: document.getElementById('currentTime'),
            timelineProgress: document.getElementById('timelineProgress'),
            timelineMarker: document.getElementById('timelineMarker'),
            messageIcon: document.getElementById('messageIcon'),
            messageTitle: document.getElementById('messageTitle'),
            messageText: document.getElementById('messageText'),
            statusBadge: document.getElementById('statusBadge'),
            statusIndicator: document.getElementById('statusIndicator'),
            statusText: document.getElementById('statusText'),
            voiceToggle: document.getElementById('voiceToggle'),
            volumeIcon: document.getElementById('volumeIcon')
        };
        
        this.init();
    }

    init() {
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
        this.setupVoiceToggle();
    }

    setupVoiceToggle() {
        this.elements.voiceToggle.addEventListener('click', () => {
            this.isVoiceEnabled = !this.isVoiceEnabled;
            this.updateVoiceButton();
        });
        this.updateVoiceButton();
    }

    updateVoiceButton() {
        const button = this.elements.voiceToggle;
        const icon = this.elements.volumeIcon;
        
        if (this.isVoiceEnabled) {
            button.classList.add('active');
            icon.innerHTML = `
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            `;
        } else {
            button.classList.remove('active');
            icon.innerHTML = `
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <line x1="23" y1="9" x2="17" y2="15"></line>
                <line x1="17" y1="9" x2="23" y2="15"></line>
            `;
        }
    }

    getMarketTimeInfo() {
        const now = new Date();
        const est = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
        
        // Market times in EST
        const marketStart = new Date(est);
        marketStart.setHours(9, 30, 0, 0);
        
        const marketEnd = new Date(est);
        marketEnd.setHours(16, 0, 0, 0);
        
        const preMarketStart = new Date(est);
        preMarketStart.setHours(9, 15, 0, 0);

        let currentMessage = '';
        let messageType = 'clock';
        let marketStatus = 'market-closed';
        let statusText = 'Market Closed';

        const hour = est.getHours();
        const minute = est.getMinutes();
        const totalMinutes = hour * 60 + minute;

        // Pre-market (9:15 - 9:30)
        if (totalMinutes >= 555 && totalMinutes < 570) { // 9:15 - 9:30
            marketStatus = 'pre-market';
            statusText = 'Pre-Market';
            currentMessage = '15 minutes until market open. Prepare for trading session.';
            messageType = 'alert';
        }
        // First 5 minutes (9:30 - 9:35)
        else if (totalMinutes >= 570 && totalMinutes < 575) { // 9:30 - 9:35
            marketStatus = 'market-open';
            statusText = 'Market Open - High Volatility';
            currentMessage = 'Liquidity grab - high volatility! Wait for market to steady before making moves.';
            messageType = 'warning';
        }
        // Approaching 10 AM (9:55 - 10:05)
        else if (totalMinutes >= 595 && totalMinutes < 605) { // 9:55 - 10:05
            marketStatus = 'market-open';
            statusText = 'Market Open - Movement Expected';
            currentMessage = 'Market move incoming! Watch for reversal, pullback, consolidation, or continuation.';
            messageType = 'trending';
        }
        // Approaching lunch (11:45 - 12:15)
        else if (totalMinutes >= 705 && totalMinutes < 735) { // 11:45 - 12:15
            marketStatus = 'market-open';
            statusText = 'Market Open - Lunch Approach';
            currentMessage = 'Approaching lunch time. Possible market slowdown and consolidation ahead.';
            messageType = 'coffee';
        }
        // Lunch ending (1:00 - 1:30)
        else if (totalMinutes >= 780 && totalMinutes < 810) { // 1:00 - 1:30
            marketStatus = 'market-open';
            statusText = 'Market Open - Post-Lunch';
            currentMessage = 'Lunch ending - a significant move might occur between now and 1:30 PM.';
            messageType = 'trending';
        }
        // Power hour (3:00 - 3:45)
        else if (totalMinutes >= 900 && totalMinutes < 945) { // 3:00 - 3:45
            marketStatus = 'market-open';
            statusText = 'Market Open - Power Hour';
            currentMessage = 'Power hour activated! High volume and volatility expected.';
            messageType = 'power';
        }
        // 15 minutes to close (3:45 - 4:00)
        else if (totalMinutes >= 945 && totalMinutes < 960) { // 3:45 - 4:00
            marketStatus = 'market-open';
            statusText = 'Market Open - Closing Soon';
            currentMessage = '15-minute warning! Market closes soon - final trading opportunities.';
            messageType = 'alert';
        }
        // Market hours (9:30 - 4:00) - general
        else if (totalMinutes >= 570 && totalMinutes < 960) {
            marketStatus = 'market-open';
            statusText = 'Market Open';
            currentMessage = 'Market is active. Monitor price action and volume for trading opportunities.';
            messageType = 'trending';
        }
        // After hours
        else if (totalMinutes >= 960) {
            marketStatus = 'after-hours';
            statusText = 'After Hours';
            currentMessage = 'Market closed. After-hours trading available with limited liquidity.';
            messageType = 'clock';
        }
        // Before pre-market
        else {
            marketStatus = 'market-closed';
            statusText = 'Market Closed';
            currentMessage = 'Market is closed. Pre-market opens at 9:15 AM EST.';
            messageType = 'clock';
        }

        // Calculate progress (9:15 AM to 4:00 PM = 405 minutes)
        const startMinutes = 555; // 9:15 AM
        const endMinutes = 960;   // 4:00 PM
        const currentMinutes = Math.max(startMinutes, Math.min(endMinutes, totalMinutes));
        const progress = ((currentMinutes - startMinutes) / (endMinutes - startMinutes)) * 100;

        return {
            currentTime: est,
            currentMessage,
            messageType,
            marketStatus,
            statusText,
            progress: Math.max(0, Math.min(100, progress))
        };
    }

    updateClock() {
        const timeInfo = this.getMarketTimeInfo();
        
        // Update time display
        this.elements.currentTime.textContent = timeInfo.currentTime.toLocaleTimeString('en-US', {
            hour12: true,
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit'
        });

        // Update progress bar and marker
        this.elements.timelineProgress.style.width = `${timeInfo.progress}%`;
        this.elements.timelineMarker.style.left = `${timeInfo.progress}%`;

        // Update message
        this.elements.messageTitle.textContent = this.getMessageTitle(timeInfo.messageType);
        this.elements.messageText.textContent = timeInfo.currentMessage;
        this.updateMessageIcon(timeInfo.messageType);

        // Update status
        this.elements.statusIndicator.className = `status-indicator ${timeInfo.marketStatus}`;
        this.elements.statusText.textContent = timeInfo.statusText;

        // Speak message if changed
        if (timeInfo.currentMessage !== this.lastMessage) {
            this.lastMessage = timeInfo.currentMessage;
            this.speakMessage(timeInfo.currentMessage);
        }
    }

    getMessageTitle(type) {
        const titles = {
            'clock': 'Market Status',
            'trending': 'Trading Alert',
            'warning': 'High Volatility Warning',
            'coffee': 'Market Timing',
            'power': 'Power Hour Alert',
            'alert': 'Important Notice'
        };
        return titles[type] || 'Market Update';
    }

    updateMessageIcon(type) {
        const icons = {
            'clock': `<circle cx="12" cy="12" r="10"></circle><polyline points="12,6 12,12 16,14"></polyline>`,
            'trending': `<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline>`,
            'warning': `<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>`,
            'coffee': `<path d="M17 8h1a4 4 0 1 1 0 8h-1"></path><path d="m6.5 8 7.5 8 7.5-8"></path><path d="M6.5 8h11"></path>`,
            'power': `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>`,
            'alert': `<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>`
        };
        
        this.elements.messageIcon.innerHTML = `
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                ${icons[type] || icons['clock']}
            </svg>
        `;
    }

    async speakMessage(message) {
        if (!this.isVoiceEnabled) return;
        
        try {
            // Try ElevenLabs API first (you'll need to add your API key)
            const apiKey = 'YOUR_ELEVENLABS_API_KEY'; // Replace with your actual API key
            
            if (apiKey && apiKey !== 'YOUR_ELEVENLABS_API_KEY') {
                const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/9BWtsMINqrJLrRacOk9x', {
                    method: 'POST',
                    headers: {
                        'Accept': 'audio/mpeg',
                        'Content-Type': 'application/json',
                        'xi-api-key': apiKey
                    },
                    body: JSON.stringify({
                        text: message,
                        model_id: 'eleven_turbo_v2',
                        voice_settings: {
                            stability: 0.5,
                            similarity_boost: 0.75,
                            style: 0.0,
                            use_speaker_boost: true
                        }
                    })
                });

                if (response.ok) {
                    const audioBlob = await response.blob();
                    const audioUrl = URL.createObjectURL(audioBlob);
                    const audio = new Audio(audioUrl);
                    audio.play();
                    return;
                }
            }
            
            // Fallback to browser's Speech Synthesis API
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(message);
                utterance.rate = 0.9;
                utterance.pitch = 1;
                utterance.volume = 0.8;
                speechSynthesis.speak(utterance);
            }
        } catch (error) {
            console.error('Error generating speech:', error);
            
            // Fallback to browser's Speech Synthesis API
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(message);
                utterance.rate = 0.9;
                utterance.pitch = 1;
                utterance.volume = 0.8;
                speechSynthesis.speak(utterance);
            }
        }
    }
}

// Initialize the clock when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new StockMarketClock();
});