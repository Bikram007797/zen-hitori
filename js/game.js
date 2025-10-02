class HitoriGame {
    constructor(difficulty = 'easy') {
        this.profile = new Profile();
        this.currentDifficulty = difficulty;
        this.grid = null;
        this.solution = null;
        this.gridSize = this.getGridSizeForDifficulty(difficulty);
        this.hintsLeft = this.getInitialHints(difficulty);
        this.initialize();
    }

    getGridSizeForDifficulty(difficulty) {
        return {
            'easy': 6,
            'medium': 7,
            'hard': 8
        }[difficulty] || 6;
    }

    getInitialHints(difficulty) {
        return {
            'easy': 3,
            'medium': 2,
            'hard': 1
        }[difficulty] || 3;
    }

    initialize() {
        this.generateGrid();
        this.calculateSolution();
        this.startTime = Date.now();
        this.renderGrid();
    }

    generateGrid() {
        this.grid = [];
        for (let i = 0; i < this.gridSize; i++) {
            let row = [];
            for (let j = 0; j < this.gridSize; j++) {
                // Generate numbers 1 to gridSize
                row.push(Math.floor(Math.random() * this.gridSize) + 1);
            }
            this.grid.push(row);
        }
        // Ensure at least one solution exists
        this.ensureValidPuzzle();
    }

    ensureValidPuzzle() {
        // Make sure there's at least one valid solution
        // by ensuring no more than two same numbers in adjacent cells
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                let count = 0;
                // Check horizontally
                if (j > 0 && this.grid[i][j] === this.grid[i][j-1]) count++;
                if (j < this.gridSize-1 && this.grid[i][j] === this.grid[i][j+1]) count++;
                // Check vertically
                if (i > 0 && this.grid[i][j] === this.grid[i-1][j]) count++;
                if (i < this.gridSize-1 && this.grid[i][j] === this.grid[i+1][j]) count++;
                
                if (count > 2) {
                    this.grid[i][j] = (this.grid[i][j] % this.gridSize) + 1;
                }
            }
        }
    }

    calculateSolution() {
        // Initialize solution grid with all cells unshaded
        this.solution = Array(this.gridSize).fill().map(() => 
            Array(this.gridSize).fill(false)
        );
        
        // Simple solution strategy: shade cells to eliminate duplicates
        // while maintaining connectivity
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                if (!this.solution[i][j]) {
                    // Check for duplicates in row and column
                    this.checkAndShadeCell(i, j);
                }
            }
        }
    }

    checkAndShadeCell(row, col) {
        const current = this.grid[row][col];
        
        // Check row
        for (let j = 0; j < this.gridSize; j++) {
            if (j !== col && this.grid[row][j] === current && !this.solution[row][j]) {
                if (this.canShadeCell(row, j)) {
                    this.solution[row][j] = true;
                }
            }
        }
        
        // Check column
        for (let i = 0; i < this.gridSize; i++) {
            if (i !== row && this.grid[i][col] === current && !this.solution[i][col]) {
                if (this.canShadeCell(i, col)) {
                    this.solution[i][col] = true;
                }
            }
        }
    }

    canShadeCell(row, col) {
        // Check if shading this cell would break connectivity rules
        this.solution[row][col] = true;
        const isValid = this.checkConnectivity();
        this.solution[row][col] = false;
        return isValid;
    }

    checkConnectivity() {
        // Find first unshaded cell
        let startCell = null;
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                if (!this.solution[i][j]) {
                    startCell = {i, j};
                    break;
                }
            }
            if (startCell) break;
        }
        
        if (!startCell) return false;
        
        // Do flood fill from start cell
        const visited = Array(this.gridSize).fill().map(() => 
            Array(this.gridSize).fill(false)
        );
        
        this.floodFill(startCell.i, startCell.j, visited);
        
        // Check if all unshaded cells were reached
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                if (!this.solution[i][j] && !visited[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }

    floodFill(i, j, visited) {
        if (i < 0 || i >= this.gridSize || j < 0 || j >= this.gridSize) return;
        if (visited[i][j] || this.solution[i][j]) return;
        
        visited[i][j] = true;
        
        this.floodFill(i-1, j, visited);
        this.floodFill(i+1, j, visited);
        this.floodFill(i, j-1, visited);
        this.floodFill(i, j+1, visited);
    }

    renderGrid() {
        const gameGrid = document.getElementById('gameGrid');
        gameGrid.innerHTML = '';
        gameGrid.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;
        
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.textContent = this.grid[i][j];
                cell.dataset.row = i;
                cell.dataset.col = j;
                
                cell.addEventListener('click', () => this.toggleCell(i, j));
                gameGrid.appendChild(cell);
            }
        }
        
        // Update hints display
        document.getElementById('hintsLeft').textContent = `Hints: ${this.hintsLeft}`;
    }

    toggleCell(row, col) {
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        cell.classList.toggle('shaded');
        
        // Add vibration feedback
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }

    getHint() {
        if (this.hintsLeft <= 0) return;
        
        // Find a cell that should be shaded but isn't
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                if (this.solution[i][j]) {
                    const cell = document.querySelector(`.cell[data-row="${i}"][data-col="${j}"]`);
                    if (!cell.classList.contains('shaded')) {
                        cell.classList.add('shaded');
                        this.hintsLeft--;
                        document.getElementById('hintsLeft').textContent = `Hints: ${this.hintsLeft}`;
                        return;
                    }
                }
            }
        }
    }

    checkSolution() {
        const cells = document.querySelectorAll('.cell');
        let correct = true;
        
        cells.forEach(cell => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            const isShaded = cell.classList.contains('shaded');
            
            if (isShaded !== this.solution[row][col]) {
                correct = false;
            }
        });
        
        if (correct) {
            alert('Congratulations! You solved the puzzle!');
            this.profile.addScore({
                difficulty: this.currentDifficulty,
                time: Math.floor((Date.now() - this.startTime) / 1000)
            });
        } else {
            alert('Not quite right. Keep trying!');
        }
    }

    pause() {
        // Implement pause functionality
        this.isPaused = !this.isPaused;
        const gameGrid = document.getElementById('gameGrid');
        if (this.isPaused) {
            gameGrid.style.opacity = '0.5';
            gameGrid.style.pointerEvents = 'none';
        } else {
            gameGrid.style.opacity = '1';
            gameGrid.style.pointerEvents = 'auto';
        }
    }

    restart() {
        if (confirm('Are you sure you want to restart?')) {
            this.initialize();
        }
    }
}