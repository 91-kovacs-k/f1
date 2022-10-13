import { Team } from '../entity/Team'
import { AppDataSource } from '../data-source'
import { Like } from 'typeorm'

const repo = AppDataSource.getRepository(Team)

export function get(query? : string, limit? : number){
    return new Promise(async (resolve, reject) => {
        try {
            let items;
            if(query){
                items = await repo.findBy({name: Like(`%${query}%`)})
            }else{
                items = await repo.find()
            }
            let ret = []
            if(limit > 0){
                ret = items.slice(0, limit)
            }else{
                ret = items
            }

            if(ret.length === 0 && query){
                reject(`there is no match to search term of '${query.toLowerCase()}'`)
            }else if(ret.length === 0 && !query){
                reject('no team in database')
            }

            resolve(ret)
        } catch (error) {
            reject(error)
        }
    })
}

export function getById(id : number){
    return new Promise(async (resolve, reject) => {
        try {
            const item = await repo.findOneByOrFail({ id })
            resolve(item)
        } catch (error) {
            reject(error)
        }
    })
}

export function update(id : number, team : Team){
    return new Promise(async (resolve, reject) => {
        try {
            const teamExists = await repo.findOneBy({name: Like(`%${team.name}%`)})

            if(teamExists && teamExists.id !== id){
                return reject(`team with the name of ${team.name.toLowerCase()} already exists in database`)
            }
            const idExists = await repo.findOneBy({ id })
            if(!idExists){
                return reject(`team with id of ${id} not exists in database`)
            }

            idExists.name = team.name
            await repo.save(idExists)
            resolve(idExists)
        } catch (error) {
            reject(error)
        }
    })
}

export function insert(team : Team){
    return new Promise(async (resolve, reject) => {
        try {
            const teamFromDb = await repo.findOneBy({name: Like(`%${team.name}%`)})
            if(teamFromDb){
                return reject(`${team.name.toLowerCase()} already exists in database`)
            }

            if(team.id){
                return reject(`do not specify id for insert!`)
            }
            const ret = await repo.save(team)
            resolve(ret)
        } catch (error) {
            reject(error)
        }
    })
}

export function remove(id : number){
    return new Promise(async (resolve, reject) => {
        try {
            const team = await repo.findOneBy({ id })
            if(!team){
                return reject(`team with ${id} not exists in database`)
            }

            const ret = await repo.remove(team)
            resolve(ret)
        } catch (error) {
            reject(error)
        }
    })
}