

CELL_SIZE = 100;

EMPTY = 0;
PLAYER_X = 1;
PLAYER_O = 2;

class TicTacToe {

    constructor() {
        this.matrix = [
            [0,0,0],
            [0,0,0],
            [0,0,0]
        ];

        this.player_turn = PLAYER_X;
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

    console.log("asdf")

    if (GAME.matrix[row][col] != EMPTY) {
        return;
    } 

    GAME.matrix[row][col] = GAME.player_turn;

    var imgTag= getImgTag(GAME.player_turn);

    $("#" + getCellId(row, col)).append(imgTag);

    if (GAME.player_turn == PLAYER_X) {
        GAME.player_turn = PLAYER_O;
    } else {
        GAME.player_turn = PLAYER_X;
    }

}