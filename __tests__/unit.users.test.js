const {
  setUsers,
  getUsers,
  addUser,
  updateUser,
  deleteUser
} = require('../lib/users');

describe('User Logic Unit Tests', () => {
  beforeEach(() => {
    setUsers([
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      { id: 2, name: 'Bob', email: 'bob@example.com' }
    ]);
  });

  test('adds a new user', () => {
    const user = addUser({ name: 'Charlie', email: 'charlie@example.com' });
    expect(user.name).toBe('Charlie');
    expect(getUsers().length).toBe(3);
  });

  test('updates a user', () => {
    const updated = updateUser(1, { name: 'Alice Smith' });
    expect(updated.name).toBe('Alice Smith');
  });

  test('returns null when updating non-existent user', () => {
    const result = updateUser(99, { name: 'Ghost' });
    expect(result).toBeNull();
  });

  test('deletes a user', () => {
    const deleted = deleteUser(2);
    expect(deleted.email).toBe('bob@example.com');
    expect(getUsers().length).toBe(1);
  });

  test('returns null when deleting non-existent user', () => {
    const deleted = deleteUser(99);
    expect(deleted).toBeNull();
  });
});
