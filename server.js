const io = require("socket.io")();

const PORT = process.argv[2] || 5050;

const { makeBoard, checkWinner, resetBoard } = require("./helper/board");
const users = {};
let lock = {};

const updateLock = () => {
    Object.keys(lock).forEach((key) => {
        lock[key] = !lock[key];
    });
};

io.on("connection", (socket) => {
    lock = { 1: false, 2: true }; // handle lock

    /**
     * Create a room called 'game' and let the clients connect to it assigning player number to them. It works on first come first serve basis. Client connecting first will be Player 1, client connecting second will be player 2.
     */
    socket.on("join", function (room) {
        socket.join(room);
        const playerNo = io.sockets.adapter.rooms.get("game").size;
        users[socket.id] = playerNo;
        console.log(
            "Player",
            playerNo,
            "joined",
            io.sockets.adapter.rooms.get("game")
        );
        socket.emit("start", playerNo);
    });

    socket.on("move", (position) => {
        // check if 2 players exists or not
        if (io.sockets.adapter.rooms.get("game").size !== 2) {
            io.sockets.in("game").emit("print_error", "Wait for player 2");
            return false;
        }

        const playerNo = users[socket.id];

        // check if resign
        if (position === "r") {
            resetBoard();
            io.sockets
                .in("game")
                .emit("end_game", `Game won by Player ${(playerNo % 2) + 1}`);
        }

        if (lock[playerNo]) {
            socket.emit("print_error", `Please wait for your turn`);
        } else {
            console.log(
                `Socket ${socket.id} Position ${position}, User ${playerNo}`
            );

            let mark = "X";
            if (playerNo === 2) mark = "O";

            const res = makeBoard(position, mark); // return true if move is valid else return false
            if (res) {
                io.sockets
                    .in("game")
                    .emit("print_board", position, mark, playerNo);

                updateLock(); // update lock on valid move
            } else {
                io.sockets
                    .in("game")
                    .emit("print_error", `Invalid move by player ${playerNo}`);
            }

            const isWinner = checkWinner(mark); // 1 -> win, 0 -> no winner yet, 2 -> tie
            if (isWinner === 1) {
                resetBoard();
                io.sockets
                    .in("game")
                    .emit("end_game", `Game won by Player ${playerNo}`);
            } else if (isWinner === 2) {
                resetBoard();
                io.sockets.in("game").emit("end_game", "Game is tied.");
            }
        }
    });
});

io.listen(PORT);
console.log("Please start client files to play...");
