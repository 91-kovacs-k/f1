import { Pilot } from '../entity/Pilot'
import { AppDataSource } from '../data-source'
import { Like } from 'typeorm'
import * as teamRepo from './teamRepo'
import { ErrorType, BackendError } from '../utils/error'
import { Team } from '../entity/Team'

const repo = AppDataSource.getRepository(Pilot)

export async function get (query?: string, limit: number = 0): Promise<Pilot[]> {
  return await new Promise(async (resolve, reject) => {
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
      let ret = []
      if (limit > 0) {
        ret = items.slice(0, limit)
      } else {
        ret = items
      }

      if (ret.length === 0 && !(query === null || query === undefined)) {
        reject(new BackendError(ErrorType.NotFound, 'not found', `there is no match to search term of '${query.toLowerCase()}'`))
      } else if (ret.length === 0 && (query === null || query === undefined)) {
        reject(new BackendError(ErrorType.NoRecords, 'no records', 'no pilot in database'))
      }

      resolve(ret)
    } catch (error) {
      reject(new BackendError(ErrorType.ServerError, 'server error', error.message))
    }
  })
}

export async function getById (id: number): Promise<Pilot> {
  return await new Promise(async (resolve, reject) => {
    try {
      const item = await repo.find({ where: { id }, relations: { team: true } })
      if (item.length === 0) {
        reject(new BackendError(ErrorType.NotFound, 'not found', `Could not find any entity of type "Pilot" matching: {\n    "id": ${id}\n}`))
      }
      resolve(item[0])
    } catch (error) {
      reject(new BackendError(ErrorType.ServerError, 'server error', error.message))
    }
  })
}

export async function insert (pilot: Pilot): Promise<Pilot> {
  return await new Promise(async (resolve, reject) => {
    try {
      const pilotFromDb = await repo.findOneBy({ name: Like(`%${pilot.name}%`) })
      if (pilotFromDb != null) {
        return reject(new BackendError(ErrorType.AlreadyExists, 'already exists', `${pilot.name.toLowerCase()} already exists in database`))
      }

      if (pilot.id > 0) {
        return reject(new BackendError(ErrorType.ArgumentError, 'argument error', 'do not specify id for insert!'))
      }
      const pilotToSave: Pilot = pilot

      let teamById: Team | null = null
      if (pilot.team !== null && pilot.team.id > 0) {
        try {
          teamById = await teamRepo.getById(Number(pilot.team.id))
        } catch (error) {
          return reject(error)
        }
      }

      let teamByName: Team[] | null = null
      if (pilot.team !== null && !(pilot.team.name === null || pilot.team.name === undefined)) {
        try {
          teamByName = await teamRepo.get(pilot.team.name)
          if (teamByName.length > 1) {
            return reject(new BackendError(ErrorType.MultipleMatch, 'multiple match', `there is more than one team that matches the name of '${pilot.team.name}'`))
          }
        } catch (error) {
          teamByName = [pilot.team] as Team[]
        }
      }

      if (!(teamById === null || teamById === undefined) && !(teamByName === null || teamByName === undefined)) {
        if (teamByName[0].id !== teamById.id) {
          return reject(new BackendError(ErrorType.IdMismatch, 'id mismatch', `the id from request body is belong to '${teamById.name}' but in request the name was: '${teamByName[0].name}'`))
        }
      }

      if (!(teamById === null || teamById === undefined)) {
        pilotToSave.team = teamById
      } else if (!(teamByName === null || teamByName === undefined)) {
        pilotToSave.team = teamByName[0]
      } else {
        pilotToSave.team = pilot.team
      }

      const ret = await repo.save(pilotToSave)
      resolve(ret)
    } catch (error) {
      reject(new BackendError(ErrorType.ServerError, 'server error', error.message))
    }
  })
}

export async function remove (id: number): Promise<Pilot> {
  return await new Promise(async (resolve, reject) => {
    try {
      const pilot = await repo.findOneBy({ id })
      if (pilot == null) {
        return reject(new BackendError(ErrorType.NotFound, 'not found', `pilot with ${id} not exists in database`))
      }

      const ret = await repo.remove(pilot)
      resolve(ret)
    } catch (error) {
      reject(new BackendError(ErrorType.ServerError, 'server error', error.message))
    }
  })
}

export async function update (id: number, pilot: Pilot): Promise<Pilot> {
  return await new Promise(async (resolve, reject) => {
    try {
      const pilotExists = await repo.findOneBy({ name: Like(`%${pilot.name}%`) })

      if ((pilotExists != null) && pilotExists.id !== id) {
        return reject(new BackendError(ErrorType.AlreadyExists, 'already exists', `pilot with the name of ${pilot.name.toLowerCase()} already exists in database`))
      }
      const idExists: Pilot | null = await repo.findOneBy({ id })
      if (idExists == null) {
        return reject(new BackendError(ErrorType.NotFound, 'not found', `pilot with id of ${id} not exists in database`))
      }
      idExists.name = pilot.name

      let teamById: Team | null = null
      if (pilot.team !== null && pilot.team.id > 0) {
        try {
          teamById = await teamRepo.getById(Number(pilot.team.id))
        } catch (error) {
          return reject(error)
        }
      }

      let teamByName: Team[] | null = null
      if (pilot.team !== null && !(pilot.team.name === null || pilot.team.name === undefined)) {
        try {
          teamByName = await teamRepo.get(pilot.team.name)
          if (teamByName.length > 1) {
            return reject(new BackendError(ErrorType.MultipleMatch, 'multiple match', `there is more than one team that matches the name of '${pilot.team.name}'`))
          }
        } catch (error) {
          teamByName = [pilot.team] as Team[]
        }
      }

      if (!(teamById === null || teamById === undefined) && !(teamByName === null || teamByName === undefined)) {
        if (teamByName[0].id !== teamById.id) {
          return reject(new BackendError(ErrorType.IdMismatch, 'id mismatch', `the id from request body is belong to '${teamById.name}' but in request the name was: '${teamByName[0].name}'`))
        }
      }

      if (!(teamById === null || teamById === undefined)) {
        idExists.team = teamById
      } else if (!(teamByName === null || teamByName === undefined)) {
        idExists.team = teamByName[0]
      } else {
        idExists.team = pilot.team
      }

      await repo.save(idExists)
      resolve(idExists)
    } catch (error) {
      reject(new BackendError(ErrorType.ServerError, 'server error', error.message))
    }
  })
}
