import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import teamRepo from './repos/teamRepo'
import "reflect-metadata"
import { AppDataSource } from './data-source'
import { Team } from './entity/Team'

const app = express()

app.use(cors())
app.use(bodyParser.json())

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
let initialized = false;
const initADS = async() => {
    for (let i = 1; i < 7; i++) {
        if(initialized){
            break;
        }
        console.log(`--->AppDataSource initialization try #${i}`)
        AppDataSource.initialize()
            .then(() => {
                // here you can start to work with your database
                console.log('--->Successfully initialized AppDataSource')
                initialized = true
            })
            .catch((error) => {
                console.log('--->Error while initializing AppDataSource')
                console.log(error)
            })
        await delay(i*10000)
    }
}
initADS()

app.route('/api/team')
    .get(async (req, res) => {
        try {
            const data = await teamRepo.get()
            return res.send(data)
        } catch (error) {
            if(error === 'no team in database'){
                return res.status(404).send({error})
            }
            return res.status(500).send({error})
        }
    })
    .post(async (req, res) => {
        if(req.body.type === 'search'){
            try {
                const ret = await teamRepo.get(req.body.name, req.body.limit)
                return res.send(ret)
            } catch (error) {
                if(error === `there is no match to search term of '${req.body.name.toLowerCase()}'`)
                    return res.status(404).send({error})
                return res.status(500).send({error})
            }
        }

        let data
        try {
            data = await teamRepo.insert(req.body)
        } catch (error) {
            return res.status(500).send({ error })
        }
        res.send(data)
    })

app.route('/api/team/:id')
    .get(async (req, res) => {
        const id = Number(req.params.id)
        try {
            const data = await teamRepo.getById(id)
            return res.status(200).send(data)
        } catch (error) {
            if(error.message === `Could not find any entity of type \"Team\" matching: {\n    \"id\": ${id}\n}`){
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
            data = await teamRepo.update(id, updatedTeam)
        } catch (error) {
            if(error === `team with id of ${id} not exists in database`){
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
            data = await teamRepo.remove(id)
        } catch (error) {
            if(error === `team with ${id} not exists in database`){
                return res.status(404).end()
            }
            return res.status(500).send({error})
        }
        res.send(data)
    })

app.listen(4000, () => {
    console.log('--->BE listening on port 4000.')
})