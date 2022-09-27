import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongodb from 'mongodb'
import teamRepo from './repos/teamRepo.js'

const app = express()
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017'
const dbName = 'f1'
// const teams = 
// [
//     { id: 1, name: 'ferrari' },
//     { id: 2, name: 'mercedes' },
//     { id: 3, name: 'red bull' },
//     { id: 4, name: 'mclaren' }
// ]

// async function main(){
//     const client = new MongoClient(url)
//     await client.connect()
//     const results = await teamRepo.loadData(JSON.parse(JSON.stringify(teams)))
//     const admin = client.db(dbName).admin()
//     // await client.db(dbName).dropDatabase()
//     //console.log(await admin.serverStatus())
//     //console.log(await admin.listDatabases())
//     client.close()
// }
// main()

app.use(cors())
app.use(bodyParser.json())

app.route('/api/team')
    .get(async (req, res) => {
        try {
            const data = await teamRepo.get()
            return res.send(data)
        } catch (error) {
            return res.status(500).send({error: error})
        }
    })
    .post(async (req, res) => {
        if(req.body.type === 'search'){
            try {
                const data = await teamRepo.get(req.body.name, req.body.limit) 
                return res.send(data)
            } catch (error) { 
                if(error === `there is no match to search term of '${req.body.name.toLowerCase()}'`)
                    return res.status(404).send({error: error})
                return res.status(500).send({error: error})
            }
        }

        let data = ""
        try {
            data = await teamRepo.insert(req.body)
        } catch (error) {
            return res.status(500).send({ error: error })
        }
        res.send(data)
    })

app.route('/api/team/:id')
    .get(async (req, res) => {
        const id = req.params.id
        const data = await teamRepo.getById(id)
        if(!data){
            return res.status(404).end()
        }
        return res.status(200).send(data)
    })
    .put(async (req, res) => {
        const id = req.params.id
        const updatedTeam = req.body
        if(id != updatedTeam.id){
            return res.status(500).send({ error: "the id in url endpoint and request body does not match" })
        }

        let data = ""
        try {
            data = await teamRepo.update(id, updatedTeam)
        } catch (error) {
            return res.status(500).send({error: error})
        }

        return res.send(data)
    })
    .delete(async (req, res) => {
        const id = req.params.id
        let data = ""
        try {
            data = await teamRepo.remove(id)
        } catch (error) {
            if(error === `team with ${id} not exists in database`){
                return res.status(404).end() 
            }
            return res.status(500).send({error: error})
        }
        res.send(data)
    })

app.listen(4000, () => {
    console.log('--->BE listening on port 4000.')
})