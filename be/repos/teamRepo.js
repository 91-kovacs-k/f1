import mongodb from 'mongodb'

function teamRepo(){
    const MongoClient = mongodb.MongoClient;
    const url = 'mongodb://localhost:27017'
    const dbName = 'f1'

    function loadData(data){
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url)

            try {
                await client.connect()
                const db = client.db(dbName)
                let results = await db.collection('teams').insertMany(data)
                resolve(results)
                client.close()
            } catch (error) {
                reject(error)
            }
        })
    }

    function get(query, limit){
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url)
            try {
                await client.connect()
                const db = client.db(dbName)

                let items = db.collection('teams').find(query)

                if(limit > 0){
                    items = items.limit(limit)
                }

                resolve(await items.toArray())
                client.close()
            } catch (error) {
                reject(error)
            }
        })
    }    

    function getById(id){
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url)
            try {
                await client.connect()
                const db = client.db(dbName)

                const item = await db.collection('teams').findOne({id: Number(id)})

                resolve(item)
                client.close()
            } catch (error) {
                reject(error)
            }
        })
    }   

    function update(id, team){
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url)
            try {
                await client.connect()
                const db = client.db(dbName)
                const teamFromDb = await db.collection('teams').findOneAndReplace({id: Number(id)}, team)
                if(!teamFromDb){
                    return reject(`team with ${id} not exists in database`)
                }

                resolve(teamFromDb.value)
                client.close()
            } catch (error) {
                reject(error)
            }
        })
    }   

    function insert(team){
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url)
            try {
                await client.connect()
                const db = client.db(dbName)
                let teamFromDb = await db.collection('teams').findOne({name: team.name})
                if(teamFromDb){
                    return reject(`${team.name} already exists in database`)
                }
                teamFromDb = await db.collection('teams').findOne({id: Number(team.id)})
                if(teamFromDb){
                    return reject(`a team with the id of ${team.id} already exists in database`)
                }

                let results = await db.collection('teams').insertOne(team)
                resolve(results)
                
                client.close()
            } catch (error) {
                reject(error)
            }
        })
    }   

    function remove(id){
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url)
            try {
                await client.connect()
                const db = client.db(dbName)
                const team = await db.collection('teams').findOne({id: Number(id)})
                if(!team){
                    return reject(`team with ${id} not exists in database`)
                }

                let results = await db.collection('teams').deleteOne({id: Number(id)})
                resolve(results)
                
                client.close()
            } catch (error) {
                reject(error)
            }
        })
    }  

    return { loadData, get, getById, insert, remove, update }
}


export default teamRepo()