const fs = require('fs');
const path = require('path');
const dataModule = require('../lib/data');
const {
    loadUsersFromFile,
    saveUsersToFile
} = dataModule;

const testPath = path.join(__dirname, '../mock-data/test-users.json');

afterEach(() => {
  if (fs.existsSync(testPath)) fs.unlinkSync(testPath);
});

describe('Data File Utility', () => {
  test('saves and loads users from file', () => {
    const sample = [
      { id: 1, name: 'Test One' },
      { id: 2, name: 'Test Two' }
    ];
    saveUsersToFile(sample);

    const result = loadUsersFromFile();
    expect(result).toEqual(sample);
  });

test('returns [] if file does not exist', () => {
    const nonExistentPath = path.join(__dirname, '../mock-data/this-file-does-not-exist.json');
    expect(loadUsersFromFile(nonExistentPath)).toEqual([]);
});

test('returns [] if file is invalid JSON', () => {
  const badJsonPath = path.join(__dirname, '../mock-data/invalid.json');
  fs.writeFileSync(badJsonPath, 'this-is-not-json', 'utf8');

  expect(loadUsersFromFile(badJsonPath)).toEqual([]);

  fs.unlinkSync(badJsonPath); // Clean up
});

});
