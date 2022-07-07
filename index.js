const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

// middle ware 

app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.BICYCLE_USER}:${process.env.BICYCLE_PASSWORD}@cluster0.qjhxj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const bicycleCollection = client.db('Bicycle-warehouse').collection('Inventory_Items');

        // inventory api collection 
        // find many 
        app.get('/inventory', async (req, res) => {
            const query = {};
            const cursor = bicycleCollection.find(query)
            const inventory_Items = await cursor.toArray()
            res.send(inventory_Items)
        })

        // find one 
        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const inventory = await bicycleCollection.findOne(query)
            res.send(inventory)
        })

        // add a data in api 

        app.post('/inventory', async (req, res) => {
            const newInventory = req.body;
            // console.log(newInventory)
            const result = await bicycleCollection.insertOne(newInventory)
            res.send(result)
        })

        // // delete methode 
        app.delete('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = bicycleCollection.deleteOne(query)
            res.send(result)
        })



    }
    finally {


    }
}


run().catch(console.dir);








app.get('/', (req, res) => {
    res.send('Ware house server is runnings')
})


app.listen(port, () => {
    console.log("Listening To Ware house Server", port)
})