const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g8d1l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();

        const database = client.db("tourPlanner");
        const toursCollection = database.collection("tours");
        const ordersCollection = database.collection("orders");

        // GET api //
        app.get('/tours', async (req, res) => {
            const cursor = toursCollection.find({});
            const tours = await cursor.toArray();
            res.send(tours);

        })

        // POST api
        app.post('/tours', async (req, res) => {
            const tour = req.body;
            const result = await toursCollection.insertOne(tour);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.json(result)

        })

        // POST api
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.json(result)
        });

        // get orders api //
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            console.log(orders)
            res.send(orders);
        })

        // DELETE api
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        })


    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello from tour planner!')
})

app.listen(port, () => {
    console.log(`connected on port`, port)
})