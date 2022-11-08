import { Like } from 'typeorm'
import { AppDataSource } from '../data-source.js'
import { User } from '../entity/User.js'
import { ErrorType, BackendError } from '../utils/error.js'

const repo = AppDataSource.getRepository(User)

export const get = async (
  query?: string,
  limit: number = 0
): Promise<User[]> => {
  let ret: User[] = []
  try {
    let items
    if (!(query === null || query === undefined)) {
      items = await repo.findBy({ name: Like(`%${query}%`) })
    } else {
      items = await repo.find()
    }

    if (limit > 0) {
      ret = items.slice(0, limit)
    } else {
      ret = items
    }
  } catch (error) {
    return await new Promise((resolve, reject) => {
      reject(
        new BackendError(ErrorType.ServerError, 'server error', error.message)
      )
    })
  }

  if (ret.length === 0 && !(query === null || query === undefined)) {
    return await new Promise((resolve, reject) => {
      reject(
        new BackendError(
          ErrorType.NotFound,
          'not found',
          `there is no match to search term of '${query.toLowerCase()}'`
        )
      )
    })
  } else if (ret.length === 0 && (query === null || query === undefined)) {
    return await new Promise((resolve, reject) => {
      reject(
        new BackendError(
          ErrorType.NoRecords,
          'no records',
          'no user in database'
        )
      )
    })
  }
  return await new Promise((resolve, reject) => {
    resolve(ret)
  })
}

export const getById = async (id: number): Promise<User> => {
  let item: User | null = null
  try {
    item = await repo.findOneBy({ id })
  } catch (error) {
    return await new Promise((resolve, reject) => {
      reject(
        new BackendError(ErrorType.ServerError, 'server error', error.message)
      )
    })
  }
  if (item === null) {
    return await new Promise((resolve, reject) => {
      return reject(
        new BackendError(
          ErrorType.NotFound,
          'not found',
          `Could not find any entity of type "User" matching: {\n    "id": ${id}\n`
        )
      )
    })
  }
  return await new Promise((resolve, reject) => {
    resolve(item as User)
  })
}

export const getByUsername = async (username: string): Promise<User> => {
  let item: User | null = null
  try {
    item = await repo.findOneBy({ name: username })
  } catch (error) {
    return await new Promise((resolve, reject) => {
      reject(
        new BackendError(ErrorType.ServerError, 'server error', error.message)
      )
    })
  }
  if (item === null) {
    return await new Promise((resolve, reject) => {
      return reject(
        new BackendError(
          ErrorType.NotFound,
          'not found',
          `Could not find any entity of type "User" matching: {\n    "name": ${username}\n`
        )
      )
    })
  }
  return await new Promise((resolve, reject) => {
    resolve(item as User)
  })
}

export const update = async (id: number, user: User): Promise<User> => {
  let userExists: User | null = null
  let idExists: User | null = null
  try {
    userExists = await repo.findOneBy({ name: Like(`%${user.name}%`) })
    idExists = await repo.findOneBy({ id })
  } catch (error) {
    return await new Promise((resolve, reject) => {
      reject(
        new BackendError(ErrorType.ServerError, 'server error', error.message)
      )
    })
  }

  if (userExists != null && userExists.id !== id) {
    return await new Promise((resolve, reject) => {
      return reject(
        new BackendError(
          ErrorType.AlreadyExists,
          'already exists',
          `user with the name of ${user.name.toLowerCase()} already exists in database`
        )
      )
    })
  }
  if (idExists == null) {
    return await new Promise((resolve, reject) => {
      return reject(
        new BackendError(
          ErrorType.NotFound,
          'not found',
          `user with id of ${id} not exists in database`
        )
      )
    })
  }

  idExists.name = user.name
  await repo.save(idExists)
  return await new Promise((resolve, reject) => {
    resolve(idExists as User)
  })
}

export const insert = async (user: User): Promise<User> => {
  let userFromDb: User | null = null
  try {
    userFromDb = await repo.findOneBy({ name: Like(`%${user.name}%`) })
  } catch (error) {
    return await new Promise((resolve, reject) => {
      reject(
        new BackendError(ErrorType.ServerError, 'server error', error.message)
      )
    })
  }
  if (userFromDb !== null) {
    return await new Promise((resolve, reject) => {
      return reject(
        new BackendError(
          ErrorType.AlreadyExists,
          'already exists',
          `${user.name.toLowerCase()} already exists in database`
        )
      )
    })
  }

  if (user.id > 0) {
    return await new Promise((resolve, reject) => {
      return reject(
        new BackendError(
          ErrorType.ArgumentError,
          'argument error',
          'do not specify id for insert!'
        )
      )
    })
  }
  const ret = await repo.save(user)
  return await new Promise((resolve, reject) => {
    resolve(ret)
  })
}

export const remove = async (id: number): Promise<User> => {
  let user: User | null = null
  try {
    user = await repo.findOneBy({ id })
  } catch (error) {
    return await new Promise((resolve, reject) => {
      reject(
        new BackendError(ErrorType.ServerError, 'server error', error.message)
      )
    })
  }
  if (user === null) {
    return await new Promise((resolve, reject) => {
      return reject(
        new BackendError(
          ErrorType.NotFound,
          'not found',
          `user with ${id} not exists in database`
        )
      )
    })
  }

  const ret = await repo.remove(user)
  return await new Promise((resolve, reject) => {
    resolve(ret)
  })
}
