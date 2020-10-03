const express = require('express')

const port = 5000
const bodyParser = require('body-parser')
const cors = require('cors')
const admin = require('firebase-admin');

const password = "NewArab78"


const app = express()
app.use(cors());
app.use(bodyParser.json());
var serviceAccount = require("./burj-al-arab-37f5d-firebase-adminsdk-fmx1v-55c317ea79.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://burj-al-arab-37f5d.firebaseio.com"
});

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://arabian:NewArab78@cluster0.dhmoa.mongodb.net/burjAlArab?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
client.connect(err => {
  const bookings = client.db("burjAlArab").collection("bookings");
//  console.log('db connection succesfully')

  app.post('/addBooking', (req,res)=>{
    const newBooking = req.body;
         bookings.insertOne(newBooking)
        .then(result=>{
          res.send(result.insertedCount > 0);
        })
  
  })




app.get('/bookings', (req, res) => {
  const bearer = req.headers.authorization;
  if(bearer&& bearer.startsWith('Bearer ')){
    const idToken = bearer.split(' ')[1];
    console.log({idToken});

    admin.auth().verifyIdToken(idToken)
  .then(function(decodedToken) {
    
    const tokenEmail = decodedToken.email;
    const queryEmail = req.query.email;
    console.log(tokenEmail, queryEmail);

    if(tokenEmail==req.query.email){ 
        
  bookings.find({email:req.query.email})
  .toArray((err,documents)=>{
    
    res.send(documents);
  })

    }
  }).catch(function(error) {
    // Handle error
  });
  }
})
})

app.listen(port)