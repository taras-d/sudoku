
/*
    Example:

    // Create sudoku with medium level
    var sudoku = new Sudoku();

    // Show grid in console
    sudoku.show();

    // Set number in position 1-1
    // (Set 0 to clear cell)
    sudoku.setNumber(1, 1, 5);
    sudoku.show();

    // Check grid
    if (sudoku.check()) {
        console.log('Well done!');
    } else {
        console.log(sudoku.errors);
    }

    // Start new game in Hard level
    sudoku.newGame(Sudoku.Level.Hard);
    sudoku.show();
*/

// Sudoku constructor
function Sudoku(level) {

    // Base grid
    this.baseGrid = [
        [5,3,4,  6,7,8,  9,1,2],
        [6,7,2,  1,9,5,  3,4,8],
        [1,9,8,  3,4,2,  5,6,7],

        [8,5,9,  7,6,1,  4,2,3],
        [4,2,6,  8,5,3,  7,9,1],
        [7,1,3,  9,2,4,  8,5,6],

        [9,6,1,  5,3,7,  2,8,4],
        [2,8,7,  4,1,9,  6,3,5],
        [3,4,5,  2,8,6,  1,7,9]
    ];

    // Generated grid
    this.grid = [];

    // Errors
    this.errors = [];

    // New game
    this.newGame = function(level) {
        this.errors = [];
        this._generateGrid(level || Sudoku.Level.Medium);
    };

    // Set number in specific position
    this.setNumber = function(row, col, num) {
        num = Number(num);
        if (num >= 0 && num <= 9) {
            this.grid[row][col] = num;
            return true;
        }
        return false;
    };

    // Check at errors
    this.check = function() {
      	this.errors = [];
        this._checkSubgrids();
        this._checkRows();
        this._checkCols();
        return (this.errors.length == 0);
    };

    // Show grid in console
    this.show = function() {
        console.log(this.toString());
    };

    // Convert grid to string
    this.toString = function() {
        var grid = this.grid,
            str = '\n';
        for (var i = 0; i < grid.length; ++i) {
            if (i != 0 && i % 3 == 0) {
                str += '-----------------------\n';
            }
            str += ' ';
            for (var j = 0; j < grid[i].length; ++j) {
                if (j != 0 && j % 3 == 0) {
                    str += '| ';
                }
                str += grid[i][j];
                str += this._hasError(i, j)? '*': ' ';
            }
            str += '\n';
        }
        return str;
    };

    // Generate grid.
    // Instead of creating grid from scratch, I copy base grid and mix it
    this._generateGrid = function(level) {
        this._copy();
        this._mix();
        this._clear(level);
    };

    // Copy base grid
    this._copy = function() {
        this.grid = [];
        for (var i = 0; i < this.baseGrid.length; ++i) {
            this.grid.push( this.baseGrid[i].slice() );
        }
    };

    // Mix grid
    this._mix = function() {
        this._swapRowsCols(0, 3);
        this._swapRowsCols(3, 6);
        this._swapRowsCols(6, 9);
    };

    // Swap rows and columns in specific range
    this._swapRowsCols = function(from, to) {
        var i = 0, j, k;
        while (i < 3) {
            j = this._random(from, to);
            k = this._random(from, to);
            if (j != k) {
                this._swapRows(j, k);
                this._swapCols(j, k);
                ++i;
            }
        }
    };

    // Swap rows
    this._swapRows = function(row1, row2) {
        var grid = this.grid, tmp;
        for (var i = 0; i < grid[row1].length; ++i) {
            tmp = grid[row1][i];
            grid[row1][i] = grid[row2][i];
            grid[row2][i] = tmp;
        }
    };

    // Swap columns
    this._swapCols = function(col1, col2) {
        var grid = this.grid, tmp;
        for (var i = 0; i < grid.length; ++i) {
            tmp = grid[i][col1];
            grid[i][col1] = grid[i][col2];
            grid[i][col2] = tmp;
        }
    }

    // Clear grid by specific amount of percents
    this._clear = function(percent) {
        var grid = this.grid,
            gridLen = grid.length,
            clearCount = Math.floor( (gridLen * gridLen) * percent / 100 ),
            cleared = [],
            i = 0, row, col;
        while (i < clearCount) {
            row = this._random(0, gridLen);
            col = this._random(0, gridLen);
            if (cleared.indexOf(row + '-' + col) == -1) {
                grid[row][col] = 0;
                cleared.push(row + '-' + col);
                ++i;
            }
        }
    };

    // Check subgrids
    this._checkSubgrids = function() {
        this._checkRange(0, 2, 0, 2); // top left
        this._checkRange(0, 2, 3, 5); // top center
        this._checkRange(0, 2, 6, 8); // top right
        this._checkRange(3, 5, 0, 2); // middle left
        this._checkRange(3, 5, 3, 5); // middle center
        this._checkRange(3, 5, 6, 8); // middle right
        this._checkRange(6, 8, 0, 2); // bottom left
        this._checkRange(6, 8, 3, 5); // bottom center
        this._checkRange(6, 8, 6, 8); // bottom right
    };

    // Check grid rows
    this._checkRows = function() {
        var grid = this.grid;
        for (var i = 0; i < grid.length; ++i) {
            this._checkRange(i, i, 0, grid[i].length - 1);
        }
    };

    // Check grid columns
    this._checkCols = function() {
        var grid = this.grid;
        for (var i = 0; i < grid.length; ++i) {
            this._checkRange(0, grid.length - 1, i, i);
        }
    };

    // Check grid specific range
    this._checkRange = function(rowStart, rowEnd, colStart, colEnd) {
        var grid = this.grid,
            i, j, k, l;
        for (i = rowStart; i <= rowEnd; ++i) for (j = colStart; j <= colEnd; ++j) {
            if (grid[i][j] == 0) {
                this._addError(i, j, Sudoku.Error.Empty);
                continue;
            }
            for (k = rowStart; k <= rowEnd; ++k) for (l = colStart; l <= colEnd; ++l) {
                if (i == k && j == l) {
                    continue;
                }
                if (grid[i][j] == grid[k][l]) {
                    this._addError(i, j, Sudoku.Error.Repeat);
                }
            }
        }
    };

    // Add error
    this._addError = function(row, col, type) {
        if (this._hasError(row, col)) {
            // Skip duplicates
            return;
        }
        this.errors.push({
            row: row, col: col,
            val: this.grid[row][col],
            type: type
        });
    };

    // Check whether grid has error in specific position
    this._hasError = function(row, col) {
        var errs = this.errors;
        for (var i = 0; i < errs.length; ++i) {
            if (errs[i].row == row && errs[i].col == col) {
                return true;
            }
        }
        return false;
    };

    // Get random number
    this._random = function(from, to) {
        return Math.floor( Math.random() * (from - to) + to );
    };

    // Start new game
    this.newGame(level);

}

// Level - how much grid is empty in percentages
Sudoku.Level = {
    Easy: 25,
    Medium: 50,
    Hard: 75
};

Sudoku.Error = {
    Repeat: 'repeat',
    Empty: 'empty'
};
