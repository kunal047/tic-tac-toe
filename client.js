const io = require("socket.io-client");
const readcommand = require("readcommand");
const socket = io.connect(`http://${process.argv[2]}:${process.argv[3]}`, { forceNew: true });
var sigints = 0;

const {
    initializeBoard,
    makeBoard,
    printBoard,
    printError,
    resetBoard,
} = require("./helper/board");

socket.on("connect", () => {
    socket.emit("join", "game");
});

socket.on("start", (playerNo) => {
    initializeBoard(playerNo);
    resetBoard();
});

readcommand.loop(function (err, args, str, next) {

    if (args[0] === "r") {
        socket.emit("move", "r");
        process.exit(0);
    }

    if (err && err.code !== 'SIGINT') {
        throw err;
    } else if (err) {
        if (sigints === 1) {
            process.exit(0);
        } else {
            sigints++;
            console.log('Press ^C again to exit.');
            return next();
        }
    } else {
        sigints = 0;
    }

    const val = parseInt(args[0]);
    // check validity of inputs
    if (val <= 9 && val >= 1) {
        socket.emit("move", val);
    } else {
        console.log("invalid move, select a number between 1-9");
    }
    return next();
});

socket.on("print_board", (position, mark, playerNo) => {
    makeBoard(position, mark);
    printBoard(playerNo);
})

socket.on("print_error", (msg) => {
    printError(msg);
});

socket.on("end_game", (msg) => {
    printError(msg);
    resetBoard();
    socket.disconnect();
});
