import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(bodyParser.json())

const teams = 
[
    { id: 1, name: 'ferrari' },
    { id: 2, name: 'mercedes' },
    { id: 3, name: 'red bull' },
    { id: 4, name: 'mclaren' }
]

app.route('/api/team')
    .get((req, res) => {
        res.send({ data: teams})
    })
    .post((req, res) => {
        console.log(req.body)
        res.send(req.body)
    })

app.route('/api/team/:id')
    .get((req, res) => {
        const id = req.params.id
        const team = selectTeam(id)
        if(team.id === 0){
            return res.status(404).end()
        }

        return res.status(200).send(team)
    })
    .put((req, res) => {
        const id = req.params.id
        const team = selectTeam(id)

        if(team.id === 0){
            return res.status(404).end()
        }

        return res.status(200).send(req.body)
    })
    .delete((req, res) => {
        const id = req.params.id
        const team = selectTeam(id)

        if(team.id === 0){
            return res.status(404).end()
        }

        return res.status(200).send({ data: `${team.name} was deleted.` })
    })

function selectTeam(id){
    const teamId = Number(id)
    let selectedTeam = ''
    teams.forEach(team => team.id === teamId ? selectedTeam = team : "")

    if(!selectedTeam){
        selectedTeam = { id: 0, name: 'not found' }
    }

    return selectedTeam;
}

app.listen(4000, () => {
    console.log('--->BE listening on port 4000.')
})