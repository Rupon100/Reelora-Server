const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();
require('dotenv').config();

app.use(cors({ 
  origin: ['http://localhost:5173', 'https://reelora-83735.web.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
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
    const movieCollection = client.db("movieDB").collection('movies');
    const favCollection = client.db("movieDB").collection('favmovie');
    const userCollection = client.db("movieDB").collection('users');
    
    // user information
    app.post('/users', async(req,res) => {
      const newUser = req.body;
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });

    app.get('/users', async(req,res) => {
      const query = await userCollection.find().toArray();
      res.send(query);
    });

    // add all movie
    app.post('/addmovie', async(req, res) => {
        const newMovie = req.body;
        const result = await movieCollection.insertOne(newMovie);
        res.send(result)
    });

    // get all movie in the api
    app.get('/', async (req,res) => {
        const query = movieCollection.find();
        const movie = await query.toArray();
        res.send(movie)
    });
    
    // get details api
    app.get('/details/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await movieCollection.findOne(query)
      res.send(result);
    })

    // delete a single movie
    app.delete('/allmovie/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await movieCollection.deleteOne(query);
      res.send(result);
    })




    // handle fav movie
    app.post('/favmovie', async (req, res) => {
      const favMovie = req.body;
      const result = await favCollection.insertOne(favMovie);
      res.send(result)
    })

    // show in api
    app.get('/favmovie', async(req, res) => {
      const query = favCollection.find();
      const favmovie = await query.toArray();
      res.send(favmovie)
    })



    app.get('/favmovie/:email', async(req, res) => {
      const mail = req.params.email;
      const query = {email: mail} ;
      const result = await favCollection.find(query).toArray();
      res.send(result);
    })
    





    // fav item delete
    app.delete('/favmovie/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await favCollection.deleteOne(query);
      res.send(result);
    });

    // update movie item
    app.put('/update/:id', async (req, res) => {
      const id = req.params.id;
      const upMovie = req.body;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true};
      const updateUser = {
        $set: {
            title: upMovie.title,
            poster: upMovie.poster,
            genre: upMovie.genre,
            time: upMovie.time,
            rating: upMovie.rating,
            year: upMovie.year,
            msg: upMovie.msg,
        }
      };
      const result = await movieCollection.updateOne(filter, updateUser, options);
      res.send(result)
    })

  } finally {
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('server running');
})

app.listen(port)