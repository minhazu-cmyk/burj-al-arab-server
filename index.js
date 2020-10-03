const express = require('express')

const port = 5000
const bodyParser = require('body-parser')
const cors = require('cors')
const admin = require('firebase-admin');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dhmoa.mongodb.net/burjAlArab?retryWrites=true&w=majority`;



const app = express()
app.use(cors());
app.use(bodyParser.json());
var serviceAccount = require("./configs/burj-al-arab-37f5d-firebase-adminsdk-fmx1v-55c317ea79.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://burj-al-arab-37f5d.firebaseio.com"
});



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
    

    admin.auth().verifyIdToken(idToken)
  .then(function(decodedToken) {
    
    const tokenEmail = decodedToken.email;
    const queryEmail = req.query.email;
    

    if(tokenEmail==queryEmail){ 
        
  bookings.find({email:queryEmail})
  .toArray((err,documents)=>{
    
    res.send(documents);
  })

    }
  }).catch(function(error) {
    // Handle error
  });
  }
  
  else{
    res.status(401).send("un-authorized log in")
  }
})
})

app.listen(port)