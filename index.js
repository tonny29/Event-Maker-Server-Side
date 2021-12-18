const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const MongoClient = require("mongodb").MongoClient;

const port = process.env.PORT || 5000;
// middle wire set

app.use(cors());
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rpvut.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// console.log(uri)
client.connect((err) => {
  console.log("connection error", err);
  const eventCollection = client.db("event-service").collection("event");
  const adminsCollection = client.db("event-service").collection("admin");
  const orderCollection = client.db("event-service").collection("orders");

//filter by email
  app.get('/customerOrderItem', (req, res)=>{
    console.log(req.query.email)
    orderCollection.find({email:req.query.email})
    .toArray((err,documents)=>{
      res.send(documents)
    })
  })
  
// service delete
  app.delete('/serviceDelete/:id', (req, res) => {
    eventCollection.deleteOne({ _id: ObjectId(req.params.id) })
        .then(result => {
            res.send(result.deletedCount > 0);
        })
})

//order delete
  app.delete('/orderDelete/:id', (req, res) => {
    orderCollection.deleteOne({ _id: ObjectId(req.params.id) })
        .then(result => {
            res.send(result.deletedCount > 0);
        })
})

//post order
  app.post("/order", (req, res) => {
    const newOrder = req.body;
    console.log("adding new event:", newOrder);
    orderCollection.insertOne(newOrder).then((result) => {
      console.log("inserted count", result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });
  
  //get order
  app.get('/allOrder', (req, res) => {
    orderCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        });
});

//admin
  app.get('/adminDetails', (req, res) => {
    adminsCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        });
});

//get service
  app.get("/event", (req, res) => {
    eventCollection.find().toArray((err, items) => {
      res.send(items);
      console.log("from data base", items);
    });
  });

  //post services
  app.post("/addEvent", (req, res) => {
    const newEvent = req.body;
    console.log("adding new event:", newEvent);
    eventCollection.insertOne(newEvent).then((result) => {
      console.log("inserted count", result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });
  //   client.close();
});

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
