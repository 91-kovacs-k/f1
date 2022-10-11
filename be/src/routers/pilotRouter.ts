import { Router } from 'express'
import pilotRepo from '../repos/pilotRepo'

const pilotRouter = Router()

pilotRouter.route('/')
.get(async (req, res) => {
    try {
        const data = await pilotRepo.get()
        return res.send(data)
    } catch (error) {
        if(error === 'no pilot in database'){
            return res.status(404).send({error})
        }
        return res.status(500).send({error})
    }
})
.post(async (req, res) => {
    if(req.body.type === 'search'){
        try {
            const ret = await pilotRepo.get(req.body.name, req.body.limit)
            return res.send(ret)
        } catch (error) {
            if(error === `there is no match to search term of '${req.body.name.toLowerCase()}'`)
                return res.status(404).send({error})
            return res.status(500).send({error})
        }
    }

    let data
    try {
        data = await pilotRepo.insert(req.body)
    } catch (error) {
        return res.status(500).send({ error })
    }
    res.send(data)
})

pilotRouter.route('/:id')
.get(async (req, res) => {
    const id = Number(req.params.id)
    try {
        const data = await pilotRepo.getById(id)
        return res.status(200).send(data)
    } catch (error) {
        if(error === `Could not find any entity of type \"Pilot\" matching: {\n    \"id\": ${id}\n}`){
            return res.status(404).send({error})
        }
        return res.status(500).send({error})
    }
})
.put(async (req, res) => {
    const id = Number(req.params.id)
    const updatedTeam = req.body
    if(updatedTeam.id){
        if(id !== updatedTeam.id){
            return res.status(400).send({ error: "the id in url endpoint and request body does not match" })
        }
    }

    let data;
    try {
        data = await pilotRepo.update(id, updatedTeam)
    } catch (error) {
        if(error === `pilot with id of ${id} not exists in database`){
            return res.status(404).send({error})
        }
        return res.status(500).send({error})
    }

    return res.send(data)
})
.delete(async (req, res) => {
    const id = Number(req.params.id)
    let data;
    try {
        data = await pilotRepo.remove(id)
    } catch (error) {
        if(error === `pilot with ${id} not exists in database`){
            return res.status(404).end()
        }
        return res.status(500).send({error})
    }
    res.send(data)
})

export default pilotRouter;