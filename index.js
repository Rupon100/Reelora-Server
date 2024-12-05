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
     
    app.get('/', (req,res) => {
        res.send('Running from mongodb')
    })

    app.post('/addmovie', async(req, res) => {
        
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