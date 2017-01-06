# Tic Tac Toe

A JavaScript project walk-through for novice programmers.

In this project you will develop an unbeatable AI for Tic Tac Toe. [Check it out](https://mikegagnon.github.io/tic-tac-toe/).

## Prerequisites

Mastery of [Lights Out](https://github.com/mikegagnon/lights-out/blob/master/README.md),
[Thumb Wrestling](https://github.com/mikegagnon/thumb-wrestling/blob/master/README.md),
recursion (see [linked lists](https://github.com/mikegagnon/linked-lists/blob/master/README.md) and
[binary search trees](https://github.com/mikegagnon/bst/blob/master/README.md)), and
[Sokoban+](https://github.com/mikegagnon/sokoban/blob/master/README.md).
And familiarity with OOP (object-orient programming) in JavaScript.

## Contents

- [Part 1. Two-player Tic Tac Toe]
  - [Lecture 1.1 Framework for `TicTacToe` class](#lec1-1)
  - [Lecture 1.2 Framework for controller and for `Viz` class](#lec1-2)
  - [Challenge 1.3 X's and O's](#c1-3)
  - [Challenge 1.4 Pretty graphics](#c1-4)
  - [Challenge 1.5 Game Over](#c1-5)

## <a name="lec1-1">Lecture 1.1 Framework for `TicTacToe` class</a>

Initialize your Tic Tac Toe directory with the following two files:

### `index.html`

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Tic Tac Toe</title>
  </head>

  <script src="tic-tac-toe.js"></script>

</html>
```

### `tic-tac-toe.js`

Study this code (including tests) until it makes 100% sense to you.

```js
function assert(condition) {
    if (!condition) {
        console.error("Assertion failed");
    }
}

NUM_ROWS = 3;
NUM_COLS = 3;

EMPTY = 0;
PLAYER_X = 1;
PLAYER_O = 2;s

class TicTacToe {

    constructor() {
        this.matrix = [
            [EMPTY, EMPTY,EMPTY],
            [EMPTY, EMPTY,EMPTY],
            [EMPTY, EMPTY,EMPTY]
        ];
    }

    makeMove(row, col) {

        assert(row >= 0 && row < NUM_ROWS);
        assert(col >= 0 && col < NUM_COLS);

        this.matrix[row][col] = PLAYER_X;
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

// Test player-x makeMove(0, 0)
var game = new TicTacToe();
game.makeMove(0, 0);
var expected_matrix = [
    [PLAYER_X, EMPTY, EMPTY],
    [EMPTY,    EMPTY, EMPTY],
    [EMPTY,    EMPTY, EMPTY]
]
assert(matricesEqual(game.matrix, expected_matrix));

// Test player-x makeMove(1, 1)
var game = new TicTacToe();
game.makeMove(1, 1);
var expected_matrix = [
    [EMPTY,    EMPTY,    EMPTY],
    [EMPTY,    PLAYER_X, EMPTY],
    [EMPTY,    EMPTY,    EMPTY]
]
assert(matricesEqual(game.matrix, expected_matrix));
```










## <a name="lec1-2">Lecture 1.2 Framework for controller and for `Viz` class</a>

Study this code until it makes 100% sense to you.

### `style.css`

```css
.row {
    clear: left;
}

.cell {
    height: 100px;
    width: 100px;
    margin-left: 5px;
    margin-top: 5px;
    float: left; 
    background-color: lightgray;
    cursor: pointer;
}
```

### `index.html`

Update your `index.html` file to do the following:

- Import `style.css`
- Import `jquery.js`
- Create a 3&times;3 grid of cells

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Tic Tac Toe</title>
    <link rel="stylesheet" type="text/css" href="style.css">
    <script src="jquery.js"></script>
  </head>
  <body>
    <div class="row">
      <div class="cell" id="cell-0-0" onclick="cellClick(0, 0)"></div>
      <div class="cell" id="cell-0-1" onclick="cellClick(0, 1)"></div>
      <div class="cell" id="cell-0-2" onclick="cellClick(0, 2)"></div>
    </div>
    <div class="row">
      <div class="cell" id="cell-1-0" onclick="cellClick(1, 0)"></div>
      <div class="cell" id="cell-1-1" onclick="cellClick(1, 1)"></div>
      <div class="cell" id="cell-1-2" onclick="cellClick(1, 2)"></div>
    </div>
    <div class="row">
      <div class="cell" id="cell-2-0" onclick="cellClick(2, 0)"></div>
      <div class="cell" id="cell-2-1" onclick="cellClick(2, 1)"></div>
      <div class="cell" id="cell-2-2" onclick="cellClick(2, 2)"></div>
    </div>
  </body>

  <script src="tic-tac-toe.js"></script>

</html>
```

### `tic-tac-toe.js`

```js
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
    constructor(valid, row, col, player) {
        this.valid = valid;
        this.row = row;
        this.col = col;
        this.player = player;
    }
}

/*******************************************************************************
 * TicTacToe class
 ******************************************************************************/
class TicTacToe {

    constructor() {
        this.matrix = [
            [EMPTY, EMPTY,EMPTY],
            [EMPTY, EMPTY,EMPTY],
            [EMPTY, EMPTY,EMPTY]
        ];
    }

    makeMove(row, col) {

        assert(row >= 0 && row < NUM_ROWS);
        assert(col >= 0 && col < NUM_COLS);

        this.matrix[row][col] = PLAYER_X;

        return new Move(true, row, col, PLAYER_X);
    }

}

/*******************************************************************************
 * Vizualization code
 ******************************************************************************/
 class Viz {
    
    static getCellId(row, col) {
        return "cell-" + row + "-" + col;
    }

    constructor() { }

    drawMove(move) {
        if (!move.valid) {
            return;
        }

        var cellId = Viz.getCellId(move.row, move.col)
        $("#" + cellId).text("X") ;
    }
 }

/*******************************************************************************
 * Controller code
 ******************************************************************************/
var GAME = new TicTacToe();
var VIZ = new Viz();

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
var game = new TicTacToe();
game.makeMove(0, 0);
var expected_matrix = [
    [PLAYER_X, EMPTY, EMPTY],
    [EMPTY,    EMPTY, EMPTY],
    [EMPTY,    EMPTY, EMPTY]
]
assert(matricesEqual(game.matrix, expected_matrix));

// Test player-x makeMove(1, 1)
var game = new TicTacToe();
game.makeMove(1, 1);
var expected_matrix = [
    [EMPTY,    EMPTY,    EMPTY],
    [EMPTY,    PLAYER_X, EMPTY],
    [EMPTY,    EMPTY,    EMPTY]
]
assert(matricesEqual(game.matrix, expected_matrix));
```

### Result

If you play the game in your browser, you should see something like this:

<img src="all-x.png" width=315>








## <a name="c1-3">Challenge 1.3 X's and O's</a>

The game, as it is in [Lecture 1.2](#lec1-2), only allows
moves for X's. Here, we will add O's to the game.

### Update `TicTacToe` constructor

```js
class TicTacToe {

    ...
    
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
    }
```

### Update `GAME` initialization

Recall, the controller code from [Lecture 1.2](#lec1-2), looks as follows:

```js
/*******************************************************************************
 * Controller code
 ******************************************************************************/
var GAME = new TicTacToe();
var VIZ = new Viz();

...
```

Since the `TicTacToe` constructor has changed, we must update the `GAME` initialization:

```js
/*******************************************************************************
 * Controller code
 ******************************************************************************/
var GAME = new TicTacToe(PLAYER_X); // <------------------------------------------------
var VIZ = new Viz();

...
```


### Update `makeMove(...)`

- In the `makeMove(...)` function, check to see if the move is valid. If it's not, then return
  an appropriate `Move` object.
- Update `makeMove(...)` so that this.player alternates between X's and O's
- Fix tests that are broken (since the constructor for TicTacToe has changed, the old tests will fail)
- Write new tests that verify/refute the correctness of your program

### Result

If you play the game in your browser, you should see something like this:

<img src="ascii-graphics.png" width=315>

### Hints

- [Hint 1](#hint1-3-1)
- [Hint 2](#hint1-3-2)
- [Hint 3](#hint1-3-3)
- [Hint 4](#hint1-3-4)
- [Solution](#solution1-3)









## <a name="c1-4">Challenge 1.4 Pretty graphics</a>

We will update the vizualization code to use pretty graphics.
After this challenge, Tic Tac Toe will look something like this:

<img src="pretty.png" width="315px">

### Download images

Download these two images into your directory:

<img src="player-x.png" width=100>
<img src="player-o.png" width=100>


### Update `Viz`
Update the `Viz` constructor so it takes a `cell_size` argument,
and sets `this.cell_size = cell_size`, and sets the cell `<div>`
elements to the proper size.

```js
class Viz {
 
    ...
    
    constructor(cell_size) {
        this.cell_size = cell_size;
        
        $(".cell").css("height", this.cell_size);
        $(".cell").css("width", this.cell_size);
    }
}
```

### Update controller

Now that `Viz` has a new constructor, we need to update our initialization of `VIZ` inside the controller.

```js
/*******************************************************************************
 * Controller code
 ******************************************************************************/
var GAME = new TicTacToe(PLAYER_X);
var VIZ = new Viz(100); // <-----------------------------------------------------------
```

### The challenge
The challenge is to update `drawMove(...)` so that it draws either `player-x.png` to the cell,
or `player-o.png` to the cell, depending on `move.player`.

### Hints

- [Solution](#solution1-4)










## <a name="c1-5">Challenge 1.5 Game Over</a>

Let's detect when a game has reached it's end.

### Introducing the `GameOver` class

This class `GameOver` stores information about the end of the game.
Hopefully the comments explain it well enough.

```js
class GameOver {
    // Either this.victor == undefined (indicating a draw), or
    // this.victor == PLAYER_X, or
    // this.victor == PLAYER_O...
    // depending upon who won the game.
    //
    // Either victoryCells == undefined (indicating a draw,), or
    // dthis.victoryCells is an array of (row, col) pairs.
    // For example this.victoryCells might == [[0,0], [1,1], [2, 2]]
    // this.victoryCells denotes which (row, col) pairs constitute the
    // victories triple of cells that won the game.
    //
    // For example, if this.matrix == [
    //      [EMPTY,    EMPTY,    EMPTY],
    //      [EMPTY,    EMPTY,    EMPTY],
    //      [PLAYER_X, PLAYER_X, PLAYER_X],
    // ]
    // 
    // then, this.victoryCells would be [[2,0], [2,1], [2,2]]
    constructor(victor, victoryCells) {
        this.victor = victor;
        this.victoryCells = victoryCells;
    }
}
```

### Update the `Move` class

We add a `gameOver` reference to the `Move` class, which
will help the `Viz` class highlight the victorious cells
after a victory.

```js
class Move {
    // valid == true iff the move results in change in game state
    // (row, col) are the coordinates that player added their mark
    // player is either PLAYER_X or PLAYER_O, depending on who made the move
    // gameOver is either undefined (which signifies the game has not concluded)
    // or gameOver is a GameOver object, representing the conclusion of the game
    constructor(valid, row, col, player, gameOver) { // <------------------------------
        this.valid = valid;
        this.row = row;
        this.col = col;
        this.player = player;
        this.gameOver = gameOver; // <-------------------------------------------------
    }
}
```

### Update the `TicTacToe` constructor

```js
class TicTacToe {

    ...

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
        this.gameOver = undefined; // <------------------------------------------------

    }
}
```

### Update `makeMove` method

We make three modifications to the `makeMove` method.

1. We check to see if the game is over at the beginning of the method.
   This way we can exit the method right away if the game is already over.
2. We modify the instantiation of the `move` object by adding
   this.gameOver to the argument list (since the `Move` constructor
   now takes a gameOver argument).
3. We invoke `this.checkGameOver()`, which is the subject of the next section.

```js
class TicTacTow {

    ...

    makeMove(row, col) {

        assert(row >= 0 && row < NUM_ROWS);
        assert(col >= 0 && col < NUM_COLS);

        if (this.matrix[row][col] != EMPTY || this.gameOver != undefined) { // <--------------------------
            return new Move(false, undefined, undefined, undefined);
        } 

        this.matrix[row][col] = this.player;

        var move = new Move(true, row, col, this.player, this.gameOver); // <-----------------------------
        this.checkGameOver(); // <------------------------------------------------------------------------

        if (this.player == PLAYER_X) {
            this.player = PLAYER_O;
        } else {
            this.player = PLAYER_X;
        }

        return move;
    }
}
```

### Challenge: implement `checkGameOver()`

```js
class  TicTacToe {

    ...

    // Determines whether or the game has reached its conclusion.
    // If the game is over, then sets this.gameOver to a GameOver object
    // representing the conclusion of the game.
    checkGameOver() {
        // ?
    }
}
```

### Hints

- [Hint 1](#hint1-5-1) Categories for game over
- [Hint 2](#hint1-5-2) shell implementation
- [Hint 3](#hint1-5-3) implementation of checkVictoryHorizontal
- [Hint 4](#hint1-5-4) implementation of checkVictoryVertical
- [Hint 5](#hint1-5-5) implementation of checkVictoryDiagonal
- [Hint 6](#hint1-5-6) explanation of checkDraw
- [Hint 7](#hint1-5-7) implementation of checkDraw
- [Solution](#solution1-5) 












<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

## <a name="hint1-3-1">Hint 1 for Challenge 1.3</a>

Check to see if the move is valid:

```js
class TicTacToe {

    makeMove(row, col) {

        assert(row >= 0 && row < NUM_ROWS);
        assert(col >= 0 && col < NUM_COLS);

        if (this.matrix[row][col] != EMPTY) {
            return new Move(false, undefined, undefined, undefined);
        } 
        ...
    }
}
```
<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

## <a name="hint1-3-2">Hint 2 for Challenge 1.3</a>

Alterante turns between X's and O's:

```js
class TicTacToe {

    makeMove(row, col) {

        assert(row >= 0 && row < NUM_ROWS);
        assert(col >= 0 && col < NUM_COLS);

        if (this.matrix[row][col] != EMPTY) {
            return new Move(false, undefined, undefined, undefined);
        } 

        this.matrix[row][col] = this.player;

        var move = new Move(true, row, col, this.player);

        if (this.player == PLAYER_X) {
            this.player = PLAYER_O;
        } else {
            this.player = PLAYER_X;
        }

        return move;
    }
}
```

<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

## <a name="hint1-3-3">Hint 3 for Challenge 1.3</a>

Fix broken tests:

```js
// Test player-x makeMove(0, 0)
var game = new TicTacToe(PLAYER_X); // <-------------------------
game.makeMove(0, 0);
var expected_matrix = [
    [PLAYER_X, EMPTY, EMPTY],
    [EMPTY,    EMPTY, EMPTY],
    [EMPTY,    EMPTY, EMPTY]
]
assert(matricesEqual(game.matrix, expected_matrix));

// Test player-x makeMove(1, 1)
var game = new TicTacToe(PLAYER_X); // <-------------------------
game.makeMove(1, 1);
var expected_matrix = [
    [EMPTY,    EMPTY,    EMPTY],
    [EMPTY,    PLAYER_X, EMPTY],
    [EMPTY,    EMPTY,    EMPTY]
]
assert(matricesEqual(game.matrix, expected_matrix));
```

<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

## <a name="hint1-3-4">Hint 4 for Challenge 1.3</a>

New tests:

```js

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
```

<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

## <a name="solution1-3">Solution for Challenge 1.3</a>

The solution is simply the union of all the hints:

- [Hint 1](#hint1-3-1)
- [Hint 2](#hint1-3-2)
- [Hint 3](#hint1-3-3)
- [Hint 4](#hint1-3-4)

<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

## <a name="solution1-4">Solution for Challenge 1.4</a>

```js
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
```
