/** @format */

const http = require("http");
const express = require("express");
const socketIoServer = require("socket.io");
const cors = require("cors");

const {
	addGame,
	removeUser,
	removeGame,
	getGame,
	getGames,
	resetGame,
	checkIfWin,
} = require("./games");

const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketIoServer(server);

app.use(cors());
app.use(router);

io.on("connect", (socket) => {
	// console.log(socket);
	socket.on("join", ({ name, game }, callback) => {
		try {
			const { error, TheGame } = addGame({
				game,
				user: { id: socket.id, username: name },
			});

			if (error) return callback(error);

			console.log(TheGame);
			socket.join(TheGame.game);

			io.to(TheGame.game).emit("Update", getGame(game));

			console.log(getGames());

			callback();
		} catch (error) {
			console.log(error);

			return callback(error);
		}
	});

	socket.on("sendMove", ({ Move, name, game }, callback) => {
		const Game = getGame(game);
		if (Game.moves.indexOf(Move) === -1) {
			Game.moves = [...Game.moves, Move];
			io.to(Game.game).emit("Update", Game);
			console.log(getGame(game));
		}
		if ((Game.moves.length === 9, checkIfWin(Game.moves))) {
			resetGame(Game.game);
			console.log("current Games", getGames());
		}
		callback();
	});
	socket.on("disconnect", () => {
		const TheGame = removeUser(socket.id);
		console.log("disconnect from Game :", TheGame);

		if (TheGame) {
			resetGame(TheGame.game);
			if (TheGame.users.length === 0) {
				removeGame(TheGame.game);
			} else {
				io.to(TheGame.game).emit("Update", TheGame);
			}
		}
		console.log("current Games", getGames());
	});
});

server.listen(process.env.PORT || 5000, () =>
	console.log(`Server is listening on Port ${process.env.PORT || 5000}`),
);
