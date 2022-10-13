import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { teamRouter } from './routers/teamRouter'
import { pilotRouter } from './routers/pilotRouter'

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.use('/api/team', teamRouter)
app.use('/api/pilot', pilotRouter)

app.listen(4000, () => {
    console.log('--->BE listening on port 4000.')
})
