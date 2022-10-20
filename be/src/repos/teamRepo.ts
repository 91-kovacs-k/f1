import { Team } from '../entity/Team.js'
import { AppDataSource } from '../data-source.js'
import { Like } from 'typeorm'
import { ErrorType, BackendError } from '../utils/error.js'

const repo = AppDataSource.getRepository(Team)

export const get = async (query?: string, limit: number = 0): Promise<Team[]> => {
  let ret: Team[] = []
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
      reject(new BackendError(ErrorType.ServerError, 'server error', error.message))
    })
  }

  if (ret.length === 0 && !(query === null || query === undefined)) {
    return await new Promise((resolve, reject) => {
      reject(new BackendError(ErrorType.NotFound, 'not found', `there is no match to search term of '${query.toLowerCase()}'`))
    })
  } else if (ret.length === 0 && (query === null || query === undefined)) {
    return await new Promise((resolve, reject) => {
      reject(new BackendError(ErrorType.NoRecords, 'no records', 'no team in database'))
    })
  }
  return await new Promise((resolve, reject) => {
    resolve(ret)
  })
}

export const getById = async (id: number): Promise<Team> => {
  let item: Team | null = null
  try {
    item = await repo.findOneBy({ id })
  } catch (error) {
    return await new Promise((resolve, reject) => {
      reject(new BackendError(ErrorType.ServerError, 'server error', error.message))
    })
  }
  if (item === null) {
    return await new Promise((resolve, reject) => {
      return reject(new BackendError(ErrorType.NotFound, 'not found', `Could not find any entity of type "Team" matching: {\n    "id": ${id}\n`))
    })
  }
  return await new Promise((resolve, reject) => {
    resolve(item as Team)
  })
}

export const update = async (id: number, team: Team): Promise<Team> => {
  let teamExists: Team | null = null
  let idExists: Team | null = null
  try {
    teamExists = await repo.findOneBy({ name: Like(`%${team.name}%`) })
    idExists = await repo.findOneBy({ id })
  } catch (error) {
    return await new Promise((resolve, reject) => {
      reject(new BackendError(ErrorType.ServerError, 'server error', error.message))
    })
  }

  if ((teamExists != null) && teamExists.id !== id) {
    return await new Promise((resolve, reject) => {
      return reject(new BackendError(ErrorType.AlreadyExists, 'already exists', `team with the name of ${team.name.toLowerCase()} already exists in database`))
    })
  }
  if (idExists == null) {
    return await new Promise((resolve, reject) => {
      return reject(new BackendError(ErrorType.NotFound, 'not found', `team with id of ${id} not exists in database`))
    })
  }

  idExists.name = team.name
  await repo.save(idExists)
  return await new Promise((resolve, reject) => {
    resolve(idExists as Team)
  })
}

export const insert = async (team: Team): Promise<Team> => {
  let teamFromDb: Team | null = null
  try {
    teamFromDb = await repo.findOneBy({ name: Like(`%${team.name}%`) })
  } catch (error) {
    return await new Promise((resolve, reject) => {
      reject(new BackendError(ErrorType.ServerError, 'server error', error.message))
    })
  }
  if (teamFromDb !== null) {
    return await new Promise((resolve, reject) => {
      return reject(new BackendError(ErrorType.AlreadyExists, 'already exists', `${team.name.toLowerCase()} already exists in database`))
    })
  }

  if (team.id > 0) {
    return await new Promise((resolve, reject) => {
      return reject(new BackendError(ErrorType.ArgumentError, 'argument error', 'do not specify id for insert!'))
    })
  }
  const ret = await repo.save(team)
  return await new Promise((resolve, reject) => {
    resolve(ret)
  })
}

export const remove = async (id: number): Promise<Team> => {
  let team: Team | null = null
  try {
    team = await repo.findOneBy({ id })
  } catch (error) {
    return await new Promise((resolve, reject) => {
      reject(new BackendError(ErrorType.ServerError, 'server error', error.message))
    })
  }
  if (team === null) {
    return await new Promise((resolve, reject) => {
      return reject(new BackendError(ErrorType.NotFound, 'not found', `team with ${id} not exists in database`))
    })
  }
  const pilots = await AppDataSource.getRepository('pilot').find({ where: { team } })

  for (let i = 0; i < pilots.length; i++) {
    pilots[i].team = null
    await AppDataSource.getRepository('pilot').save(pilots[i])
  }

  // pilots.forEach(async (pilot) => {
  //   pilot.team = null
  //   await AppDataSource.getRepository('pilot').save(pilot)
  // })

  const ret = await repo.remove(team)
  return await new Promise((resolve, reject) => {
    resolve(ret)
  })
}
