import * as bcrypt from 'bcryptjs';

export function hashPassword(password: string): string {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, salt);
}

/**
 * Check if raw password is matching with hashed password from DB.
 *
 * @param raw - Raw password from Request
 * @param hash - Hashed password from DB
 * @returns True if matching, False otherwise.
 */
export function comparePasswords(raw: string, hash: string): boolean {
  return bcrypt.compareSync(raw, hash);
}
