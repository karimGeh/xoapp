/** @format */

const users = [];

const addUser = ({ id, name, codeGame }) => {
	name = name.trim().toLowerCase();
	codeGame = codeGame.trim().toLowerCase();

	const existingUser = users.find(
		(user) => user.codeGame === codeGame && user.name === name,
	);
	const count = users.filter((user) => user.codeGame === codeGame).length;
	console.log(count);

	if (!name || !codeGame)
		return { error: "Username and codeGame are required." };
	if (existingUser) return { error: "Username is taken." };
	if (count >= 2) return { error: "Game is not available" };

	const user = { id, name, codeGame };

	users.push(user);

	return { user };
};

const removeUser = (id) => {
	const index = users.findIndex((user) => user.id === id);

	if (index !== -1) return users.splice(index, 1)[0];
};

const getUser = (id) => users.find((user) => user.id === id);

const getUserInGame = (codeGame) =>
	users.filter((user) => user.codeGame === codeGame);

module.exports = { addUser, removeUser, getUser, getUserInGame };
