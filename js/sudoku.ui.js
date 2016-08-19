
// Sudoku UI constructor
function SudokuUI(element) {

    this.level = Sudoku.Level.Medium;
    this.sudoku = new Sudoku(this.level);

    this.$sudoku = element;

    this.$gridWrap = this.$sudoku.find('.grid-wrap');
    this.$grid = this.$gridWrap.find('.grid');
    this.$keyboard = this.$gridWrap.find('.keyboard');
    this.$solved = this.$gridWrap.find('.solved');

    this.$controls = this.$sudoku.find('.controls');
    this.$newGame = this.$controls.find('.new-game');
    this.$level = this.$controls.find('.level');
    this.$check = this.$controls.find('.check');

    this.$selectedCell = null;

    this.table = this.$grid[0];

    // Init
    this._init = function() {
        this._initEvents();
        this._initLevels();
        this._fillTable();
        if ('ontouchstart' in window) {
            // Mobile friendly keyboard
            this.$keyboard.addClass('touch');
        }
    };

    // Init events listeners
    this._initEvents = function() {
        this.$grid.find('td').click(this._cellClick.bind(this));
        this.$keyboard.find('td').click(this._keyboardClick.bind(this));
        this.$newGame.click(this._newGameClick.bind(this));
        this.$check.click(this._checkClick.bind(this));
    };

    // Init levels
    this._initLevels = function() {
        for (var level in Sudoku.Level) {
            this.$level.append(
                $('<option>', {
                    text: level,
                    val: Sudoku.Level[level],
                    selected: Sudoku.Level[level] == this.level
                })
            );
        }
    };

    // Get cell by position
    this._getCell = function(row, col) {
        return $(this.table.rows[row].cells[col]);
    };

    // Get selected cell position
    this._getSelectedCellPosition = function() {
        if (this.$selectedCell) {
            var cell = this.$selectedCell[0];
            return {
                row: cell.parentElement.rowIndex,
                col: cell.cellIndex
            };
        }
        return null;
    };

    // Remove cells class
    this._removeCellsClass = function(classes) {
        this.$grid.find('td').removeClass(classes);
    };

    // Fill table
    this._fillTable = function() {
        this._removeCellsClass('disabled repeat empty');
        var grid = this.sudoku.grid,
            number, cell;
        for (var i = 0; i < grid.length; ++i) {
            for (var j = 0; j < grid[i].length; ++j) {
                number = grid[i][j];
                cell = this._getCell(i, j);
                cell.text('');
                if (number != 0) {
                    cell.text(number).addClass('disabled');
                }
            }
        }
    };

    // Cell click
    this._cellClick = function(event) {
        this._removeCellsClass('repeat empty');
        var cell = $(event.target);
        if (cell.hasClass('disabled')) {
            this._hideKeyboard();
            return;
        }
        this.$selectedCell = cell;
        this._showKeyboard();
    };

    // Keyboard click
    this._keyboardClick = function(event) {
        var cell = $(event.target),
            cellPos = this._getSelectedCellPosition(),
            number = cell.hasClass('clear')? 0: Number(cell.text());
        this.$selectedCell.text( (number)? number: '' );
        this.$selectedCell = null;
        this.sudoku.setNumber(cellPos.row, cellPos.col, number);
        this._hideKeyboard();
        this._check(false);
    };

    // New game click
    this._newGameClick = function(event) {
        this.level = +this.$level.val();
        this.sudoku.newGame(this.level);
        this._hideSolved();
        this._fillTable();
    };

    // Check click
    this._checkClick = function(event) {
        this._check(true);
    };

    // Check grid
    this._check = function(showErrors) {
        this._removeCellsClass('repeat empty');
        if (this.sudoku.check()) {
            this._showSolved();
        } else if (showErrors){
            $.each(this.sudoku.errors, function(index, err) {
                var cell = this._getCell(err.row, err.col);
                cell.addClass(err.type);
            }.bind(this));
        }
    };

    // Show keyboard
    this._showKeyboard = function() {
        var cell = this.$selectedCell;
        if (!cell) {
            return;
        }
        var cellPos = cell.position(),
            cellWidth = cell.width(),
            cellHeight = cell.height();
        var kbWidth = this.$keyboard.outerWidth(),
            kbHeight = this.$keyboard.outerHeight();
        var gridWidth = this.$grid.width(),
            gridHeight = this.$grid.height();
        var top = cellPos.top - ((kbHeight - cellHeight) / 2),
            left = cellPos.left - ((kbWidth - cellWidth) / 2);
        // Prevent to appear keyboard outside grid
        if (left < 0) {
            left = 0;
        } else if (left + kbWidth > gridWidth) {
            left = gridWidth - kbWidth;
        }
        if (top < 0) {
            top = 0;
        } else if (top + kbHeight > gridHeight) {
            top = gridHeight - kbHeight;
        }
        this.$keyboard.css({ top: top, left: left }).show();
    };

    // Hide keyboard
    this._hideKeyboard = function() {
        this.$keyboard.hide();
    };

    // Show solved message
    this._showSolved = function() {
        this.$solved.show();
    };

    // Hide solved message
    this._hideSolved = function() {
        this.$solved.hide();
    };

    // Init Sudoku UI
    this._init();

}
