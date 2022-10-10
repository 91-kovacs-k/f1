import { Pilot } from '../entity/Pilot'
import { Team } from '../entity/Team'
import { AppDataSource } from '../data-source'
import { Like } from 'typeorm'
import teamRepo from './teamRepo'

function pilotRepo(){
    const repo = AppDataSource.getRepository(Pilot)

    function get(query? : string, limit? : number){
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
                    reject('no pilot in database')
                }

                resolve(ret)
            } catch (error) {
                reject(error)
            }
        })
    }

    function getById(id: number){
        return new Promise(async (resolve, reject) => {
            try {
                const item = await repo.findOneByOrFail({ id })
                resolve(item)
            } catch (error) {
                reject(error)
            }
        })
    }

    function insert(pilot: Pilot, team?: Team){
        return new Promise(async (resolve, reject) => {
            try {
                const pilotFromDb = await repo.findOneBy({name: Like(`%${pilot.name}%`)})
                if(pilotFromDb){
                    return reject(`${pilot.name.toLowerCase()} already exists in database`)
                }

                if(pilot.id){
                    return reject(`do not specify id for insert!`)
                }
                const ret = await repo.save(pilot)
                resolve(ret)
            } catch (error) {
                reject(error)
            }
        })
    }

    function remove(id : number){
        return new Promise(async (resolve, reject) => {
            try {
                const pilot = await repo.findOneBy({ id })
                if(!pilot){
                    return reject(`pilot with ${id} not exists in database`)
                }

                const ret = await repo.remove(pilot)
                resolve(ret)
            } catch (error) {
                reject(error)
            }
        })
    }

    function update(id : number, pilot : Pilot){
        return new Promise(async (resolve, reject) => {
            try {
                const pilotExists = await repo.findOneBy({name: Like(`%${pilot.name}%`)})

                if(pilotExists && pilotExists.id !== id){
                    return reject(`pilot with the name of ${pilot.name.toLowerCase()} already exists in database`)
                }
                const idExists = await repo.findOneBy({ id })
                if(!idExists){
                    return reject(`pilot with id of ${id} not exists in database`)
                }

                idExists.name = pilot.name
                await repo.save(idExists)
                resolve(idExists)
            } catch (error) {
                reject(error)
            }
        })
    }

    return { get, getById, insert, remove, update }
}

export default pilotRepo()