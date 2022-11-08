import { Router } from 'express'
import { BackendError, ErrorType } from '../utils/error.js'
import { User } from '../entity/User'
import * as userRepo from '../repos/userRepo.js'
import { comparePasswords, hashPassword } from '../utils/helpers.js'

export const authRouter = Router()

authRouter.post('/login', async (req, res) => {
  const { username, password } = req.body
  if (username && password) {
    const hashedPassword = hashPassword(password)
    const userFromDb = await userRepo.getByUsername(username)

    if (comparePasswords(hashedPassword, userFromDb.password)) {
      return res.send(
        new BackendError(
          ErrorType.IncorrectPassword,
          'incorrect password',
          `password provided was different from user's password.`
        )
      )
    } else {
      req.session.user = userFromDb
      res.sendStatus(200)
    }
  }
})

authRouter.post('/register', async (req, res) => {
  const { username, password } = req.body
  if (username && password) {
    const hashedPassword = hashPassword(password)
    try {
      const newUser = { name: username, password: hashedPassword }
      const data = await userRepo.insert(newUser as User)
      req.session.user = newUser
      res.send(data)
    } catch (error) {
      if (
        error.type === ErrorType.AlreadyExists ||
        error.type === ErrorType.ArgumentError
      ) {
        return res.status(400).send(error)
      }
      return res.status(500).send(error)
    }
  } else {
    return res
      .status(400)
      .send(
        new BackendError(
          ErrorType.ArgumentError,
          'argument error',
          'Provide correct username and password'
        )
      )
  }
})
