import "reflect-metadata"
import { DataSource } from "typeorm"
import { Team } from "./entity/Team"

export const AppDataSource = new DataSource({
    type: "mssql",
    host: "f1-mssql",
    username: "SA",
    password: "notPassword123",
    database: "F1",
    synchronize: true,
    logging: false,
    entities: [Team],
    migrations: [],
    subscribers: [],
    options: { encrypt: false }
})
