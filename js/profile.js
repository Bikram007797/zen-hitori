class Profile {
    constructor() {
        this.data = this.load();
    }

    load() {
        const defaultProfile = {
            name: 'Player',
            gamesPlayed: 0,
            gamesWon: 0,
            currentStreak: 0,
            bestStreak: 0,
            bestTimes: {
                easy: Infinity,
                medium: Infinity,
                hard: Infinity
            },
            preferences: {
                sound: true,
                vibration: true,
                theme: 'classic'
            }
        };
        
        const saved = localStorage.getItem('zen_hitori_profile');
        return saved ? JSON.parse(saved) : defaultProfile;
    }

    save() {
        localStorage.setItem('zen_hitori_profile', JSON.stringify(this.data));
    }
}