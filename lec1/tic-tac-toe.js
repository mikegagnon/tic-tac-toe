function assert(condition) {
    if (!condition) {
        console.error("Assertion failed");
    }
}

NUM_ROWS = 3;
NUM_COLS = 3;

EMPTY = 0;
PLAYER_X = 1;
PLAYER_O = 2;

class TicTacToe {

    constructor() {
        this.matrix = [
            [EMPTY, EMPTY,EMPTY],
            [EMPTY, EMPTY,EMPTY],
            [EMPTY, EMPTY,EMPTY]
        ];

        this.player_turn = PLAYER_X;
    }

    makeMove(row, col) {

        assert(row >= 0 && row < NUM_ROWS);
        assert(col >= 0 && col < NUM_COLS);

        if (this.matrix[row][col] != EMPTY) {
            return;
        }

        this.matrix[row][col] = this.player_turn;

        if (this.player_turn == PLAYER_X) {
            this.player_turn = PLAYER_O;
        } else if (this.player_turn == PLAYER_O) {
            this.player_turn = PLAYER_X;
        } else {
            assert(false);
        }

    }

}

/*******************************************************************************
 * TESTS
 ******************************************************************************/

// Returns true iff the matrices are equal 
function matricesEqual(matrix1, matrix2) {
    for (row = 0; row < NUM_ROWS; row++) {
        for (col = 0; col < NUM_COLS; col++) {
            if (matrix1[row][col] != matrix2[row][col]) {
                return false;
            }
        }
    }

    return true;
}

// Test player 1 makeMove(0, 0)
var game = new TicTacToe();
game.makeMove(0, 0);
var expected_matrix = [
    [PLAYER_X, EMPTY, EMPTY],
    [EMPTY,    EMPTY, EMPTY],
    [EMPTY,    EMPTY, EMPTY]
]
assert(matricesEqual(game.matrix, expected_matrix));

// Test: player-x makeMove(0, 0), then player-o makeMove(1, 1)
//  
var game = new TicTacToe();
game.makeMove(0, 0);
var expected_matrix = [
    [PLAYER_X, EMPTY, EMPTY],
    [EMPTY,    EMPTY, EMPTY],
    [EMPTY,    EMPTY, EMPTY]
]
assert(matricesEqual(game.matrix, expected_matrix));

game.makeMove(1, 1)
var expected_matrix = [
    [PLAYER_X, EMPTY,    EMPTY],
    [EMPTY,    PLAYER_O, EMPTY],
    [EMPTY,    EMPTY,    EMPTY]
]
assert(matricesEqual(game.matrix, expected_matrix));

// Test: player-x makeMove(0, 0), then player-o makeMove(0, 0), which is an
// occupied cell
var game = new TicTacToe();
game.makeMove(0, 0);
var expected_matrix = [
    [PLAYER_X, EMPTY, EMPTY],
    [EMPTY,    EMPTY, EMPTY],
    [EMPTY,    EMPTY, EMPTY]
]
assert(matricesEqual(game.matrix, expected_matrix));

game.makeMove(0, 0)
var expected_matrix = [
    [PLAYER_X, EMPTY,    EMPTY],
    [EMPTY,    EMPTY, EMPTY],
    [EMPTY,    EMPTY,    EMPTY]
]
assert(matricesEqual(game.matrix, expected_matrix));
assert(game.player_turn = PLAYER_O);
