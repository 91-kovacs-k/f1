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
                    items = await repo.createQueryBuilder("pilot")
                                    .leftJoinAndSelect("pilot.team", "team")
                                    .where("pilot.name like :name", {name: `%${query}%`})
                                    .getMany()
                }else{
                    items = await repo.find({relations: {team: true}})
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
                const item = await repo.find({where: { id }, relations: { team: true }})
                if(item.length === 0){
                    reject(`Could not find any entity of type \"Pilot\" matching: {\n    \"id\": ${id}\n}`)
                }
                resolve(item[0])
            } catch (error) {
                reject(error)
            }
        })
    }

    function insert(pilot: Pilot){
        return new Promise(async (resolve, reject) => {
            try {
                const pilotFromDb = await repo.findOneBy({name: Like(`%${pilot.name}%`)})
                if(pilotFromDb){
                    return reject(`${pilot.name.toLowerCase()} already exists in database`)
                }

                if(pilot.id){
                    return reject(`do not specify id for insert!`)
                }
                const pilotToSave : Pilot = pilot;
                if(pilot.team && !pilot.team?.id){
                    try {
                        const team = await teamRepo.get(pilot.team.name) as Team[]
                        if(team.length > 1){
                            return reject(`there is more than 1 team that match the pilot.team.name`)
                        }
                        pilotToSave.team = team[0]
                    } catch (error) {
                        pilotToSave.team = pilot.team
                    }
                }else if(pilot.team?.id){
                    try {
                        const team = await teamRepo.getById(pilot.team.id) as Team
                        pilotToSave.team = team
                    } catch (error) {
                        pilotToSave.team = pilot.team
                    }
                }
                const ret = await repo.save(pilotToSave)
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
                const idExists : Pilot = await repo.findOneBy({ id })
                if(!idExists){
                    return reject(`pilot with id of ${id} not exists in database`)
                }
                idExists.name = pilot.name
                if(pilot.team && !pilot.team?.id){
                    try {
                        const team = await teamRepo.get(pilot.team.name) as Team[]
                        if(team.length > 1){
                            return reject(`there is more than 1 team that match the pilot.team.name`)
                        }
                        idExists.team = team[0]
                    } catch (error) {
                        idExists.team = pilot.team
                    }
                }else if(pilot.team?.id){
                    try {
                        const team = await teamRepo.getById(pilot.team.id) as Team
                        idExists.team = team
                    } catch (error) {
                        idExists.team = pilot.team
                    }
                }
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