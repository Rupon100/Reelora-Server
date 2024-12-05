const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());


const name = process.env.USER_NAME;
const key = process.env.USER_KEY;


const uri = `mongodb+srv://${name}:${key}@cluster0.cne3f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // await client.connect();

    const movieCollection = client.db("movieDB").collection('movies')
    

    app.post('/addmovie', async(req, res) => {
        const newMovie = req.body;
        const result = await movieCollection.insertOne(newMovie);
        res.send(result)
    });

    app.get('/', async (req,res) => {
        const query = movieCollection.find();
        const movie = await query.toArray();
        res.send(movie)
    })



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('server running');
})

app.listen(port, () => {
    console.log('Running on port: ', port);
})