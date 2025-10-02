// UI Control Functions
function showMenuWithTransition() {
    showPageTransition(() => {
        hideAllScreens();
        document.getElementById('mainMenu').style.display = 'flex';
    });
}

function showPageTransition(callback) {
    const transition = document.getElementById('pageTransition');
    transition.style.display = 'flex';
    
    setTimeout(() => {
        transition.style.display = 'none';
        if (callback) callback();
    }, 1500);
}

function hideAllScreens() {
    const screens = [
        'loadingScreen',
        'titleScreen',
        'mainMenu',
        'gameScreen',
        'howToPlayScreen',
        'aboutGameScreen',
        'statisticsScreen',
        'victoryScreen'
    ];
    
    screens.forEach(screenId => {
        const element = document.getElementById(screenId);
        if (element) {
            element.style.display = 'none';
        }
    });
}

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', function() {
    // Show loading screen for 2 seconds
    setTimeout(() => {
        document.getElementById('loadingScreen').style.display = 'none';
        document.getElementById('titleScreen').style.display = 'flex';
    }, 2000);
});

// Game control functions
function startGame(difficulty) {
    showPageTransition(() => {
        hideAllScreens();
        document.getElementById('gameScreen').style.display = 'block';
        window.game = new HitoriGame(difficulty);
    });
}

function showHowToPlay() {
    showPageTransition(() => {
        hideAllScreens();
        document.getElementById('howToPlayScreen').style.display = 'block';
    });
}

function showAboutGame() {
    showPageTransition(() => {
        hideAllScreens();
        document.getElementById('aboutGameScreen').style.display = 'block';
    });
}

function showStatistics() {
    showPageTransition(() => {
        hideAllScreens();
        document.getElementById('statisticsScreen').style.display = 'block';
    });
}

function showMenuBack() {
    showPageTransition(() => {
        hideAllScreens();
        document.getElementById('mainMenu').style.display = 'flex';
        if (window.game) {
            window.game.pause();
        }
    });
}

// Event listeners for menu buttons
document.addEventListener('DOMContentLoaded', () => {
    // Add click handlers for all menu buttons
    const menuButtons = document.querySelectorAll('.menu-btn');
    menuButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        });
    });
});