import { Router } from 'express'
import { BackendError, ErrorType } from '../utils/error.js'
import { User } from '../entity/User'
import * as userRepo from '../repos/userRepo.js'
import { comparePasswords, hashPassword } from '../utils/helpers.js'

export const authRouter = Router()

authRouter.post('/login', async (req, res) => {
  const { username, password } = req.body
  if (username && password) {
    let userFromDb: User | undefined
    try {
      userFromDb = await userRepo.getByUsername(username)
    } catch (error) {
      if (
        error.type === ErrorType.AlreadyExists ||
        error.type === ErrorType.ArgumentError
      ) {
        return res.status(400).send(error)
      }
      return res.status(500).send(error)
    }
    if (!comparePasswords(password, userFromDb.password)) {
      res.status(401)
      return res.send(
        new BackendError(
          ErrorType.IncorrectPassword,
          'incorrect password',
          `password provided was different from user's password.`
        )
      )
    } else {
      req.session.user = userFromDb
      res.send(userFromDb)
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

authRouter.get('/logout', async (req, res) => {
  req.session.user = undefined
  res.status(200)
  res.send({ response: `Successfully logged out.` })
})
