function assert(condition) {
    if (!condition) {
        console.error("Assertion failed");
    }
}

CELL_SIZE = 100;

EMPTY = 0;
PLAYER_X = 1;
PLAYER_O = 2;

NUM_ROWS = 3;
NUM_COLS = 3;

class Move {
    constructor(row, col, score) {
        this.row = row;
        this.col = col;
    }
}


class Node {

    constructor(ticTacToe, move = undefined) {
        this.ticTacToe = ticTacToe;
        this.move = move;
    }

    getMove() {
        return this.move;
    }

    getGameOver() {
        return this.ticTacToe.gameOver;
    }

    getValue() {
        assert(this.ticTacToe.gameOver);

        if (this.ticTacToe.victor == undefined) {
            return 0;
        } else if (this.ticTacToe.victor == PLAYER_X) {
            return Number.MAX_SAFE_INTEGER;
        } else {
            return Number.MIN_SAFE_INTEGER;;
        }
    }

    getChildren() {

        var children = [];

        for (var row = 0; row < NUM_ROWS; row++) {
            for (var col = 0; col < NUM_COLS; col++) {
                var newGame = this.ticTacToe.clone();
                var [validMove, _] = newGame.click(row, col);

                if (validMove) {
                    var child = new Node(newGame, new Move(row, col));
                    children.push(child);
                }
            }
        }

        return children;
    }
}

// node is an object with three methods:
//      - getGameOver(), which returns true if the node represents a game state
//        where no more moves are possible
//      - getValue(), a value representing the assessment of the game state --
//        i.e. whether the gamestate favors one player more than the other. 
//        Number.MAX_SAFE_INTEGER indicates that maximizingPlayer has won
//        Number.MIN_SAFE_INTEGER indicates that maximizingPlayer has lost
//        0 indicates the game is (or appears to be) a draw.
//        Positive numbers indicate the game state favors the maximizing player:
//        the larger the number, the more the game state appears to favor
//        the maximizing player.
//        Negative numbers indicate the game state does not favor the
//        maximizing player: the smaller the number, the more the game state
//        appears to favor the minimizing player.
//      - getChildren() returns an array of nodes that are the offspring of this
//        node.
// maximizingPlayer is true if it is the maximizing players turn.
function minMax(node, maximizingPlayer) {
    if (node.getGameOver()) {
        return [node.getMove(), node.getValue()];
    }

    if (maximizingPlayer) {
        var bestValue = Number.MIN_SAFE_INTEGER;
        var children = node.getChildren();
        var bestChild = children[0];
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            var [_, v] = minMax(child, false);
            bestValue = Math.max(bestValue, v);
            if (bestValue == v) {
                bestChild = child;
            }
        }
        return [bestChild.getMove(), bestValue];
    } else {
        var bestValue = Number.MAX_SAFE_INTEGER;
        var children = node.getChildren();
        var bestChild = children[0];
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            var [_, v] = minMax(child, true);
            bestValue = Math.min(bestValue, v);
            if (bestValue == v) {
                bestChild = child;
            }
        }
        return [bestChild.getMove(), bestValue];
    }
}

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
        var newTicTacToe = new TicTacToe();

        for (var row = 0; row < NUM_ROWS; row++) {
            for (var col = 0; col < NUM_COLS; col++) {
                newTicTacToe.matrix[row][col] = this.matrix[row][col];
            }
        }

        newTicTacToe.player_turn = this.player_turn;
        newTicTacToe.gameOver = this.gameOver;
        newTicTacToe.victor = this.victor;

        // It's OK to clone by reference here, sicne this.victoryCells is
        // immutable
        newTicTacToe.victoryCells = this.victoryCells;

        return newTicTacToe;
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

function cellClick(row, col, ai) {

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

    if (!ai && !GAME.gameOver) {
        var [move, _] = minMax(new Node(GAME), false);
        cellClick(move.row, move.col, true);
    }
}