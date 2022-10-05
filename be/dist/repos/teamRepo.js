var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import sql from 'mssql';
function teamRepo() {
    const config = {
        // server: "localhost",          // local build (npm start)
        server: "f1-mssql",
        port: 1433,
        user: "SA",
        password: "notPassword123",
        database: "F1",
        options: {
            enableArithAbort: true,
            trustServerCertificate: true
        },
        connectionsTimeout: 150000,
        pool: {
            max: 10,
            min: 0,
            idleTimeoutMillis: 30000
        }
    };
    // sql.on('error', err => console.log(err.message))
    // sql.on('connect', function(err) {
    //         // If no error, then good to proceed.
    //         console.log("--->Connected to MS SQL");
    // })
    // function loadData(data){
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             const pool = await sql.connect(config)
    //             const results
    //             // TODO insert data into db
    //             resolve(results)
    //             sql.close()
    //         } catch (error) {
    //             reject(error)
    //         }
    //     })
    // }
    function get(query, limit) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield sql.connect(config);
                let items;
                if (query) {
                    items = yield pool
                        .request()
                        .query(`select * from team where name like '%${query}%'`);
                }
                else {
                    items = yield pool.request().query(`select * from team`);
                }
                let ret = [];
                if (limit > 0) {
                    ret = items.recordset.slice(0, limit);
                }
                else {
                    ret = yield items.recordset;
                }
                if (ret.length === 0 && query) {
                    reject(`there is no match to search term of '${query.toLowerCase()}'`);
                }
                else if (ret.length === 0 && !query) {
                    reject('no team in database');
                }
                resolve(ret);
                // sql.close()
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    function getById(id) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield sql.connect(config);
                const result = yield pool
                    .request()
                    .input("id", sql.Int, id)
                    .query('select * from team where id = @id');
                const item = result.recordset[0];
                resolve(item);
                // sql.close()
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    function update(id, team) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield sql.connect(config);
                const result = yield pool.request().query(`select * from team where name like '${team.name}'`);
                const teamExists = result.recordset[0];
                if (teamExists && teamExists.id !== id) {
                    return reject(`team with the name of ${team.name.toLowerCase()} already exists in database`);
                }
                const teamFromDb = yield pool.request().query(`update team set name = '${team.name}' where id = ${id}`);
                if ((teamFromDb === null || teamFromDb === void 0 ? void 0 : teamFromDb.rowsAffected[0]) === 0) {
                    return reject(`team with id of ${id} not exists in database`);
                }
                resolve(teamFromDb);
                // sql.close()
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    function insert(team) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield sql.connect(config);
                const result = yield pool.request().query(`select * from team where name like '${team.name}'`);
                const teamFromDb = result.recordset[0];
                if (teamFromDb) {
                    return reject(`${team.name.toLowerCase()} already exists in database`);
                }
                const lastId = yield pool.request().query(`SELECT * FROM team where id = (select MAX(ID) from team)`);
                let newId = 1;
                if (lastId.rowsAffected[0] !== 0) {
                    newId = lastId.recordset[0].id + 1;
                }
                const results = yield pool.request().query(`insert into team (name) values ('${team.name}')`);
                resolve(results);
                // sql.close()
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    function remove(id) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield sql.connect(config);
                const result = yield pool.request().query(`select * from team where id = ${id}`);
                const team = result.recordset[0];
                if (!team) {
                    return reject(`team with ${id} not exists in database`);
                }
                const ret = yield pool.request().query(`delete from team where id = ${id}`);
                resolve(ret);
                // sql.close()
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    return { get, getById, insert, remove, update };
}
export default teamRepo();
//# sourceMappingURL=teamRepo.js.map