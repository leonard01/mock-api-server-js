const fs = require('fs');
const path = require('path');

const defaultPath = path.join(__dirname, '..', 'mock-data', 'users.json');

function loadUsersFromFile(filePath = defaultPath) {
  if (!fs.existsSync(filePath)) return [];

  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to parse JSON:', err.message);
    return [];
  }
}

function saveUsersToFile(users, filePath = defaultPath) {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf8');
}

module.exports = {
  loadUsersFromFile,
  saveUsersToFile,
  defaultPath
};
