const express = require('express');
const bodyParser = require('body-parser');
//const MongoClient = require('mongodb').MongoClient;
const {MongoClient} = require('mongodb');

//load all key-value pairs in .env file to process.env obj
//const dotenv = require('dotenv')
// dotenv.config()
const app = express();
app.use(express.json())

/* We cannot serve up the index.html file and expect
 html data to magically appear because there’s 
 no way to add dynamic content to an HTML file.
 so, we have installed EJS template engine to
 generate the HTML. */
 //MIDDLE WARE
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))
//WE NEED TO WRITE THIS TO ADD CSS TO HTML IN VIEWS
//OTHER-WISE IT WONT WORK
app.use(express.static(__dirname + '/views'));

const connectionString = "mongodb+srv://madhan:1234@cluster0.uuaneaz.mongodb.net/?retryWrites=true&w=majority"
MongoClient.connect(connectionString, {
  useNewUrlParser: true,
  //useFindAndModify: false,
  useUnifiedTopology: true
}).then(client => {
    console.log('Connected to Database')
    const db = client.db('UPLOAD_NEWS')
    const myCollection = db.collection('UPLOAD_COLL')

//GET METHOD
// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html')
// })

app.get('/', (req,res) => {
  db.collection('UPLOAD_COLL').find().toArray()
    .then(results => {
      res.render('index.ejs', { UPLOAD_COLL : results })
    })
})

//POST METHOD
app.post('/myNews', (req, res) => {
  myCollection.insertOne(req.body)
    .then(result => {
      console.log(result)
      //after uploading, to refresh the browser
      res.redirect('/')
    })
    .catch(error => console.error(error))
})

//global obj to access all env. variables
// console.log(process.env)

const PORT = 8000
app.listen(PORT, function() {
  console.log('listening on 9999')
})


})
  .catch(error => console.error(error))
  