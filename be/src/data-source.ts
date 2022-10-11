import "reflect-metadata"
import { DataSource } from "typeorm"
import { Pilot } from './entity/Pilot'
import { Team } from './entity/Team'

export const AppDataSource = new DataSource({
    type: "mssql",
    host: "f1-mssql",          // docker
    // host: "localhost",      // non-docker
    port: 1433,
    username: "SA",
    password: "notPassword123",
    database: "F1",
    synchronize: true,
    logging: false,
    entities: [Pilot, Team],
    // entities: [`${__dirname}/entity/*.ts`],
    migrations: [],
    subscribers: [],
    options: { encrypt: false }
})

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