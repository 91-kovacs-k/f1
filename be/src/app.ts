import express from 'express'
import session from 'express-session'
import bodyParser from 'body-parser'
import cors from 'cors'
import { teamRouter } from './routers/teamRouter.js'
import { pilotRouter } from './routers/pilotRouter.js'
import { authRouter } from './routers/authRouter.js'

const app = express()
const PORT = 4000

app.use(cors())
app.use(bodyParser.json())
app.use(
  session({
    secret: 'ASDIWKRLSICXLFIEOELSSDKER',
    resave: false,
    saveUninitialized: false,
  })
)
app.use('/api/auth', authRouter)
app.use((req, res, next) => {
  if (req.session.user) {
    next()
  } else {
    res.sendStatus(401)
  }
})

app.use('/api/team', teamRouter)
app.use('/api/pilot', pilotRouter)

app.listen(4000, () => {
  console.log(`--->BE listening on port ${PORT}.`)
})
