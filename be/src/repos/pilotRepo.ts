import { Pilot } from '../entity/Pilot'
import { AppDataSource } from '../data-source'
import { Like } from 'typeorm'
import * as teamRepo from './teamRepo'
import { ErrorType, BackendError } from '../utils/error'
import { Team } from '../entity/Team'

const repo = AppDataSource.getRepository(Pilot)

export const get = async (query?: string, limit: number = 0): Promise<Pilot[]> => {
  let ret: Pilot[] = []
  try {
    let items
    if (!(query === null || query === undefined)) {
      items = await repo.createQueryBuilder('pilot')
        .leftJoinAndSelect('pilot.team', 'team')
        .where('pilot.name like :name', { name: `%${query}%` })
        .getMany()
    } else {
      items = await repo.find({ relations: { team: true } })
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

  return await new Promise((resolve, reject) => {
    if (ret.length === 0 && !(query === null || query === undefined)) {
      reject(new BackendError(ErrorType.NotFound, 'not found', `there is no match to search term of '${query.toLowerCase()}'`))
    } else if (ret.length === 0 && (query === null || query === undefined)) {
      reject(new BackendError(ErrorType.NoRecords, 'no records', 'no pilot in database'))
    }

    resolve(ret)
  })
}

export const getById = async (id: number): Promise<Pilot> => {
  let item: Pilot[]
  try {
    item = await repo.find({ where: { id }, relations: { team: true } })
  } catch (error) {
    return await new Promise((resolve, reject) => {
      reject(new BackendError(ErrorType.ServerError, 'server error', error.message))
    })
  }
  if (item.length === 0) {
    return await new Promise((resolve, reject) => {
      reject(new BackendError(ErrorType.NotFound, 'not found', `Could not find any entity of type "Pilot" matching: {\n    "id": ${id}\n}`))
    })
  }
  return await new Promise((resolve, reject) => {
    resolve(item[0])
  })
}

export const insert = async (pilot: Pilot): Promise<Pilot> => {
  let pilotFromDb: Pilot | null = null

  try {
    pilotFromDb = await repo.findOneBy({ name: Like(`%${pilot.name}%`) })
  } catch (error) {
    return await new Promise((resolve, reject) => {
      return reject(new BackendError(ErrorType.ServerError, 'server error', error.message))
    })
  }

  if (pilotFromDb !== null) {
    return await new Promise((resolve, reject) => {
      return reject(new BackendError(ErrorType.AlreadyExists, 'already exists', `${pilot.name.toLowerCase()} already exists in database`))
    })
  }

  if (pilot.id > 0) {
    return await new Promise((resolve, reject) => {
      return reject(new BackendError(ErrorType.ArgumentError, 'argument error', 'do not specify id for insert!'))
    })
  }
  const pilotToSave: Pilot = pilot

  let teamById: Team | null = null
  let teamByName: Team[] = []
  if (!(pilot.team === null || pilot.team === undefined)) {
    if (pilot.team.id > 0) {
      try {
        teamById = await teamRepo.getById(Number(pilot.team.id))
      } catch (error) {
        return await new Promise((resolve, reject) => {
          return reject(error)
        })
      }
    }

    if (!(pilot.team.name === null || pilot.team.name === undefined)) {
      try {
        teamByName = await teamRepo.get(pilot.team.name)
        if (teamByName.length > 1) {
          return await new Promise((resolve, reject) => {
            return reject(new BackendError(ErrorType.MultipleMatch, 'multiple match', `there is more than one team that matches the name of '${pilot.team.name}'`))
          })
        }
        if (teamByName.length === 0) {
          return await new Promise((resolve, reject) => {
            return reject(new BackendError(ErrorType.NotFound, 'not found', `there is no team that match the name of ${pilot.team.name}`))
          })
        }
      } catch (error) {
        if (error.type === ErrorType.MultipleMatch) {
          return await new Promise((resolve, reject) => {
            return reject(error)
          })
        }
        if (error.type === ErrorType.NotFound) {
          teamByName = [pilot.team] as Team[]
        }
      }
    }
  }

  if (!(teamById === null || teamById === undefined) && !(teamByName[0] === null || teamByName[0] === undefined)) {
    if ((teamByName[0].id !== teamById.id) || (teamByName[0].name !== teamById.name)) {
      return await new Promise((resolve, reject) => {
        return reject(new BackendError(ErrorType.IdMismatch, 'id mismatch', `the id from request body is belong to '${(teamById as Team).name}' but in request the name was matching: '${teamByName[0].name}'`))
      })
    }
  }

  if (!(teamById === null || teamById === undefined)) {
    pilotToSave.team = teamById
  } else if (!(teamByName[0] === null || teamByName[0] === undefined)) {
    pilotToSave.team = teamByName[0]
  } else {
    pilotToSave.team = pilot.team
  }

  let ret: Pilot
  try {
    ret = await repo.save(pilotToSave)
  } catch (error) {
    return await new Promise((resolve, reject) => {
      return reject(new BackendError(ErrorType.ServerError, 'server error', error.message))
    })
  }

  return await new Promise((resolve, reject) => {
    resolve(ret)
  })
}

export const remove = async (id: number): Promise<Pilot> => {
  let pilot: Pilot | null = null
  try {
    pilot = await repo.findOneBy({ id })
  } catch (error) {
    return await new Promise((resolve, reject) => {
      reject(new BackendError(ErrorType.ServerError, 'server error', error.message))
    })
  }
  if (pilot === null) {
    return await new Promise((resolve, reject) => {
      return reject(new BackendError(ErrorType.NotFound, 'not found', `pilot with ${id} not exists in database`))
    })
  }

  const ret = await repo.remove(pilot)
  return await new Promise((resolve, reject) => {
    resolve(ret)
  })
}

export const update = async (id: number, pilot: Pilot): Promise<Pilot> => {
  let pilotExists: Pilot | null = null
  let idExists: Pilot | null = null
  try {
    pilotExists = await repo.findOneBy({ name: Like(`%${pilot.name}%`) })
    idExists = await repo.findOneBy({ id })
  } catch (error) {
    return await new Promise((resolve, reject) => {
      return reject(new BackendError(ErrorType.ServerError, 'server error', error.message))
    })
  }

  if ((pilotExists !== null) && pilotExists.id !== id) {
    return await new Promise((resolve, reject) => {
      return reject(new BackendError(ErrorType.AlreadyExists, 'already exists', `pilot with the name of ${pilot.name.toLowerCase()} already exists in database`))
    })
  }
  if (idExists === null) {
    return await new Promise((resolve, reject) => {
      return reject(new BackendError(ErrorType.NotFound, 'not found', `pilot with id of ${id} not exists in database`))
    })
  }
  idExists.name = pilot.name

  let teamById: Team | null = null
  if (pilot.team !== null && pilot.team.id > 0) {
    try {
      teamById = await teamRepo.getById(Number(pilot.team.id))
    } catch (error) {
      return await new Promise((resolve, reject) => {
        return reject(error)
      })
    }
  }

  let teamByName: Team[] = []
  if (pilot.team !== null && !(pilot.team.name === null || pilot.team.name === undefined)) {
    try {
      teamByName = await teamRepo.get(pilot.team.name)
      if (teamByName.length > 1) {
        return await new Promise((resolve, reject) => {
          return reject(new BackendError(ErrorType.MultipleMatch, 'multiple match', `there is more than one team that matches the name of '${pilot.team.name}'`))
        })
      }
      if (teamByName.length === 0) {
        return await new Promise((resolve, reject) => {
          return reject(new BackendError(ErrorType.NotFound, 'not found', `there is no team that match the name of ${pilot.team.name}`))
        })
      }
    } catch (error) {
      if (error.type === ErrorType.MultipleMatch) {
        return await new Promise((resolve, reject) => {
          return reject(error)
        })
      }
      if (error.type === ErrorType.NotFound) {
        teamByName = [pilot.team] as Team[]
      }
    }
  }

  if (!(teamById === null || teamById === undefined) && !(teamByName[0] === null || teamByName[0] === undefined)) {
    if ((teamByName[0].id !== teamById.id) || (teamByName[0].name !== teamById.name)) {
      return await new Promise((resolve, reject) => {
        return reject(new BackendError(ErrorType.IdMismatch, 'id mismatch', `the id from request body is belong to '${(teamById as Team).name}' but in request the name was natching: '${teamByName[0].name}'`))
      })
    }
  }

  if (!(teamById === null || teamById === undefined)) {
    idExists.team = teamById
  } else if (!(teamByName[0] === null || teamByName[0] === undefined)) {
    idExists.team = teamByName[0]
  } else {
    idExists.team = pilot.team
  }

  let ret: Pilot
  try {
    ret = await repo.save(idExists)
  } catch (error) {
    return await new Promise((resolve, reject) => {
      return reject(new BackendError(ErrorType.ServerError, 'server error', error.message))
    })
  }

  return await new Promise((resolve, reject) => {
    resolve(ret)
  })
}
