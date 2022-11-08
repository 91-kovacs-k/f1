import bcrypt from 'bcryptjs'

export function hashPassword(password: string): string {
  const salt = bcrypt.genSaltSync()
  return bcrypt.hashSync(password, salt)
}

export function comparePasswords(raw: string, hash: string): boolean {
  return bcrypt.compareSync(raw, hash)
}
