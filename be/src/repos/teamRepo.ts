import { Team } from '../entity/Team'
import { AppDataSource } from '../data-source'
import { Like } from 'typeorm'
import { ErrorType, BackendError } from '../utils/error'

const repo = AppDataSource.getRepository(Team)

export async function get (query?: string, limit: number = 0): Promise<Team[]> {
  return await new Promise(async (resolve, reject) => {
    try {
      let items
      if (!(query === null || query === undefined)) {
        items = await repo.findBy({ name: Like(`%${query}%`) })
      } else {
        items = await repo.find()
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
        reject(new BackendError(ErrorType.NoRecords, 'no records', 'no team in database'))
      }

      resolve(ret)
    } catch (error) {
      reject(new BackendError(ErrorType.ServerError, 'server error', error.message))
    }
  })
}

export async function getById (id: number): Promise<Team> {
  return await new Promise(async (resolve, reject) => {
    try {
      const item = await repo.findOneBy({ id })
      if (item == null) {
        return reject(new BackendError(ErrorType.NotFound, 'not found', `Could not find any entity of type "Team" matching: {\n    "id": ${id}\n`))
      }
      resolve(item)
    } catch (error) {
      reject(new BackendError(ErrorType.ServerError, 'server error', error.message))
    }
  })
}

export async function update (id: number, team: Team): Promise<Team> {
  return await new Promise(async (resolve, reject) => {
    try {
      const teamExists = await repo.findOneBy({ name: Like(`%${team.name}%`) })

      if ((teamExists != null) && teamExists.id !== id) {
        return reject(new BackendError(ErrorType.AlreadyExists, 'already exists', `team with the name of ${team.name.toLowerCase()} already exists in database`))
      }
      const idExists = await repo.findOneBy({ id })
      if (idExists == null) {
        return reject(new BackendError(ErrorType.NotFound, 'not found', `team with id of ${id} not exists in database`))
      }

      idExists.name = team.name
      await repo.save(idExists)
      resolve(idExists)
    } catch (error) {
      reject(new BackendError(ErrorType.ServerError, 'server error', error.message))
    }
  })
}

export async function insert (team: Team): Promise<Team> {
  return await new Promise(async (resolve, reject) => {
    try {
      const teamFromDb = await repo.findOneBy({ name: Like(`%${team.name}%`) })
      if (teamFromDb != null) {
        return reject(new BackendError(ErrorType.AlreadyExists, 'already exists', `${team.name.toLowerCase()} already exists in database`))
      }

      if (team.id > 0) {
        return reject(new BackendError(ErrorType.ArgumentError, 'argument error', 'do not specify id for insert!'))
      }
      const ret = await repo.save(team)
      resolve(ret)
    } catch (error) {
      reject(new BackendError(ErrorType.ServerError, 'server error', error.message))
    }
  })
}

export async function remove (id: number): Promise<Team> {
  return await new Promise(async (resolve, reject) => {
    try {
      const team = await repo.findOneBy({ id })
      if (team == null) {
        return reject(new BackendError(ErrorType.NotFound, 'not found', `team with ${id} not exists in database`))
      }
      const pilots = await AppDataSource.getRepository('pilot').find({ where: { team } })
      pilots.forEach(async (pilot) => {
        pilot.team = null
        await AppDataSource.getRepository('pilot').save(pilot)
      })
      const ret = await repo.remove(team)
      resolve(ret)
    } catch (error) {
      reject(new BackendError(ErrorType.ServerError, 'server error', error.message))
    }
  })
}
