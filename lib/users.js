let users = [];

function setUsers(data) {
  users = [...data];
}

function getUsers() {
  return users;
}

function addUser(user) {
  const id = Math.max(0, ...users.map(u => u.id)) + 1;
  const newUser = { id, ...user };
  users.push(newUser);
  return newUser;
}

function updateUser(id, updatedFields) {
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return null;
  users[index] = { ...users[index], ...updatedFields };
  return users[index];
}

function deleteUser(id) {
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return null;
  return users.splice(index, 1)[0];
}

module.exports = { setUsers, getUsers, addUser, updateUser, deleteUser };
