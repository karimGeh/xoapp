/** @format */

const Games = [];

const addGame = ({ game, user: { id, username } }) => {
	game = game.trim().toLowerCase();
	username = username.trim().toUpperCase();

	let userExist;
	let userInGame;
	let newGame;
	if (Games.length < 1) {
		userExist = false;
		userInGame = 0;
	} else {
		userExist = Games.find(
			(Game) =>
				Game.game === game &&
				Game.users.find((User) => User.username === username),
		);
		if (Games.find((Game) => Game.game === game)) {
			userInGame = Games.find((Game) => Game.game === game).users.length;
		} else {
			userInGame = 0;
		}
	}

	if (!game || !username)
		return { error: "Username and codeGame are required." };
	else if (userExist) return { error: "Username is taken." };
	else if (userInGame >= 2) return { error: "Game is not available" };
	else if (userInGame === 1) {
		newGame = Games.find((Game) => Game.game === game);
		newGame.users.push({ id, username });
	} else {
		newGame = {
			game: game,
			users: [{ id, username }],
			moves: [],
		};
		Games.push(newGame);
	}
	return { TheGame: newGame };
};

const removeUser = (id) => {
	const Game = Games.find((Game) => Game.users.find((user) => user.id === id));
	console.log("Here is Game", Game);
	try {
		const index = Game.users.findIndex((user) => user.id === id);

		if (index !== -1) {
			Game.users.splice(index, 1)[0];
		}
		return Game;
	} catch (error) {
		console.log("there is an error in remove user");
	}
};

const removeGame = (game) => {
	const index = Games.findIndex((Game) => Game.game === game);

	if (index !== -1) return Games.splice(index, 1)[0];
};

const getGame = (game) => Games.filter((Game) => Game.game === game)[0];

const getGames = () => Games;

const resetGame = (game) => {
	const Game = Games.find((Game) => Game.game === game);
	Game.moves = [];
};

const checkIfWin = (lst) => {
	const possibleWin = [
		[1, 2, 3],
		[4, 5, 6],
		[7, 8, 9],
		[1, 4, 7],
		[2, 5, 8],
		[3, 6, 9],
		[1, 5, 9],
		[3, 5, 7],
	];

	let win = false;
	let possibility;
	for (let i = 0; i < 8; i++) {
		possibility = possibleWin[i];
		possibility = possibility.map((i) => i - 1);
		let list = possibility.map((item) =>
			lst.indexOf(item) === -1 ? -1 : lst.indexOf(item) % 2,
		);

		if (
			(list.indexOf(1) === -1 || list.indexOf(0) === -1) &&
			list.indexOf(-1) === -1
		) {
			return true;
		}
	}
	return win;
};

module.exports = {
	addGame,
	removeUser,
	removeGame,
	getGame,
	getGames,
	resetGame,
	checkIfWin,
};
