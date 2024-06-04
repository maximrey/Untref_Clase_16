
require('dotenv').config();

const {MongoClient} = require('mongodb');

const URI = process.env.MONGODB_URI;

const client = new MongoClient(URI);

const connectMongo = async() =>{
    try {
       await client.connect()
       console.log('Conectado');  
       return client;         
    } catch (error) {
        console.log(error)
        return null        
    }
}

const disconnectMongo = async() =>{
    try {
       await client.close()
       console.log('Desconectado');          
    } catch (error) {
        console.log(error)      
    }
}

module.exports={
    connectMongo,
    disconnectMongo
};

