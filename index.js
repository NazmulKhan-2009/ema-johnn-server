// REQUIRE START ⚙️
const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser')
const cors=require('cors')
//REQUIRE END :gear:

//ENVIRONMENTAL OR ENV CONFIGURATION
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qnbwm.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()

//MIDDLE WARE START :play_or_pause_button:
app.use(bodyParser.json())
app.use(cors())
//MIDDLE WARE END :play_or_pause_button:

const port = 5000

//FOR CHECKING EITHER ENV CONNECTED OR NOT :pick:
// console.log(process.env.DB_USER);


//MONGO DATABASE CLIENT CONNECTION START :rocket:

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("productsList");
  const ordersCollection = client.db("emaJohnStore").collection("orders");
//POST
  app.post('/addProduct' , (req, res)=>{
    const products=req.body;
    console.log(products);
  
    productsCollection.insertOne(products)
    .then(result=>{
      console.log(result.insertedCount)
      res.send(result.insertedCount)
    })
  })

//GET
app.get("/products", (req, res) => {
  productsCollection.find({})
  .toArray((err, documents)=>{
      res.send(documents)
  })
})


app.get("/product/:key", (req, res) => {
  productsCollection.find({key:req.params.key})
  .toArray((err, documents)=>{
      res.send(documents[0])
  })
})

app.post("/productByKeys", (req, res)=>{
  const productKyes=req.body
  productsCollection.find({key:{$in:productKyes}})
  .toArray ((err, documents)=>{
    res.send(documents)
  })
})

// ORDERS API
  app.post('/addOrder' , (req, res)=>{
  const order=req.body;
 
  ordersCollection.insertOne(order)
  .then(result=>{
    console.log(result.insertedCount)
    res.send(result.insertedCount>0) //???????????????????
  })
})

  
});
//MONGO DATABASE CLIENT CONNECTON END :rocket:


app.listen(port)
