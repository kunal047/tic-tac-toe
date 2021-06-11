const colors = require("colors");

var board = {
    1: ".",
    2: ".",
    3: ".",
    4: ".",
    5: ".",
    6: ".",
    7: ".",
    8: ".",
    9: ".",
};

const makeBoard = (position, mark) => {
    if (validate(position)) {
        board[position] = mark.toUpperCase();
        return true;
    }
    console.log('board', board);
    return false;
};

const printBoard = (playerNo) => {
    console.log(colors.green.bold('\n'+
    '                             '+board[1] + ' ' + board[2] + ' '+ board[3] +'\n' +
    '                             '+board[4] + ' ' + board[5] + ' '+ board[6] + '\n' +
    '                             '+board[7] + ' ' + board[8] + ' '+ board[9] + '\n'
  ));
  console.log(colors.blue.bold(`Player ${(playerNo%2)+1} turn`));
}

const printError = (msg) => {
    console.log(colors.red.bold(msg))
}

const initializeBoard = (playerNo) => {
    if (playerNo)
        console.log(colors.red.bold(`Game started. You are Player ${playerNo}`));
    console.log(
        colors.green.bold(
                "                              1 | 2 | 3 \n" +
                "                              4 | 5 | 6 \n" +
                "                              7 | 8 | 9 \n"
        )
    );
};

function isInt(value) {
    var x;
    if (isNaN(value)) {
        return false;
    }
    x = parseFloat(value);
    return (x | 0) === x;
}

const validate = (position) => {
    return isInt(position) && board[position] === ".";
};

var winCombinations = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
];

function checkWinner(player) {
    for (var i = 0; i < winCombinations.length; i++) {
        var mark = 0,
            count = 0;
        for (var j = 0; j < winCombinations[i].length; j++) {
            if (board[winCombinations[i][j]] === player) {
                mark++;
            }
            if (mark === 3) {
                count++;
                console.log(count);
                if (count === 0) {
                    return 2;
                }
                resetBoard();
                return 1;
            }
        }
    }
    return 0;
}

const resetBoard = () => {
    board = {
        1: ".",
        2: ".",
        3: ".",
        4: ".",
        5: ".",
        6: ".",
        7: ".",
        8: ".",
        9: ".",
    };
}

module.exports = {
    initializeBoard,
    makeBoard,
    checkWinner,
    validate,
    printBoard,
    printError,
    resetBoard,
};
