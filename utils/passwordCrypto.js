import bcrypt from 'bcryptjs';

// Fallback para React Native (bcryptjs necesita una fuente de aleatoriedad)
bcrypt.setRandomFallback((len) => {
  const arr = new Array(len);
  for (let i = 0; i < len; i++) {
    arr[i] = Math.floor(Math.random() * 256);
  }
  return arr;
});

const SALT_ROUNDS = 10;

/**
 * Genera un hash bcrypt de la contraseña en texto plano.
 * @param {string} plainPassword
 * @returns {Promise<string>} hash bcrypt
 */
export async function hashPassword(plainPassword) {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(plainPassword, salt);
}

/**
 * Compara una contraseña en texto plano contra un hash bcrypt.
 * @param {string} plainPassword
 * @param {string} hashedPassword
 * @returns {Promise<boolean>} true si coinciden
 */
export async function comparePassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

