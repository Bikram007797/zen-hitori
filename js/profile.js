class Profile {
    constructor() {
        this.scores = this.loadScores();
    }

    loadScores() {
        const savedScores = localStorage.getItem('hitoriScores');
        return savedScores ? JSON.parse(savedScores) : {
            easy: [],
            medium: [],
            hard: []
        };
    }

    saveScores() {
        localStorage.setItem('hitoriScores', JSON.stringify(this.scores));
    }

    addScore(score) {
        if (!this.scores[score.difficulty]) {
            this.scores[score.difficulty] = [];
        }
        
        this.scores[score.difficulty].push(score.time);
        this.scores[score.difficulty].sort((a, b) => a - b);
        
        // Keep only top 10 scores
        if (this.scores[score.difficulty].length > 10) {
            this.scores[score.difficulty] = this.scores[score.difficulty].slice(0, 10);
        }
        
        this.saveScores();
    }

    getBestScore(difficulty) {
        if (!this.scores[difficulty] || this.scores[difficulty].length === 0) {
            return null;
        }
        return this.scores[difficulty][0];
    }

    getAverageScore(difficulty) {
        if (!this.scores[difficulty] || this.scores[difficulty].length === 0) {
            return null;
        }
        const sum = this.scores[difficulty].reduce((a, b) => a + b, 0);
        return Math.floor(sum / this.scores[difficulty].length);
    }

    getGamesPlayed(difficulty) {
        return this.scores[difficulty] ? this.scores[difficulty].length : 0;
    }
}