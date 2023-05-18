const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());



console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xdyi47s.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const toysCollection = client.db('toysWebsite').collection('toys'); 

        // get all toys
        app.get('/allToys', async(req,res)=>{
            // const cursor = toysCollection.find();
            
            const result = await toysCollection.find().sort({ createdAt: -1 }).toArray();
            res.send(result)
        })

        //  app.get('/myToys/:id', async(req, res)=>{
        //     const id = req.params.id;
        //     const query = {_id: new ObjectId(id)}
        //     const result = await toysCollection.findOne(query);
        //     res.send(result);
        //  })
        

        app.post('/allToys', async(req,res)=>{
            const newToys = req.body;
            newToys.createdAt = new Date();
            console.log(newToys);
            const result = await toysCollection.insertOne(newToys);
            res.send(result)
        })

      
        app.get('/allToys/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await toysCollection.findOne(query);
            res.send(result)
        })
       

        app.get('/myToys/:email',async(req, res) => {
            console.log(req.params.email)
             const result = await toysCollection.find({
                userEmail: req.params.email}).toArray();
                res.send(result)
        })


        app.delete('/myToys/:id', async(req , res) =>{
            const id = req.params.id;
            const query = { _id: new ObjectId(id)}
            const result = await toysCollection.deleteOne(query);
            res.send(result)
        })








        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('doll is running')
})

app.listen(port, () => {
    console.log(`doll is running on port ${port}`)
})