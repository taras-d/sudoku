
/*
    Example:

    // Create sudoku with medium level
    var sudoku = new Sudoku();

    // Show matrix in console
    sudoku.show();

    // Set number in position 1-1
    // (Set 0 to clear cell)
    sudoku.setNumber(1, 1, 5);
    sudoku.show();

    // Check matrix
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

    // Base matrix
    this.baseMatrix = [
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

    // Generated matrix
    this.matrix = [];

    // Errors
    this.errors = [];

    // New game
    this.newGame = function(level) {
        this.errors = [];
        this._generateMatrix(level || Sudoku.Level.Medium);
    };

    // Set number in specific position
    this.setNumber = function(row, col, num) {
        num = Number(num);
        if (num >= 0 || num <= 9) {
            this.matrix[row][col] = num;
        }
    };

    // Check at errors
    this.check = function() {
      	this.errors = [];
        this._checkSquares();
        this._checkRows();
        this._checkCols();
        return (this.errors.length == 0);
    };

    // Show matrix in console
    this.show = function() {
        console.log(this.toString());
    };

    // Convert matrix to string
    this.toString = function() {
        var mtx = this.matrix,
            str = '\n';
        for (var i = 0; i < mtx.length; ++i) {
            if (i != 0 && i % 3 == 0) {
                str += '-----------------------\n';
            }
            str += ' ';
            for (var j = 0; j < mtx[i].length; ++j) {
                if (j != 0 && j % 3 == 0) {
                    str += '| ';
                }
                str += mtx[i][j];
                str += this._hasError(i, j)? '*': ' ';
            }
            str += '\n';
        }
        return str;
    };

    // Generate matrix.
    // Instead of creating matrix from scratch, I copy base matrix and mix it
    this._generateMatrix = function(level) {
        this._copy();
        this._mix();
        this._clear(level);
    };

    // Copy base matrix
    this._copy = function() {
        this.matrix = [];
        for (var i = 0; i < this.baseMatrix.length; ++i) {
            this.matrix.push( this.baseMatrix[i].slice() );
        }
    };

    // Mix matrix
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
        var mtx = this.matrix, tmp;
        for (var i = 0; i < mtx[row1].length; ++i) {
            tmp = mtx[row1][i];
            mtx[row1][i] = mtx[row2][i];
            mtx[row2][i] = tmp;
        }
    };

    // Swap columns
    this._swapCols = function(col1, col2) {
        var mtx = this.matrix, tmp;
        for (var i = 0; i < mtx.length; ++i) {
            tmp = mtx[i][col1];
            mtx[i][col1] = mtx[i][col2];
            mtx[i][col2] = tmp;
        }
    }

    // Clear matrix by specific amount of percents
    this._clear = function(percent) {
        var mtx = this.matrix,
            mtxLen = mtx.length,
            clearCount = Math.floor( (mtxLen * mtxLen) * percent / 100 ),
            cleared = [],
            i = 0, row, col;
        while (i < clearCount) {
            row = this._random(0, mtxLen);
            col = this._random(0, mtxLen);
            if (cleared.indexOf(row + '-' + col) == -1) {
                mtx[row][col] = 0;
                cleared.push(row + '-' + col);
                ++i;
            }
        }
    };

    // Check squares of matrix
    this._checkSquares = function() {
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

    // Check matrix rows
    this._checkRows = function() {
        var mtx = this.matrix;
        for (var i = 0; i < mtx.length; ++i) {
            this._checkRange(i, i, 0, mtx[i].length - 1);
        }
    };

    // Check matrix columns
    this._checkCols = function() {
        var mtx = this.matrix;
        for (var i = 0; i < mtx.length; ++i) {
            this._checkRange(0, mtx.length - 1, i, i);
        }
    };

    // Check matrix specific range
    this._checkRange = function(rowStart, rowEnd, colStart, colEnd) {
        var mtx = this.matrix,
            i, j, k, l;
        for (i = rowStart; i <= rowEnd; ++i) for (j = colStart; j <= colEnd; ++j) {
            if (mtx[i][j] == 0) {
                this._addError(i, j, Sudoku.Error.Empty);
                continue;
            }
            for (k = rowStart; k <= rowEnd; ++k) for (l = colStart; l <= colEnd; ++l) {
                if (i == k && j == l) {
                    continue;
                }
                if (mtx[i][j] == mtx[k][l]) {
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
            val: this.matrix[row][col],
            type: type
        });
    };

    // Check whether matrix has error in specific position
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

// Level - how much matrix is empty in percentages
Sudoku.Level = {
    Easy: 25,
    Medium: 50,
    Hard: 75
};

Sudoku.Error = {
    Repeat: 'repeat',
    Empty: 'empty'
};
