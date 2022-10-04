import sql from 'mssql'



function teamRepo(){
    const config = {
        //server: "localhost",
        server: "mssql",
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
    }
    sql.on('error', err => console.log(err.message))
    sql.on('connect', function(err) {  
            // If no error, then good to proceed.
            console.log("--->Connected to MS SQL"); 
    })
    
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

    function get(query, limit){
        return new Promise(async (resolve, reject) => {
            try {
                const pool = await sql.connect(config)
                let items;
                if(query){
                    items = await pool
                    .request()
                    .query(`select * from team where name like '%${query}%'`)
                }else{
                    items = await pool.request().query(`select * from team`)
                }
                let ret = []
                if(limit > 0){
                    ret = items.recordset.slice(0, limit)
                }else{
                    ret = await items.recordset;
                }

                if(ret.length === 0 && query){
                    reject(`there is no match to search term of '${query.toLowerCase()}'`)
                }else if(ret.length === 0 && !query){
                    reject('no team in database')
                }

                resolve(ret)
                sql.close()
            } catch (error) {
                reject(error)
            }
        })
    }    

    function getById(id){
        return new Promise(async (resolve, reject) => {
            try {
                const pool = await sql.connect(config)
                const result = await pool
                    .request()
                    .input("id", sql.Int, parseInt(id))
                    .query('select * from team where id = @id')
                const item = result.recordset[0]

                resolve(item)
                sql.close()
            } catch (error) {
                reject(error)
            }
        })
    }   

    function update(id, team){
        return new Promise(async (resolve, reject) => {
            try {
                const pool = await sql.connect(config)
                const result = await pool.request().query(`select * from team where name like '${team.name}'`)
                const teamExists = result.recordset[0]

                if(teamExists && teamExists.id != id){
                    return reject(`team with the name of ${team.name.toLowerCase()} already exists in database`)
                }
                const teamFromDb = await pool.request().query(`update team set name = '${team.name}' where id = ${id}`)

                if(teamFromDb?.rowsAffected[0] === 0){
                    return reject(`team with id of ${id} not exists in database`)
                }
                resolve(teamFromDb)
                sql.close()
            } catch (error) {
                reject(error)
            }
        })
    }   

    function insert(team){
        return new Promise(async (resolve, reject) => {
            try {
                const pool = await sql.connect(config) 
                const result = await pool.request().query(`select * from team where name like '${team.name}'`)
                const teamFromDb = result.recordset[0]
                if(teamFromDb){
                    return reject(`${team.name.toLowerCase()} already exists in database`)
                }
                
                const lastId = await pool.request().query(`SELECT * FROM team where id = (select MAX(ID) from team)`)
                let newId = 1
                if(lastId.recordset[0].id){
                    newId = lastId.recordset[0].id + 1
                }
                const results = await pool.request().query(`insert into team (id, name) values (${newId}, '${team.name}')`)
                resolve(results)
                
                sql.close()
            } catch (error) {
                reject(error)
            }
        })
    }   

    function remove(id){
        return new Promise(async (resolve, reject) => {
            try {
                const pool = await sql.connect(config)
                const result = await pool.request().query(`select * from team where id = ${id}`)
                const team = result.recordset[0]
                if(!team){
                    return reject(`team with ${id} not exists in database`)
                }

                let ret = await pool.request().query(`delete from team where id = ${id}`)
                resolve(ret)
                
                sql.close()
            } catch (error) {
                reject(error)
            }
        })
    }  

    return { get, getById, insert, remove, update }
}


export default teamRepo()