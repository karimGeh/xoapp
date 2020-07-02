/** @format */

const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");

const { addUser, removeUser, getUser, getUserInGame } = require("./users");

const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(router);

io.on("connection", (socket) => {
	socket.on("join", ({ name, codeGame }, callback) => {
		const { error, user } = addUser({ id: socket.id, name, codeGame });

		if (error) return callback(error);

		socket.join(user.codeGame);
		console.log(user);

		io.to(user.codeGame).emit("UserJoined", getUserInGame(codeGame));
		console.log(getUserInGame(codeGame));

		callback();
	});

	socket.on("sendMove", (Move, callback) => {
		const user = getUser(socket.id);

		io.to(user.codeGame).emit("Move", { user: user.name, Move });

		callback();
	});

	socket.on("disconnect", () => {
		const user = removeUser(socket.id);
		console.log(user);

		if (user) {
			io.to(user.codeGame).emit("UserLeft", { user });
		}
	});
});

server.listen(process.env.PORT || 5000, () =>
	console.log(`Server has started.`),
);
