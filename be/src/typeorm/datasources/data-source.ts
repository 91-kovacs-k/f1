import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { entities } from '..';

let MSSQLHOST: string;
if (process.env.ENVIRONMENT === 'localhost') {
  MSSQLHOST = process.env.NODE_DBHOST_DEV;
} else {
  MSSQLHOST = process.env.NODE_DBHOST;
}

let DATABASE = 'F1';
if (process.env.TESTING === 'true') {
  DATABASE = 'F1_TEST';
}

const dataSource = new DataSource({
  type: 'mssql',
  host: MSSQLHOST,
  port: 1433,
  username: 'SA',
  password: 'notPassword123',
  database: DATABASE,
  synchronize: true,
  logging: false,
  entities: entities,
  migrations: [],
  subscribers: [],
  options: { encrypt: false },
});

const init = async () => {
  try {
    await dataSource.initialize();
    console.log('-->AppDataSource initialization done.');
  } catch (error) {
    console.log(`-->Error while initializing AppDataSource: ${error}`);
  }
};

const AppDataSource = { dataSource: dataSource, init: init };
export default AppDataSource;
