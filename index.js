require('dotenv').config();
const express=require('express');
const app=express();
const cors=require('cors');
const port=process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
    const taskCollection=client.db("task_management").collection("tasks")
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
    app.get('/allusers',async(req,res)=>{
      const result=await usersCollection.find().toArray();
      res.send(result);
    })
    app.post('/addtask',async(req,res)=>{
      const task=req.body;
      const result=await taskCollection.insertOne(task);
      res.send(result);
    })
    app.get('/alltasks',async(req,res)=>{
      const result=await taskCollection.find().toArray();
     
      res.send(result);

    })
    app.get('/mytasks',async(req,res)=>{
      const email=req.query.email;
      const query={assignee:email};
      const result=await taskCollection.find(query).toArray();
      res.send(result);
    })
    app.get('/taskdetails/:id',async(req,res)=>{
      const id=req.params.id;
      const filter={_id:new ObjectId(id)};
      const result=await taskCollection.find(filter).toArray();
      res.send(result);
    })
    app.patch('/updatestatus/:id',async(req,res)=>{
      const id=req.params.id;
      console.log(id,req.body);
      const {status}=req.body;
      const filter={_id:new ObjectId(id)};
      const updateDoc={$set:{status:status}};
      const result=await taskCollection.updateOne(filter,updateDoc);
      res.send(result);
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

