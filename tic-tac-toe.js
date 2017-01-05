

CELL_SIZE = 100;

EMPTY = 0;
PLAYER_X = 1;
PLAYER_O = 2;

NUM_ROWS = 3;
NUM_COLS = 3;

class TicTacToe {

    constructor() {
        this.matrix = [
            [0,0,0],
            [0,0,0],
            [0,0,0]
        ];

        this.player_turn = PLAYER_X;
        this.gameOver = false;
        this.victor = undefined;
        this.victoryCells = undefined;
    }

    clone() {
        newTicTacTow = new TicTacToe();

        for (var row = 0; row < NUM_ROWS; row++) {
            for (col = 0; col < NUM_COLS; col++) {
                newTicTacToe.matrix[row][col] = this.matrix[row][col];
            }
        }

        newTicTacToe.player_turn = this.player_turn;
        newTicTacToe.gameOver = this.gameOver;
        newTicTacToe.victor = this.victor;

        // It's OK to clone by reference here, sicne this.victoryCells is
        // immutable
        newTicTacToe.victoryCells = this.victoryCells;
    }

    checkGameOver() {

        for (var row = 0; row < NUM_ROWS; row++) {
            var a = this.matrix[row][0];
            var b = this.matrix[row][1];
            var c = this.matrix[row][2];

            if (a == b && b == c && a != EMPTY) {
                this.gameOver = true;
                this.victor = a;
                this.victoryCells = [[row, 0], [row, 1], [row, 2]];
                return;
            }
        }

        for (var col = 0; col < NUM_COLS; col++) {
            var a = this.matrix[0][col];
            var b = this.matrix[1][col];
            var c = this.matrix[2][col];

            if (a == b && b == c && a != EMPTY) {
                this.gameOver = true;
                this.victor = a;
                this.victoryCells = [[0, col], [1, col], [2, col]];
                return;
            }
        }

        var a = this.matrix[0][0];
        var b = this.matrix[1][1];
        var c = this.matrix[2][2];
        if (a == b && b == c && a != EMPTY) {
            this.gameOver = true;
            this.victor = a;
            this.victoryCells = [[0, 0], [1, 1], [2, 2]];
            return;
        }

        var a = this.matrix[0][2];
        var b = this.matrix[1][1];
        var c = this.matrix[2][0];
        if (a == b && b == c && a != EMPTY) {
            this.gameOver = true;
            this.victor = a;
            this.victoryCells = [[0, 2], [1, 1], [2, 0]];
            return;
        }

        var containsEmptyCell = false;

        for (var row = 0; row < NUM_ROWS; row++) {
            for (var col = 0; col < NUM_COLS; col++) {
                if (this.matrix[row][col] == EMPTY) {
                    containsEmptyCell = true;
                }
            }
        }

        if (!containsEmptyCell) {
            this.gameOver = true;
        }
    }

    // Returns true iff the click results in a valid move 
    click(row, col) {
        if (this.matrix[row][col] != EMPTY || this.gameOver) {
            return [false, undefined];
        } 

        this.matrix[row][col] = this.player_turn;

        var old_player_turn = this.player_turn;

        if (this.player_turn == PLAYER_X) {
            this.player_turn = PLAYER_O;
        } else {
            this.player_turn = PLAYER_X;
        }

        this.checkGameOver();

        return [true, old_player_turn];
    }
}

class Node {

    constructor(ticTacToe) {
        this.ticTacToe = ticTacToe
        this.children = [];
    }

    branch() {

    }


}


var GAME = new TicTacToe();

function getCellId(row, col) {
    return "cell-" + row + "-" + col;
}

function getImgTag(player_turn) {

    var filename;

    if (player_turn == PLAYER_X) {
        filename = "player-x.png";
    } else {
        filename = "player-o.png";
    }

    return "<img src='" + filename + "' width=" + CELL_SIZE + ">";
}

function cellClick(row, col) {

    var [valid_move, player_turn] = GAME.click(row, col);

    if (valid_move) {

        var imgTag = getImgTag(player_turn);

        $("#" + getCellId(row, col)).append(imgTag);

        if (GAME.gameOver && GAME.victor != undefined) {
            for (var i = 0; i < GAME.victoryCells.length; i++) {
                var [row, col] = GAME.victoryCells[i];

                $("#" + getCellId(row, col)).css("background-color", "pink");
            }


        }
    }
}