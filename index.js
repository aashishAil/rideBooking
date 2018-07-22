const app = require('express')();
var http,io;
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const dbConfig = require('./config/database');

mongoose.Promise = Promise;
mongoose.connect(dbConfig.credentials.mongoUrl + dbConfig.credentials.mongoDb);

let dbConnection = mongoose.connection;

dbConnection.on('error', error => {
   console.log('Unable to connect to mongo');
   console.log(error.toString());
});

dbConnection.once('open', () => {
    console.log('Connected to mongo');
})

app.use(cors());
app.use(bodyParser.json());

app.use('/api/requests',require('./api/requests'));

app.get('/customerApp.html',(req,res) =>{
    res.sendFile( __dirname +'/webpages/customer.html');
});


http = require('http').Server(app);
io = require('socket.io')(http);

io.on('connection' , socket => {
   console.log('User connected');
   socket.on('disconnect', () => {
      console.log('User disconnected');
   });
});

http.listen(5432,() => {
   console.log('Listening on port 5432');
});