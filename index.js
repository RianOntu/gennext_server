require('dotenv').config();
const express=require('express');
const app=express();
const cors=require('cors');
const port=process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors());

app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.bi6ve1l.mongodb.net/?retryWrites=true&w=majority`;

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
    const usersCollection = client.db("task_management").collection("usersCollection")
    app.post('/adduser',async(req,res)=>{
      const user=req.body;
      const result=await usersCollection.insertOne(user);
      res.send(result)
    })
    app.get('/userrole',async(req,res)=>{
      
      const email=req.query.email;
      const query={email:email}
      const result=await usersCollection.find(query).toArray()
      res.send(result)
    })
    
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send("server is running")
})
app.listen(port);

