import bcrypt from 'bcrypt'

class AuthService {
  SALT = 12

  constructor() {}

  hashPassword(password: string) {
    return bcrypt.hash(password, this.SALT)
  }

  validatePassword(inputPassword: string, actualPassword: string) {
    return bcrypt.compare(inputPassword, actualPassword)
  }
}

const authService = new AuthService()

export { authService }
