const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
//midlewares
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nbna82s.mongodb.net/?retryWrites=true&w=majority`;
  // console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try{
    const productCollection = client.db('bdAmazon').collection('products');
    //get & query by page,size!
    app.get('/products', async(req, res)=>{
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      const query = {};
      const count = await productCollection.estimatedDocumentCount();
      const cursor = productCollection.find(query);
      const products = await cursor.skip(page*size).limit(size).toArray();
      res.send({count, products});
    });
    //
    app.post('/productsByIds', async(req, res)=>{
      const ids = req.body;
      const objectIds = ids.map(id => ObjectId(id)) //confused
      const query = { _id: { $in: objectIds } };
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    })
  }
  finally{

  }
}
run().catch(error=> console.log(error));

app.get('/', (req, res)=>{
    res.send('BD Amazon Server is Running');
});
app.listen(port, ()=>{
    console.log(`Amazon server is running on port ${port}`);
})