const { MongoClient } = require('mongodb')

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const client = new MongoClient(process.env.MONGODB_URI);
let db;

const connectDB = async () => {
    try {
        await client.connect()
        db = client.db('spendly');
        console.log("MongoDB connected successfully!")
    } catch (err) {
        console.log("MongoDB Connection Error: ", err)
        process.exit(1);
    }
}

let getDB = () => db;

module.exports = { connectDB, getDB };