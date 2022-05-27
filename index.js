const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = 2001;
app.use(cors());
app.use(bodyParser.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lzmkl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;



app.get('/',(req,res)=>{
  res.send('chinta nai chalu ase')
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const bazarCollection = client.db("SBBR_Bazar").collection("Hisab_Nikas");
  const AddAdminCollection = client.db("SBBR_Bazar").collection("AddAddmin");
  app.post('/uploadbazar',(req,res)=>{
    const bazarlist = req.body;
    bazarCollection.insertOne(bazarlist)
    .then(result=>{

      res.send(result.insertedCount>0)
    })
  })

  app.get('/allbazar',(req,res)=>{
    bazarCollection.find({})
    .toArray((err,result) =>{
      res.send(result)
    })
  })
  app.get('/products/:id',(req,res)=>{
    bazarCollection.find({_id : ObjectId(req.params.id)})
    .toArray((arr,docu)=>{
      res.send(docu[0])
    })
  })
  app.post('/totalprice',(req,res)=>{
    bazarCollection.find({price})
    .toArray((err,result) =>{
      res.send(result)
      console.log(result)
    })
  })

  app.post('/addadmin',(req,res)=>{
    const admin = req.body;
    AddAdminCollection.insertOne(admin)
    .then(result=>{
    res.send(result.insertedCount>0);
    })
  })

  app.patch('/update/:id',(req,res)=>{
    const id = req.params.id;
    bazarCollection.updateOne({_id: ObjectId(id)},{
      $set: {product:req.body.product, weight:req.body.weight, price:req.body.price,person:req.body.person,date:req.body.date,}
    })
    .then(result=>res.send(result))
  
  })

  app.post('/isadmin',(req,res)=>{
    const email = req.body.email;
    AddAdminCollection.find({email: email})
    .toArray((err,document)=>{
      res.send(document.length>0)
    })
  })

});


app.listen(process.env.PORT || port);



