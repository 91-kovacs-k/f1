import express from 'express'
import bodyParser from 'body-parser'

const app = express()

app.use(bodyParser.json())

app.route('/api/team')
    .get((req, res) => {
        res.send({ data: ['ferrari', 'mercedes', 'red bull', 'mclaren'] })
    })
    .post((req, res) => {
        console.log(req.body)
        res.send(req.body)
    })

app.route('/api/team/:id')
    .get((req, res) => {
        const id = req.params.id
        const team = selectTeam(id)
        if(team === 'not found'){
            return res.status(404).end()
        }

        return res.status(200).send({ data: team })
    })
    .put((req, res) => {
        const id = req.params.id
        const team = selectTeam(id)

        if(team === 'not found'){
            return res.status(404).end()
        }

        return res.status(200).send(req.body)
    })
    .delete((req, res) => {
        const id = req.params.id
        const team = selectTeam(id)

        if(team === 'not found'){
            return res.status(404).end()
        }

        return res.status(200).send({ data: `${team} was deleted.` })
    })

function selectTeam(id){
    let team = '';
    const teamId = Number(id)

    switch(teamId){
        case 1:
            team = 'ferrari'
            break
        case 2:
            team = 'mercedes'
            break
        case 3:
            team = 'red bull'
            break
        case 4:
            team = 'mclaren'
            break
        default:
            team = 'not found'
            break
    }
    return team;
}

app.listen(4000, () => {
    console.log('--->BE listening on port 4000.')
})