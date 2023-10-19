// require the dependencies
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
// const corsConfig = {
//   origin: "",
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE"],
// };
// app.use(cors(corsConfig));
// app.options("", cors(corsConfig));
app.use(express.json());
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const usersCollection = database.collection("users");
    const CartsCollection = database.collection("carts");
    //brands post
    app.post("/brands", async (req, res) => {
      const brand = req.body;
      console.log(brand);
      const result = await brandsCollection.insertOne(brand);
      res.send(result);
    });
    app.put("/brands/:brand", async (req, res) => {
      const brand = req.params.brand;
      const data = req.body;
      console.log(data);
      console.log(brand, "is the brand ");
      const filter = { brand: brand };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          img1: data.img1,
          img2: data.img2,
          img3: data.img3,
        },
      };
      const result = await brandsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
    app.get("/brands", async (req, res) => {
      const result = await brandsCollection.find().toArray();
      res.send(result);
    });
    app.get("/brands/:brand", async (req, res) => {
      const brand = req.params.brand;
      const query = { brand: brand };

      const result = await brandsCollection.findOne(query);
      res.send(result);
    });

    // product post
    app.post("/products", async (req, res) => {
      const product = req.body;
      console.log(product);
      const result = await productsCollection.insertOne(product);
      res.send(result);
    });
    // all product get
    app.get("/products", async (req, res) => {
      const result = await productsCollection.find().toArray();
      res.send(result);
    });
    // get single brand product
    app.get("/products/:brand", async (req, res) => {
      const brand = req.params.brand;
      const query = { brand: brand };
      const cursor = productsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // get single product
    app.get("/products/details/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });
    app.get("/products/categories/:type", async (req, res) => {
      const type = req.params.type;
      const query = { type: type };
      const cursor = productsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // update product
    app.put("/products/update/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      console.log(data);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedProduct = {
        $set: {
          name: data.name,
          brand: data.brand,
          price: data.price,
          rating: data.rating,
          img: data.img,
          type: data.type,
          details: data.details,
        },
      };
      const result = await productsCollection.updateOne(
        filter,
        updatedProduct,
        options
      );
      res.send(result);
    });
    // Send a ping to confirm a successful connection

    //users management
    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    app.post("/carts", async (req, res) => {
      const cart = req.body;
      // console.log(cart);
      const result = await CartsCollection.insertOne(cart);
      res.send(result);
    });
    app.get("/carts/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await CartsCollection.find(query).toArray();
      res.send(result);
    });

    app.delete("/carts/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await CartsCollection.deleteOne(query);
      res.send(result);
      // const result
    });

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
