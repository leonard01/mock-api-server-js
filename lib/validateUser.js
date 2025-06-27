function validateUserInput(user, existingUsers = []) {
  if (typeof user.name !== 'string' || user.name.length < 2) {
    return { valid: false, message: 'Name must be a string with at least 2 characters' };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (typeof user.email !== 'string' || !emailPattern.test(user.email)) {
    return { valid: false, message: 'Email format is invalid' };
  }

  const emailExists = existingUsers.some(u => u.email === user.email);
  if (emailExists) {
    return { valid: false, message: 'Email already exists' };
  }

  return { valid: true };
}

module.exports = { validateUserInput };
