const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const cors = require('cors')
const port = process.env.PORT || 5000;
const jwt = require('jsonwebtoken');


require('dotenv').config()

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3zaytaj.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const serviceCollection = client.db('tourism-guide').collection('services')
        const orderCollection = client.db('tourism-guide').collection('order')

        const moreCollection = client.db('tourism-guide').collection('more')

        // Get api from the database server
        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query)
            const services = await cursor.toArray()
            res.send(services);
        })

        // Get api from the database server
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await serviceCollection.findOne(query)
            res.send(service)
        })

        //post api
        app.post('/service', async (req, res) => {
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService)
            res.send(result);
        })

        // Delete
        app.delete('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await serviceCollection.deleteOne(query)
            res.send(result);
        })

        // Create order API
        app.post('/order', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order)
            res.send(result);
        })

        // Get API
        app.get('/order', async (req, res) => {
            const query = {};
            const cursor = orderCollection.find(query)
            const orders = await cursor.toArray()
            res.send(orders);
        })

        app.get('/more', async(req, res) =>{
            const query = {}
            const cursor = moreCollection.find(query)
            const more = await cursor.toArray()
            res.send(more);
        })
    }

    finally {
        // await client.close()
    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Hello latest tourism! How are you?')
})

app.listen(port, () => {
    console.log('Running port to the latest tourism server site', port)
})


