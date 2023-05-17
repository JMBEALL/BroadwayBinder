//requirements

// testing
// require('dotenv').config();
// const uri = process.env.MONGODB_URI;



const express = require('express');
const app = express();
const PORT = 3000
const path = require('path');
const ejsMate = require("ejs-mate");
const Joi = require("joi");
const methodOverride = require("method-override")
const AppError = require("./utils/AppError")
const catchAsync = require('./utils/catchAsync')
//as I access the id, this allows me to convert it from a string to an ObjectId using this constructor and the new keyword
const ObjectId = require('mongodb').ObjectId;
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://jordanbeall:Broadway2018@broadwaybinder.jw7chrm.mongodb.net/?retryWrites=true&w=majority";

// Add the body-parser middleware to parse the request body
const bodyParser = require('body-parser');
const { CLIENT_RENEG_WINDOW } = require('tls');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

//connecting to MongoDB
async function run() {
    try {
      // Connect the client to the server
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (e) {
      console.error(e);
    }
  }
run().catch(console.dir);

//setting up server to listen to requests 
app.listen(process.env.PORT || PORT , () => {
    console.log("Server is up and running.")
})


//setting up templating

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', ejsMate) 



////******ROUTING-GET******////
//test route
app.get("/", (req,res) => {
    console.log("testing")
    res.send('home')
})

//gets all audition documents from the data collection and loops through them in the GETauditions.ejs and creates a list of links for each theater and show
app.get("/auditions",catchAsync(async  (req,res) => {
    const auditions =  client.db('BroadwayBinder').collection('data').find({});
    const auditionsArray = await auditions.toArray();
    res.render("auditions/GETauditions", {auditions: auditionsArray});
}))

//order matters here- must be above the below get with the vriable id or it will break the code.
app.get('/auditions/new', (req,res) => {
    res.render('auditions/new')
});

app.post('/auditions', catchAsync(async (req,res) => {
  //  const auditionSchema = Joi.object({
  //   audition: Joi.object({
  //     theater: Joi.number().required({convert:false}),
  //     show: Joi.string().required(),
  //     description: Joi.string().required(),
  //     date: Joi.date().required({convert:false})
  
  // })  .required()
  //  })
  //  const result = auditionSchema.validate(req.body)
  //  console.log(result)


    //     // Connect to the MongoDB server
    //     await client.connect();
    
    //     // Get the data from the request body
    //     const data = req.body;
    //     // Insert the data into the "data" collection in the "test" database
    //     const result = await client.db('BroadwayBinder').collection('data').insertOne(data);
    
    //     // Return a success message with the inserted document's ID
    //   //   res.json({ message: 'Audition inserted successfully', id: result.insertedId });
  
    //   //this gets all documents from the specified collection and renders them using the given ejs template upon submission of a new form
    //   const auditions =  client.db('BroadwayBinder').collection('data').find({});
    //   const auditionsArray = await auditions.toArray();
    //   res.render("auditions/GETauditions", {auditions: auditionsArray});
  
  //////////////
      console.log(req.body.auditions);
      const audition = await client.db('BroadwayBinder').collection('data').insertOne(req.body.auditions);

//       //mongoDB returns an object when using the insertOne method, so I am accessing the insertedId property on the audition object we just created and saved 
        const auditionId = audition.insertedId;
    
        res.redirect(`/auditions/${auditionId}`);


}));

app.get('/auditions/GETauditions.ejs', catchAsync(async (req,res) => {
 
      // Connect to the MongoDB server
      await client.connect();
  
      // Get the data from the request body
      const data = req.body;
      // Insert the data into the "data" collection in the "test" database
      const result = await client.db('BroadwayBinder').collection('data').insertOne(data);
  
      // Return a success message with the inserted document's ID
      // res.json({ message: 'Audition inserted successfully', id: result.insertedId });
  
      // This gets all documents from the specified collection and renders them using the given ejs template upon submission of a new form
      const auditions = client.db('BroadwayBinder').collection('data').find({});
      const auditionsArray = await auditions.toArray();
      res.render("auditions/GETauditions", { auditions: auditionsArray });
 
  }));
  
  // When a show is clicked, it grabs the _id, turns it into an ObjectId and renders it onto the SHOWaudition page.
  app.get("/auditions/:id", catchAsync(async (req,res) => {
    const audition = await client.db('BroadwayBinder').collection('data').findOne({ _id: new ObjectId(req.params.id) });
    // console.log(audition)
    res.render("auditions/SHOWauditions", { audition: audition });

    
  }));

  //rendering About page
  app.get("/about" , catchAsync(async (req,res) => {
    await res.render("./footers/about")
  }));

  app.get("/contact" , catchAsync(async (req,res) => {
    await res.render("./footers/contact")
  }))

  app.get("/signin" , catchAsync(async (req,res) => {
    await res.render("./navbar/signin")
  }));

  app.get("/signup" , catchAsync(async (req,res) => {
    await res.render("./navbar/signup")
  }))
  



////******ROUTING-POST******////


// app.post('/auditions', async (req, res) => {
//     try {
//       // Connect to the MongoDB server
//       await client.connect();
  
//       // Get the data from the request body
//       const data = req.body;
//       // Insert the data into the "data" collection in the "test" database
//       const result = await client.db('BroadwayBinder').collection('data').insertOne(data);
  
//       // Return a success message with the inserted document's ID
//     //   res.json({ message: 'Audition inserted successfully', id: result.insertedId });

//     //this gets all documents from the specified collection and renders them using the given ejs template upon submission of a new form
//     const auditions =  client.db('BroadwayBinder').collection('data').find({});
//     const auditionsArray = await auditions.toArray();
//     res.render("auditions/GETauditions", {auditions: auditionsArray});



//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Internal server error' });
//     } 
//   });




// Define a route for handling POST requests
app.post('/data', async (req, res) => {
  try {
    // Connect to the MongoDB server
    await client.connect();

    // Get the data from the request body
    const data = req.body;

    // Insert the data into the "data" collection in the "test" database
    const result = await client.db('BroadwayBinder').collection('data').insertOne(data);

    // Return a success message with the inserted document's ID
    res.json({ message: 'Data inserted successfully', id: result.insertedId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    // Close the connection
    await client.close();
  }
});

/////////EDIT AUDITIONS

app.get('/auditions/:id/edit', catchAsync(async(req,res) => {
    const audition = await client.db('BroadwayBinder').collection('data').findOne({ _id: new ObjectId(req.params.id) });
    // console.log(audition)
    res.render("auditions/edit", { audition: audition });
}))

app.put("/auditions/:id", catchAsync(async (req, res) => {
        // Find the audition in the database with the provided id and update its theater and show fields with the new values from the form
    const updatedAudition = await client
      .db("BroadwayBinder")
      .collection("data")
      .findOneAndUpdate(
        { _id: new ObjectId(req.params.id) },
        { $set: { theater: req.body.auditions.theater, show: req.body.auditions.show, description: req.body.auditions.description } },
        { returnOriginal: false }
      );
      // Render the SHOWauditions.ejs template and pass in the updated audition object as a variable called "audition"
    res.render("auditions/SHOWauditions", { audition: updatedAudition.value });
  }));
  
  app.delete('/auditions/:id', catchAsync(async (req,res) => {
    const deleteAudition = await client
      .db("BroadwayBinder")
      .collection("data")
      .deleteOne(
        { _id: new ObjectId(req.params.id)});
        res.redirect("/auditions")
  }));

  app.all("*", (req,res,next)=> {
    next(new AppError("Page Not Found", 404))
  })
  app.use((err,req, res ,next) => {
    const {statusCode = 500, message = "Something went wrong"} = err
    res.status(statusCode).send(message)
  })








