// ====================================
// SPOTIFY CLONE - APP.JS
// ====================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ====================================
    // GLOBAL STATE
    // ====================================
    const appState = {
        isPlaying: false,
        currentTrack: {
            title: 'Mahiye Jinna Sohna',
            artist: 'Darshan Raval, Asees Kaur',
            duration: 213, // in seconds (3:33)
            currentTime: 0,
            image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%233a5a40' width='300' height='300'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' fill='white' text-anchor='middle' dominant-baseline='middle'%3EMahiye Jinna%3C/text%3E%3C/svg%3E"
        },
        volume: 100,
        isMuted: false,
        isShuffle: false,
        repeatMode: 'off', // 'off', 'all', 'one'
        isLiked: false
    };

    // ====================================
    // DOM ELEMENTS
    // ====================================
    const elements = {
        // Player controls
        playBtn: document.querySelector('.play-btn'),
        playIcon: document.querySelector('.play-btn i'),
        
        // Progress bar
        progressBar: document.getElementById('progressBar'),
        progressFill: document.getElementById('progressFill'),
        currentTimeDisplay: document.querySelector('.progress-wrapper .time:first-child'),
        totalTimeDisplay: document.querySelector('.progress-wrapper .time:last-child'),
        
        // Volume controls
        volumeIcon: document.querySelector('.volume-icon'),
        volumeSlider: document.querySelector('.volume-slider'),
        volumeFill: document.querySelector('.volume-fill'),
        
        // Track info
        trackName: document.querySelector('.track-name'),
        artistName: document.querySelector('.artist-name'),
        nowPlayingImg: document.querySelector('.now-playing-img'),
        likeBtn: document.querySelector('.like-button'),
        
        // Cards
        cards: document.querySelectorAll('.card'),
        playButtons: document.querySelectorAll('.play-button'),
        
        // Navigation
        navOptions: document.querySelectorAll('.nav-option'),
        navArrows: document.querySelectorAll('.nav-arrow')
    };

    // Get control buttons after DOM is loaded
    const controlButtons = document.querySelectorAll('.control-btn');
    elements.shuffleBtn = controlButtons[0];
    elements.prevBtn = controlButtons[1];
    elements.nextBtn = controlButtons[3];
    elements.repeatBtn = controlButtons[4];

    // Get promo buttons
    const promoButtons = document.querySelectorAll('.promo-box .btn');
    elements.createPlaylistBtn = promoButtons[0];
    elements.browsePodcastsBtn = promoButtons[1];

    // ====================================
    // UTILITY FUNCTIONS
    // ====================================

    // Format time from seconds to MM:SS
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Update progress bar
    function updateProgress() {
        const percent = (appState.currentTrack.currentTime / appState.currentTrack.duration) * 100;
        elements.progressFill.style.width = `${percent}%`;
        elements.currentTimeDisplay.textContent = formatTime(appState.currentTrack.currentTime);
    }

    // Update play button icon
    function updatePlayButton() {
        elements.playIcon.className = appState.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play';
    }

    // Update volume icon based on volume level
    function updateVolumeIcon() {
        if (appState.isMuted || appState.volume === 0) {
            elements.volumeIcon.className = 'fa-solid fa-volume-xmark volume-icon';
        } else if (appState.volume < 50) {
            elements.volumeIcon.className = 'fa-solid fa-volume-low volume-icon';
        } else {
            elements.volumeIcon.className = 'fa-solid fa-volume-high volume-icon';
        }
    }

    // Update repeat button appearance
    function updateRepeatButton() {
        if (!elements.repeatBtn) return;
        
        const repeatIcon = elements.repeatBtn.querySelector('i');
        elements.repeatBtn.style.color = appState.repeatMode !== 'off' ? 'var(--accent-green)' : 'var(--text-secondary)';
        
        if (appState.repeatMode === 'one') {
            repeatIcon.className = 'fa-solid fa-repeat fa-1';
        } else {
            repeatIcon.className = 'fa-solid fa-repeat';
        }
    }

    // Update shuffle button appearance
    function updateShuffleButton() {
        if (!elements.shuffleBtn) return;
        elements.shuffleBtn.style.color = appState.isShuffle ? 'var(--accent-green)' : 'var(--text-secondary)';
    }

    // Show notification
    function showNotification(message) {
        console.log('🎵 ' + message);
    }

    // ====================================
    // PLAYBACK FUNCTIONS
    // ====================================

    function togglePlay() {
        appState.isPlaying = !appState.isPlaying;
        updatePlayButton();
        
        if (appState.isPlaying) {
            showNotification(`Playing: ${appState.currentTrack.title}`);
        } else {
            showNotification('Paused');
        }
    }

    function playTrack(trackData) {
        appState.currentTrack = {
            ...appState.currentTrack,
            ...trackData,
            currentTime: 0
        };
        
        // Update UI
        elements.trackName.textContent = trackData.title;
        elements.artistName.textContent = trackData.artist;
        elements.nowPlayingImg.src = trackData.image;
        elements.totalTimeDisplay.textContent = formatTime(trackData.duration);
        
        // Start playing
        appState.isPlaying = true;
        updatePlayButton();
        updateProgress();
        
        showNotification(`Now playing: ${trackData.title}`);
    }

    function playPrevious() {
        if (appState.currentTrack.currentTime > 3) {
            appState.currentTrack.currentTime = 0;
            updateProgress();
            showNotification('Track restarted');
        } else {
            showNotification('Playing previous track');
            appState.currentTrack.currentTime = 0;
            updateProgress();
        }
    }

    function playNext() {
        showNotification('Playing next track');
        appState.currentTrack.currentTime = 0;
        updateProgress();
    }

    function toggleShuffle() {
        appState.isShuffle = !appState.isShuffle;
        updateShuffleButton();
        showNotification(`Shuffle ${appState.isShuffle ? 'on' : 'off'}`);
    }

    function cycleRepeat() {
        const modes = ['off', 'all', 'one'];
        const currentIndex = modes.indexOf(appState.repeatMode);
        appState.repeatMode = modes[(currentIndex + 1) % modes.length];
        updateRepeatButton();
        
        const modeText = appState.repeatMode === 'off' ? 'off' : 
                         appState.repeatMode === 'all' ? 'all' : 'one';
        showNotification(`Repeat ${modeText}`);
    }

    // ====================================
    // VOLUME FUNCTIONS
    // ====================================

    function setVolume(percent) {
        appState.volume = Math.max(0, Math.min(100, percent));
        appState.isMuted = appState.volume === 0;
        elements.volumeFill.style.width = `${appState.volume}%`;
        updateVolumeIcon();
    }

    function toggleMute() {
        if (appState.isMuted || appState.volume === 0) {
            setVolume(appState.lastVolume || 100);
            appState.isMuted = false;
        } else {
            appState.lastVolume = appState.volume;
            setVolume(0);
            appState.isMuted = true;
        }
    }

    // ====================================
    // LIKE FUNCTION
    // ====================================

    function toggleLike() {
        appState.isLiked = !appState.isLiked;
        elements.likeBtn.className = appState.isLiked 
            ? 'fa-solid fa-heart like-button liked' 
            : 'fa-regular fa-heart like-button';
        
        showNotification(appState.isLiked ? 'Added to Liked Songs' : 'Removed from Liked Songs');
    }

    // ====================================
    // EVENT LISTENERS
    // ====================================

    // Play/Pause button
    if (elements.playBtn) {
        elements.playBtn.addEventListener('click', togglePlay);
    }

    // Previous/Next buttons
    if (elements.prevBtn) {
        elements.prevBtn.addEventListener('click', playPrevious);
    }
    if (elements.nextBtn) {
        elements.nextBtn.addEventListener('click', playNext);
    }

    // Shuffle button
    if (elements.shuffleBtn) {
        elements.shuffleBtn.addEventListener('click', toggleShuffle);
    }

    // Repeat button
    if (elements.repeatBtn) {
        elements.repeatBtn.addEventListener('click', cycleRepeat);
    }

    // Progress bar click
    if (elements.progressBar) {
        elements.progressBar.addEventListener('click', (e) => {
            const rect = elements.progressBar.getBoundingClientRect();
            const percent = ((e.clientX - rect.left) / rect.width);
            appState.currentTrack.currentTime = percent * appState.currentTrack.duration;
            updateProgress();
            showNotification(`Seeked to ${formatTime(appState.currentTrack.currentTime)}`);
        });
    }

    // Volume slider
    if (elements.volumeSlider) {
        elements.volumeSlider.addEventListener('click', (e) => {
            const rect = elements.volumeSlider.getBoundingClientRect();
            const percent = ((e.clientX - rect.left) / rect.width) * 100;
            setVolume(percent);
        });
    }

    // Volume icon (mute toggle)
    if (elements.volumeIcon) {
        elements.volumeIcon.addEventListener('click', toggleMute);
    }

    // Like button
    if (elements.likeBtn) {
        elements.likeBtn.addEventListener('click', toggleLike);
    }

    // Track name and artist click
    if (elements.trackName) {
        elements.trackName.addEventListener('click', () => {
            showNotification('Opening track page...');
        });
    }

    if (elements.artistName) {
        elements.artistName.addEventListener('click', () => {
            showNotification('Opening artist page...');
        });
    }

    // Card play buttons
    elements.playButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const card = btn.closest('.card');
            const title = card.querySelector('.card-title').textContent;
            const subtitle = card.querySelector('.card-subtitle').textContent;
            const image = card.querySelector('.card-img').src;
            
            playTrack({
                title: title,
                artist: subtitle,
                duration: 180 + Math.floor(Math.random() * 120),
                image: image
            });
        });
    });

    // Card clicks
    elements.cards.forEach((card) => {
        card.addEventListener('click', () => {
            const title = card.querySelector('.card-title').textContent;
            const subtitle = card.querySelector('.card-subtitle').textContent;
            const image = card.querySelector('.card-img').src;
            
            playTrack({
                title: title,
                artist: subtitle,
                duration: 180 + Math.floor(Math.random() * 120),
                image: image
            });
        });
    });

    // Navigation arrows
    elements.navArrows.forEach((arrow, index) => {
        arrow.addEventListener('click', () => {
            showNotification(index === 0 ? 'Going back...' : 'Going forward...');
        });
    });

    // Sidebar navigation
    elements.navOptions.forEach((option) => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            
            elements.navOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            const text = option.querySelector('span')?.textContent || 'Home';
            showNotification(`Navigated to ${text}`);
        });
    });

    // Create playlist button
    if (elements.createPlaylistBtn) {
        elements.createPlaylistBtn.addEventListener('click', () => {
            showNotification('Creating new playlist...');
        });
    }

    // Browse podcasts button
    if (elements.browsePodcastsBtn) {
        elements.browsePodcastsBtn.addEventListener('click', () => {
            showNotification('Opening podcast browser...');
        });
    }

    // ====================================
    // KEYBOARD SHORTCUTS
    // ====================================

    document.addEventListener('keydown', (e) => {
        // Ignore if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        switch(e.code) {
            case 'Space':
                e.preventDefault();
                togglePlay();
                break;
            case 'ArrowRight':
                e.preventDefault();
                appState.currentTrack.currentTime = Math.min(
                    appState.currentTrack.currentTime + 5,
                    appState.currentTrack.duration
                );
                updateProgress();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                appState.currentTrack.currentTime = Math.max(
                    appState.currentTrack.currentTime - 5,
                    0
                );
                updateProgress();
                break;
            case 'ArrowUp':
                e.preventDefault();
                setVolume(appState.volume + 10);
                break;
            case 'ArrowDown':
                e.preventDefault();
                setVolume(appState.volume - 10);
                break;
            case 'KeyM':
                toggleMute();
                break;
            case 'KeyL':
                toggleLike();
                break;
            case 'KeyS':
                toggleShuffle();
                break;
            case 'KeyR':
                cycleRepeat();
                break;
        }
    });

    // ====================================
    // PLAYBACK INTERVAL
    // ====================================

    setInterval(() => {
        if (appState.isPlaying) {
            appState.currentTrack.currentTime += 0.1;
            
            // Check if track ended
            if (appState.currentTrack.currentTime >= appState.currentTrack.duration) {
                if (appState.repeatMode === 'one') {
                    appState.currentTrack.currentTime = 0;
                } else if (appState.repeatMode === 'all') {
                    playNext();
                } else {
                    appState.isPlaying = false;
                    appState.currentTrack.currentTime = 0;
                    updatePlayButton();
                }
            }
            
            updateProgress();
        }
    }, 100);

    // ====================================
    // INITIALIZATION
    // ====================================

    function init() {
        // Set initial time display
        if (elements.totalTimeDisplay) {
            elements.totalTimeDisplay.textContent = formatTime(appState.currentTrack.duration);
        }
        if (elements.currentTimeDisplay) {
            elements.currentTimeDisplay.textContent = formatTime(0);
        }
        
        // Set initial volume
        if (elements.volumeFill) {
            elements.volumeFill.style.width = `${appState.volume}%`;
        }
        
        // Update button states
        updatePlayButton();
        updateVolumeIcon();
        updateRepeatButton();
        updateShuffleButton();
        
        console.log('🎵 Spotify Clone Initialized!');
        console.log('⌨️  Keyboard shortcuts:');
        console.log('   Space - Play/Pause');
        console.log('   ← → - Skip 5 seconds');
        console.log('   ↑ ↓ - Volume');
        console.log('   M - Mute');
        console.log('   L - Like');
        console.log('   S - Shuffle');
        console.log('   R - Repeat');
    }

    // Initialize the app
    init();
});