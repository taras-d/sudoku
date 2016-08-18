
var sudoku = new Sudoku();

function isErrorEqual(error, row, col, val, type) {
    return (
        error.row == row && error.col == col &&
        error.val == val && error.type == type
    );
}

QUnit.test('Check top left subgrid (2 repeat)', function(assert) {

    sudoku.errors = [];

    // Repeat number '3' twice at positions: 0-1, 0-2
    sudoku.grid = [
        [5,3,3,  6,7,8,  9,1,2], // <--
        [6,7,2,  1,9,5,  3,4,8],
        [1,9,8,  3,4,2,  5,6,7],

        [8,5,9,  7,6,1,  4,2,3],
        [4,2,6,  8,5,3,  7,9,1],
        [7,1,3,  9,2,4,  8,5,6],

        [9,6,1,  5,3,7,  2,8,4],
        [2,8,7,  4,1,9,  6,3,5],
        [3,4,5,  2,8,6,  1,7,9]
    ];

    sudoku._checkRange(0, 2, 0, 2);

    assert.ok(
        sudoku.errors.length == 2 &&
        isErrorEqual(sudoku.errors[0], 0, 1, 3, Sudoku.Error.Repeat) &&
        isErrorEqual(sudoku.errors[1], 0, 2, 3, Sudoku.Error.Repeat)
    );

});

QUnit.test('Check middle center subgrid (2 repeat, 2 empty)', function(assert) {

    sudoku.errors = [];

    // Repeat number '5' twice at positions: 3-5, 4-4
    // Two empty at position 5-5
    sudoku.grid = [
        [5,3,4,  6,7,8,  9,1,2],
        [6,7,2,  1,9,5,  3,4,8],
        [1,9,8,  3,4,2,  5,6,7],

        [8,5,9,  7,6,5,  4,2,3], // <--
        [4,2,6,  8,5,3,  7,9,1], // <--
        [7,1,3,  9,0,0,  8,5,6], // <--

        [9,6,1,  5,3,7,  2,8,4],
        [2,8,7,  4,1,9,  6,3,5],
        [3,4,5,  2,8,6,  1,7,9]
    ];

    sudoku._checkRange(3, 5, 3, 5);

    assert.ok(
        sudoku.errors.length == 4 &&
        isErrorEqual(sudoku.errors[0], 3, 5, 5, Sudoku.Error.Repeat) &&
        isErrorEqual(sudoku.errors[1], 4, 4, 5, Sudoku.Error.Repeat) &&
        isErrorEqual(sudoku.errors[2], 5, 4, 0, Sudoku.Error.Empty) &&
        isErrorEqual(sudoku.errors[3], 5, 5, 0, Sudoku.Error.Empty)
    );

});

QUnit.test('Check bottom right subgrid (4 repeat)', function(assert) {

    sudoku.errors = [];

    // Repeat number '2' twice at positions: 6-6, 6-8
    // Repeat number '1' twice at positions: 8-6, 8-8
    sudoku.grid = [
        [5,3,4,  6,7,8,  9,1,2],
        [6,7,2,  1,9,5,  3,4,8],
        [1,9,8,  3,4,2,  5,6,7],

        [8,5,9,  7,6,1,  4,2,3],
        [4,2,6,  8,5,3,  7,9,1],
        [7,1,3,  9,2,4,  8,5,6],

        [9,6,1,  5,3,7,  2,8,2], // <--
        [2,8,7,  4,1,9,  6,3,5],
        [3,4,5,  2,8,6,  1,7,1]  // <--
    ];

    sudoku._checkRange(6, 8, 6, 8);

    assert.ok(
        sudoku.errors.length == 4 &&
        isErrorEqual(sudoku.errors[0], 6, 6, 2, Sudoku.Error.Repeat) &&
        isErrorEqual(sudoku.errors[1], 6, 8, 2, Sudoku.Error.Repeat) &&
        isErrorEqual(sudoku.errors[2], 8, 6, 1, Sudoku.Error.Repeat) &&
        isErrorEqual(sudoku.errors[3], 8, 8, 1, Sudoku.Error.Repeat)
    );

});

QUnit.test('Check 2nd row (3 repeat, 1 empty)', function(assert) {

    sudoku.errors = [];

    // Repeat number '3' three times at positions: 1-2, 1-4, 1-6
    // One empty at position 1-5
    sudoku.grid = [
        [5,3,4,  6,7,8,  9,1,2],
        [6,7,3,  1,3,0,  3,4,8], // <--
        [1,9,8,  3,4,2,  5,6,7],

        [8,5,9,  7,6,1,  4,2,3],
        [4,2,6,  8,5,3,  7,9,1],
        [7,1,3,  9,2,4,  8,5,6],

        [9,6,1,  5,3,7,  2,8,4],
        [2,8,7,  4,1,9,  6,3,5],
        [3,4,5,  2,8,6,  1,7,9]
    ];

    sudoku._checkRange(1, 1, 0, 8);

    assert.ok(
        sudoku.errors.length == 4 &&
        isErrorEqual(sudoku.errors[0], 1, 2, 3, Sudoku.Error.Repeat) &&
        isErrorEqual(sudoku.errors[1], 1, 4, 3, Sudoku.Error.Repeat) &&
        isErrorEqual(sudoku.errors[2], 1, 5, 0, Sudoku.Error.Empty) &&
        isErrorEqual(sudoku.errors[3], 1, 6, 3, Sudoku.Error.Repeat)
    );

});

QUnit.test('Check 5th column (2 repeat, 2 empty)', function(assert) {

    sudoku.errors = [];

    // Repeat number '8' at positions: 3-4, 8-4
    // Two empty at positions: 1-4, 5-4
    sudoku.grid = [
        [5,3,4,  6,7,8,  9,1,2],
        [6,7,2,  1,0,5,  3,4,8], // <--
        [1,9,8,  3,4,2,  5,6,7],

        [8,5,9,  7,8,1,  4,2,3], // <--
        [4,2,6,  8,5,3,  7,9,1],
        [7,1,3,  9,0,4,  8,5,6], // <--

        [9,6,1,  5,3,7,  2,8,4],
        [2,8,7,  4,1,9,  6,3,5],
        [3,4,5,  2,8,6,  1,7,9]  // <--
    ];

    sudoku._checkRange(0, 8, 4, 4);

    assert.ok(
        sudoku.errors.length == 4 &&
        isErrorEqual(sudoku.errors[0], 1, 4, 0, Sudoku.Error.Empty) &&
        isErrorEqual(sudoku.errors[1], 3, 4, 8, Sudoku.Error.Repeat) &&
        isErrorEqual(sudoku.errors[2], 5, 4, 0, Sudoku.Error.Empty) &&
        isErrorEqual(sudoku.errors[3], 8, 4, 8, Sudoku.Error.Repeat)
    );

});

QUnit.test('Check all (7 repeat, 2 empty)', function(assert) {

    // Repeat number '7' four times at positions: 3-3, 3-7, 4-6, 8-7
    // Two empty at positions: 1-1, 7-1
    sudoku.grid = [
        [5,3,4,  6,7,8,  9,1,2],
        [6,0,2,  1,9,5,  3,4,8], // <--
        [1,9,8,  3,4,2,  5,6,7],

        [8,5,9,  7,6,1,  4,7,3], // <--
        [4,2,6,  8,5,3,  7,9,1], // <--
        [7,1,3,  9,2,4,  8,5,6],

        [9,6,1,  5,3,7,  2,8,4],
        [2,0,7,  4,1,9,  6,3,5], // <--
        [3,4,5,  2,8,6,  1,7,9]  // <--
    ];

    sudoku.check();

    assert.ok(
        sudoku.errors.length == 6 &&
        isErrorEqual(sudoku.errors[0], 1, 1, 0, Sudoku.Error.Empty) &&
        isErrorEqual(sudoku.errors[1], 3, 7, 7, Sudoku.Error.Repeat) &&
        isErrorEqual(sudoku.errors[2], 4, 6, 7, Sudoku.Error.Repeat) &&
        isErrorEqual(sudoku.errors[3], 7, 1, 0, Sudoku.Error.Empty) &&
        isErrorEqual(sudoku.errors[4], 3, 3, 7, Sudoku.Error.Repeat) &&
        isErrorEqual(sudoku.errors[5], 8, 7, 7, Sudoku.Error.Repeat)
    );

});

QUnit.test('Check all (no errors)', function(assert) {

    sudoku._copy();

    assert.ok( sudoku.check() );

});

QUnit.test('Swap rows 1 and 2', function(assert) {

    sudoku._copy();

    var beforeRow0 = sudoku.grid[0].slice(),
        beforeRow1 = sudoku.grid[1].slice();

    sudoku._swapRows(0, 1);

    var afterRow0 = sudoku.grid[0],
        afterRow1 = sudoku.grid[1];

    assert.deepEqual(beforeRow0, afterRow1);
    assert.deepEqual(beforeRow1, afterRow0);

});

QUnit.test('Swap columns 1 and 2', function(assert) {

    sudoku._copy();

    var beforeCol0 = [], beforeCol1 = [];
    for (var i = 0; i < sudoku.grid.length; ++i) {
        beforeCol0.push( sudoku.grid[i][0] );
        beforeCol1.push( sudoku.grid[i][1] );
    }

    sudoku._swapCols(0, 1);

    var afterCol0 = [], afterCol1 = [];
    for (var i = 0; i < sudoku.grid.length; ++i) {
        afterCol0.push( sudoku.grid[i][0] );
        afterCol1.push( sudoku.grid[i][1] );
    }

    assert.deepEqual(beforeCol0, afterCol1);
    assert.deepEqual(beforeCol1, afterCol0);

});

QUnit.test('Mix', function(assert) {

    sudoku._copy();
    sudoku._mix();

    assert.notDeepEqual(sudoku.baseGrid, sudoku.grid);

});

var clearPer = sudoku._random(10, 91);
QUnit.test('Clear ' + clearPer + '%', function(assert) {

    sudoku._copy();
    sudoku._clear(clearPer);
    sudoku.check();

    var gridLen = sudoku.grid.length,
        clearCount = Math.floor( (gridLen * gridLen) * clearPer / 100 ),
        allEmpty = true;
    for (var i = 0; i < sudoku.errors; ++i) {
        if (sudoku.errors[i].type != Sudoku.Error.Empty) {
            allEmpty = false;
            break;
        }
    }

    assert.ok(
        sudoku.errors.length == clearCount && allEmpty
    );

});

QUnit.test('Set number', function(assert) {

    assert.ok(
        sudoku.setNumber(0, 0, 8),
        'Valid number'
    );

    assert.ok(
        !sudoku.setNumber(0, 0, 11),
        'Invalid number'
    );

});
