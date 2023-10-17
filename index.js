// require the dependencies
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion } = require("mongodb");
// assignment-man
// OVlN4NWU9WhSyZyl
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vfiwhpa.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const database = client.db("Assignment10DB");
    const brandsCollection = database.collection("brands");
    const productsCollection = database.collection("products");
    //brands post
    app.post("/brands", async (req, res) => {
      const brand = req.body;
      console.log(brand);
      const result = await brandsCollection.insertOne(brand);
      res.send(result);
    });
    app.get("/brands", async (req, res) => {
      const result = await brandsCollection.find().toArray();
      res.send(result);
    });

    // product post
    app.post("/products", async (req, res) => {
      const product = req.body;
      console.log(product);
      // const result = await productsCollection.insertOne(product);
      // res.send(result);
    });
    // Send a ping to confirm a successful connection

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("hello assignment 10");
});
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
