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
                let items;
                if(query){
                    items = db.collection('teams').find({name: {$regex: query, $options: 'i'}})
                }else{
                    items = db.collection('teams').find()
                }

                if(limit > 0){
                    items = items.limit(limit)
                }

                const ret = await items.toArray()                

                if(ret.length === 0){
                    reject(`there is no match to search term of '${query.toLowerCase()}'`)
                }

                resolve(ret)
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
                let teamExists = await db.collection('teams').findOne({name : {$regex: team.name, $options: 'i'}})
                if(teamExists){
                    return reject(`team with the name of ${team.name.toLowerCase()} already exists in database`)
                }
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
                let teamFromDb = await db.collection('teams').findOne({name: {$regex: team.name, $options: 'i'}})
                if(teamFromDb){
                    return reject(`${team.name.toLowerCase()} already exists in database`)
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