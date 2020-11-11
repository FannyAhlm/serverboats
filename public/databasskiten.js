const { MongoClient, ObjectID } = require("mongodb");

const url = "mongodb://127.0.0.1:27017/";
const dbName = "berrasboats";
const collectionName = "boats";

const { allBoats } = require('./boats.js');

function checkDB(){
    MongoClient.connect( url, { useUnifiedTopology: true }, 
        async (error, client) => {
            if(error){
                console.log("Could not connect ", error.message);
                return;
            }
            console.log('connected successfully');

            const db = client.db(dbName);
            const col = db.collection(collectionName);
            
            col.find({}).toArray((error, docs)=> {
                if(error){
                    console.log('Something went wrong', error.message);
                    client.close()
                } else{
                    if(docs.length == 0){
                        let i = 1;
                        allBoats.forEach(boat => {
                            col.insertOne(boat);
                            i++;
                        })
                        if(i === 10){
                            client.close();
                        }
                    } else{
                        client.close();
                    }
                }
            })
        }
    )
}

function getBoats(callback){
    MongoClient.connect( url, { useUnifiedTopology: true }, 
        (error, client) => {
            if(error){
                console.log("Could not connect ", error.message);
                return;
            }
            console.log('connected successfully');

            const db = client.db(dbName);
            const col = db.collection(collectionName);
                
            col.find({}).toArray((error, docs)=> {

                try{
                    if(error){
                        console.log('Something went wrong', error.message);
                    } else{
                        callback(docs);
                    }

                } finally{
                    client.close();
                }
            })
        }
    )
}

function getThisBoat(id, callback){
    MongoClient.connect( url, { useUnifiedTopology: true }, 
        async (error, client) => {
            if(error){
                console.log("Could not connect ", error.message);
                return;
            }
            console.log('connected successfully');

            const db = client.db(dbName);
            const col = db.collection(collectionName);

            try{
                const boat = await col.find({ _id: new ObjectID(id)}).toArray();
                callback(boat);
            } catch(e) {
                console.log('Error: ' + e);
            } finally{
                client.close();
            }
        }
    )
}

function createBoat(userBoat, callback){
    MongoClient.connect( url, { useUnifiedTopology: true }, 
        async (error, client) => {
            if(error){
                console.log("Could not connect ", error.message);
                return;
            }
            console.log('connected successfully');

            const db = client.db(dbName);
            const col = db.collection(collectionName);

            try{
                const newBoat = await col.insertOne(userBoat);
                callback(newBoat.result);
            } catch(e) {
                console.log('Error: ' + e);
            } finally {
                client.close();
            }
        }
    )
}

function deleteBoat(id, callback){
    MongoClient.connect( url, { useUnifiedTopology: true }, 
        async (error, client) => {
            if(error){
                console.log("Could not connect ", error.message);
                return;
            }
            console.log('connected successfully');

            const db = client.db(dbName);
            const col = db.collection(collectionName);

            try{
                const response = await col.deleteOne({ _id: new ObjectID(id)});
                callback(response.result);
            } catch(e) {
                console.log('Error: ' + e);
            } finally {
                client.close();
            }
        }
    )
}

function searchBoats(params, callback){
    MongoClient.connect( url, { useUnifiedTopology: true }, 
        async (error, client) => {
            if(error){
                console.log("Could not connect ", error.message);
                return;
            }
            console.log('connected successfully');

            const db = client.db(dbName);
            const col = db.collection(collectionName);

            if(!params.word && !params.maxprice){
                callback('You must search for a word or maxprice to get a result.');
                client.close();
                return;
            }
            try{

                let boats;

                if(params.word && params.maxprice){
                    const regex = new RegExp(params.word, 'i');
                   boats = await col.find({model: regex, price: {$lte: Number(params.maxprice)}}).limit(5).toArray();
                } else if(params.word){
                    const regex = new RegExp(params.word, 'i');
                    boats = await col.find({model: regex}).limit(5).toArray();
                } else{
                    boats = await col.find({price: {$lte: Number(params.maxprice)}}).limit(5).toArray();
                }
                callback(boats);
            } catch(e){
                console.log('Error: ' + e);
            } finally{
                client.close();
            }
        }
    )
}

module.exports = {
  getBoats,
  getThisBoat,
  createBoat,
  deleteBoat,
  checkDB,
  searchBoats
};


// compressors=disabled&gssapiServiceName=mongodb