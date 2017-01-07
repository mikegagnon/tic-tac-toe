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

/*******************************************************************************
 * Move is the interface between TicTacToe and Viz
 ******************************************************************************/
class Move {
    // valid == true iff the move results in change in game state
    // (row, col) are the coordinates that player added their mark
    // player is either PLAYER_X or PLAYER_O, depending on who made the move
    // gameOver is either undefined (which signifies the game has not concluded)
    // or gameOver is a GameOver object, representing the conclusion of the game
    constructor(valid, row, col, player, gameOver) {
        this.valid = valid;
        this.row = row;
        this.col = col;
        this.player = player;
        this.gameOver = gameOver;
    }
}

/*******************************************************************************
 * GameOver
 ******************************************************************************/
// GameOver objects store information about the end of the game.
class GameOver {

    // There are two fields in a GameOver object:
    //      1. this.victor
    //      2. this.victoryCells
    //
    // this.victor
    // ===========
    // this.victor is equal to one of the following:
    //      (A) undefined
    //      (B) PLAYER_X
    //      (C) PLAYER_O
    //
    // if this.victor == undefined, then that indicates the game ended ina draw
    // if this.victor == PLAYER_X, then that indicates PLAYER_X won the game
    // if this.victor == PLAYER_O, then that indicates PLAYER_O won the game
    //
    // this.victoryCells
    // =================
    // this.victoryCells is either:
    //      (A) undefined
    //      (B) a list of three [row, col] pairs
    //
    // if this.victoryCells == undefined, then that indicates the game ended in
    // a draw.
    //
    // if this.victoryCells is a list of three [row, col] pairs, then that
    // indicates the game has ended in a victory. Furthermore the three 
    // [row, col] pairs indicate which cells contain the winning 3-in-a-row
    // marks.
    // 
    // As an example: this.victoryCells might equal [[0,0], [1,1], [2, 2]].
    // This denotes that (row 0, col 0), (row 1, col 1), and (row 2, col 2)
    // constitute the three cells that contain the winning 3-in-a-row marks.
    constructor(victor, victoryCells) {
        this.victor = victor;
        this.victoryCells = victoryCells;
    }
}

/*******************************************************************************
 * TicTacToe class
 ******************************************************************************/
class TicTacToe {

    // player is either PLAYER_X or PLAYER_O, and indicates which player has
    // the opening move
    constructor(player) {
        this.matrix = [
            [EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY]
        ];

        assert(player == PLAYER_X || player == PLAYER_O);

        // this.player always equals the player (either PLAYER_X or PLAYER_O)
        // who has the next move.
        this.player = player;

        // If the game is over, then this.gameOver equals a GameOver object
        // that describes the properties of the conclusion of the game
        // If the game is not over, then this.gameOver is undefined;
        this.gameOver = undefined;

    }

    checkVictoryHorizontal() {
        for (var row = 0; row < NUM_ROWS; row++) {
            var a = this.matrix[row][0];
            var b = this.matrix[row][1];
            var c = this.matrix[row][2];

            if (a == b && b == c && a != EMPTY) {
                this.gameOver = new GameOver(a, [[row, 0], [row, 1], [row, 2]]);
            }
        }
    }

    checkVictoryVertical() {
        for (var col = 0; col < NUM_COLS; col++) {
            var a = this.matrix[0][col];
            var b = this.matrix[1][col];
            var c = this.matrix[2][col];

            if (a == b && b == c && a != EMPTY) {
                this.gameOver = new GameOver(a, [[0, col], [1, col], [2, col]]);
            }
        }
    }

    checkVictoryDiagonal() {
        var a = this.matrix[0][0];
        var b = this.matrix[1][1];
        var c = this.matrix[2][2];
        if (a == b && b == c && a != EMPTY) {
            this.gameOver = new GameOver(a, [[0, 0], [1, 1], [2, 2]]);
        }

        var a = this.matrix[0][2];
        var b = this.matrix[1][1];
        var c = this.matrix[2][0];
        if (a == b && b == c && a != EMPTY) {
            this.gameOver = new GameOver(a, [[0, 2], [1, 1], [2, 0]]);
        }
    }

    checkDraw() {
        for (var row = 0; row < NUM_ROWS; row++) {
            for (var col = 0; col < NUM_COLS; col++) {
                if (this.matrix[row][col] == EMPTY) {
                    return;
                }
            }
        }

        this.gameOver = new GameOver(undefined, undefined);
    }


    // Determines whether or not the game has reached its conclusion.
    // If the game is over, then sets this.gameOver to a GameOver object
    // representing the conclusion of the game.
    checkGameOver() {
        this.checkVictoryHorizontal();
        this.checkVictoryVertical();
        this.checkVictoryDiagonal();
        if (this.gameOver == undefined) {
            this.checkDraw();
        }
    }

    makeMove(row, col) {

        assert(row >= 0 && row < NUM_ROWS);
        assert(col >= 0 && col < NUM_COLS);

        if (this.matrix[row][col] != EMPTY || this.gameOver != undefined) {
            return new Move(false, undefined, undefined, undefined);
        } 

        this.matrix[row][col] = this.player;

        var move = new Move(true, row, col, this.player, this.gameOver);
        this.checkGameOver();

        if (this.player == PLAYER_X) {
            this.player = PLAYER_O;
        } else {
            this.player = PLAYER_X;
        }

        return move;
    }

}

/*******************************************************************************
 * Vizualization code
 ******************************************************************************/
 class Viz {
    
    static getCellId(row, col) {
        return "cell-" + row + "-" + col;
    }

    getImgTag(player) {
        var filename;
        if (player == PLAYER_X) {
            filename = "player-x.png";
        } else if (player == PLAYER_O) {
            filename = "player-o.png";
        } else {
            assert(false);
        }

        return "<img src='" + filename + "' width=" + this.cell_size + " >";
    }

    constructor(cell_size) {
        this.cell_size = cell_size;

        $(".cell").css("height", this.cell_size);
        $(".cell").css("width", this.cell_size);
    }

    drawMove(move) {
        if (!move.valid) {
            return;
        }

        var cellId = Viz.getCellId(move.row, move.col);
        var imgTag = this.getImgTag(move.player);
        $("#" + cellId).append(imgTag);
    }
 }

/*******************************************************************************
 * Controller code
 ******************************************************************************/
var GAME = new TicTacToe(PLAYER_X);
var VIZ = new Viz(100);

function cellClick(row, col) {

    var move = GAME.makeMove(row, col);
    VIZ.drawMove(move);

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

// Test player-x makeMove(0, 0)
var game = new TicTacToe(PLAYER_X);
game.makeMove(0, 0);
var expected_matrix = [
    [PLAYER_X, EMPTY, EMPTY],
    [EMPTY,    EMPTY, EMPTY],
    [EMPTY,    EMPTY, EMPTY]
]
assert(matricesEqual(game.matrix, expected_matrix));

// Test player-x makeMove(1, 1)
var game = new TicTacToe(PLAYER_X);
game.makeMove(1, 1);
var expected_matrix = [
    [EMPTY,    EMPTY,    EMPTY],
    [EMPTY,    PLAYER_X, EMPTY],
    [EMPTY,    EMPTY,    EMPTY]
]
assert(matricesEqual(game.matrix, expected_matrix));

// Test opening player as PLAYER_O
var game = new TicTacToe(PLAYER_O);
game.makeMove(0, 0);
var expected_matrix = [
    [PLAYER_O, EMPTY,    EMPTY],
    [EMPTY,    EMPTY,    EMPTY],
    [EMPTY,    EMPTY,    EMPTY]
]
assert(matricesEqual(game.matrix, expected_matrix));

// Test X then O then X
var game = new TicTacToe(PLAYER_X);
game.makeMove(1, 1);
game.makeMove(0, 0);
game.makeMove(2, 2);
var expected_matrix = [
    [PLAYER_O, EMPTY,    EMPTY],
    [EMPTY,    PLAYER_X, EMPTY],
    [EMPTY,    EMPTY,    PLAYER_X]
]
assert(matricesEqual(game.matrix, expected_matrix));

// Test invalid move
var game = new TicTacToe(PLAYER_X);
game.makeMove(0, 0);
var move = game.makeMove(0, 0);
assert(!move.valid);
var expected_matrix = [
    [PLAYER_X, EMPTY, EMPTY],
    [EMPTY,    EMPTY, EMPTY],
    [EMPTY,    EMPTY, EMPTY]
]
assert(matricesEqual(game.matrix, expected_matrix));

/* TESTS for checkGameOver ****************************************************/

// Vertical victories
var game = new TicTacToe(PLAYER_X);
game.matrix = [
    [PLAYER_X,    EMPTY,    EMPTY],
    [PLAYER_X,    EMPTY,    EMPTY],
    [PLAYER_X,    EMPTY,    EMPTY]
];
game.checkGameOver()
assert(game.gameOver.victor == PLAYER_X);
assert(matricesEqual(game.gameOver.victoryCells, [[0,0], [1,0], [2,0]]));

var game = new TicTacToe(PLAYER_X);
game.matrix = [
    [EMPTY,    PLAYER_O,    EMPTY],
    [EMPTY,    PLAYER_O,    EMPTY],
    [EMPTY,    PLAYER_O,    EMPTY]
];
game.checkGameOver()
assert(game.gameOver.victor == PLAYER_O);
assert(matricesEqual(game.gameOver.victoryCells, [[0,1], [1,1], [2,1]]));

var game = new TicTacToe(PLAYER_X);
game.matrix = [
    [EMPTY,    EMPTY,    PLAYER_O],
    [EMPTY,    EMPTY,    PLAYER_O],
    [EMPTY,    EMPTY,    PLAYER_O]
];

game.checkGameOver()
assert(game.gameOver.victor == PLAYER_O);
assert(matricesEqual(game.gameOver.victoryCells, [[0,2], [1,2], [2,2]]));

// Horizonal victories
var game = new TicTacToe(PLAYER_X);
game.matrix = [
    [PLAYER_X, PLAYER_X, PLAYER_X],
    [EMPTY,    EMPTY,    EMPTY],
    [EMPTY,    EMPTY,    EMPTY]
];
game.checkGameOver()
assert(game.gameOver.victor == PLAYER_X);
assert(matricesEqual(game.gameOver.victoryCells, [[0,0], [0,1], [0,2]]));

var game = new TicTacToe(PLAYER_X);
game.matrix = [
    [EMPTY,    EMPTY,    EMPTY],
    [PLAYER_X, PLAYER_X, PLAYER_X],
    [EMPTY,    EMPTY,    EMPTY]
];
game.checkGameOver()
assert(game.gameOver.victor == PLAYER_X);
assert(matricesEqual(game.gameOver.victoryCells, [[1,0], [1,1], [1,2]]));

var game = new TicTacToe(PLAYER_X);
game.matrix = [
    [EMPTY,    EMPTY,    EMPTY],
    [EMPTY,    EMPTY,    EMPTY],
    [PLAYER_X, PLAYER_X, PLAYER_X],
];
game.checkGameOver()
assert(game.gameOver.victor == PLAYER_X);
assert(matricesEqual(game.gameOver.victoryCells, [[2,0], [2,1], [2,2]]));

// Diagonal victories
var game = new TicTacToe(PLAYER_X);
game.matrix = [
    [PLAYER_X, EMPTY,    EMPTY],
    [EMPTY,    PLAYER_X, EMPTY],
    [EMPTY,    EMPTY,    PLAYER_X]
];
game.checkGameOver()
assert(game.gameOver.victor == PLAYER_X);
assert(matricesEqual(game.gameOver.victoryCells, [[0,0], [1,1], [2,2]]));

var game = new TicTacToe(PLAYER_X);
game.matrix = [
    [EMPTY,    EMPTY,    PLAYER_O],
    [EMPTY,    PLAYER_O, EMPTY],
    [PLAYER_O, EMPTY,    EMPTY]
];
game.checkGameOver()
assert(game.gameOver.victor == PLAYER_O);
assert(matricesEqual(game.gameOver.victoryCells, [[0,2], [1,1], [2,0]]));

// Draws
var game = new TicTacToe(PLAYER_X);
game.matrix = [
    [PLAYER_O, PLAYER_X, PLAYER_O],
    [PLAYER_X, PLAYER_X, PLAYER_O],
    [PLAYER_O, PLAYER_O, PLAYER_X]
];
game.checkGameOver()
assert(game.gameOver.victor == undefined);
assert(game.gameOver.victoryCells == undefined);
